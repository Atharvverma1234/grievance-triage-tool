require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/approveFirstOfficial.js <email>');
    process.exit(1);
  }
  const user = await User.findOneAndUpdate({ email }, { approvalStatus: 'approved' }, { new: true });
  console.log(user ? `Approved: ${user.email}` : 'User not found');
  process.exit(0);
}
run();