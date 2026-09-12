// Lightweight, honest stand-in for RAG: rule-based retrieval over a small,
// fixed set of department-responsibility mappings. Not a vector search —
// state this plainly in the PPT rather than calling it full RAG.

const departments = require('../data/departments');

function retrieveDepartment(category) {
  const categoryMap = {
    pothole: 'Roads & Infrastructure',
    garbage: 'Sanitation',
    water_leakage: 'Water Works',
    drainage: 'Water Works',
    streetlight: 'Electrical'
  };
  return categoryMap[category] || 'General Administration';
}

module.exports = { retrieveDepartment };