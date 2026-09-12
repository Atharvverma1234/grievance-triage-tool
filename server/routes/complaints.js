
const express = require('express');
const Complaint = require('../models/Complaint');
const { authenticate, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  analyzeComplaint,
  checkDuplicate
} = require('../services/granite.service');
const { retrieveDepartment } = require('../services/rag.service');

const router = express.Router();

router.post(
  '/',
  authenticate,
  requireRole('citizen'),
  upload.single('photo'),
  async (req, res) => {
    try {
      const {
        rawText,
        location,
        locationLat,
        locationLng
      } = req.body;

      const photoUrl = req.file
        ? `/uploads/${req.file.filename}`
        : null;

      const analysis = await analyzeComplaint(
        rawText,
        location
      );

      const department = retrieveDepartment(
        analysis.category
      );

      // Look for candidate duplicates:
      // same category, still open, last 14 days
      const twoWeeksAgo = new Date(
        Date.now() - 14 * 24 * 60 * 60 * 1000
      );

      const candidates = await Complaint.find({
        category: analysis.category,
        status: { $ne: 'resolved' },
        isDuplicate: false,
        createdAt: { $gte: twoWeeksAgo }
      })
        .limit(10)
        .select('summary');

      const parentComplaintId = await checkDuplicate(
        analysis.summary,
        analysis.category,
        candidates
      );

      const complaint = await Complaint.create({
        citizenId: req.user.id,
        rawText,
        location,
        photoUrl,

        category: analysis.category,
        urgency: analysis.urgency,
        extractedLocation: analysis.extractedLocation,
        summary: analysis.summary,
        department,

        isDuplicate: !!parentComplaintId,

        locationLat: locationLat
          ? parseFloat(locationLat)
          : null,

        locationLng: locationLng
          ? parseFloat(locationLng)
          : null,

        detectedLanguage: analysis.detectedLanguage,

        parentComplaintId:
          parentComplaintId || null
      });

      // If it's a duplicate, bump the parent's urgency
      // if this complaint is more urgent.
      if (parentComplaintId) {
        const parent = await Complaint.findById(
          parentComplaintId
        );

        if (parent) {
          const urgencyRank = {
            low: 1,
            medium: 2,
            high: 3
          };

          if (
            urgencyRank[analysis.urgency] >
            urgencyRank[parent.urgency]
          ) {
            parent.urgency = analysis.urgency;
            await parent.save();
          }
        }
      }

      res.status(201).json(complaint);
    } catch (err) {
      console.error('Complaint submission error:', err);

      res.status(500).json({
        error: err.message
      });
    }
  }
);

router.get(
  '/mine',
  authenticate,
  requireRole('citizen'),
  async (req, res) => {
    try {
      const complaints = await Complaint.find({
        citizenId: req.user.id
      }).sort({ createdAt: -1 });

      res.json(complaints);
    } catch (err) {
      console.error('Fetch complaints error:', err);

      res.status(500).json({
        error: err.message
      });
    }
  }
);

module.exports = router;
