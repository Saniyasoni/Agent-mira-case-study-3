const path = require("path");

// Load the three JSON data sources
const basics = require(path.join(__dirname, "../data/property_basics.json"));
const characteristics = require(path.join(__dirname, "../data/property_characteristics.json"));
const images = require(path.join(__dirname, "../data/property_images.json"));

/**
 * Merges data from all three JSON files using the 'id' field.
 * Returns an array of fully merged property objects.
 */
function mergePropertyData() {
  return basics.map((basic) => {
    const chars = characteristics.find((c) => c.id === basic.id) || {};
    const img = images.find((i) => i.id === basic.id) || {};

    return {
      id: basic.id,
      title: basic.title,
      price: basic.price,
      location: basic.location,
      bedrooms: chars.bedrooms || 0,
      bathrooms: chars.bathrooms || 0,
      size_sqft: chars.size_sqft || 0,
      amenities: chars.amenities || [],
      image_url: img.image_url || "",
    };
  });
}

/**
 * Filters properties based on user preferences.
 * @param {Object} filters - { location, minPrice, maxPrice, bedrooms, search }
 * @returns {Array} - Filtered properties
 */
function filterProperties(filters) {
  let properties = mergePropertyData();

  if (filters.search) {
    const query = filters.search.toLowerCase();
    properties = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.amenities.some(a => a.toLowerCase().includes(query))
    );
  }

  if (filters.location) {
    properties = properties.filter((p) =>
      p.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.minPrice) {
    properties = properties.filter((p) => p.price >= Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    properties = properties.filter((p) => p.price <= Number(filters.maxPrice));
  }

  if (filters.bedrooms) {
    properties = properties.filter(
      (p) => p.bedrooms >= Number(filters.bedrooms)
    );
  }

  return properties;
}

module.exports = { mergePropertyData, filterProperties };
