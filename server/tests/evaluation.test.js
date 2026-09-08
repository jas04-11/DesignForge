const RuleBasedEvaluator = require("../src/evaluation/RuleBasedEvaluator");
const AIEvaluator = require("../src/evaluation/AIEvaluator");
const EvaluationService = require("../src/evaluation/EvaluationService");

const problem = {
  title: "Parking Lot",
  difficulty: "Medium",
  description: "desc",
  requirements: ["req1"],
  expectedConcepts: ["strategy pattern"],
  expectedClasses: ["ParkingLot", "ParkingSpot"],
  expectedMethods: ["parkVehicle", "exitVehicle"],
};

describe("RuleBasedEvaluator", () => {
  const evaluator = new RuleBasedEvaluator();

  it("detects required classes present in a submission", async () => {
    const submission = {
      classes: [
        { name: "ParkingLot", responsibility: "Coordinates parking operations across floors", methods: ["parkVehicle"] },
        { name: "ParkingSpot", responsibility: "Represents a single parking spot", methods: [] },
      ],
      interfaces: [],
      relationships: [],
      explanation: "This design can be extended with a new pricing strategy.",
    };
    const result = await evaluator.evaluate(submission, problem);
    const coverage = result.categories.find((c) => c.name === "Requirement Coverage");
    expect(coverage.score).toBeGreaterThan(0);
    expect(result.strengths.some((s) => s.includes("ParkingLot"))).toBe(true);
  });

  it("detects missing required concepts/classes", async () => {
    const submission = { classes: [{ name: "Foo" }], interfaces: [], relationships: [], explanation: "x" };
    const result = await evaluator.evaluate(submission, problem);
    expect(result.weaknesses.length).toBeGreaterThan(0);
  });

  it("always returns available: true (never depends on external services)", async () => {
    const submission = { classes: [{ name: "X" }], explanation: "y" };
    const result = await evaluator.evaluate(submission, problem);
    expect(result.available).toBe(true);
  });
});

describe("AIEvaluator", () => {
  it("gracefully reports unavailable when no API key is configured", async () => {
    const evaluator = new AIEvaluator({ apiKey: "" });
    const result = await evaluator.evaluate({ classes: [], explanation: "" }, problem);
    expect(result.available).toBe(false);
    expect(result.unavailableReason).toBeDefined();
  });
});

describe("EvaluationService", () => {
  it("combines multiple evaluators and falls back to rule-based when AI is unavailable", async () => {
    const service = new EvaluationService([new RuleBasedEvaluator(), new AIEvaluator({ apiKey: "" })]);
    const submission = {
      classes: [{ name: "ParkingLot", responsibility: "Coordinates parking across floors", methods: ["parkVehicle"] }],
      interfaces: [],
      relationships: [],
      explanation: "Extensible via a pricing strategy.",
    };
    const result = await service.evaluate(submission, problem);
    expect(result.aiAvailable).toBe(false);
    expect(result.categories.length).toBe(5);
    expect(result.evaluatorResults.RuleBasedEvaluator.available).toBe(true);
    expect(result.evaluatorResults.AIEvaluator.available).toBe(false);
  });

  it("does not let an AI evaluator failure destroy the overall evaluation", async () => {
    class ThrowingEvaluator {
      get name() {
        return "AIEvaluator";
      }
      async evaluate() {
        throw new Error("network exploded");
      }
    }
    const service = new EvaluationService([new RuleBasedEvaluator(), new ThrowingEvaluator()]);
    const result = await service.evaluate(
      { classes: [{ name: "X" }], explanation: "y" },
      problem
    );
    expect(result.aiAvailable).toBe(false);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
  });
});
