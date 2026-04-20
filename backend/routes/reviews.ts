import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const reviewSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

router.get('/:restaurantId', async (req: any, res: any) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });
    const avg = reviews.length ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0;
    res.json({ reviews, average: Math.round(avg * 10) / 10, count: reviews.length });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', async (req: any, res: any) => {
  try {
    const { restaurantId, userId, userName, rating, comment } = req.body;
    if (!restaurantId || !userId || !rating || !comment) return res.status(400).json({ message: 'Missing fields' });
    const existing = await Review.findOne({ restaurantId, userId });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json(existing);
    }
    const review = new Review({ restaurantId, userId, userName, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', async (req: any, res: any) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
