const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

/**
 * Hybrid Extraction: Tries LLM first, falls back to Smart Regex if LLM fails (e.g. 429 quota error).
 */
async function extractPreferences(text) {
  let preferences = {};

  // 1. Try LLM Extraction
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Extract property preferences from: "${text}". Output ONLY JSON: {location, minPrice, maxPrice, bedrooms, bathrooms, minSize, maxSize, amenities:[]}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text().trim();
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        preferences = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
        console.log("AI Extraction Successful! ✅");
        return preferences;
      }
    } catch (error) {
      console.warn("AI Quota Finished or Error. Falling back to Smart Regex... ⚠️");
    }
  }

  // 2. Smart Regex Fallback (Unstoppable Mode)
  const lowerText = text.toLowerCase();
  
  // Extract Location (Look for capitalized words or known cities - simplified)
  const locationMatch = text.match(/(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  if (locationMatch) preferences.location = locationMatch[1];

  // Extract Price
  const priceMatch = lowerText.match(/(?:under|max|budget|below)?\s*\$?(\d+(?:\.\d+)?)\s*(k|m|million|thousand)?/);
  if (priceMatch) {
    let num = parseFloat(priceMatch[1]);
    if (priceMatch[2] === 'k' || priceMatch[2] === 'thousand') num *= 1000;
    if (priceMatch[2] === 'm' || priceMatch[2] === 'million') num *= 1000000;
    preferences.maxPrice = num;
  }

  // Extract Bedrooms
  const bedMatch = lowerText.match(/(\d+)\s*(?:bed|bhk|bedroom)/);
  if (bedMatch) preferences.bedrooms = parseInt(bedMatch[1]);

  // Extract Bathrooms
  const bathMatch = lowerText.match(/(\d+)\s*(?:bath|bathroom)/);
  if (bathMatch) preferences.bathrooms = parseInt(bathMatch[1]);

  // Extract Amenities (Expanded List)
  const commonAmenities = [
    "pool", "gym", "garden", "parking", "balcony", "security", "terrace", 
    "pet friendly", "office", "lake", "dock", "garage", "backyard", "ocean"
  ];
  preferences.amenities = commonAmenities.filter(a => lowerText.includes(a));

  // 3. General Search Fallback (If no specific filters found, treat words as search keywords)
  if (!preferences.location && !preferences.maxPrice && !preferences.bedrooms && preferences.amenities.length === 0) {
    // Exclude common stop words
    const stopWords = ["show", "me", "find", "i", "want", "a", "an", "the", "in", "at", "for", "with", "house", "home", "property"];
    const keywords = lowerText.split(/\s+/).filter(word => word.length > 2 && !stopWords.includes(word));
    if (keywords.length > 0) {
      preferences.search = keywords.join(" ");
    }
  }

  console.log("Regex Fallback Results:", preferences);
  return preferences;
}

module.exports = { extractPreferences };
