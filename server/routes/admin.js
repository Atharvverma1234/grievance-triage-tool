const express = require('express');
const router = express.Router();

const { generateDigest } = require('../services/granite.service');
const { authenticate, requireRole } = require('../middleware/auth');
const Complaint = require('../models/Complaint');

// List/filter complaints
router.get('/complaints', authenticate, requireRole('official'), async (req, res) => {
  try {
    const { status, category, location } = req.query;
    const filter = { isDuplicate: false }; // only show parent issues by default
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (location) filter.location = location;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 }).lean();

    // Attach a duplicate count to each parent complaint
const URGENCY_SLA_HOURS = { high: 24, medium: 72, low: 168 }; // 1 day / 3 days / 7 days

const withCounts = await Promise.all(
  complaints.map(async (c) => {
    const dupeCount = await Complaint.countDocuments({ parentComplaintId: c._id });
    const hoursOpen = (Date.now() - new Date(c.createdAt)) / (1000 * 60 * 60);
    const slaHours = URGENCY_SLA_HOURS[c.urgency] || 72;
    const isOverdue = c.status !== 'resolved' && hoursOpen > slaHours;
    return { ...c, reportCount: dupeCount + 1, isOverdue, hoursOpen: Math.round(hoursOpen) };
  })
);

// Sort: overdue first, then by urgency, then newest
const urgencyRank = { high: 3, medium: 2, low: 1 };
withCounts.sort((a, b) => {
  if (a.isOverdue !== b.isOverdue) return b.isOverdue - a.isOverdue;
  return (urgencyRank[b.urgency] || 0) - (urgencyRank[a.urgency] || 0);
});

res.json(withCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update complaint status
router.patch('/complaints/:id', authenticate, requireRole('official'), async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const update = { status };
    if (resolutionNote !== undefined) update.resolutionNote = resolutionNote;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggregate insights + AI digest
router.get('/insights', authenticate, requireRole('official'), async (req, res) => {
  try {
    const categoryCounts = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const locationCounts = await Complaint.aggregate([
      { $group: { _id: '$extractedLocation', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const trend = await Complaint.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const recent = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .select('summary category extractedLocation');

    const digest = await generateDigest(recent);

    res.json({ categoryCounts, locationCounts, trend, digest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;