import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import { sendNotificationToUser } from "./notificationService.js";

export async function checkAndAwardBadges(user: any) {
  if (!user || user.role !== "Student") return;

  const currentBadges = Array.isArray(user.badges) ? user.badges : [];
  const newBadges: string[] = [];

  // 1. Points Milestones
  if (user.points >= 100 && !currentBadges.includes("Bronze Medal")) {
    newBadges.push("Bronze Medal");
    await sendNotificationToUser(user._id, {
      title: "Badge Unlocked! 🏆",
      message: "Congratulations! You have unlocked the 'Bronze Medal' badge for passing 100 XP!",
      type: "award",
    });
  }

  if (user.points >= 500 && !currentBadges.includes("Silver Medal")) {
    newBadges.push("Silver Medal");
    await sendNotificationToUser(user._id, {
      title: "Badge Unlocked! 🏆",
      message: "Awesome job! You have unlocked the 'Silver Medal' badge for passing 500 XP!",
      type: "award",
    });
  }

  if (user.points >= 1000 && !currentBadges.includes("Gold Medal")) {
    newBadges.push("Gold Medal");
    await sendNotificationToUser(user._id, {
      title: "Badge Unlocked! 🏆",
      message: "Legendary! You have unlocked the 'Gold Medal' badge for passing 1,000 XP!",
      type: "award",
    });
  }

  // 2. Course Completion Milestones
  try {
    const completedCount = await Enrollment.countDocuments({
      student: user._id,
      progress: 100,
    });

    if (completedCount >= 1 && !currentBadges.includes("First Step")) {
      newBadges.push("First Step");
      await sendNotificationToUser(user._id, {
        title: "Badge Unlocked! 🏆",
        message: "Congratulations! You have unlocked the 'First Step' badge for completing your first course!",
        type: "award",
      });
    }

    if (completedCount >= 3 && !currentBadges.includes("Course Master")) {
      newBadges.push("Course Master");
      await sendNotificationToUser(user._id, {
        title: "Badge Unlocked! 🏆",
        message: "Amazing! You have unlocked the 'Course Master' badge for completing 3 courses!",
        type: "award",
      });
    }
  } catch (err) {
    console.error("Error checking course completion badges", err);
  }

  // Save new badges if any are earned
  if (newBadges.length > 0) {
    user.badges = [...currentBadges, ...newBadges];
    await user.save();
  }
}
