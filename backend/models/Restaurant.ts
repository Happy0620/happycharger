import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  distance: { type: String }, // e.g., "Approx 1.2 km"
  image: { type: String },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  deliveryTime: { type: String }, // e.g., "30-40 mins"
  categories: [{ type: String }], // e.g., ["French", "Modern European"]
  tags: [{ type: String }], // e.g., ["Free Delivery", "Premium"]
  status: { type: String, enum: ['Open Now', 'Closed'], default: 'Open Now' }
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema);
