const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: { type: String },
  email: { type: String }
});

module.exports = mongoose.model('User', userSchema);
