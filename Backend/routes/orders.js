const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Ensure the path is correct

// Create a new order
router.post('/orders', async (req, res) => {
  const { userEmail, items, orderId, serialNumber } = req.body;

  if (!userEmail || !items || !orderId || !serialNumber) {
    return res.status(400).json({ error: 'User email, items, order ID, and serial number are required.' });
  }

  try {
    const newOrder = new Order({ userEmail, items, orderId, serialNumber });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch orders by user email
router.get('/orders', async (req, res) => {
  const { userEmail } = req.query; // Extract userEmail from query parameters

  try {
    // If userEmail is provided, filter orders by userEmail
    const orders = userEmail ? await Order.find({ userEmail }) : await Order.find({});
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch order by orderId
router.get('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an order by orderId
router.delete('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await Order.findOneAndDelete({ orderId });
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
