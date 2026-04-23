const mongoose = require("mongoose");

const SavedPropertySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  size_sqft: { type: Number },
  amenities: { type: [String] },
  image_url: { type: String },
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SavedProperty", SavedPropertySchema);
