"use client";

import React, { useState } from 'react';

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('Course Performance');

  const navItems = [
    { title: 'Engagement Report', desc: 'Student activity & participation', icon: '📊' },
    { title: 'Gamification Report', desc: 'Points, badges & leaderboard', icon: '🏆' },
    { title: 'Course Performance', desc: 'Completion rates & quiz scores', icon: '📚' },
    { title: 'User Activity Report', desc: 'Login frequency & time spent', icon: '👥' },
  ];

  const renderCoursePerformance = () => {
    const courses = [
      { course: 'Web Technologies', dept: 'Computing', lecturer: 'Dr. Silva', enrolled: 45, completion: 91, avgQuiz: '88%', status: 'Published', color: 'bg-emerald-500', text: 'text-emerald-600' },
      { course: 'Data Structures', dept: 'Computing', lecturer: 'Dr. Rajapaksa', enrolled: 52, completion: 72, avgQuiz: '78%', status: 'Published', color: 'bg-blue-500', text: 'text-blue-600' },
      { course: 'Business Analytics', dept: 'Business', lecturer: 'Dr. Peris', enrolled: 38, completion: 66, avgQuiz: '74%', status: 'Published', color: 'bg-purple-500', text: 'text-purple-600' },
      { course: 'Database Mgmt.', dept: 'Computing', lecturer: 'Dr. Rajapaksa', enrolled: 48, completion: 58, avgQuiz: '72%', status: 'Published', color: 'bg-orange-500', text: 'text-orange-600' },
      { course: 'Software Eng.', dept: 'Computing', lecturer: 'Dr. Rajapaksa', enrolled: 47, completion: 45, avgQuiz: '68%', status: 'Draft', color: 'bg-orange-500', text: 'text-orange-600' },
      { course: 'Computer Networks', dept: 'Computing', lecturer: 'Dr. Fernando', enrolled: 29, completion: 38, avgQuiz: '65%', status: 'Published', color: 'bg-blue-500', text: 'text-blue-600' },
    ];
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2 mb-1">
                 <span>📚</span> Course Performance Report
              </h2>
              <p className="text-sm text-slate-500 font-medium ml-8">All Departments · Jan 1 – Jan 31, 2025</p>
           </div>
           <div className="flex items-center gap-3">
              <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 focus:outline-none shadow-sm"><option>Jan 2025</option></select>
              <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 focus:outline-none shadow-sm"><option>Last 30 days</option></select>
           </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">Total Courses</p>
             <h3 className="text-2xl font-light text-blue-600 mb-1">12</h3><p className="text-emerald-500 text-[10px] font-bold">6 in dev</p>
           </div>
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">Avg Completion</p>
             <h3 className="text-2xl font-light text-emerald-500 mb-1">68%</h3><p className="text-emerald-500 text-[10px] font-bold">▲ +6% vs last</p>
           </div>
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">Total Enrollments</p>
             <h3 className="text-2xl font-light text-purple-500 mb-1">396</h3><p className="text-emerald-500 text-[10px] font-bold">▲ +42 this month</p>
           </div>
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">Avg Quiz Score</p>
             <h3 className="text-2xl font-light text-orange-500 mb-1">78%</h3><p className="text-emerald-500 text-[10px] font-bold">▲ +3%</p>
           </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden">
           <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2"><span>📊</span> Completion Rate by Course</h3>
           <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.course} className="flex items-center gap-4">
                  <span className="w-1/3 text-xs font-semibold text-slate-600 truncate">{course.course}</span>
                  <div className="flex-1 bg-slate-100 rounded-md h-2.5">
                    <div className={`${course.color} h-2.5 rounded-md`} style={{ width: `${course.completion}%` }}></div>
                  </div>
                  <span className={`text-xs font-bold w-8 text-right ${course.text}`}>{course.completion}%</span>
                </div>
              ))}
           </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto w-full">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Course-by-Course Breakdown</h3>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm whitespace-nowrap">Export CSV</button>
              </div>
           </div>
           <div className="w-full overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                   <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 pl-6 pr-4">Course</th><th className="py-4 px-4">Lecturer</th>
                      <th className="py-4 px-4 text-center">Enrolled</th><th className="py-4 px-4">Completion</th>
                      <th className="py-4 px-4 text-center">Avg Quiz</th><th className="py-4 pr-6 pl-4 text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {courses.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                         <td className="py-4 pl-6 pr-4 text-sm font-bold text-slate-800 whitespace-nowrap">{row.course}</td>
                         <td className="py-4 px-4 text-sm font-medium text-slate-600 whitespace-nowrap">{row.lecturer}</td>
                         <td className="py-4 px-4 text-sm font-medium text-slate-600 text-center">{row.enrolled}</td>
                         <td className="py-4 px-4 min-w-[120px]">
                            <div className="flex items-center gap-2">
                               <div className="w-full bg-slate-100 rounded-full h-1.5"><div className={`${row.color} h-1.5 rounded-full`} style={{ width: `${row.completion}%` }}></div></div>
                               <span className={`text-[11px] font-bold ${row.text} w-6`}>{row.completion}%</span>
                            </div>
                         </td>
                         <td className="py-4 px-4 text-sm font-medium text-slate-600 text-center">{row.avgQuiz}</td>
                         <td className="py-4 pr-6 px-4 text-right"><span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-600">{row.status}</span></td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    );
  };

  const renderEngagementReport = () => {
     return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 min-w-0 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-slate-300 mt-20 mb-4">Engagement Report</h1>
            <p className="text-slate-500 font-medium">UI variant matching the Figma mockup</p>
        </div>
     );
  };

  const renderGamificationReport = () => {
     return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 min-w-0">
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2 mb-1"><span>🏆</span> Gamification Report</h2>
              <p className="text-sm text-slate-500 font-medium ml-8">Platform-wide · Jan 1 – Jan 31, 2025</p>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium"><option>Jan 2025</option></select>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Total Points Awarded</p>
               <h3 className="text-3xl font-light text-blue-600 mb-1">284,320</h3><p className="text-emerald-500 text-[10px] font-bold">▲ +18,240 this month</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Badges Awarded</p>
               <h3 className="text-3xl font-light text-orange-500 mb-1">1,247</h3><p className="text-emerald-500 text-[10px] font-bold">▲ +88 this week</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Active Leaderboard Players</p>
               <h3 className="text-3xl font-light text-emerald-500 mb-1">312</h3><p className="text-emerald-500 text-[10px] font-bold">76% of enrolled students</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Avg XP Per Student</p>
               <h3 className="text-3xl font-light text-purple-600 mb-1">736</h3><p className="text-emerald-500 text-[10px] font-bold">▲ +124 vs last month</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white border rounded-xl p-5"><h4 className="font-bold mb-4">⭐ Points Distribution by Activity</h4>
                <div className="space-y-4">
                   {[{n:'Assignments',p:42,c:'bg-blue-500',t:'text-blue-600'},{n:'Quizzes',p:31,c:'bg-purple-500',t:'text-purple-600'},{n:'Lessons',p:18,c:'bg-emerald-500',t:'text-emerald-600'},{n:'Forum',p:9,c:'bg-orange-500',t:'text-orange-600'}].map(item => (
                      <div key={item.n} className="flex justify-between items-center text-sm">
                         <span className="w-24 text-slate-600">{item.n}</span>
                         <div className="flex-1 mx-4 bg-slate-100 h-2 rounded-full"><div className={`h-2 rounded-full ${item.c}`} style={{width:`${item.p}%`}}></div></div>
                         <span className={`w-8 font-bold ${item.t}`}>{item.p}%</span>
                      </div>
                   ))}
                </div>
             </div>
             <div className="bg-white border rounded-xl p-5"><h4 className="font-bold mb-4">🏅 Badges Awarded This Month</h4>
                <div className="space-y-3">
                   {[{n:'Hot Streak 🔥', v:'234 awarded', c:'text-red-500'},{n:'Quiz Champion 🏆', v:'189 awarded', c:'text-orange-500'},{n:'Bookworm 📚', v:'156 awarded', c:'text-emerald-500'},{n:'On Target 🎯', v:'98 awarded', c:'text-teal-500'},{n:'Collaborator 💬', v:'72 awarded', c:'text-purple-500'}].map((b,i) => (
                      <div key={i} className="flex justify-between text-sm">
                         <span className="text-slate-600">{b.n}</span><span className={`font-bold ${b.c}`}>{b.v}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
     );
  };

  const renderUserActivityReport = () => {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 min-w-0">
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2 mb-1"><span>👥</span> User Activity Report</h2>
              <p className="text-sm text-slate-500 font-medium ml-8">Platform-wide · Jan 1 – Jan 31, 2025</p>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium"><option>Jan 2025</option></select>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Total Users</p>
               <h3 className="text-3xl font-light text-blue-600 mb-1">416</h3><p className="text-emerald-500 text-[10px] font-bold">▲ +22 this month</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Active Users</p>
               <h3 className="text-3xl font-light text-emerald-500 mb-1">327</h3><p className="text-emerald-500 text-[10px] font-bold">▲ 78.6% of total</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Total Logins</p>
               <h3 className="text-3xl font-light text-purple-600 mb-1">3,847</h3><p className="text-emerald-500 text-[10px] font-bold">▲ +312 this week</p>
             </div>
          </div>
          
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
             <div className="bg-blue-600 flex justify-between items-center px-5 py-3">
                <h4 className="text-white font-bold text-sm">Individual User Activity</h4>
                <div className="flex gap-2">
                   <input type="text" placeholder="Search users" className="bg-blue-800 text-white placeholder:text-blue-300 text-xs px-3 py-1.5 rounded-lg border-none outline-none" />
                   <button className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Filter ▾</button>
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-200">
                     <tr><th className="py-3 px-5">User</th><th className="py-3 px-3">Role</th><th className="py-3 px-3">Logins</th><th className="py-3 px-3">Avg Session</th><th className="py-3 px-3">Last Login</th><th className="py-3 px-3">Time Spent</th><th className="py-3 px-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     <tr className="hover:bg-slate-50">
                        <td className="py-3 px-5"><div className="font-bold text-slate-800">Nimal Silva</div><div className="text-[10px] text-slate-500">n.silva@nsbm.lk</div></td>
                        <td className="py-3 px-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">Student</span></td>
                        <td className="py-3 px-3 font-bold text-slate-700">28x</td><td className="py-3 px-3 text-slate-600">32 min</td><td className="py-3 px-3 text-emerald-600 font-medium">Today, 9:14 AM</td><td className="py-3 px-3 text-slate-600">14h 22m</td>
                        <td className="py-3 px-3"><span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Active</span></td>
                     </tr>
                     <tr className="hover:bg-slate-50">
                        <td className="py-3 px-5"><div className="font-bold text-slate-800">Kavitha Perera</div><div className="text-[10px] text-slate-500">k.perera@nsbm.lk</div></td>
                        <td className="py-3 px-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">Student</span></td>
                        <td className="py-3 px-3 font-bold text-slate-700">22x</td><td className="py-3 px-3 text-slate-600">24 min</td><td className="py-3 px-3 text-emerald-600 font-medium">Today, 11:02 AM</td><td className="py-3 px-3 text-slate-600">11h 04m</td>
                        <td className="py-3 px-3"><span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Active</span></td>
                     </tr>
                     <tr className="hover:bg-slate-50">
                        <td className="py-3 px-5"><div className="font-bold text-slate-800">Dr. Rajapaksa</div><div className="text-[10px] text-slate-500">r.raj@nsbm.lk</div></td>
                        <td className="py-3 px-3"><span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">Lecturer</span></td>
                        <td className="py-3 px-3 font-bold text-slate-700">24x</td><td className="py-3 px-3 text-slate-600">42 min</td><td className="py-3 px-3 text-emerald-600 font-medium">Today, 8:30 AM</td><td className="py-3 px-3 text-slate-600">16h 48m</td>
                        <td className="py-3 px-3"><span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Active</span></td>
                     </tr>
                  </tbody>
               </table>
             </div>
          </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 mt-2 flex flex-col h-full overflow-hidden">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2 flex-shrink-0">Reports</h2>

      <div className="flex flex-col lg:flex-row gap-6 items-start h-full pb-8">
         {/* Left Sidebar Menu */}
         <div className="w-full lg:w-72 flex-shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden sticky top-4">
            <div className="p-5 border-b border-slate-100">
               <h3 className="font-semibold text-slate-800">Report Types</h3>
            </div>
            <div className="flex flex-col">
               {navItems.map((item) => (
                  <button 
                     key={item.title}
                     onClick={() => setActiveTab(item.title)}
                     className={`text-left flex items-start gap-4 p-5 transition-colors border-b border-slate-100 last:border-0 ${
                        activeTab === item.title ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                     }`}
                  >
                     <span className={`text-2xl ${activeTab === item.title ? 'scale-110 transition-transform' : ''}`}>{item.icon}</span>
                     <div>
                        <h4 className={`font-semibold text-sm ${activeTab === item.title ? 'text-blue-700' : 'text-slate-700'}`}>{item.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">{item.desc}</p>
                     </div>
                  </button>
               ))}
            </div>
         </div>

         {/* Right Main Content */}
         <div className="flex-1 w-full lg:w-auto">
            {activeTab === 'Course Performance' && renderCoursePerformance()}
            {activeTab === 'Gamification Report' && renderGamificationReport()}
            {activeTab === 'User Activity Report' && renderUserActivityReport()}
            {activeTab === 'Engagement Report' && renderEngagementReport()}
         </div>
      </div>
    </div>
  );
}
