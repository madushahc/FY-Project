import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";
import StudentProgress from "../models/StudentProgress.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

dotenv.config();

const runTest = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/fy-project";
    console.log("Connecting to MongoDB:", mongoUri.split("@")[1] || mongoUri);
    await mongoose.connect(mongoUri);

    console.log("\n=== 🔍 STEP 1: MONGODB COLLECTIONS COUNT ===");
    const usersCount = await User.countDocuments();
    const coursesCount = await Course.countDocuments();
    const studentProgressCount = await StudentProgress.countDocuments();
    const enrollmentsCount = await Enrollment.countDocuments();

    console.log(`Users: ${usersCount}`);
    console.log(`Courses: ${coursesCount}`);
    console.log(`StudentProgress: ${studentProgressCount}`);
    console.log(`Enrollments: ${enrollmentsCount}`);

    console.log("\n=== 📚 STEP 2: COURSES DETAILED LIST ===");
    const courses = await Course.find().populate("instructor", "name email role");
    courses.forEach((c) => {
      console.log(`- Course ID: ${c._id}`);
      console.log(`  Title: ${c.title} (${c.code})`);
      console.log(`  Instructor: ${c.instructor ? (c.instructor as any).name + " (" + (c.instructor as any).email + ", ID: " + (c.instructor as any)._id + ")" : "None"}`);
      console.log(`  Modules: ${c.modules?.length || 0}`);
      (c.modules || []).forEach((m, idx) => {
        console.log(`    Module ${idx + 1}: ${m.title} (${m.lessons?.length || 0} lessons)`);
        (m.lessons || []).forEach((l) => {
          console.log(`      Lesson: ${l.title} (ID: ${l._id}, Type: ${l.type}, Questions: ${l.questionMarkers?.length || 0})`);
        });
      });
    });

    console.log("\n=== 📈 STEP 3: STUDENT PROGRESS RECORDS SAMPLE ===");
    const progressList = await StudentProgress.find().populate("student", "name email").populate("course", "title");
    console.log(`Found ${progressList.length} StudentProgress records.`);
    progressList.forEach((p, idx) => {
      if (idx < 5) {
        console.log(`- Progress ID: ${p._id}`);
        console.log(`  Student: ${(p.student as any)?.name || p.student}`);
        console.log(`  Course: ${(p.course as any)?.title || p.course}`);
        console.log(`  Lesson ID: ${p.lessonId}`);
        console.log(`  Watch %: ${p.watchPercent}%, Max Time: ${p.maxWatchedTime}s`);
        console.log(`  Completed: ${p.completed}, Video Watched: ${p.videoWatched}`);
        console.log(`  Answered Questions: ${p.answeredQuestions?.length || 0}`);
      }
    });

    console.log("\n=== 👥 STEP 4: USERS ROLE BREAKDOWN ===");
    const lecturers = await User.find({ role: { $regex: /lecturer/i } });
    console.log(`Lecturers count: ${lecturers.length}`);
    lecturers.forEach((l) => {
      console.log(`- Lecturer ID: ${l._id}, Name: ${l.name}, Email: ${l.email}, Role in DB: "${l.role}"`);
    });

    await mongoose.disconnect();
    console.log("\n✅ Test completed.");
  } catch (err) {
    console.error("Test failed:", err);
  }
};

runTest();
