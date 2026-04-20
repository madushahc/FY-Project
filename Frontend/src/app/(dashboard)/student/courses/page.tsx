"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CourseCard, CourseData } from '@/components/ui/CourseCard';

export default function MyCourses() {
  const [activeTab, setActiveTab] = useState('All Courses');

  // Static mock data based on the screenshot
  const courses: CourseData[] = [
    {
      id: '1',
      title: 'Data Structures & Algorithms',
      code: 'CS301',
      department: 'Computing',
      lecturer: '',
      lessons: 24,
      quizzes: 6,
      progress: 78,
      emoji: '💻',
      colorType: 'blue',
      status: 'enrolled',
    },
    {
      id: '2',
      title: 'Database Management Systems',
      code: 'CS302',
      department: 'Computing',
      lecturer: '',
      lessons: 18,
      quizzes: 4,
      progress: 55,
      emoji: '🗄️',
      colorType: 'emerald',
      status: 'enrolled',
    },
    {
      id: '3',
      title: 'Web Technologies',
      code: 'CS303',
      department: 'Computing',
      lecturer: '',
      lessons: 20,
      quizzes: 5,
      progress: 92,
      emoji: '🌐',
      colorType: 'purple',
      status: 'enrolled',
    },
    {
      id: '4',
      title: 'Software Engineering',
      code: 'CS304',
      department: 'Computing',
      lecturer: '',
      lessons: 22,
      quizzes: 3,
      progress: 34,
      emoji: '⚙️',
      colorType: 'orange',
      status: 'enrolled',
    },
    {
      id: '5',
      title: 'Computer Networks',
      code: 'CS305',
      department: 'Computing',
      lecturer: '',
      lessons: 16,
      quizzes: 4,
      tags: ['New'],
      emoji: '🌐',
      colorType: 'blue',
      status: 'available',
    },
    {
      id: '6',
      title: 'Operating Systems',
      code: 'CS306',
      department: 'Computing',
      lecturer: '',
      lessons: 20,
      quizzes: 5,
      tags: ['New'],
      emoji: '🖥️',
      colorType: 'emerald',
      status: 'available',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs Menu */}
      <div className="border-b border-slate-200 flex justify-between items-end pb-3">
        <div className="flex gap-8 px-2 translate-y-[13px]">
          {['All Courses', 'In Progress', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium text-sm transition-colors relative ${
                activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
        <Link 
          href="/student/browse-courses"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          + Browse Courses
        </Link>
      </div>

      <div className="pt-2">
        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 font-bold text-xs rounded-full mb-6">
          6 courses
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
