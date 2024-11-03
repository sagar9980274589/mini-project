const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true, // Ensure that userEmail is required
  }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
