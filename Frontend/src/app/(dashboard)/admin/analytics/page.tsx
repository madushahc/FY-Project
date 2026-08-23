"use client";

import React, { useState } from "react";
import StudentEngagementAnalytics from "@/components/StudentEngagementAnalytics";
import LecturerLearningAnalyticsPage from "@/app/(dashboard)/lecturer/learning-analytics/page";
import { BarChart2, Activity } from "lucide-react";

export default function AdminEngagementAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"system" | "learning">("learning");

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 bg-[#1E293B] p-1.5 rounded-2xl w-fit border border-[#334155]">
        <button
          onClick={() => setActiveTab("learning")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "learning"
              ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Learning Analytics ⭐</span>
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "system"
              ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Engagement Overview</span>
        </button>
      </div>

      {/* View Rendering */}
      {activeTab === "learning" ? (
        <LecturerLearningAnalyticsPage />
      ) : (
        <StudentEngagementAnalytics role="ADMIN" />
      )}
    </div>
  );
}
