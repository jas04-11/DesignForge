const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    constraints: { type: [String], default: [] },
    expectedConcepts: { type: [String], default: [] },
    // Class/method names a design is expected to include; used by RuleBasedEvaluator
    expectedClasses: { type: [String], default: [] },
    expectedMethods: { type: [String], default: [] },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = mongoose.model("Problem", problemSchema);
