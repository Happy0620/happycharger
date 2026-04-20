import express from 'express';
import Restaurant from '../models/Restaurant';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

// Get all restaurants (with search/filter)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query: any = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.categories = category;
    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Add restaurant
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Edit restaurant
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete restaurant
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;