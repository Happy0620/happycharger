import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String }, // e.g., "Main Course", "Dessert"
  calories: { type: Number }, // Extra feature
  funFact: { type: String }, // Extra feature
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);
