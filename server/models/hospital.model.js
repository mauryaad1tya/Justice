const mongoose = require('mongoose');
const User = require('./user.model');

// Hospital schema extending User schema
const hospitalSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'India'
    }
  }
});

// Create Hospital model as a discriminator of User
const Hospital = User.discriminator('hospital', hospitalSchema);

module.exports = Hospital;
