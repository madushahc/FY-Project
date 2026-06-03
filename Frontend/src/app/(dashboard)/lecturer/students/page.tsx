"use client";

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '@/lib/api';

export default function LecturerStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchStudents = async () => {
        try {
           const res = await api.get('/courses/lecturer/students');
           
           // group by user to prevent duplicates if a user is in multiple courses
           const userMap = new Map();
           res.data.forEach((enrollment: any) => {
              const u = enrollment.user;
              if (!u) return;
              if (!userMap.has(u._id)) {
                 userMap.set(u._id, {
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    pts: u.points || 0,
                    courses: 1,
                    completion: enrollment.progress || 0,
                    login: 'Active',
                    status: 'Active',
                    initial: u.name?.charAt(0).toUpperCase() || 'U'
                 });
              } else {
                 const existing = userMap.get(u._id);
                 existing.courses += 1;
                 existing.completion = Math.round((existing.completion + (enrollment.progress || 0)) / 2);
                 userMap.set(u._id, existing);
              }
           });
           
           setStudents(Array.from(userMap.values()));
        } catch(err) {
           console.error("Failed to fetch students", err);
        }
        setLoading(false);
     };
     fetchStudents();
  }, []);

  const activeStudents = students.filter(s => s.status === 'Active').length;
  const atRiskStudents = students.filter(s => s.completion < 40).length;
  const avgScore = students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.completion, 0) / students.length) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
         <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
            <span>👥</span> Student Management
         </h2>
         
         <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64 text-slate-700" 
               />
            </div>
            <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 focus:outline-none">
               <option>All Courses</option>
               <option>Data Structures</option>
               <option>Database Systems</option>
            </select>
         </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Students</p>
          <h3 className="text-3xl font-light text-blue-600">{students.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active Today</p>
          <h3 className="text-3xl font-light text-emerald-500">{activeStudents}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">At Risk</p>
          <h3 className="text-3xl font-light text-red-500">{atRiskStudents}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Avg Score</p>
          <h3 className="text-3xl font-light text-purple-500">{avgScore}%</h3>
        </div>
      </div>

      {/* Student Table */}
      {loading ? (
         <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
      ) : students.length === 0 ? (
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center text-slate-500">
            No students are currently enrolled in your courses.
         </div>
      ) : (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
               <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 pl-6 pr-4">Student</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Courses</th>
                  <th className="py-4 px-4">Points</th>
                  <th className="py-4 px-4">Completion</th>
                  <th className="py-4 px-4">Last Login</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 pr-6 pl-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {students.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                     <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                              {student.initial}
                           </div>
                           <div>
                              <p className="text-sm font-medium text-slate-800">{student.name}</p>
                              <p className="text-xs text-blue-500 font-medium">{student.pts} pts</p>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 px-4 text-sm text-slate-400 font-medium">
                        {student.email}
                     </td>
                     <td className="py-4 px-4 text-sm text-slate-600 font-medium">
                        {student.courses} courses
                     </td>
                     <td className="py-4 px-4 text-sm text-blue-600 font-medium">
                        {student.score}
                     </td>
                     <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                           <div className="w-16 bg-slate-100 rounded-full h-1.5 flex-shrink-0">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${student.completion}%` }}></div>
                           </div>
                           <span className="text-xs font-medium text-slate-400">{student.completion}%</span>
                        </div>
                     </td>
                     <td className="py-4 px-4 text-sm text-slate-400 font-medium">
                        {student.login}
                     </td>
                     <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${
                           student.status === 'Active' ? 'bg-emerald-100/50 text-emerald-600' : 'bg-red-50 text-red-500'
                        }`}>
                           {student.status}
                        </span>
                     </td>
                     <td className="py-4 pr-6 pl-4 text-right">
                        <button className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
                           View
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
      )}
    </div>
  );
}
