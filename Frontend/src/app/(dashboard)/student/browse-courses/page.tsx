"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CourseCard, CourseData } from '@/components/ui/CourseCard';

export default function BrowseCourses() {
  const [activeFilter, setActiveFilter] = useState('All');

  const courses: CourseData[] = [
    {
      id: '1',
      title: 'Data Structures & Algorithms',
      code: 'CS301',
      department: 'Computing',
      lecturer: 'Dr. Rajapaksa',
      lessons: 24,
      students: 52,
      rating: 4.8,
      tags: ['Core'],
      emoji: '💻',
      colorType: 'blue',
      status: 'enrolled',
    },
    {
      id: '2',
      title: 'Database Management Systems',
      code: 'CS302',
      department: 'Computing',
      lecturer: 'Dr. Rajapaksa',
      lessons: 18,
      students: 48,
      rating: 4.6,
      tags: ['Core'],
      emoji: '🗄️',
      colorType: 'emerald',
      status: 'enrolled',
    },
    {
      id: '3',
      title: 'Web Technologies',
      code: 'CS303',
      department: 'Computing',
      lecturer: 'Dr. Silva',
      lessons: 20,
      students: 45,
      rating: 4.9,
      tags: ['Core'],
      emoji: '🌐',
      colorType: 'purple',
      status: 'enrolled',
    },
    {
      id: '4',
      title: 'Machine Learning Basics',
      code: 'CS401',
      department: 'Computing',
      lecturer: 'Dr. Kumar',
      lessons: 18,
      students: 32,
      rating: 4.7,
      tags: ['Elective', 'New'],
      emoji: '🤖',
      colorType: 'orange',
      status: 'available',
    },
    {
      id: '5',
      title: 'Software Engineering',
      code: 'CS304',
      department: 'Computing',
      lecturer: 'Dr. Rajapaksa',
      lessons: 22,
      students: 47,
      rating: 4.5,
      tags: ['Core'],
      emoji: '⚙️',
      colorType: 'blue',
      status: 'enrolled',
    },
    {
      id: '6',
      title: 'Business Analytics',
      code: 'BA201',
      department: 'Business',
      lecturer: 'Dr. Peris',
      lessons: 16,
      students: 38,
      rating: 4.4,
      tags: ['Elective'],
      emoji: '📊',
      colorType: 'emerald',
      status: 'available',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4 mb-6">
        <span className="font-semibold text-slate-800 mr-2">Filter:</span>
        {['All (18)', 'Computing', 'Business', 'Core Modules', 'Electives', 'New', 'Available'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === f 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
        <input 
          type="text" 
          placeholder="Search by course name, code, or lecturer..." 
          className="flex-1 py-2 px-2 focus:outline-none text-slate-700" 
        />
        <button className="bg-blue-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          Search
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-5">Filters</h3>
            
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">Department</h4>
                <div className="space-y-2.5">
                  {['All Departments', 'Computing', 'Business', 'Engineering'].map((dept, i) => (
                    <label key={dept} className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${i === 0 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>
                        {i === 0 && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                      </div>
                      <span className={`text-sm ${i === 0 ? 'text-blue-600 font-medium' : 'text-slate-600'}`}>{dept}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider mt-6">Module Type</h4>
                <div className="space-y-2.5">
                  {['All Types', 'Core Module', 'Elective', 'Workshop'].map((type, i) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${i === 0 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>
                        {i === 0 && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                      </div>
                      <span className={`text-sm ${i === 0 ? 'text-blue-600 font-medium' : 'text-slate-600'}`}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider mt-6">Semester</h4>
                <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>2024/2025 Sem 2</option>
                  <option>2024/2025 Sem 1</option>
                </select>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider mt-6">Lecturer</h4>
                <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Lecturers</option>
                  <option>Dr. Rajapaksa</option>
                </select>
              </div>

              <button className="w-full py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition mt-6 text-sm">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 text-sm text-slate-500">
            <span>Showing 9 of 18 courses</span>
            <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none text-slate-700 font-medium">
              <option>Sort: Most Popular</option>
              <option>Sort: Highest Rated</option>
              <option>Sort: Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
