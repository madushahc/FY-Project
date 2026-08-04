import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";
import StudentProgress from "../models/StudentProgress.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

dotenv.config();

const runDebug = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/fy-project";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);

    console.log("\n=== 🔍 ALL USERS IN DATABASE ===");
    const users = await User.find();
    users.forEach((u) => {
      console.log(`User ID: ${u._id} | Name: ${u.name} | Email: ${u.email} | Role: "${u.role}" | Points: ${u.points || 0}`);
    });

    console.log("\n=== 📚 ALL COURSES IN DATABASE ===");
    const courses = await Course.find();
    courses.forEach((c) => {
      console.log(`Course ID: ${c._id} | Title: ${c.title} (${c.code}) | Instructor: ${c.instructor}`);
    });

    console.log("\n=== 🎓 ALL ENROLLMENTS IN DATABASE ===");
    const enrollments = await Enrollment.find().populate("student", "name email").populate("course", "title");
    console.log(`Total Enrollments: ${enrollments.length}`);
    enrollments.forEach((e) => {
      console.log(`Enrollment ID: ${e._id} | Student: ${(e.student as any)?.name || e.student} (${(e.student as any)?._id}) | Course: ${(e.course as any)?.title || e.course}`);
    });

    console.log("\n=== 📈 ALL STUDENT PROGRESS RECORDS IN DATABASE ===");
    const progressList = await StudentProgress.find().populate("student", "name email").populate("course", "title");
    console.log(`Total StudentProgress Records: ${progressList.length}`);
    progressList.forEach((p, idx) => {
      console.log(`\nProgress #${idx + 1} [ID: ${p._id}]:`);
      console.log(`  Student: ${(p.student as any)?.name || p.student} (ID: ${(p.student as any)?._id || p.student})`);
      console.log(`  Course: ${(p.course as any)?.title || "NULL"} (ID: ${p.course})`);
      console.log(`  Lesson ID: ${p.lessonId}`);
      console.log(`  Watch %: ${p.watchPercent}%, Max Time: ${p.maxWatchedTime}s, Video Watched: ${p.videoWatched}`);
      console.log(`  Completed: ${p.completed}`);
      console.log(`  Answered Questions Count: ${p.answeredQuestions?.length || 0}`);
      if (p.answeredQuestions && p.answeredQuestions.length > 0) {
        p.answeredQuestions.forEach((q, qIdx) => {
          console.log(`    Question #${qIdx + 1}: Marker ID: ${q.questionMarkerId}, Option: ${q.selectedOption}, Correct: ${q.isCorrect}, Time Taken: ${q.timeTaken}s`);
        });
      }
      console.log(`  Scanned QR Codes: ${p.scannedQrCodes?.length || 0}`);
    });

    await mongoose.disconnect();
    console.log("\n✅ Debug completed.");
  } catch (err) {
    console.error("Debug failed:", err);
  }
};

runDebug();
