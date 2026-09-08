const express = require("express");
const cors = require("cors");

const problemRoutes = require("./routes/problemRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "DesignForge API is running." });
  });

  app.use("/api/problems", problemRoutes);
  app.use("/api/attempts", attemptRoutes);
  app.use("/api/evaluations", evaluationRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
