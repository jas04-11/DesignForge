const request = require("supertest");
const createApp = require("../src/app");
const Problem = require("../src/models/Problem");
const { connect, closeDatabase, clearDatabase } = require("./setup");

const app = createApp();

beforeAll(async () => {
  await connect();
});
afterEach(async () => {
  await clearDatabase();
});
afterAll(async () => {
  await closeDatabase();
});

describe("GET /api/problems", () => {
  it("retrieves seeded problems", async () => {
    await Problem.create({
      title: "Parking Lot",
      slug: "parking-lot",
      difficulty: "Medium",
      description: "desc",
      requirements: ["req1"],
      expectedClasses: ["ParkingLot"],
      expectedMethods: ["parkVehicle"],
    });

    const res = await request(app).get("/api/problems");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe("Parking Lot");
  });

  it("returns an error for an invalid problem id", async () => {
    const res = await request(app).get("/api/problems/not-a-valid-id");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 404 for a well-formed but nonexistent problem id", async () => {
    const res = await request(app).get("/api/problems/64b64b64b64b64b64b64b64b");
    expect(res.status).toBe(404);
  });
});
