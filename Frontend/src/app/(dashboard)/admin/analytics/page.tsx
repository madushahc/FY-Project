"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminAnalytics() {
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

  const chartBars = data?.engagement?.dailyActiveUsers?.map((d: any, idx: number) => {
     const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500'];
     return { label: d.d || '', color: colors[idx % colors.length], height: `${d.v}%` };
  }) || [];

  const students = data?.userActivity?.users?.map((u: any, idx: number) => ({
     id: idx,
     name: u.name,
     completion: `${u.logins * 2}%`, // mock derived stat based on logins
     avg: `${Math.min(100, u.logins * 3)}%`,
     pts: u.logins * 100,
     active: u.lastLogin,
     status: u.status
  })) || [];

  if (loading) {
     return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
         <h2 className="text-2xl font-semibold text-slate-800">Platform Analytics</h2>
         
         <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 focus:outline-none w-max shadow-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This Year</option>
         </select>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Activities</p>
          <h3 className="text-3xl font-light text-blue-600 mb-2">{data?.userActivity?.metrics?.totalLogins || 0}</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ +342 this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Badges Awarded</p>
          <h3 className="text-3xl font-light text-orange-400 mb-2">{data?.gamification?.metrics?.badgesAwarded || 0}</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ +88 this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Points Distributed</p>
          <h3 className="text-3xl font-light text-purple-500 mb-2">{data?.gamification?.metrics?.totalPoints || 0}</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ 18k this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Avg Engagement</p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">{data?.engagement?.metrics?.completionRate || 0}%</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ +5%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Chart Section */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-start mb-8">
               <h3 className="font-semibold text-slate-800">Engagement vs Completion Rate</h3>
               <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-md">Last 30 days</span>
            </div>
            
            {/* Simple Bar Chart Implementation */}
            <div className="flex-1 flex items-end justify-between gap-1 sm:gap-4 border-b border-slate-100 pb-2 px-2 min-h-[200px]">
               {chartBars.map((bar, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 gap-3">
                     <div className={`w-full max-w-[40px] rounded-t-lg transition hover:brightness-95 cursor-pointer ${bar.color}`} style={{ height: bar.height, minHeight: '10%' }}></div>
                     <span className="text-[10px] font-medium text-slate-400">{bar.label}</span>
                  </div>
               ))}
            </div>
            
            <div className="flex items-center gap-6 mt-6 px-2 text-xs font-medium text-slate-500">
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Engagement</div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Completion</div>
            </div>
         </div>

         {/* Top Courses Section */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-8">Top Courses by Completion</h3>
            <div className="space-y-6">
               {data?.coursePerformance?.courses?.slice(0, 4).map((course: any) => (
                 <div key={course.course}>
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-medium text-slate-700">{course.course}</span>
                     <span className={`text-xs font-bold ${course.text}`}>{course.completion}%</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-2">
                     <div className={`${course.color} h-2 rounded-full`} style={{ width: `${course.completion}%` }}></div>
                   </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Student Performance Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
         <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Student Performance Overview</h3>
            <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition whitespace-nowrap hidden sm:block">
               Export CSV ↓
            </button>
         </div>
         <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
               <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 pl-6 pr-4">Student</th>
                  <th className="py-4 px-4 w-28">Completion</th>
                  <th className="py-4 px-4 w-28">Avg Quiz</th>
                  <th className="py-4 px-4 w-28">Points</th>
                  <th className="py-4 px-4 w-40">Last Active</th>
                  <th className="py-4 px-6 text-right">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {students.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                     <td className="py-4 pl-6 pr-4">
                        <p className="text-sm font-medium text-slate-800">{student.name}</p>
                     </td>
                     <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                        {student.completion}
                     </td>
                     <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                        {student.avg}
                     </td>
                     <td className="py-4 px-4 text-sm font-medium text-blue-600">
                        {student.pts}
                     </td>
                     <td className="py-4 px-4 text-sm font-medium text-slate-500">
                        {student.active}
                     </td>
                     <td className="py-4 px-6 text-right">
                        <span className={`px-4 py-1.5 text-xs font-bold rounded-full inline-block ${
                           student.status === 'Active' ? 'bg-emerald-100/50 text-emerald-600' : 'bg-red-50 text-red-500'
                        }`}>
                           {student.status}
                        </span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
