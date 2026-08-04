"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCourseStore } from "@/store/useCourseStore";
import { useUserStore } from "@/store/useUserStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import Loading from "@/components/ui/Loading";

export default function StudentDashboard() {
  const {
    myEnrollments,
    fetchMyEnrollments,
    loading: courseLoading,
  } = useCourseStore();
  const { user, fetchUserProfile, badges, fetchGamification } = useUserStore();
  const { leaderboard, fetchLeaderboard } = useGamificationStore();

  useEffect(() => {
    fetchUserProfile();
    fetchMyEnrollments();
    fetchGamification();
    fetchLeaderboard();
  }, []);

  // Filter valid enrollments (where course still exists)
  const validEnrollments = myEnrollments.filter(
    (e) => e && e.course && (e.course._id || (e.course as any))
  );

  // Derive dynamic metrics
  const activeCoursesCount = validEnrollments.filter(
    (e) => (e.progress || 0) < 100
  ).length;
  const completedCoursesCount = validEnrollments.filter(
    (e) => (e.progress || 0) === 100
  ).length;

  const points = user?.points || 0;
  const badgesEarned = Array.isArray(user?.badges)
    ? user.badges.length
    : badges?.length || 0;

  // Real Leaderboard Rank calculation
  const myRankIndex = leaderboard.findIndex(
    (u) => String(u._id || u.id) === String(user?._id || user?.id)
  );
  const myRankDisplay =
    myRankIndex !== -1
      ? `#${myRankIndex + 1}`
      : leaderboard.length > 0
      ? `#${leaderboard.length}+`
      : "#--";

  // Real Level & XP Progress calculation
  const levelXP = 250;
  const currentLevel = Math.floor(points / levelXP) + 1;
  const currentLevelXP = points % levelXP;
  const levelProgressPercent = Math.min(
    Math.round((currentLevelXP / levelXP) * 100),
    100
  );

  const bgColors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-orange-500",
  ];
  const textColors = [
    "text-blue-600",
    "text-emerald-600",
    "text-purple-600",
    "text-orange-600",
  ];
  const lightBgColors = [
    "bg-blue-100",
    "bg-emerald-100",
    "bg-purple-100",
    "bg-orange-100",
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute right-32 bottom-0 w-48 h-48 bg-teal-200 opacity-20 rounded-full blur-2xl translate-y-1/4"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋
          </h1>
          <p className="text-blue-100 text-sm mb-6">
            Keep pushing! You have {activeCoursesCount} active course{activeCoursesCount !== 1 ? "s" : ""} in progress.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              ⭐ {points.toLocaleString()} XP earned
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              🏅 {badgesEarned} Badges
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              🎖️ Level {currentLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Total Points
          </p>
          <h3 className="text-3xl font-light text-blue-600 mb-2">{points.toLocaleString()}</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span>⭐</span> Lifetime XP earned
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Badges Earned
          </p>
          <h3 className="text-3xl font-light text-orange-500 mb-2">
            {badgesEarned}
          </h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span>🏅</span> Unlocked achievements
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Leaderboard Rank
          </p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">{myRankDisplay}</h3>
          <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
            <span>🏆</span> Out of {leaderboard.length} student{leaderboard.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Courses Active
          </p>
          <h3 className="text-3xl font-light text-pink-500 mb-2">
            {activeCoursesCount}
          </h3>
          <p className="text-slate-400 text-xs font-medium">
            {completedCoursesCount} completed • {validEnrollments.length} total
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Course Progress) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-slate-800">Course Progress</h3>
              <Link
                href="/student/courses"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View all <span className="text-lg leading-none">→</span>
              </Link>
            </div>

            {courseLoading ? (
              <Loading />
            ) : validEnrollments.length === 0 ? (
              <div className="text-center p-6 text-slate-500">
                <p className="mb-4">
                  You have not enrolled in any courses yet.
                </p>
                <Link
                  href="/student/browse-courses"
                  className="btn-primary inline-flex text-sm py-2 px-4"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {validEnrollments.map((enrollment, index) => {
                  const courseTitle =
                    enrollment.course?.title || "Unknown Course";
                  const progressValue = enrollment.progress || 0;
                  const colorIdx = index % bgColors.length;

                  return (
                    <div key={enrollment._id}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-slate-700 truncate max-w-[80%]">
                          {courseTitle}
                        </p>
                        <div
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${lightBgColors[colorIdx]} ${textColors[colorIdx]}`}
                        >
                          {progressValue}%
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`${bgColors[colorIdx]} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${progressValue}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (XP Progress & Leaderboard) */}
        <div className="space-y-6">
          {/* Real XP & Level Progress Widget */}
          <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>⭐</span> Your Level & XP
            </p>
            <h3 className="text-4xl font-light mb-1">{points.toLocaleString()}</h3>
            <p className="text-blue-100 text-xs mb-6">
              Level {currentLevel} • {badgesEarned} Badges unlocked
            </p>

            <div>
              <div className="flex justify-between text-xs font-medium text-blue-100 mb-2">
                <span>Progress to Level {currentLevel + 1}</span>
                <span>{currentLevelXP} / {levelXP} XP</span>
              </div>
              <div className="w-full bg-blue-700/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${levelProgressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Real Top Learners List Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <span>🏆</span> Top Learners
              </h3>
            </div>
            <div>
              {leaderboard.length === 0 ? (
                <div className="p-5 text-center text-xs text-slate-400 font-medium">
                  No leaderboard data available yet.
                </div>
              ) : (
                leaderboard.slice(0, 5).map((learner, i) => {
                  const isMe = user && String(user._id || user.id) === String(learner._id || learner.id);
                  const rank = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
                  return (
                    <div
                      key={learner._id || i}
                      className={`flex items-center justify-between p-3 px-5 border-b border-slate-50 last:border-0 ${isMe ? "bg-blue-50/70" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 text-center text-xs font-bold ${isMe ? "text-blue-600" : "text-slate-400"}`}
                        >
                          {rank}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isMe ? "bg-blue-600" : "bg-slate-400"}`}
                        >
                          {learner.name ? learner.name[0].toUpperCase() : "U"}
                        </div>
                        <span
                          className={`text-sm ${isMe ? "font-bold text-blue-700" : "text-slate-600 font-medium"}`}
                        >
                          {learner.name} {isMe && "✨ (You)"}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-bold ${isMe ? "text-blue-600" : "text-slate-600"}`}
                      >
                        {(learner.points || 0).toLocaleString()}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
