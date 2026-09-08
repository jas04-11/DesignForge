require("dotenv").config();
const { connectDB, disconnectDB } = require("../src/config/db");
const Problem = require("../src/models/Problem");
const problems = require("../src/problems/seedData");

async function seed() {
  await connectDB();

  for (const problem of problems) {
    await Problem.findOneAndUpdate(
      { slug: problem.slug },
      { $set: problem },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`[seed] Upserted problem: ${problem.title}`);
  }

  console.log(`[seed] Done. ${problems.length} problems seeded.`);
  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
