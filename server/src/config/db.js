const mongoose = require("mongoose");

async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined. Please set it in your .env file.");
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[db] Connected to MongoDB at ${mongoUri}`);
  } catch (err) {
    console.error("[db] Failed to connect to MongoDB:", err.message);
    throw err;
  }

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB connection error:", err.message);
  });

  return mongoose.connection;
}

async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
