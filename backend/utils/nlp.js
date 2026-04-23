const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

/**
 * Uses Gemini LLM to extract property preferences from natural language.
 */
async function extractPreferences(text) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not found. Please add it to your .env file.");
    return {};
  }

  const prompt = `
    You are a real estate assistant. Extract property preferences from the following user message.
    User Message: "${text}"

    Return ONLY a JSON object with these keys (if not found, use null):
    - location (String)
    - minPrice (Number)
    - maxPrice (Number)
    - bedrooms (Number)
    - bathrooms (Number)
    - minSize (Number, square feet)
    - maxSize (Number, square feet)
    - amenities (Array of Strings)

    Example response:
    {
      "location": "Miami",
      "maxPrice": 500000,
      "bedrooms": 3,
      "bathrooms": 2,
      "amenities": ["pool", "gym"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("LLM Extraction Error:", error);
    return {};
  }
}

module.exports = { extractPreferences };
