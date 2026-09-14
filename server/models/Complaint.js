const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rawText: { type: String, required: true },
  photoUrl: { type: String },
  location: { type: String }, // text or "lat,lng" for now

  // AI-derived fields
  category: { type: String, default: null },
  urgency: { type: String, default: null },
  extractedLocation: { type: String, default: null },
  summary: { type: String, default: null },
  department: { type: String, default: null }, // rule-based retrieval result
  isDuplicate: { type: Boolean, default: false },
  detectedLanguage: { type: String, default: null },
  resolutionNote: { type: String, default: null },
  locationLat: { type: Number, default: null },
  locationLng: { type: Number, default: null },
  escalated: { type: Boolean, default: false },
  escalatedAt: { type: Date, default: null },
  parentComplaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', default: null },

  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);