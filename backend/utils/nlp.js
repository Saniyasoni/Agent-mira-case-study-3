const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize APIs
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const geminiModel = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// --- DATA DICTIONARIES (For Final Regex Fallback) ---
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
 * Triple-Layer Hybrid Extraction:
 * 1. Groq (Primary AI)
 * 2. Gemini (Secondary AI)
 * 3. Ultra-Smart Regex (Final Fallback)
 */
async function extractPreferences(text) {
  let preferences = { amenities: [], reply: null };
  const prompt = `
    You are Mira, a friendly real estate assistant. 
    Analyze this user message: "${text}"

    Your task is to extract property preferences AND provide a friendly conversational response.

    RULES:
    1. If the user says "Hi", "Hello", or "How are you", greet them warmly and ask what kind of home they seek.
    2. If the user asks something unrelated to real estate, politely steer them back to house hunting.
    3. If the user provides property details (location, price, beds, etc.), extract them into the JSON.
    4. Output ONLY a valid JSON object. Do not include any other text.

    REQUIRED JSON FORMAT:
    {
      "reply": "Your friendly response string here",
      "location": "City name or null",
      "minPrice": number or null,
      "maxPrice": number or null,
      "bedrooms": number or null,
      "bathrooms": number or null,
      "minSize": number or null,
      "maxSize": number or null,
      "amenities": ["amenity1", "amenity2"] or []
    }
  `;

  // LAYER 1: TRY GROQ (Primary AI)
  if (process.env.GROQ_API_KEY) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
      });
      const rawText = chatCompletion.choices[0]?.message?.content.trim() || "";
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        console.log("Layer 1 Successful: Groq AI ⚡");
        return JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
      }
    } catch (error) {
      console.warn("Layer 1 (Groq) Failed. Trying Layer 2 (Gemini)... ⚠️");
    }
  }

  // LAYER 2: TRY GEMINI (Secondary AI)
  if (process.env.GEMINI_API_KEY) {
    try {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text().trim();
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        console.log("Layer 2 Successful: Gemini AI 🤖");
        return JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
      }
    } catch (error) {
      console.warn("Layer 2 (Gemini) Failed. Falling back to Final Regex... ⚠️");
    }
  }

  // LAYER 3: ULTRA-SMART REGEX FALLBACK (Unstoppable Mode)
  const lowerText = text.toLowerCase();
  
  // Basic Greeting Detection for Regex
  if (lowerText.match(/hi|hello|hey|greetings/)) {
    preferences.reply = "Hello! I'm Mira, your real estate assistant. How can I help you find your dream home today?";
  }

  knownCities.forEach(city => {
    if (lowerText.includes(city.toLowerCase())) preferences.location = city;
  });

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
  const sizeMaxMatch = lowerText.match(/(?:under|less than|max|below)\s*(\d+)\s*(?:sqft|sq ft|square feet|feet)/);
  if (sizeMaxMatch) preferences.maxSize = parseInt(sizeMaxMatch[1]);
  const sizeMinMatch = lowerText.match(/(?:above|more than|min|at least|over)\s*(\d+)\s*(?:sqft|sq ft|square feet|feet)/);
  if (sizeMinMatch) preferences.minSize = parseInt(sizeMinMatch[1]);

  const bedMatch = lowerText.match(/(\d+)\s*(?:bed|bhk|bedroom)/);
  if (bedMatch) preferences.bedrooms = parseInt(bedMatch[1]);
  const bathMatch = lowerText.match(/(\d+)\s*(?:bath|bathroom)/);
  if (bathMatch) preferences.bathrooms = parseInt(bathMatch[1]);

  Object.keys(amenityMap).forEach(key => {
    if (lowerText.includes(key) && !preferences.amenities.includes(amenityMap[key])) {
      preferences.amenities.push(amenityMap[key]);
    }
  });

  console.log("Layer 3 Successful: Ultra-Smart Regex 🛡️", preferences);
  return preferences;
}

module.exports = { extractPreferences };
