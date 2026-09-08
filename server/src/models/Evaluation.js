const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    feedback: { type: String, default: "" },
  },
  { _id: false }
);

const evaluationSchema = new mongoose.Schema(
  {
    attemptId: { type: mongoose.Schema.Types.ObjectId, ref: "Attempt", required: true },
    overallScore: { type: Number, required: true },
    categories: { type: [categorySchema], default: [] },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    evaluatorResults: { type: mongoose.Schema.Types.Mixed, default: {} },
    aiAvailable: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);
