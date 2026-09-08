const express = require("express");
const { getEvaluationForAttempt } = require("../controllers/attemptController");

const router = express.Router();

router.get("/:attemptId", getEvaluationForAttempt);

module.exports = router;
