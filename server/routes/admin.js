const express = require('express');
const router = express.Router();

const { generateDigest } = require('../services/granite.service');
const { authenticate, requireRole } = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { sendStatusUpdateEmail } = require('../services/notification.service');


// =====================================================
// List / Filter Complaints
// =====================================================
router.get(
  '/complaints',
  authenticate,
  requireRole('official'),
  async (req, res) => {
    try {
      const { status, category, location, allWards } = req.query;

      // Only show parent complaints by default
      const filter = {
        isDuplicate: false
      };

      if (status) filter.status = status;
      if (category) filter.category = category;
      if (location) filter.location = location;

      // Default to the official's own ward unless they explicitly ask for all wards
      if (allWards !== 'true' && req.user.ward) {
        filter.$or = [
          { location: { $regex: req.user.ward, $options: 'i' } },
          { extractedLocation: { $regex: req.user.ward, $options: 'i' } }
        ];
      }

      const complaints = await Complaint.find(filter)
        .sort({ createdAt: -1 })
        .lean();

      const URGENCY_SLA_HOURS = {
        high: 24,
        medium: 72,
        low: 168
      };

      const ESCALATION_MULTIPLIER = 2;

      const withCounts = await Promise.all(
        complaints.map(async (c) => {
          // Count duplicate complaints
          const dupeCount = await Complaint.countDocuments({
            parentComplaintId: c._id
          });

          // Calculate how long complaint has been open
          const hoursOpen =
            (Date.now() - new Date(c.createdAt).getTime()) /
            (1000 * 60 * 60);

          const slaHours =
            URGENCY_SLA_HOURS[c.urgency] || 72;

          // Check SLA
          const isOverdue =
            c.status !== 'resolved' &&
            hoursOpen > slaHours;

          // Check escalation threshold
          const shouldEscalate =
            c.status !== 'resolved' &&
            hoursOpen > slaHours * ESCALATION_MULTIPLIER;

          // Auto-escalate complaint
          if (shouldEscalate && !c.escalated) {
            await Complaint.findByIdAndUpdate(c._id, {
              escalated: true,
              escalatedAt: new Date()
            });

            c.escalated = true;
            c.escalatedAt = new Date();
          }

          return {
            ...c,
            reportCount: dupeCount + 1,
            isOverdue,
            hoursOpen: Math.round(hoursOpen)
          };
        })
      );

      // Sort:
      // 1. Overdue complaints first
      // 2. High urgency first
      // 3. Newest complaints first
      const urgencyRank = {
        high: 3,
        medium: 2,
        low: 1
      };

      withCounts.sort((a, b) => {
        if (a.isOverdue !== b.isOverdue) {
          return Number(b.isOverdue) - Number(a.isOverdue);
        }

        if (a.urgency !== b.urgency) {
          return (
            (urgencyRank[b.urgency] || 0) -
            (urgencyRank[a.urgency] || 0)
          );
        }

        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );
      });

      res.json(withCounts);

    } catch (err) {
      console.error('Error fetching complaints:', err);

      res.status(500).json({
        error: err.message
      });
    }
  }
);


// =====================================================
// Update Complaint Status
// =====================================================


router.patch('/complaints/:id', authenticate, requireRole('official'), async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const update = {};
    if (status !== undefined) update.status = status;
    if (resolutionNote !== undefined) update.resolutionNote = resolutionNote;

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    // Fire-and-forget notification — doesn't block or fail the response
    if (status) {
      const citizen = await User.findById(complaint.citizenId).select('email');
      if (citizen?.email) {
        sendStatusUpdateEmail(citizen.email, complaint.summary || complaint.rawText, status, resolutionNote);
      }
    }

    res.json(complaint);
  } catch (err) {
    console.error('Error updating complaint:', err);
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// Aggregate Insights + AI Digest
// =====================================================
router.get(
  '/insights',
  authenticate,
  requireRole('official'),
  async (req, res) => {
    try {
      const categoryCounts = await Complaint.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]);

      const locationCounts = await Complaint.aggregate([
        {
          $group: {
            _id: '$extractedLocation',
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            count: -1
          }
        },
        {
          $limit: 10
        }
      ]);

      const trend = await Complaint.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ]);

      const recent = await Complaint.find()
        .sort({ createdAt: -1 })
        .limit(30)
        .select(
          'summary category extractedLocation'
        )
        .lean();

      const digest = await generateDigest(recent);

      res.json({
        categoryCounts,
        locationCounts,
        trend,
        digest
      });

    } catch (err) {
      console.error('Error generating insights:', err);

      res.status(500).json({
        error: err.message
      });
    }
  }
);


// =====================================================
// List Pending Officials
// =====================================================
router.get(
  '/pending-officials',
  authenticate,
  requireRole('official'),
  async (req, res) => {
    try {
      const pending = await User.find({
        role: 'official',
        approvalStatus: 'pending'
      })
        .select(
          'name email ward createdAt'
        )
        .lean();

      res.json(pending);

    } catch (err) {
      console.error(
        'Error fetching pending officials:',
        err
      );

      res.status(500).json({
        error: err.message
      });
    }
  }
);


// =====================================================
// Approve an Official
// =====================================================
router.patch(
  '/pending-officials/:id/approve',
  authenticate,
  requireRole('official'),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          approvalStatus: 'approved'
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json({
        id: user._id,
        name: user.name,
        approvalStatus: user.approvalStatus
      });

    } catch (err) {
      console.error(
        'Error approving official:',
        err
      );

      res.status(500).json({
        error: err.message
      });
    }
  }
);


// =====================================================
// Get Escalated Complaints
// =====================================================
router.get(
  '/escalated',
  authenticate,
  requireRole('official'),
  async (req, res) => {
    try {
      const complaints = await Complaint.find({
        escalated: true,
        status: {
          $ne: 'resolved'
        }
      })
        .sort({
          escalatedAt: -1
        })
        .lean();

      res.json(complaints);

    } catch (err) {
      console.error(
        'Error fetching escalated complaints:',
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