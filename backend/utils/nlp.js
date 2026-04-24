const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// --- DATA DICTIONARIES (For Unstoppable Regex Fallback) ---
const knownCities = ["New York", "Miami", "Los Angeles", "Austin", "San Francisco", "Chicago", "Dallas", "Seattle", "Boston"];

const amenityMap = {
  "bbq": "BBQ Area",
  "barbeque": "BBQ Area",
  "pool": "Swimming Pool",
  "gym": "Gym",
  "fitness": "Fitness Center",
  "garden": "Private Garden",
  "parking": "Parking",
  "garage": "Garage",
  "beach": "Beach Access",
  "security": "Security",
  "balcony": "Balcony",
  "laundry": "Laundry",
  "terrace": "Rooftop Terrace",
  "elevator": "Private Elevator",
  "concierge": "24/7 Concierge",
  "dock": "Private Dock",
  "boat": "Boat Parking",
  "backyard": "Backyard",
  "pet": "Pet Friendly",
  "office": "Home Office",
  "solar": "Solar Panels",
  "smart": "Smart Home",
  "energy": "Energy Efficient"
};

/**
 * Hybrid Extraction: Tries LLM first, falls back to Ultra-Smart Regex if LLM fails.
 */
async function extractPreferences(text) {
  let preferences = { amenities: [] };

  // 1. Try LLM Extraction First
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Extract property preferences from: "${text}". Output ONLY JSON: {location, minPrice, maxPrice, bedrooms, bathrooms, minSize, maxSize, amenities:[]}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text().trim();
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const aiPrefs = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
        console.log("AI Extraction Successful! ✅");
        return aiPrefs;
      }
    } catch (error) {
      console.warn("AI Quota Finished or Error. Falling back to Ultra-Smart Regex... ⚠️");
    }
  }

  // 2. Ultra-Smart Regex Fallback
  const lowerText = text.toLowerCase();
  
  // Extract Location (Check against knownCities)
  knownCities.forEach(city => {
    if (lowerText.includes(city.toLowerCase())) {
      preferences.location = city;
    }
  });

  // Extract Price (Max and Min)
  const priceMatch = lowerText.match(/(?:under|max|budget|below|up to)\s*\$?(\d+(?:\.\d+)?)\s*(k|m|million|thousand)?/);
  if (priceMatch) {
    let num = parseFloat(priceMatch[1]);
    if (priceMatch[2] === 'k' || priceMatch[2] === 'thousand') num *= 1000;
    if (priceMatch[2] === 'm' || priceMatch[2] === 'million') num *= 1000000;
    preferences.maxPrice = num;
  }
  const minPriceMatch = lowerText.match(/(?:above|min|minimum|at least|over)\s*\$?(\d+(?:\.\d+)?)\s*(k|m|million|thousand)?/);
  if (minPriceMatch) {
    let num = parseFloat(minPriceMatch[1]);
    if (minPriceMatch[2] === 'k' || minPriceMatch[2] === 'thousand') num *= 1000;
    if (minPriceMatch[2] === 'm' || minPriceMatch[2] === 'million') num *= 1000000;
    preferences.minPrice = num;
  }

  // Extract Size (Sq Ft) - Handles "under 2000", "more than 1000", etc.
  const sizeMaxMatch = lowerText.match(/(?:under|less than|max|below)\s*(\d+)\s*(?:sqft|sq ft|square feet|feet)/);
  if (sizeMaxMatch) preferences.maxSize = parseInt(sizeMaxMatch[1]);
  
  const sizeMinMatch = lowerText.match(/(?:above|more than|min|at least|over)\s*(\d+)\s*(?:sqft|sq ft|square feet|feet)/);
  if (sizeMinMatch) preferences.minSize = parseInt(sizeMinMatch[1]);

  // Extract Bedrooms
  const bedMatch = lowerText.match(/(\d+)\s*(?:bed|bhk|bedroom)/);
  if (bedMatch) preferences.bedrooms = parseInt(bedMatch[1]);

  // Extract Bathrooms
  const bathMatch = lowerText.match(/(\d+)\s*(?:bath|bathroom)/);
  if (bathMatch) preferences.bathrooms = parseInt(bathMatch[1]);

  // Extract Amenities with Mapping (e.g., bbq -> BBQ Area)
  Object.keys(amenityMap).forEach(key => {
    if (lowerText.includes(key)) {
      if (!preferences.amenities.includes(amenityMap[key])) {
        preferences.amenities.push(amenityMap[key]);
      }
    }
  });

  console.log("Ultra-Smart Regex Results:", preferences);
  return preferences;
}

module.exports = { extractPreferences };
