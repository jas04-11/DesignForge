const mongoose = require("mongoose");

const ATTEMPT_STATUSES = ["DRAFT", "SUBMITTED", "EVALUATING", "COMPLETED", "FAILED"];

const attemptSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", default: null },
    status: { type: String, enum: ATTEMPT_STATUSES, default: "DRAFT" },
    score: { type: Number, default: null },
    evaluationId: { type: mongoose.Schema.Types.ObjectId, ref: "Evaluation", default: null },
    attemptNumber: { type: Number, default: 1 },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

attemptSchema.statics.STATUSES = ATTEMPT_STATUSES;

module.exports = mongoose.model("Attempt", attemptSchema);
