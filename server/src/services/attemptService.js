const mongoose = require("mongoose");
const Attempt = require("../models/Attempt");
const Submission = require("../models/Submission");
const Evaluation = require("../models/Evaluation");
const Problem = require("../models/Problem");
const ApiError = require("../utils/ApiError");
const EvaluationService = require("../evaluation/EvaluationService");
const RuleBasedEvaluator = require("../evaluation/RuleBasedEvaluator");
const AIEvaluator = require("../evaluation/AIEvaluator");

// The main submission flow depends only on this service instance, which in
// turn depends only on the Evaluator interface. Swapping/adding evaluators
// (e.g. a future PlagiarismEvaluator) never requires touching this file's
// callers.
const evaluationService = new EvaluationService([new RuleBasedEvaluator(), new AIEvaluator()]);

async function createAttempt(problemId) {
  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new ApiError(404, `Problem with id ${problemId} was not found.`);
  }

  const previousCount = await Attempt.countDocuments({ problemId });

  const attempt = await Attempt.create({
    problemId,
    status: "DRAFT",
    attemptNumber: previousCount + 1,
  });

  return attempt;
}

async function listAttempts() {
  return Attempt.find()
    .sort({ createdAt: -1 })
    .populate("problemId", "title slug difficulty")
    .lean();
}

async function getAttemptById(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, `Invalid attempt id: ${id}`);
  }
  const attempt = await Attempt.findById(id).populate("problemId", "title slug difficulty").lean();
  if (!attempt) {
    throw new ApiError(404, `Attempt with id ${id} was not found.`);
  }
  return attempt;
}

function validateSubmissionPayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== "object") {
    errors.push("Submission payload is required.");
    return errors;
  }
  if (!Array.isArray(payload.classes) || payload.classes.length === 0) {
    errors.push("At least one class is required.");
  } else {
    payload.classes.forEach((c, idx) => {
      if (!c.name || !String(c.name).trim()) {
        errors.push(`Class at position ${idx + 1} is missing a name.`);
      }
    });
  }
  if (!payload.explanation || !String(payload.explanation).trim()) {
    errors.push("Design explanation is required.");
  }
  return errors;
}

async function submitAttempt(attemptId, payload) {
  if (!mongoose.isValidObjectId(attemptId)) {
    throw new ApiError(400, `Invalid attempt id: ${attemptId}`);
  }

  const attempt = await Attempt.findById(attemptId);
  if (!attempt) {
    throw new ApiError(404, `Attempt with id ${attemptId} was not found.`);
  }

  if (attempt.status === "COMPLETED") {
    throw new ApiError(409, "This attempt has already been submitted and evaluated.");
  }

  const problem = await Problem.findById(attempt.problemId);
  if (!problem) {
    throw new ApiError(404, "The problem associated with this attempt no longer exists.");
  }

  const validationErrors = validateSubmissionPayload(payload);
  if (validationErrors.length > 0) {
    throw new ApiError(400, "Submission is invalid.", validationErrors);
  }

  const submission = await Submission.create({
    attemptId: attempt._id,
    classes: payload.classes || [],
    interfaces: payload.interfaces || [],
    relationships: payload.relationships || [],
    explanation: payload.explanation || "",
    code: payload.code || "",
  });

  attempt.submissionId = submission._id;
  attempt.status = "EVALUATING";
  await attempt.save();

  try {
    const result = await evaluationService.evaluate(submission.toObject(), problem.toObject());

    const evaluation = await Evaluation.create({
      attemptId: attempt._id,
      overallScore: result.overallScore,
      categories: result.categories,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      suggestions: result.suggestions,
      evaluatorResults: result.evaluatorResults,
      aiAvailable: result.aiAvailable,
    });

    attempt.status = "COMPLETED";
    attempt.score = result.overallScore;
    attempt.evaluationId = evaluation._id;
    await attempt.save();

    return { attempt, submission, evaluation };
  } catch (err) {
    // Evaluation itself failed catastrophically (should be rare since
    // EvaluationService already isolates evaluator failures). We still
    // persist the submission and mark the attempt as FAILED rather than
    // losing the learner's work.
    attempt.status = "FAILED";
    await attempt.save();
    throw new ApiError(502, "Evaluation failed unexpectedly. Your submission has been saved; please try submitting again.", err.message);
  }
}

module.exports = {
  createAttempt,
  listAttempts,
  getAttemptById,
  submitAttempt,
  validateSubmissionPayload,
};
