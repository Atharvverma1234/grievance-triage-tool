
const express = require('express');

const Complaint = require('../models/Complaint');
const {
  authenticate,
  requireRole
} = require('../middleware/auth');

const upload = require('../middleware/upload');

const {
  analyzeComplaint,
  checkDuplicate
} = require('../services/granite.service');

const {
  retrieveDepartment
} = require('../services/rag.service');

const router = express.Router();


// =====================================================
// Submit Complaint
// =====================================================
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

      // Basic validation
      if (!rawText || rawText.trim().length === 0) {
        return res.status(400).json({
          error: 'Complaint description is required'
        });
      }

      // Uploaded photo URL
      const photoUrl = req.file
        ? `/uploads/${req.file.filename}`
        : null;

      // AI complaint analysis
      const analysis = await analyzeComplaint(
        rawText,
        location
      );

      // Retrieve responsible department
      const department = await retrieveDepartment(
        analysis.summary
      );

      // =================================================
      // Find possible duplicate complaints
      // =================================================

      const twoWeeksAgo = new Date(
        Date.now() -
          14 * 24 * 60 * 60 * 1000
      );

      const candidates = await Complaint.find({
        category: analysis.category,
        status: {
          $ne: 'resolved'
        },
        isDuplicate: false,
        createdAt: {
          $gte: twoWeeksAgo
        }
      })
        .limit(10)
        .select('summary');

      // Check whether complaint is a duplicate
      const parentComplaintId =
        await checkDuplicate(
          analysis.summary,
          analysis.category,
          candidates
        );

      // =================================================
      // Create Complaint
      // =================================================

      const complaint = await Complaint.create({
        citizenId: req.user.id,

        rawText,

        location,

        photoUrl,

        category: analysis.category,

        urgency: analysis.urgency,

        extractedLocation:
          analysis.extractedLocation,

        summary: analysis.summary,

        department,

        isDuplicate:
          !!parentComplaintId,

        locationLat:
          locationLat !== undefined &&
          locationLat !== ''
            ? parseFloat(locationLat)
            : null,

        locationLng:
          locationLng !== undefined &&
          locationLng !== ''
            ? parseFloat(locationLng)
            : null,

        detectedLanguage:
          analysis.detectedLanguage,

        parentComplaintId:
          parentComplaintId || null
      });

      // =================================================
      // Update Parent Complaint Urgency
      // =================================================

      if (parentComplaintId) {
        const parent =
          await Complaint.findById(
            parentComplaintId
          );

        if (parent) {
          const urgencyRank = {
            low: 1,
            medium: 2,
            high: 3
          };

          const newUrgencyRank =
            urgencyRank[
              analysis.urgency
            ] || 0;

          const parentUrgencyRank =
            urgencyRank[
              parent.urgency
            ] || 0;

          // Increase parent's urgency
          // if duplicate complaint is more urgent
          if (
            newUrgencyRank >
            parentUrgencyRank
          ) {
            parent.urgency =
              analysis.urgency;

            await parent.save();
          }
        }
      }

      res.status(201).json(
        complaint
      );

    } catch (err) {
      console.error(
        'Complaint submission error:',
        err
      );

      res.status(500).json({
        error: err.message
      });
    }
  }
);


// =====================================================
// Pre-submission Duplicate Check
// =====================================================
// This is only a soft UX check.
// The citizen has NOT submitted the complaint yet.
router.post(
  '/check-duplicate',
  authenticate,
  requireRole('citizen'),
  async (req, res) => {
    try {
      const {
        rawText,
        location
      } = req.body;

      // Don't check extremely short complaints
      if (
        !rawText ||
        rawText.trim().length < 15
      ) {
        return res.json({
          isDuplicate: false
        });
      }

      // Look at recent open parent complaints
      const twoWeeksAgo =
        new Date(
          Date.now() -
            14 * 24 * 60 * 60 * 1000
        );

      const candidates =
        await Complaint.find({
          status: {
            $ne: 'resolved'
          },

          isDuplicate: false,

          createdAt: {
            $gte: twoWeeksAgo
          }
        })
          .limit(15)
          .select(
            'summary rawText'
          );

      // No complaints to compare with
      if (!candidates.length) {
        return res.json({
          isDuplicate: false
        });
      }

      // AI duplicate check
      const matchId =
        await checkDuplicate(
          rawText,
          null,
          candidates
        );

      // No duplicate found
      if (!matchId) {
        return res.json({
          isDuplicate: false
        });
      }

      // Find matching complaint
      const match =
        candidates.find(
          (c) =>
            c._id.toString() ===
            matchId.toString()
        );

      res.json({
        isDuplicate: true,

        matchSummary:
          match?.summary ||
          match?.rawText ||
          '',

        matchId
      });

    } catch (err) {
      console.error(
        'Duplicate check error:',
        err
      );

      // This endpoint is only a UX hint,
      // so failure should not block submission.
      res.json({
        isDuplicate: false
      });
    }
  }
);


// =====================================================
// Get My Complaints
// =====================================================
router.get(
  '/mine',
  authenticate,
  requireRole('citizen'),
  async (req, res) => {
    try {
      const complaints =
        await Complaint.find({
          citizenId: req.user.id
        })
          .sort({
            createdAt: -1
          });

      res.json(
        complaints
      );

    } catch (err) {
      console.error(
        'Fetch complaints error:',
        err
      );

      res.status(500).json({
        error: err.message
      });
    }
  }
);


// =====================================================
// Export Router
// =====================================================
module.exports = router;
