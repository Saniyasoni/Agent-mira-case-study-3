const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
require("dotenv").config();

const propertiesRouter = require("./routes/properties");
const savedRouter = require("./routes/saved");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MongoDB and Start Server
const startServer = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // If no external MongoDB URI is provided, spin up the local memory server
    if (!mongoUri || mongoUri.includes("localhost")) {
      console.log("No Atlas URI found. Starting local in-memory database...");
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully! 🚀");
    
    // Routes
    app.use("/api/properties", propertiesRouter);
    app.use("/api/saved", savedRouter);

    // Health check route
    app.get("/", (req, res) => {
      res.json({ message: "Agent Mira Real Estate Chatbot API is running!" });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
