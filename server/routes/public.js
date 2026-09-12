const express = require('express');
const Complaint = require('../models/Complaint');

const router = express.Router();

// Public, read-only, aggregate-only — no personal data exposed
router.get('/stats', async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments({ isDuplicate: false });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved', isDuplicate: false });
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

    const categoryCounts = await Complaint.aggregate([
      { $match: { isDuplicate: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);
    const thisMonthCount = await Complaint.countDocuments({
      isDuplicate: false,
      createdAt: { $gte: thisMonthStart }
    });

    res.json({
      totalComplaints,
      resolvedComplaints,
      resolutionRate,
      thisMonthCount,
      categoryCounts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;