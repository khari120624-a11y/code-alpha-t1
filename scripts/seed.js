const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const connectDB = require('../config/db');

dotenv.config();

const seedData = async () => {
  try {
    // Establish DB Connection
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moodstream');

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Database cleared.');

    // Hash user passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    // Create seed users
    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        isAdmin: true,
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        isAdmin: false,
      },
    ]);

    const adminUser = createdUsers[0]._id;

    // Create seed products
    const sampleProducts = [
      {
        user: adminUser,
        name: 'Sony WH-1000XM4 Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        description: 'Industry-leading noise-canceling wireless over-ear headphones with Alexa voice control and 30 hours of battery life.',
        category: 'Audio',
        price: 349.99,
        countInStock: 12,
        rating: 4.8,
        numReviews: 24,
      },
      {
        user: adminUser,
        name: 'Keychron K2 Mechanical Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        description: 'A 75% layout wireless mechanical keyboard with Gateron switches, RGB backlighting, and dual compatibility for Mac and Windows.',
        category: 'Keyboards',
        price: 99.99,
        countInStock: 8,
        rating: 4.5,
        numReviews: 18,
      },
      {
        user: adminUser,
        name: 'Apple Watch Series 8 GPS',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
        description: 'Advanced health monitoring sensors, crash detection, workout tracking, and a bright always-on Retina display.',
        category: 'Wearables',
        price: 399.99,
        countInStock: 5,
        rating: 4.7,
        numReviews: 14,
      },
      {
        user: adminUser,
        name: 'MX Master 3S Ergonomic Mouse',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
        description: 'Ultra-fast MagSpeed scrolling ergonomic mouse with an 8K DPI sensor that tracks on glass, and quiet click design.',
        category: 'Accessories',
        price: 99.99,
        countInStock: 20,
        rating: 4.6,
        numReviews: 32,
      },
      {
        user: adminUser,
        name: 'Bose SoundLink Flex Bluetooth Speaker',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
        description: 'Waterproof portable speaker designed to deliver deep, immersive audio with custom-engineered transducers and PositionIQ tech.',
        category: 'Audio',
        price: 149.99,
        countInStock: 0,
        rating: 4.4,
        numReviews: 9,
      },
      {
        user: adminUser,
        name: 'Logitech G PRO X Superlight Gaming Mouse',
        image: 'https://images.unsplash.com/photo-1625600243103-1dc6824c6c8a?w=600&q=80',
        description: 'Designed with the world\'s leading esports pros, weighing less than 63 grams with ultra-low latency LIGHTSPEED wireless connectivity.',
        category: 'Accessories',
        price: 159.99,
        countInStock: 15,
        rating: 4.9,
        numReviews: 40,
      },
    ];

    await Product.insertMany(sampleProducts);

    console.log('Database successfully seeded with users and products!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
