"use client";

import React, { useEffect } from 'react';
import { useCourseStore } from '@/store/useCourseStore';

export default function AdminAllCourses() {
  const { availableCourses, fetchAvailableCourses, loading } = useCourseStore();

  useEffect(() => {
    fetchAvailableCourses();
  }, [fetchAvailableCourses]);

  const courses = availableCourses;
  
  const inDevelopment = courses.filter(c => c.status === 'Draft').length;
  const published = courses.filter(c => c.status === 'Published').length;
  const archived = courses.filter(c => c.status === 'Archived').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">All Courses</h2>

      {/* Top Header Row with Metrics and Actions */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-6">
         
          <div className="flex flex-wrap gap-4 flex-1">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Courses</p>
               <h3 className="text-3xl font-light text-blue-600 mb-2">{courses.length}</h3>
               <p className="text-emerald-500 text-xs font-medium">{inDevelopment} in development</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Published</p>
               <h3 className="text-3xl font-light text-emerald-500 mb-2">{published}</h3>
               <p className="text-emerald-500 text-xs font-medium">actively running</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Draft</p>
               <h3 className="text-3xl font-light text-orange-400 mb-2">{inDevelopment}</h3>
               <p className="text-emerald-500 text-xs font-medium">awaiting publish</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Archived</p>
               <h3 className="text-3xl font-light text-slate-600 mb-2">{archived}</h3>
               <p className="text-emerald-500 text-xs font-medium">completed courses</p>
            </div>
         </div>

         <div className="flex items-center gap-3 pt-2">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm whitespace-nowrap">
               + New Course
            </button>
            <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 focus:outline-none">
               <option>All Departments</option>
               <option>Computing</option>
               <option>Business</option>
            </select>
         </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
               <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-5 pl-6 pr-4">Course</th>
                  <th className="py-5 px-4 w-20">Code</th>
                  <th className="py-5 px-4">Lecturer</th>
                  <th className="py-5 px-4">Dept</th>
                  <th className="py-5 px-4 text-center">Students</th>
                  <th className="py-5 px-4 w-40">Completion</th>
                  <th className="py-5 px-4 text-center">Status</th>
                  <th className="py-5 pr-6 pl-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                  <tr>
                     <td colSpan={8} className="py-12 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                     </td>
                  </tr>
               ) : courses.map(course => {
                  const progress = 0; // Backend lacks progress per course for now
                  const studentsCount = course.enrollmentCount || 0;
                  return (
                  <tr key={course._id} className="hover:bg-slate-50 transition-colors">
                     <td className="py-4 pl-6 pr-4">
                        <p className="text-sm font-bold text-slate-800">{course.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{'N/A'}</p>
                     </td>
                     <td className="py-4 px-4 text-sm text-slate-500 font-medium">
                        {'N/A'}
                     </td>
                     <td className="py-4 px-4 text-sm text-slate-600 font-medium">
                        {course.instructor?.name || 'Unknown'}
                     </td>
                     <td className="py-4 px-4 text-sm text-slate-500 font-medium">
                        {'N/A'}
                     </td>
                     <td className="py-4 px-4 text-sm text-slate-600 text-center font-medium">
                        {studentsCount}
                     </td>
                     <td className="py-4 px-4">
                        {progress > 0 ? (
                           <div className="flex items-center gap-3">
                              <div className="w-full bg-slate-100 rounded-full h-1.5 flex-1 max-w-[100px]">
                                 <div className={`bg-blue-500 h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-slate-400 w-8">{progress}%</span>
                           </div>
                        ) : (
                           <div className="w-8 border-b-2 border-slate-200 ml-2"></div>
                        )}
                     </td>
                     <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1.5 text-[10px] font-bold rounded-full ${
                           course.status === 'Published' ? 'bg-emerald-100/50 text-emerald-600' : 
                           course.status === 'Draft' ? 'bg-orange-100/50 text-orange-600' : 
                           'bg-slate-100 text-slate-500'
                        }`}>
                           {course.status || 'Draft'}
                        </span>
                     </td>
                     <td className="py-4 pr-6 pl-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                              Edit
                           </button>
                           {course.status !== 'Published' ? (
                              <button className="px-4 py-1.5 bg-blue-600 border border-transparent rounded-lg text-xs font-bold text-white hover:bg-blue-700 transition">
                                 Publish
                              </button>
                           ) : (
                              <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                                 View
                              </button>
                           )}
                        </div>
                     </td>
                  </tr>
               )})}
            </tbody>
         </table>
      </div>
    </div>
  );
}
