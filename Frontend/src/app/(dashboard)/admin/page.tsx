"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchAnalytics = async () => {
        try {
           const res = await api.get('/analytics/admin-reports');
           setData(res.data);
        } catch (err) {
           console.error("Failed to load analytics", err);
        }
        setLoading(false);
     };
     fetchAnalytics();
  }, []);

  // Chart data height percentages and specific colors from the image
  const chartData = data?.engagement?.dailyActiveUsers?.map((d: any, idx: number) => {
     const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-indigo-400', 'bg-orange-400'];
     return { h: `${d.v}%`, color: colors[idx % colors.length] };
  }) || [];

  if (loading) {
     return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        {/* Abstract background shapes */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute right-32 bottom-0 w-48 h-48 bg-orange-300 opacity-20 rounded-full blur-2xl translate-y-1/4"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Admin Control Panel 🛠️</h1>
          <p className="text-red-100 text-sm mb-6">Platform-wide system overview • NSBM Green University</p>

          <div className="flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              👥 {data?.userActivity?.metrics?.totalUsers || 0} Users
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              📚 {data?.coursePerformance?.metrics?.totalCourses || 0} Courses
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              ⚡ {data?.engagement?.metrics?.completionRate || 0}% Engagement
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Students</p>
          <h3 className="text-3xl font-light text-blue-500 mb-2">{data?.userActivity?.metrics?.totalUsers || 0}</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> 22 this month
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active Users</p>
          <h3 className="text-3xl font-light text-purple-500 mb-2">{data?.userActivity?.metrics?.activeUsers || 0}</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> 3 new
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active Courses</p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">{data?.coursePerformance?.metrics?.totalCourses || 0}</h3>
          <p className="text-emerald-400 text-xs font-medium">
            6 in development
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Platform Engagement</p>
          <h3 className="text-3xl font-light text-orange-400 mb-2">{data?.engagement?.metrics?.completionRate || 0}%</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> +5% this month
          </p>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-semibold text-slate-800">Platform-Wide Engagement</h3>
          <button className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-medium">
            Last 30 days
          </button>
        </div>

        <div className="h-64 flex items-end justify-between gap-2 px-2 pb-2">
          {chartData.map((bar, idx) => (
            <div
              key={idx}
              className={`w-full max-w-[40px] rounded-t-md ${bar.color} opacity-90 hover:opacity-100 transition-opacity cursor-pointer`}
              style={{ height: bar.h }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
