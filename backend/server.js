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
    let isAtlas = mongoUri && !mongoUri.includes("localhost") && mongoUri !== "PASTE_YOUR_CONNECTION_STRING_HERE";

    if (isAtlas) {
      console.log("Attempting to connect to MongoDB Atlas... ☁️");
      try {
        // Set a short timeout so it doesn't hang forever if DNS is blocked
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected to MongoDB Atlas successfully! ✅");
      } catch (atlasError) {
        console.error("Atlas connection failed (DNS/Network issue). Falling back to local database... ⚠️");
        isAtlas = false;
      }
    }

    if (!isAtlas) {
      const mongoServer = await MongoMemoryServer.create();
      const localUri = mongoServer.getUri();
      await mongoose.connect(localUri);
      console.log("Connected to Local In-Memory MongoDB successfully! 🚀");
    }

    
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
