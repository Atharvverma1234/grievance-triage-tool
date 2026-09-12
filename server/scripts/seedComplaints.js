require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const { analyzeComplaint } = require('../services/granite.service');

const sampleComplaints = [
  { text: 'Huge pothole near the bus stop on MG Road, cars are swerving dangerously', location: 'Ward 3' },
  { text: 'Garbage has not been collected for a week near the market', location: 'Ward 5' },
  { text: 'Sewage water is overflowing onto the street after every rain', location: 'Ward 5' },
  { text: 'Streetlight outside house number 22 has been off for two weeks', location: 'Ward 2' },
  { text: 'Drainage is blocked and causing waterlogging near the school', location: 'Ward 1' }
  // add more variety as needed
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const citizen = await User.findOne({ role: 'citizen' });
  if (!citizen) {
    console.error('No citizen user found — register one first.');
    process.exit(1);
  }

  for (const item of sampleComplaints) {
    const analysis = await analyzeComplaint(item.text, item.location);
    await Complaint.create({
      citizenId: citizen._id,
      rawText: item.text,
      location: item.location,
      category: analysis.category,
      urgency: analysis.urgency,
      extractedLocation: analysis.extractedLocation,
      summary: analysis.summary
    });
    console.log(`Seeded: ${item.text.slice(0, 40)}...`);
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed();