"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CourseCard, CourseData } from '@/components/ui/CourseCard';

export default function BrowseCourses() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extended mocked courses based on screenshot layout (9 of 18 courses)
  const courses = [
     {
        id: 'c1', title: 'Data Structures & Algorithms', code: 'CS301 · Computing', 
        lecturer: 'Dr. Rajapaksa', lessons: 24, students: 52, rating: 4.8, 
        tag: 'Core', tagColor: 'bg-blue-50 text-blue-600', icon: '💻', isEnrolled: false
     },
     {
        id: 'c2', title: 'Database Management Systems', code: 'CS302 · Computing', 
        lecturer: 'Dr. Rajapaksa', lessons: 18, students: 48, rating: 4.6, 
        tag: 'Core', tagColor: 'bg-blue-50 text-blue-600', icon: '🗄️', isEnrolled: true
     },
     {
        id: 'c3', title: 'Web Technologies', code: 'CS303 · Computing', 
        lecturer: 'Dr. Silva', lessons: 20, students: 45, rating: 4.9, 
        tag: 'Core', tagColor: 'bg-blue-50 text-blue-600', icon: '🌐', isEnrolled: true
     },
     {
        id: 'c4', title: 'Machine Learning Basics', code: 'CS401 · Computing', 
        lecturer: 'Dr. Kumar', lessons: 18, students: 32, rating: 4.7, 
        tag: 'Elective', tagColor: 'bg-orange-50 text-orange-600', icon: '🤖', isEnrolled: false,
        flag: '✨ New', flagColor: 'bg-blue-600 text-white'
     },
     {
        id: 'c5', title: 'Software Engineering', code: 'CS304 · Computing', 
        lecturer: 'Dr. Rajapaksa', lessons: 22, students: 47, rating: 4.5, 
        tag: 'Core', tagColor: 'bg-blue-50 text-blue-600', icon: '⚙️', isEnrolled: true
     },
     {
        id: 'c6', title: 'Business Analytics', code: 'BA201 · Business', 
        lecturer: 'Dr. Peris', lessons: 16, students: 38, rating: 4.4, 
        tag: 'Elective', tagColor: 'bg-orange-50 text-orange-600', icon: '📊', isEnrolled: false
     }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold text-slate-800">Browse Courses</h2>
      </div>

      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4">
        <span className="font-semibold text-slate-800 text-sm">Filter:</span>
        {['All (18)', 'Computing', 'Business', 'Core Modules', 'Electives', 'New', 'Available'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              (activeFilter === f || (activeFilter === 'All' && f === 'All (18)'))
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center">
        <Search className="w-5 h-5 text-slate-400 ml-3 mr-3 shrink-0" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by course name, code, or lecturer..." 
          className="flex-1 py-1 px-2 focus:outline-none text-slate-700 text-sm font-medium placeholder:text-slate-400" 
        />
        <button className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-sm">
          Search
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 bg-white border border-slate-200 rounded-2xl flex flex-col shrink-0 overflow-hidden shadow-sm">
           <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Filters</h3>
           </div>
           
           <div className="p-5 space-y-6">
              {/* Department */}
              <div>
                 <h4 className="text-xs font-bold text-slate-800 mb-3">Department</h4>
                 <div className="space-y-2.5">
                    {['All Departments', 'Computing', 'Business', 'Engineering'].map((opt, i) => (
                       <label key={i} className="flex items-center gap-3 cursor-pointer group">
                          <input type="radio" name="dept" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" defaultChecked={i === 0} />
                          <span className={`text-sm font-medium ${i === 0 ? 'text-blue-700' : 'text-slate-500 group-hover:text-slate-700'}`}>{opt}</span>
                       </label>
                    ))}
                 </div>
              </div>

              {/* Module Type */}
              <div>
                 <h4 className="text-xs font-bold text-slate-800 mb-3">Module Type</h4>
                 <div className="space-y-2.5">
                    {['All Types', 'Core Module', 'Elective', 'Workshop'].map((opt, i) => (
                       <label key={i} className="flex items-center gap-3 cursor-pointer group">
                          <input type="radio" name="type" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" defaultChecked={i === 0} />
                          <span className={`text-sm font-medium ${i === 0 ? 'text-blue-700' : 'text-slate-500 group-hover:text-slate-700'}`}>{opt}</span>
                       </label>
                    ))}
                 </div>
              </div>

              {/* Semester Select */}
              <div>
                 <h4 className="text-xs font-bold text-slate-800 mb-2">Semester</h4>
                 <select className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 appearance-none">
                    <option>2024/2025 Sem 2 ▾</option>
                 </select>
              </div>

              {/* Lecturer Select */}
              <div>
                 <h4 className="text-xs font-bold text-slate-800 mb-2">Lecturer</h4>
                 <select className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 appearance-none">
                    <option>All Lecturers ▾</option>
                 </select>
              </div>

              <div className="pt-2">
                 <button className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl text-sm border border-slate-200 hover:bg-slate-100 transition">
                    Clear Filters
                 </button>
              </div>
           </div>
        </div>

        {/* Course Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 text-sm font-medium text-slate-500 border-b border-transparent">
            <span>Showing 9 of 18 courses</span>
            <div className="flex items-center gap-2">
               <span>Sort:</span>
               <select className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer">
                  <option>Most Popular ▾</option>
               </select>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {courses.map(course => (
               <div key={course.id} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition group relative flex flex-col">
                  
                  {/* Status Flags */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
                     {course.isEnrolled && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold tracking-wide">Enrolled</span>}
                     {!course.isEnrolled && <div></div>}
                     {course.flag && <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${course.flagColor}`}>{course.flag}</span>}
                  </div>

                  <div className="h-40 bg-slate-50 border-b border-slate-100 flex items-center justify-center text-6xl group-hover:bg-blue-50/30 transition-colors">
                     {course.icon}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                     <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1">{course.title}</h3>
                     <p className="text-xs font-medium text-slate-400 mb-4">{course.code}</p>

                     <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2">
                        <span className="text-[10px]">👨‍🏫</span> {course.lecturer}
                     </div>
                     <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                        <span className="flex items-center gap-1.5"><span className="text-[10px]">📖</span> {course.lessons} lessons</span>
                        <span className="flex items-center gap-1.5"><span className="text-[10px]">👥</span> {course.students} students</span>
                     </div>

                     <div className="flex items-center justify-between mb-5">
                        <span className="text-sm font-bold text-yellow-500">⭐ {course.rating.toFixed(1)}</span>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${course.tagColor}`}>{course.tag}</span>
                     </div>

                     <div className="mt-auto">
                        <button className={`w-full py-2.5 rounded-xl text-sm font-bold transition shadow-sm ${course.isEnrolled ? 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50' : 'bg-blue-600 border border-transparent text-white hover:bg-blue-700'}`}>
                           {course.isEnrolled ? 'Continue Learning →' : 'Enroll Now →'}
                        </button>
                     </div>
                  </div>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
