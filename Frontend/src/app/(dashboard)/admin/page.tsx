import React from 'react';

export default function AdminDashboard() {
  // Chart data height percentages and specific colors from the image
  const chartData = [
    { h: '60%', color: 'bg-blue-500' },
    { h: '70%', color: 'bg-emerald-500' },
    { h: '75%', color: 'bg-blue-500' },
    { h: '65%', color: 'bg-indigo-400' },
    { h: '80%', color: 'bg-emerald-500' },
    { h: '55%', color: 'bg-blue-500' },
    { h: '68%', color: 'bg-orange-400' },
    { h: '60%', color: 'bg-blue-500' },
    { h: '72%', color: 'bg-emerald-500' },
    { h: '78%', color: 'bg-blue-500' },
    { h: '65%', color: 'bg-indigo-400' },
    { h: '82%', color: 'bg-emerald-500' },
    { h: '55%', color: 'bg-blue-500' },
    { h: '18%', color: 'bg-orange-400' },
    { h: '80%', color: 'bg-emerald-500' },
  ];

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
              👥 412 Users
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              📚 18 Courses
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              ⚡ 78% Engagement
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Students</p>
          <h3 className="text-3xl font-light text-blue-500 mb-2">384</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> 22 this month
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Lecturers</p>
          <h3 className="text-3xl font-light text-purple-500 mb-2">28</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> 3 new
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active Courses</p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">18</h3>
          <p className="text-emerald-400 text-xs font-medium">
            6 in development
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Platform Engagement</p>
          <h3 className="text-3xl font-light text-orange-400 mb-2">78%</h3>
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
