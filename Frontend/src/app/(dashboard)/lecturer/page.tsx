import React from 'react';
import Link from 'next/link';

export default function LecturerDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        {/* Abstract background shapes */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute right-32 bottom-0 w-48 h-48 bg-indigo-300 opacity-20 rounded-full blur-2xl translate-y-1/4"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Good morning, Dr. Rajapaksa! 👨‍🏫</h1>
          <p className="text-purple-100 text-sm mb-6">3 courses active • 147 students enrolled • 2 assignments to grade</p>
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
               📚 3 Courses
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
               👥 147 Students
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
               📊 76% Avg Engagement
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active Students</p>
          <h3 className="text-3xl font-light text-purple-600 mb-2">147</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> 12 joined this week
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Participation Rate</p>
          <h3 className="text-3xl font-light text-blue-500 mb-2">76%</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> +4% vs last week
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Pending Grades</p>
          <h3 className="text-3xl font-light text-red-500 mb-2">2</h3>
          <p className="text-red-400 text-xs font-medium">
            Assignments to review
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Avg Completion</p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">64%</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> +6%
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-slate-800">My Courses</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                + New Course
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Course</th>
                    <th className="pb-3">Students</th>
                    <th className="pb-3">Completion</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Data Structures & Algorithms', students: '52', completion: 72 },
                    { name: 'Database Management Systems', students: '48', completion: 58 },
                    { name: 'Software Engineering', students: '47', completion: 45 },
                  ].map((course, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 pl-2 text-sm font-medium text-slate-700">{course.name}</td>
                      <td className="py-4 text-sm text-slate-600 font-medium">{course.students}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 flex-1 max-w-[100px]">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${course.completion}%` }}></div>
                          </div>
                          <span className="text-xs font-medium text-slate-400 w-8">{course.completion}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-200 transition">
                          Analytics
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
             <div className="space-y-2">
                <button className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                  + Create Course
                </button>
                <button className="w-full bg-slate-100 text-slate-700 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-200 transition">
                  + Add Activity
                </button>
                <button className="w-full bg-slate-100 text-slate-700 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-200 transition flex items-center justify-center gap-2">
                  <span>📝</span> Grade Assignments
                </button>
                <button className="w-full bg-slate-100 text-slate-700 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-200 transition flex items-center justify-center gap-2">
                  <span>🎮</span> Game Settings
                </button>
             </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
