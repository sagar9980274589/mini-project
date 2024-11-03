const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem'); // Import the MenuItem model

// Get all menu items for a specific user
router.get('/menuItems', async (req, res) => {
  const userEmail = req.query.userEmail; // Expect userEmail as a query parameter

  try {
    const items = await MenuItem.find({ userEmail }); // Filter by userEmail
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

// Add a new menu item
router.post('/menuItems', async (req, res) => {
  const { name, price, imageUrl, userEmail } = req.body;

  try {
    const newMenuItem = new MenuItem({ name, price, imageUrl, userEmail });
    const savedItem = await newMenuItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a menu item
router.delete('/menuItems/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Error deleting menu item" });
  }
});

module.exports = router;
