const { extractPreferences } = require("./utils/nlp");

async function testNLP() {
  const queries = [
    "Find me a 3 bed villa in Miami with a pool under 1 million",
    "Show me homes in New York under 500k",
    "I want a property with at least 2000 sq ft and boat parking"
  ];

  console.log("--- STARTING NLP TEST ---");
  
  for (const q of queries) {
    console.log(`\nTesting Query: "${q}"`);
    const result = await extractPreferences(q);
    console.log("Result:", JSON.stringify(result, null, 2));
  }
  
  console.log("\n--- TEST COMPLETE ---");
}

testNLP();
