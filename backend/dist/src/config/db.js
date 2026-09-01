import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI ||
            "mongodb+srv://FYProject:FYProject@register.efg8r9v.mongodb.net/");
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        // Auto-seed default badges
        try {
            const Badge = (await import("../models/Badge.js")).default;
            const count = await Badge.countDocuments();
            if (count === 0) {
                console.log("No badges found in database. Seeding default badges...");
                const defaultBadges = [
                    { name: "Bronze Medal", description: "Awarded for passing 100 XP!", icon: "🥉", category: "Milestone", triggerEvent: "Points Milestone", thresholdValue: 100, pointsBonus: 10, isVisible: true, active: true },
                    { name: "Silver Medal", description: "Awarded for passing 500 XP!", icon: "🥈", category: "Milestone", triggerEvent: "Points Milestone", thresholdValue: 500, pointsBonus: 50, isVisible: true, active: true },
                    { name: "Gold Medal", description: "Awarded for passing 1,000 XP!", icon: "🥇", category: "Milestone", triggerEvent: "Points Milestone", thresholdValue: 1000, pointsBonus: 100, isVisible: true, active: true },
                    { name: "First Step", description: "Completed first course successfully!", icon: "🚶", category: "Milestone", triggerEvent: "Course Completion", thresholdValue: 1, pointsBonus: 20, isVisible: true, active: true },
                    { name: "Course Master", description: "Completed three courses successfully!", icon: "🎓", category: "Milestone", triggerEvent: "Course Completion", thresholdValue: 3, pointsBonus: 100, isVisible: true, active: true },
                    { name: "Creative Genius", description: "Extraordinary creativity and out-of-the-box thinking.", icon: "🎨", category: "Instructor Award", triggerEvent: "Manual", thresholdValue: 1, pointsBonus: 15, isVisible: true, active: true },
                    { name: "Fastest Submitter", description: "Completed work record-fast.", icon: "⚡", category: "Instructor Award", triggerEvent: "Manual", thresholdValue: 1, pointsBonus: 10, isVisible: true, active: true },
                    { name: "Clean Code", description: "Exceptionally clean, well-structured, and well-commented submission.", icon: "💻", category: "Instructor Award", triggerEvent: "Manual", thresholdValue: 1, pointsBonus: 15, isVisible: true, active: true },
                    { name: "Perfect Score", description: "Scored 100% on a major course assignment.", icon: "💯", category: "Achievement", triggerEvent: "Manual", thresholdValue: 1, pointsBonus: 20, isVisible: true, active: true }
                ];
                await Badge.insertMany(defaultBadges);
                console.log("Seeded default badges successfully!");
            }
        }
        catch (err) {
            console.error("Failed to seed default badges:", err);
        }
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
export default connectDB;
