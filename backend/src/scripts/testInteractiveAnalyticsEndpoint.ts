import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { getInteractiveAnalytics } from "../controllers/interactiveLessonController.js";

dotenv.config();

const runTest = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/fy-project";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);

    const lecturer = await User.findOne({ email: "madushc@gmail.com" });
    if (!lecturer) {
      console.error("Lecturer madushc@gmail.com not found");
      await mongoose.disconnect();
      return;
    }

    console.log(`Testing getInteractiveAnalytics for lecturer: ${lecturer.name} (${lecturer.email}, ID: ${lecturer._id})`);

    const req: any = {
      user: lecturer,
      query: {
        courseId: "all",
        moduleId: "all",
        lessonId: "all"
      }
    };

    let jsonResponse: any = null;
    const res: any = {
      json: (data: any) => {
        jsonResponse = data;
        return res;
      },
      status: (code: number) => {
        console.log(`HTTP Status: ${code}`);
        return res;
      }
    };

    await getInteractiveAnalytics(req, res);

    console.log("\n=== 🎯 FULL ACTUAL JSON RESPONSE FOR MADUSHA HESHAN ===");
    console.log(JSON.stringify(jsonResponse, null, 2));

    await mongoose.disconnect();
    console.log("\n✅ Endpoint test complete.");
  } catch (err) {
    console.error("Endpoint test failed:", err);
  }
};

runTest();
