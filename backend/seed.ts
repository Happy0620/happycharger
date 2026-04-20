import mongoose from 'mongoose';
import Restaurant from './models/Restaurant';
import MenuItem from './models/MenuItem';

export async function seedDatabase() {
  await Restaurant.deleteMany({});
  await MenuItem.deleteMany({});

  const restaurants = [
    {
      name: 'The Golden Whisk',
      location: 'DurbarMarg',
      distance: 'Approx 1.2 km',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      deliveryTime: '30-40 mins',
      categories: ['French', 'Modern European'],
      tags: ['Free Delivery']
    },
    {
      name: 'Sakura Zen',
      location: 'Lakeside',
      distance: 'Approx 2.5 km',
      image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.5,
      deliveryTime: '20-25 mins',
      categories: ['Japanese', 'Asian Fusion'],
      tags: ['Best Seller']
    },
    {
      name: 'Wildflour Kitchen',
      location: 'Old Town',
      distance: 'Approx 0.8 km',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.9,
      deliveryTime: '15-20 mins',
      categories: ['Organic', 'Breakfast & Brunch'],
      tags: ['Organic']
    },
    {
      name: 'The Ember Grill',
      location: 'Baneshwor',
      distance: 'Approx 3.1 km',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.6,
      deliveryTime: '45-55 mins',
      categories: ['Steakhouse', 'BBQ'],
      tags: ['Premium']
    },
    {
      name: 'Vero Italian',
      location: 'Thamel',
      distance: 'Approx 1.4 km',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.7,
      deliveryTime: '25-30 mins',
      categories: ['Italian', 'Pizzeria'],
      tags: ['10% OFF']
    },
    {
      name: 'Olive & Spice',
      location: 'Jhamsikhel',
      distance: 'Approx 2.9 km',
      image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.4,
      deliveryTime: '35-45 mins',
      categories: ['Mediterranean', 'Healthy'],
      tags: ['Popular']
    }
  ];

  const createdRestaurants = await Restaurant.insertMany(restaurants);

  const menuItems = [
    {
      restaurantId: createdRestaurants[0]._id,
      name: 'Coq au Vin',
      description: 'Classic French chicken braised with wine, lardons, and mushrooms.',
      price: 25.00,
      image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'Main Course',
      calories: 650,
      funFact: 'Coq au Vin was originally a peasant dish created to make tough, old birds tender and delicious.'
    },
    {
      restaurantId: createdRestaurants[1]._id,
      name: 'Spicy Tuna Roll',
      description: 'Fresh tuna with spicy mayo and cucumber.',
      price: 12.50,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'Sushi',
      calories: 320,
      funFact: 'The spicy tuna roll was invented in Los Angeles in the 1980s.'
    },
    {
      restaurantId: createdRestaurants[4]._id,
      name: 'Margherita Pizza',
      description: 'Classic tomato, mozzarella, and fresh basil.',
      price: 18.00,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop',
      category: 'Pizza',
      calories: 800,
      funFact: 'Margherita pizza was named after Queen Margherita of Savoy in 1889.'
    }
  ];

  await MenuItem.insertMany(menuItems);

  console.log('Database seeded with initial data!');
}
