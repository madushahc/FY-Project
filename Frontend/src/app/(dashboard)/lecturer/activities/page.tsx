"use client";

import React from 'react';

export default function LecturerActivities() {
   const activities = [
      { id: 1, title: 'Sorting Algorithms Quiz', type: 'Quiz', course: 'DSA', points: '+50', due: 'Jan 27', subs: '38/52', status: 'Active', typeColor: 'bg-blue-50 text-blue-600', statusColor: 'bg-emerald-100/50 text-emerald-600' },
      { id: 2, title: 'SE Assignment 2 — UML', type: 'Assignment', course: 'SE', points: '+80', due: 'Jan 27', subs: '22/47', status: 'Due Today', typeColor: 'bg-orange-50 text-orange-600', statusColor: 'bg-orange-100/50 text-orange-600' },
      { id: 3, title: 'DBMS Normalization Report', type: 'Assignment', course: 'DBMS', points: '+100', due: 'Jan 30', subs: '8/48', status: 'Active', typeColor: 'bg-orange-50 text-orange-600', statusColor: 'bg-blue-50 text-blue-600' },
      { id: 4, title: 'Binary Trees Quiz', type: 'Quiz', course: 'DSA', points: '+40', due: 'Feb 3', subs: '0/52', status: 'Upcoming', typeColor: 'bg-blue-50 text-blue-600', statusColor: 'bg-slate-100 text-slate-500' },
      { id: 5, title: 'SE Discussion — Design Patterns', type: 'Quiz', course: 'SE', points: '+5', due: 'Ongoing', subs: '34/47', status: 'Active', typeColor: 'bg-blue-50 text-blue-600', statusColor: 'bg-purple-100/50 text-purple-600' },
   ];

   return (
      <div className="space-y-6 max-w-7xl mx-auto">
         {/* Header Area */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
               <span>📝</span> Activity Management
            </h2>

            <div className="flex items-center gap-3 ">
               <button className="bg-slate-50 cursor-pointer border border-slate-200 text-slate-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition shadow-sm whitespace-nowrap">
                  + New Quiz
               </button>
               <button className="bg-slate-50 cursor-pointer border border-slate-200 text-slate-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition shadow-sm whitespace-nowrap">
                  + Assignment
               </button>
            </div>
         </div>

         {/* Metrics */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active</p>
               <h3 className="text-3xl font-light text-emerald-500 mb-1">3</h3>
               <p className="text-emerald-500 text-xs font-semibold">activities running</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Due Today</p>
               <h3 className="text-3xl font-light text-red-500 mb-1">2</h3>
               <p className="text-emerald-500 text-xs font-semibold text-emerald-600">need grading</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Submissions</p>
               <h3 className="text-3xl font-light text-blue-500 mb-1">72</h3>
               <p className="text-emerald-500 text-xs font-semibold text-emerald-600">this week</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Avg Score</p>
               <h3 className="text-3xl font-light text-purple-500 mb-1">78%</h3>
               <p className="text-emerald-500 text-xs font-semibold">across quizzes</p>
            </div>
         </div>

         {/* Activities Table */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
               <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                     <th className="py-5 pl-6 pr-4">Title</th>
                     <th className="py-5 px-4 text-center">Type</th>
                     <th className="py-5 px-4">Course</th>
                     <th className="py-5 px-4">Points</th>
                     <th className="py-5 px-4">Due</th>
                     <th className="py-5 px-4 text-center">Submissions</th>
                     <th className="py-5 px-4 text-center">Status</th>
                     <th className="py-5 pr-6 pl-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {activities.map(activity => (
                     <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-5 pl-6 pr-4">
                           <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                        </td>
                        <td className="py-5 px-4 text-center">
                           <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${activity.typeColor}`}>
                              {activity.type}
                           </span>
                        </td>
                        <td className="py-5 px-4 text-sm text-slate-500 font-medium">
                           {activity.course}
                        </td>
                        <td className="py-5 px-4 text-sm font-bold text-blue-600">
                           {activity.points}
                        </td>
                        <td className="py-5 px-4 text-sm text-slate-500 font-medium">
                           {activity.due}
                        </td>
                        <td className="py-5 px-4 text-sm text-slate-600 text-center font-medium">
                           {activity.subs}
                        </td>
                        <td className="py-5 px-4 text-center">
                           <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${activity.statusColor}`}>
                              {activity.status}
                           </span>
                        </td>
                        <td className="py-5 pr-6 pl-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                                 Edit
                              </button>
                              <button className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-transparent rounded-lg text-xs font-bold hover:bg-blue-100 transition">
                                 Grade
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
