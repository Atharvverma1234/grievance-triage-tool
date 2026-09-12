const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'official'], default: 'citizen' },
  ward: { type: String } // only relevant for officials
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);