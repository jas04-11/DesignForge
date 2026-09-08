const express = require("express");
const {
  createAttempt,
  listAttempts,
  getAttempt,
  submitAttempt,
} = require("../controllers/attemptController");

const router = express.Router();

router.post("/", createAttempt);
router.get("/", listAttempts);
router.get("/:id", getAttempt);
router.post("/:id/submit", submitAttempt);

module.exports = router;
