"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CourseCard, CourseData } from '@/components/ui/CourseCard';
import { useCourseStore } from '@/store/useCourseStore';
import Loading from '@/components/ui/Loading';

export default function MyCourses() {
  const [activeTab, setActiveTab] = useState('All Courses');

  const { myEnrollments, fetchMyEnrollments, loading } = useCourseStore();

  React.useEffect(() => {
    fetchMyEnrollments();
  }, [fetchMyEnrollments]);

  const colors: ('blue' | 'emerald' | 'purple' | 'orange' | 'yellow')[] = ['blue', 'emerald', 'purple', 'orange', 'yellow'];

  const mappedCourses: CourseData[] = myEnrollments.map((e, index) => ({
    id: e.course._id || (e.course as any),
    title: e.course.title || 'Unknown Course',
    code: e.course.code || ('CS' + (300 + index)),
    department: e.course.department || 'Computing',
    lecturer: e.course.instructor?.name || 'Instructor',
    lessons: e.course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0,
    quizzes: 0,
    progress: e.progress || 0,
    emoji: '📚',
    colorType: colors[index % colors.length],
    status: e.progress === 100 ? 'completed' : 'enrolled',
  }));

  const displayCourses = mappedCourses.filter(c => {
    if (activeTab === 'In Progress') return c.status === 'enrolled';
    if (activeTab === 'Completed') return c.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Tabs Menu */}
      <div className="border-b border-slate-200 flex justify-between items-end pb-3">
        <div className="flex gap-8 px-2 translate-y-[13px]">
          {['All Courses', 'In Progress', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
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
          {displayCourses.length} courses
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full">
                <Loading />
             </div>
          ) : displayCourses.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">No courses found.</div>
          ) : (
            displayCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
