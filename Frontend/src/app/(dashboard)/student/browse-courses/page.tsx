"use client";

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function BrowseCourses() {
  const { availableCourses, myEnrollments, fetchAvailableCourses, fetchMyEnrollments, enrollInCourse, loading } = useCourseStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const router = useRouter();

  useEffect(() => {
    fetchAvailableCourses();
    fetchMyEnrollments();
  }, [fetchAvailableCourses, fetchMyEnrollments]);

  // Extended mocked courses based on screenshot layout (9 of 18 courses)
  const isEnrolled = (courseId: string) => myEnrollments.some(e => (e.course._id || e.course) === courseId);

  const handleEnroll = async (courseId: string, currentlyEnrolled: boolean) => {
    if (currentlyEnrolled) {
      router.push(`/student/courses/${courseId}`);
      return;
    }
    setEnrollingId(courseId);
    try {
      await enrollInCourse(courseId);
      router.push(`/student/courses/${courseId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to enroll');
    }
    setEnrollingId(null);
  };

  const filteredCourses = availableCourses.filter(c => {
    // 1. Search Query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = c.title.toLowerCase().includes(q);
      const codeMatch = c.code?.toLowerCase().includes(q);
      const instructorMatch = c.instructor?.name && c.instructor.name.toLowerCase().includes(q);
      if (!titleMatch && !codeMatch && !instructorMatch) return false;
    }

    // 2. Sidebar Department filter
    if (selectedDept !== 'All Departments') {
      if (!c.department || !c.department.toLowerCase().includes(selectedDept.toLowerCase())) {
        return false;
      }
    }

    // 3. Top Filter Bar filter
    if (activeFilter !== 'All' && activeFilter !== 'All (18)' && activeFilter !== 'All Departments') {
      if (activeFilter === 'Computing' || activeFilter === 'Business' || activeFilter === 'Engineering') {
        if (!c.department || !c.department.toLowerCase().includes(activeFilter.toLowerCase())) return false;
      } else if (activeFilter === 'Core Modules') {
        if (!c.category?.toLowerCase().includes('core') && !(c as any).type?.toLowerCase().includes('core')) return false;
      } else if (activeFilter === 'Electives') {
        if (!c.category?.toLowerCase().includes('elective') && !(c as any).type?.toLowerCase().includes('elective')) return false;
      }
    }

    return true;
  });

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
            onClick={() => {
              setActiveFilter(f);
              if (f === 'All (18)') {
                setSelectedDept('All Departments');
              } else if (f === 'Computing' || f === 'Business' || f === 'Engineering') {
                setSelectedDept(f);
              }
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${(activeFilter === f || (activeFilter === 'All' && f === 'All (18)'))
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
                    <input
                      type="radio"
                      name="dept"
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      checked={selectedDept === opt}
                      onChange={() => {
                        setSelectedDept(opt);
                        if (opt === 'All Departments') {
                          setActiveFilter('All (18)');
                        } else if (['Computing', 'Business', 'Engineering'].includes(opt)) {
                          setActiveFilter(opt);
                        }
                      }}
                    />
                    <span className={`text-sm font-medium ${selectedDept === opt ? 'text-blue-700' : 'text-slate-500 group-hover:text-slate-700'}`}>{opt}</span>
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
              <button
                onClick={() => {
                  setSelectedDept('All Departments');
                  setActiveFilter('All (18)');
                  setSearchQuery('');
                }}
                className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl text-sm border border-slate-200 hover:bg-slate-100 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 text-sm font-medium text-slate-500 border-b border-transparent">
            <span>Showing {filteredCourses.length} courses</span>
            <div className="flex items-center gap-2">
              <span>Sort:</span>
              <select className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer">
                <option>Most Popular ▾</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full">
                <Loading />
              </div>
            ) : filteredCourses.map(course => {
              const enrolled = isEnrolled(course._id);
              const isSubmitting = enrollingId === course._id;
              return (
                <div key={course._id} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition group relative flex flex-col">

                  {/* Status Flags */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
                    {enrolled && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold tracking-wide">Enrolled</span>}
                  </div>

                  <div className="h-40 bg-slate-50 border-b border-slate-100 flex items-center justify-center text-6xl group-hover:bg-blue-50/30 transition-colors">
                    📚
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1">{course.title}</h3>
                    <p className="text-xs font-medium text-slate-400 mb-4 line-clamp-1">{course.description || 'No description'}</p>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2">
                      <span className="text-[10px]">👨‍🏫</span> {course.instructor?.name || 'Unknown Instructor'}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5"><span className="text-[10px]">📖</span> {course.modules?.length || 0} modules</span>
                    </div>

                    <div className="flex items-center justify-between mb-5">
                      <span className="text-sm font-bold text-yellow-500">⭐ 4.5</span>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600`}>Core</span>
                    </div>

                    <div className="mt-auto">
                      <button
                        onClick={() => handleEnroll(course._id, enrolled)}
                        disabled={isSubmitting}
                        className={`w-full py-2.5 rounded-xl text-sm font-bold transition shadow-sm disabled:opacity-50 ${enrolled ? 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50' : 'bg-blue-600 border border-transparent text-white hover:bg-blue-700'}`}>
                        {isSubmitting ? 'Enrolling...' : enrolled ? 'Continue Learning →' : 'Enroll Now →'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
