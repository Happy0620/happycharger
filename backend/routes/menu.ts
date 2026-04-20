import express from 'express';
import MenuItem from '../models/MenuItem';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

// Search food items by name
router.get('/search', async (req: any, res: any) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const items = await MenuItem.find({ name: { $regex: q, $options: 'i' } })
      .populate('restaurantId', 'name')
      .limit(10);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get menu items by restaurant
router.get('/restaurant/:restaurantId', async (req: any, res: any) => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Surprise me - random item
router.get('/surprise', async (req: any, res: any) => {
  try {
    const count = await MenuItem.countDocuments();
    const random = Math.floor(Math.random() * count);
    const randomItem = await MenuItem.findOne().skip(random).populate('restaurantId');
    res.json(randomItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Add menu item
router.post('/', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Edit menu item
router.put('/:id', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete menu item
router.delete('/:id', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
