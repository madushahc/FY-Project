import mongoose from 'mongoose';
import Course from './src/models/Course.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://FYProject:FYProject@register.efg8r9v.mongodb.net/");
  const latestCourse = await Course.findOne().sort({ createdAt: -1 });
  console.log('Latest Course:', JSON.stringify(latestCourse, null, 2));
  process.exit(0);
}
check();
