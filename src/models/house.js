const mongoose = require('mongoose');

const HouseSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    province: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    street: {
      type: String,
      required: true,
    },

    houseNr: {
      type: String,
      required: true,
    },

    yearBuilt: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    dimension: {
      type: Number,
      required: true,
    },

    floorsInBuilding: {
      type: Number,
      required: true,
    },

    floor: {
      type: Number,
      default: '',
    },

    roomsNumber: {
      type: Number,
      required: true,
    },

    bathroomNumber: {
      type: Number,
      required: true,
    },

    otherFeatures: {
      type: Array,
      default: [],
    },

    descriptionField: {
      type: String,
    },

    images: {
      type: Array,
    },

    isAccepted: {
      type: Number,
      default: 1,
    },

    isExist: {
      type: Number,
      default: 0,
    },

    reservedBy: {
      type: String,
      default: '',
    }
  },
  { timestamps: true }
);

const House = mongoose.model('House', HouseSchema);

module.exports = House;
