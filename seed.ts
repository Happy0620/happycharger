import 'dotenv/config';
import mongoose from 'mongoose';
import Restaurant from './backend/models/Restaurant';
import MenuItem from './backend/models/MenuItem';
import User from './backend/models/User';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feasto';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');
  await Restaurant.deleteMany({});
  await MenuItem.deleteMany({});
  await User.deleteMany({});
  const adminPass = await bcrypt.hash('admin123', 10);
  const custPass = await bcrypt.hash('test123', 10);
  await User.create({name:'Admin',email:'admin@feasto.com',password:adminPass,role:'admin',favorites:[]});
  await User.create({name:'Test User',email:'test@feasto.com',password:custPass,role:'customer',favorites:[]});
  const rests = await Restaurant.insertMany([
    {name:'The Golden Whisk',location:'DurbarMarg',distance:'Approx 1.2 km',image:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',rating:4.8,deliveryTime:'30-40 mins',categories:['French','Modern European'],tags:['Free Delivery']},
    {name:'Sakura Zen',location:'Lakeside',distance:'Approx 2.5 km',image:'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=500&q=80',rating:4.5,deliveryTime:'20-25 mins',categories:['Japanese','Asian Fusion'],tags:['Best Seller']},
    {name:'Wildflour Kitchen',location:'Old Town',distance:'Approx 0.8 km',image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',rating:4.9,deliveryTime:'15-20 mins',categories:['Organic','Breakfast & Brunch'],tags:['Organic']},
    {name:'The Ember Grill',location:'Baneshwor',distance:'Approx 3.1 km',image:'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',rating:4.6,deliveryTime:'45-55 mins',categories:['Steakhouse','BBQ'],tags:['Premium']},
    {name:'Vero Italian',location:'Thamel',distance:'Approx 1.4 km',image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',rating:4.7,deliveryTime:'25-30 mins',categories:['Italian','Pizzeria'],tags:['10% OFF']},
    {name:'Olive & Spice',location:'Jhamsikhel',distance:'Approx 2.9 km',image:'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=500&q=80',rating:4.4,deliveryTime:'35-45 mins',categories:['Mediterranean','Healthy'],tags:['Popular']},
  ]);
  await MenuItem.insertMany([
    {restaurantId:rests[0]._id,name:'Coq au Vin',description:'Classic French chicken braised with wine.',price:25,image:'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80',category:'Main Course',calories:650,funFact:'Coq au Vin was originally a peasant dish!'},
    {restaurantId:rests[0]._id,name:'French Onion Soup',description:'Rich beef broth with caramelized onions.',price:12,image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80',category:'Starter',calories:310,funFact:'French onion soup dates back to Roman times!'},
    {restaurantId:rests[1]._id,name:'Spicy Tuna Roll',description:'Fresh tuna with spicy mayo and cucumber.',price:12.5,image:'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',category:'Sushi',calories:320,funFact:'Invented in LA in the 1980s!'},
    {restaurantId:rests[1]._id,name:'Ramen Tonkotsu',description:'Rich pork bone broth with chashu pork.',price:18.5,image:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=500&q=80',category:'Main Course',calories:720,funFact:'Broth simmered for 12 to 18 hours!'},
    {restaurantId:rests[2]._id,name:'Avocado Toast',description:'Sourdough with smashed avocado and poached egg.',price:13.5,image:'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=500&q=80',category:'Breakfast',calories:390,funFact:'Avocados are technically a berry!'},
    {restaurantId:rests[3]._id,name:'Wagyu Ribeye',description:'A5 wagyu ribeye with truffle butter.',price:58,image:'https://images.unsplash.com/photo-1558030006-450675393462?w=500&q=80',category:'Main Course',calories:860,funFact:'Wagyu fat melts at body temperature!'},
    {restaurantId:rests[4]._id,name:'Margherita Pizza',description:'Classic tomato mozzarella and fresh basil.',price:18,image:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80',category:'Pizza',calories:800,funFact:'Named after Queen Margherita in 1889!'},
    {restaurantId:rests[4]._id,name:'Cacio e Pepe',description:'Roman pasta with Pecorino Romano and black pepper.',price:16.5,image:'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80',category:'Pasta',calories:520,funFact:'Only 3 ingredients but notoriously hard to make!'},
    {restaurantId:rests[5]._id,name:'Mezze Platter',description:'Hummus falafel tabbouleh and pita bread.',price:19,image:'https://images.unsplash.com/photo-1576021182211-9ea8dced3690?w=500&q=80',category:'Starter',calories:650,funFact:'Hummus has been eaten for over 700 years!'},
    {restaurantId:rests[5]._id,name:'Shakshuka',description:'Poached eggs in spiced tomato sauce with feta.',price:14,image:'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=500&q=80',category:'Breakfast',calories:380,funFact:'Shakshuka means all mixed up in Arabic!'},
  ]);
  console.log('Done! admin@feasto.com/admin123 and test@feasto.com/test123');
  mongoose.connection.close();
}
seed().catch(console.error);