const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    responsibility: { type: String, default: "" },
    fields: { type: [String], default: [] },
    methods: { type: [String], default: [] },
  },
  { _id: false }
);

const interfaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    methods: { type: [String], default: [] },
  },
  { _id: false }
);

const relationshipSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Association", "Aggregation", "Composition", "Inheritance", "Dependency"],
    },
    target: { type: String, required: true },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    attemptId: { type: mongoose.Schema.Types.ObjectId, ref: "Attempt", required: true },
    classes: { type: [classSchema], default: [] },
    interfaces: { type: [interfaceSchema], default: [] },
    relationships: { type: [relationshipSchema], default: [] },
    explanation: { type: String, default: "" },
    code: { type: String, default: "" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = mongoose.model("Submission", submissionSchema);
