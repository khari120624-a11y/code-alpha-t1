const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moodstream');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Warning: Could not connect to MongoDB (${error.message}). Server is running in Local Mock Mode.`);
  }
};

module.exports = connectDB;
