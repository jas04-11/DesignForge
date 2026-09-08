const request = require("supertest");
const createApp = require("../src/app");
const Problem = require("../src/models/Problem");
const Attempt = require("../src/models/Attempt");
const { connect, closeDatabase, clearDatabase } = require("./setup");

const app = createApp();

let problem;

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  problem = await Problem.create({
    title: "Vending Machine",
    slug: "vending-machine",
    difficulty: "Easy",
    description: "desc",
    requirements: ["req1"],
    expectedConcepts: ["single responsibility"],
    expectedClasses: ["VendingMachine", "Product"],
    expectedMethods: ["selectProduct", "dispenseProduct"],
  });
});
afterEach(async () => {
  await clearDatabase();
});
afterAll(async () => {
  await closeDatabase();
});

describe("POST /api/attempts", () => {
  it("creates an attempt for a valid problem", async () => {
    const res = await request(app).post("/api/attempts").send({ problemId: problem._id });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("DRAFT");
    expect(res.body.data.attemptNumber).toBe(1);
  });

  it("increments attempt number on repeated attempts for the same problem", async () => {
    await request(app).post("/api/attempts").send({ problemId: problem._id });
    const res = await request(app).post("/api/attempts").send({ problemId: problem._id });
    expect(res.body.data.attemptNumber).toBe(2);
  });
});

describe("POST /api/attempts/:id/submit", () => {
  async function makeAttempt() {
    const res = await request(app).post("/api/attempts").send({ problemId: problem._id });
    return res.body.data._id;
  }

  it("rejects an empty submission (no classes)", async () => {
    const attemptId = await makeAttempt();
    const res = await request(app).post(`/api/attempts/${attemptId}/submit`).send({
      classes: [],
      explanation: "Some explanation",
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects a submission with no explanation", async () => {
    const attemptId = await makeAttempt();
    const res = await request(app).post(`/api/attempts/${attemptId}/submit`).send({
      classes: [{ name: "VendingMachine", responsibility: "Manages vending", methods: ["selectProduct"] }],
      explanation: "",
    });
    expect(res.status).toBe(400);
  });

  it("accepts a valid submission and evaluates it (AI unavailable -> rule-based fallback)", async () => {
    const attemptId = await makeAttempt();
    const res = await request(app)
      .post(`/api/attempts/${attemptId}/submit`)
      .send({
        classes: [
          { name: "VendingMachine", responsibility: "Coordinates the overall vending process", methods: ["selectProduct", "dispenseProduct"] },
          { name: "Product", responsibility: "Represents an item that can be purchased", fields: ["price"], methods: [] },
        ],
        interfaces: [],
        relationships: [{ source: "VendingMachine", type: "Association", target: "Product" }],
        explanation:
          "The VendingMachine class coordinates selection, payment and dispensing. This design could be extended by adding a PaymentStrategy interface for new payment types without modifying VendingMachine.",
        code: "",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.attempt.status).toBe("COMPLETED");
    expect(res.body.data.evaluation.aiAvailable).toBe(false);
    expect(res.body.data.evaluation.categories.length).toBe(5);
    expect(typeof res.body.data.evaluation.overallScore).toBe("number");

    const savedAttempt = await Attempt.findById(attemptId);
    expect(savedAttempt.status).toBe("COMPLETED");
    expect(savedAttempt.score).toBe(res.body.data.evaluation.overallScore);
  });

  it("returns 404 for an invalid attempt id on submit", async () => {
    const res = await request(app).post(`/api/attempts/64b64b64b64b64b64b64b64b/submit`).send({
      classes: [{ name: "X" }],
      explanation: "explanation",
    });
    expect(res.status).toBe(404);
  });
});

describe("GET /api/attempts", () => {
  it("retrieves attempt history", async () => {
    await request(app).post("/api/attempts").send({ problemId: problem._id });
    const res = await request(app).get("/api/attempts");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});
