/**
 * Free Custom NLP Logic
 * Extracts location, budget, and bedrooms from natural language sentences.
 */

const LOCATIONS = ["New York", "Miami", "Los Angeles", "Austin", "San Francisco", "Chicago", "Dallas", "Seattle", "Boston"];

function extractPreferences(text) {
  const lowerText = text.toLowerCase();
  let preferences = {};

  // 1. Extract Location
  for (const loc of LOCATIONS) {
    if (lowerText.includes(loc.toLowerCase())) {
      preferences.location = loc;
      break;
    }
  }

  // 2. Extract Budget (looking for numbers near words like 'under', 'max', 'budget', 'k', 'million')
  // Example matches: "under 600k", "max 500000", "1 million"
  const budgetRegex = /(?:under|max|budget)?\s*\$?(\d+(?:\.\d+)?)\s*(k|m|million|thousand)?/g;
  let match;
  let maxPrice = null;

  while ((match = budgetRegex.exec(lowerText)) !== null) {
    let num = parseFloat(match[1]);
    let multiplier = match[2];
    
    if (multiplier === 'k' || multiplier === 'thousand') {
      num = num * 1000;
    } else if (multiplier === 'm' || multiplier === 'million') {
      num = num * 1000000;
    } else if (num < 1000 && num > 10) {
       // if someone says 'under 500' they probably mean 500k
       num = num * 1000;
    }
    
    // Assume the largest number found is the budget cap
    if (!maxPrice || num > maxPrice) {
        maxPrice = num;
    }
  }

  if (maxPrice && maxPrice > 10000) { // arbitrary threshold to ignore small numbers
    preferences.maxPrice = maxPrice;
  }

  // 3. Extract Bedrooms
  // Example matches: "3 bed", "2 bedrooms", "4 bhk"
  const bedRegex = /(\d+)\s*(?:bed|bedroom|beds|bhk)/;
  const bedMatch = lowerText.match(bedRegex);
  if (bedMatch) {
    preferences.bedrooms = parseInt(bedMatch[1]);
  }

  return preferences;
}

module.exports = { extractPreferences };
