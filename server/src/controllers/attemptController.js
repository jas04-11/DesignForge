const asyncHandler = require("../utils/asyncHandler");
const attemptService = require("../services/attemptService");
const Evaluation = require("../models/Evaluation");
const ApiError = require("../utils/ApiError");

const createAttempt = asyncHandler(async (req, res) => {
  const { problemId } = req.body;
  if (!problemId) {
    throw new ApiError(400, "problemId is required.");
  }
  const attempt = await attemptService.createAttempt(problemId);
  res.status(201).json({ success: true, data: attempt });
});

const listAttempts = asyncHandler(async (req, res) => {
  const attempts = await attemptService.listAttempts();
  res.json({ success: true, data: attempts });
});

const getAttempt = asyncHandler(async (req, res) => {
  const attempt = await attemptService.getAttemptById(req.params.id);
  res.json({ success: true, data: attempt });
});

const submitAttempt = asyncHandler(async (req, res) => {
  const result = await attemptService.submitAttempt(req.params.id, req.body);
  res.json({
    success: true,
    data: {
      attempt: result.attempt,
      submission: result.submission,
      evaluation: result.evaluation,
    },
  });
});

const getEvaluationForAttempt = asyncHandler(async (req, res) => {
  const evaluation = await Evaluation.findOne({ attemptId: req.params.attemptId }).lean();
  if (!evaluation) {
    throw new ApiError(404, `No evaluation found for attempt ${req.params.attemptId}.`);
  }
  res.json({ success: true, data: evaluation });
});

module.exports = { createAttempt, listAttempts, getAttempt, submitAttempt, getEvaluationForAttempt };
