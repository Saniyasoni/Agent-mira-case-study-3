const express = require("express");
const router = express.Router();
const { mergePropertyData, filterProperties } = require("../utils/mergeData");
const { extractPreferences } = require("../utils/nlp");

// GET /api/properties — Get all properties (merged) with optional filters
// Query params: location, minPrice, maxPrice, bedrooms, search
router.get("/", (req, res) => {
  try {
    const { location, minPrice, maxPrice, bedrooms, search } = req.query;

    // If any filter is provided, use filterProperties
    if (location || minPrice || maxPrice || bedrooms || search) {
      const filtered = filterProperties({ location, minPrice, maxPrice, bedrooms, search });
      return res.json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }

    // Otherwise return all merged properties
    const allProperties = mergePropertyData();
    res.json({
      success: true,
      count: allProperties.length,
      data: allProperties,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/properties/chat — NLP Chatbot Endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    // Extract preferences from natural language using LLM
    const preferences = await extractPreferences(message);
    
    // Filter properties based on extracted preferences
    const filteredProperties = filterProperties(preferences);
    
    // Generate a conversational response based on what was understood
    let botReply = "I looked for homes based on your message. ";
    
    const understood = [];
    if (preferences.location) understood.push(`in ${preferences.location}`);
    if (preferences.bedrooms) understood.push(`with ${preferences.bedrooms}+ bedrooms`);
    if (preferences.bathrooms) understood.push(`with ${preferences.bathrooms}+ bathrooms`);
    if (preferences.maxPrice) understood.push(`under $${preferences.maxPrice.toLocaleString()}`);
    if (preferences.minSize) understood.push(`at least ${preferences.minSize} sqft`);
    if (preferences.amenities && preferences.amenities.length > 0) {
      understood.push(`with ${preferences.amenities.join(", ")}`);
    }
    
    if (understood.length > 0) {
      botReply = `I'm searching for properties ${understood.join(', ')}. `;
    } else {
      botReply = "I couldn't detect specific preferences, so here are some popular options. Try saying something like 'Show me a 3 bed villa with a pool in Miami'.";
    }

    if (filteredProperties.length > 0) {
      botReply += `I found ${filteredProperties.length} matches!`;
    } else {
      botReply += "Unfortunately, I couldn't find any properties matching those exact criteria.";
    }

    res.json({
      success: true,
      reply: botReply,
      preferencesExtracted: preferences,
      data: filteredProperties
    });

  } catch (error) {
    console.error("Chat Route Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/properties/:id — Get a single property by ID
router.get("/:id", (req, res) => {
  try {
    const allProperties = mergePropertyData();
    const property = allProperties.find((p) => p.id === Number(req.params.id));

    if (!property) {
      return res.status(404).json({ success: false, error: "Property not found" });
    }

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/properties/locations/list — Get all unique locations
router.get("/locations/list", (req, res) => {
  try {
    const allProperties = mergePropertyData();
    const locations = [...new Set(allProperties.map((p) => p.location))];
    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
