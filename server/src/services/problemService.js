const Problem = require("../models/Problem");
const ApiError = require("../utils/ApiError");

async function listProblems() {
  return Problem.find().sort({ createdAt: 1 }).lean();
}

async function getProblemById(id) {
  const problem = await Problem.findById(id).lean();
  if (!problem) {
    throw new ApiError(404, `Problem with id ${id} was not found.`);
  }
  return problem;
}

module.exports = { listProblems, getProblemById };
