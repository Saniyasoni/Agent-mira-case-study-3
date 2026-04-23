const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

async function testGemini() {
  const envContent = fs.readFileSync("./.env", "utf-8");
  const match = envContent.match(/GEMINI_API_KEY=(.*)/);
  let key = match ? match[1].trim() : "";
  if (key.startsWith("pAIza")) key = key.substring(1);

  console.log("Using Key length:", key.length);

  const genAI = new GoogleGenerativeAI(key);

  const modelsToTest = ["gemini-1.5-flash", "gemini-pro"];

  for (const modelName of modelsToTest) {
    try {
      console.log("Testing model:", modelName);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello. Return {\"ok\": true}");
      console.log(`Success for ${modelName}:`, result.response.text());
    } catch (e) {
      console.log(`Error for ${modelName}:`, e.message);
    }
  }
}

testGemini();
