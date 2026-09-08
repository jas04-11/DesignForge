const asyncHandler = require("../utils/asyncHandler");
const problemService = require("../services/problemService");

const getProblems = asyncHandler(async (req, res) => {
  const problems = await problemService.listProblems();
  res.json({ success: true, data: problems });
});

const getProblem = asyncHandler(async (req, res) => {
  const problem = await problemService.getProblemById(req.params.id);
  res.json({ success: true, data: problem });
});

module.exports = { getProblems, getProblem };
