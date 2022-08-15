const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    taskCount: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: 'Base',
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
