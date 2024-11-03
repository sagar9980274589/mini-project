const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [{ name: String, quantity: Number, price: Number, total: Number }],
  orderId: { type: String, required: true },
  serialNumber: { type: String, required: true }, // Add this field
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
