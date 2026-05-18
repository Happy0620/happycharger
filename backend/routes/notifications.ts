import express from 'express';
import Notification from '../models/Notification';

const router = express.Router();

// Get all notifications
router.get('/', async (req: any, res: any) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all as read
router.patch('/read-all', async (req: any, res: any) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Mark a specific notification as read
router.patch('/:id/read', async (req: any, res: any) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
