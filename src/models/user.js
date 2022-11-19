const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    name: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'User',
    },
    status: {
      type: Number,
      default: 1,
    },
    favorites: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
