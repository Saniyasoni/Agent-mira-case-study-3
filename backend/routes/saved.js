const express = require("express");
const router = express.Router();
const SavedProperty = require("../models/SavedProperty");

// GET /api/saved — Get all saved properties from MongoDB
router.get("/", async (req, res) => {
  try {
    const savedProperties = await SavedProperty.find().sort({ savedAt: -1 });
    res.json({ success: true, count: savedProperties.length, data: savedProperties });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/saved — Save a property to MongoDB
router.post("/", async (req, res) => {
  try {
    const propertyData = req.body;

    // Check if already saved
    const exists = await SavedProperty.findOne({ id: propertyData.id });
    if (exists) {
      return res.status(400).json({ success: false, error: "Property already saved" });
    }

    const newSaved = new SavedProperty(propertyData);
    await newSaved.save();
    
    res.status(201).json({ success: true, data: newSaved });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/saved/:id — Remove a saved property from MongoDB
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await SavedProperty.findOneAndDelete({ id: id });

    if (!result) {
      return res.status(404).json({ success: false, error: "Saved property not found" });
    }

    res.json({ success: true, message: "Property removed" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
