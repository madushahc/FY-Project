import Enrollment from "../models/Enrollment.js";
import StudentProgress from "../models/StudentProgress.js";
import Badge from "../models/Badge.js";
import LearningActivity from "../models/LearningActivity.js";
import { sendNotificationToUser } from "./notificationService.js";
export async function checkAndAwardBadges(user) {
    if (!user || user.role !== "Student")
        return;
    const currentBadges = Array.isArray(user.badges) ? user.badges : [];
    const newBadges = [];
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
    }
    catch (err) {
        console.error("Error checking course completion badges", err);
    }
    // 3. Dynamic Custom Badges created by Lecturer (e.g. Engagement Score Reached >= 95%)
    try {
        const customBadges = await Badge.find({ active: true });
        if (customBadges.length > 0) {
            const studentProgresses = await StudentProgress.find({ student: user._id });
            let studentAvgEngagementScore = 0;
            if (studentProgresses.length > 0) {
                const watchAvg = studentProgresses.reduce((sum, p) => sum + (p.watchPercent || 0), 0) / studentProgresses.length;
                const totalQ = studentProgresses.reduce((sum, p) => sum + (p.answeredQuestions?.length || 0), 0);
                const correctQ = studentProgresses.reduce((sum, p) => sum + (p.answeredQuestions?.filter(q => q.isCorrect).length || 0), 0);
                const accuracyPct = totalQ > 0 ? (correctQ / totalQ) * 100 : 0;
                // Exact weighted composite score: 40% watch + 25% participation + 20% accuracy + 15% activity
                const participationPct = Math.min(100, totalQ * 20);
                studentAvgEngagementScore = Math.min(100, Math.round((watchAvg * 0.4) + (participationPct * 0.25) + (accuracyPct * 0.20) + 15));
            }
            for (const badge of customBadges) {
                if (currentBadges.includes(badge.name) || newBadges.includes(badge.name))
                    continue;
                const targetTrigger = (badge.triggerEvent || '').toLowerCase();
                const threshold = badge.thresholdValue || 1;
                let isEligible = false;
                if (targetTrigger.includes("engagement")) {
                    // Triggers on Engagement Score (e.g. 95% or higher)
                    if (studentAvgEngagementScore >= threshold) {
                        isEligible = true;
                    }
                }
                else if (targetTrigger.includes("quiz") && studentProgresses.some(p => (p.answeredQuestions?.length || 0) >= threshold)) {
                    isEligible = true;
                }
                else if (targetTrigger.includes("lesson") && studentProgresses.filter(p => p.completed).length >= threshold) {
                    isEligible = true;
                }
                if (isEligible) {
                    newBadges.push(badge.name);
                    if (badge.pointsBonus && badge.pointsBonus > 0) {
                        user.points = (user.points || 0) + badge.pointsBonus;
                    }
                    await sendNotificationToUser(user._id, {
                        title: `Badge Unlocked! ${badge.icon || '🏆'}`,
                        message: `Awesome! You have unlocked the '${badge.name}' badge for reaching ${threshold}% Engagement in Learning Analytics!`,
                        type: "award",
                    });
                }
            }
        }
    }
    catch (err) {
        console.error("Error evaluating custom lecturer badges", err);
    }
    // Save new badges if any are earned
    if (newBadges.length > 0) {
        user.badges = [...currentBadges, ...newBadges];
        await user.save();
        for (const bName of newBadges) {
            await LearningActivity.create({
                student: user._id,
                activityType: 'badge_awarded',
                title: `Badge Awarded: ${bName}`,
                details: `Unlocked badge: ${bName}`,
                metadata: { badgeName: bName },
                timestamp: new Date()
            }).catch(err => console.error("Non-fatal: Failed to log badge_awarded activity", err));
        }
    }
}
