"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCourseStore } from "@/store/useCourseStore";
import { useUserStore } from "@/store/useUserStore";
import Loading from "@/components/ui/Loading";
import { useGamificationStore } from "@/store/useGamificationStore";

export default function StudentDashboard() {
  const {
    myEnrollments,
    fetchMyEnrollments,
    loading: courseLoading,
  } = useCourseStore();
  const { badges, fetchGamification } = useUserStore();
  const { leaderboard, fetchLeaderboard } = useGamificationStore();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchMyEnrollments();
    fetchGamification();
    fetchLeaderboard();
  }, [fetchMyEnrollments, fetchGamification, fetchLeaderboard]);

  // Derive some stats
  const activeCourses = myEnrollments.length;
  const points = user?.points || 0;
  const badgesEarned = badges?.length || 0;

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
            Keep pushing! You're actively enrolled in {activeCourses} courses.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              ⭐ {points} XP earned
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              🏅 {badgesEarned} Badges
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Total Points
          </p>
          <h3 className="text-3xl font-light text-blue-600 mb-2">{points}</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> +120 this week
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
            <span className="text-[10px]">▲</span> Fresh badge unlock
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Leaderboard Rank
          </p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">#3</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> Up 2 positions
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Courses Active
          </p>
          <h3 className="text-3xl font-light text-pink-500 mb-2">
            {activeCourses}
          </h3>
          <p className="text-red-400 text-xs font-medium">
            Keep the streak alive
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Wider) */}
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
            ) : myEnrollments.length === 0 ? (
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
                {myEnrollments.map((enrollment, index) => {
                  const courseTitle =
                    enrollment.course?.title || "Unknown Course";
                  const progressValue = enrollment.progress || 0;

                  // Pick colors cyclically
                  const colorIdx = index % bgColors.length;

                  return (
                    <div key={enrollment._id}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-slate-700">
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
                          className={`${bgColors[colorIdx]} h-2 rounded-full`}
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

        {/* Right Column (Narrower) */}
        <div className="space-y-6">
          {/* Your Points Widget */}
          <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>⭐</span> Your Points
            </p>
            <h3 className="text-4xl font-light mb-1">{points}</h3>
            <p className="text-blue-100 text-xs mb-6">
              +120 this week • Level 8
            </p>

            <div>
              <div className="flex justify-between text-xs font-medium text-blue-100 mb-2">
                <span>Progress to Level 9</span>
                <span>{points} / 2,000 XP</span>
              </div>
              <div className="w-full bg-blue-700/50 rounded-full h-1.5">
                <div
                  className="bg-white h-1.5 rounded-full"
                  style={{ width: `${(points / 2000) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Top Learners List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <span>🏆</span> Top Learners
              </h3>
            </div>
            <div>
              {leaderboard.slice(0, 3).map((learner, i) => {
                const isMe = user && user._id === learner._id;
                const rank = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 px-5 border-b border-slate-50 last:border-0 ${isMe ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-5 text-center text-sm font-bold ${isMe ? "text-blue-600" : "text-slate-400"}`}
                      >
                        {rank}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-blue-600`}
                      >
                        {learner.name ? learner.name[0].toUpperCase() : "U"}
                      </div>
                      <span
                        className={`text-sm ${isMe ? "font-medium text-blue-700" : "text-slate-600"}`}
                      >
                        {learner.name} {isMe && "✨"}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-medium ${isMe ? "text-blue-600" : "text-blue-500"}`}
                    >
                      {learner.points.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
