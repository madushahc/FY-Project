"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';
import { resolveMediaUrl } from '@/lib/mediaUrl';

export default function BrowseCourses() {
  const { availableCourses, myEnrollments, fetchAvailableCourses, fetchMyEnrollments, enrollInCourse, loading } = useCourseStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  
  // Filter states
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [selectedLecturer, setSelectedLecturer] = useState('All Lecturers');
  const [sortBy, setSortBy] = useState('Most Popular');
  
  const router = useRouter();

  useEffect(() => {
    fetchAvailableCourses();
    fetchMyEnrollments();
  }, []);

  // Dynamically extract filter options from real backend courses data
  const departmentOptions = useMemo<string[]>(() => {
    const depts = Array.from(new Set(availableCourses.map((c) => c.department).filter((x): x is string => Boolean(x))));
    return ['All Departments', ...depts];
  }, [availableCourses]);

  const categoryOptions = useMemo<string[]>(() => {
    const cats = Array.from(new Set(availableCourses.map((c) => c.category).filter((x): x is string => Boolean(x))));
    return ['All Types', ...cats];
  }, [availableCourses]);

  const semesterOptions = useMemo<string[]>(() => {
    const sems = Array.from(new Set(availableCourses.map((c) => c.academicYear).filter((x): x is string => Boolean(x))));
    return ['All Semesters', ...sems];
  }, [availableCourses]);

  const lecturerOptions = useMemo<string[]>(() => {
    const lecs = Array.from(new Set(availableCourses.map((c) => c.instructor?.name).filter((x): x is string => Boolean(x))));
    return ['All Lecturers', ...lecs];
  }, [availableCourses]);

  // Top Filter Bar buttons based on real data
  const topFilterButtons = useMemo<string[]>(() => {
    const base: string[] = [`All (${availableCourses.length})`];
    categoryOptions.slice(1).forEach((cat) => {
      if (cat) base.push(cat);
    });
    departmentOptions.slice(1).forEach((dept) => {
      if (dept && !base.includes(dept)) base.push(dept);
    });
    return base;
  }, [availableCourses, categoryOptions, departmentOptions]);

  const isEnrolled = (courseId: string) =>
    myEnrollments.some((e) => e && e.course && ((e.course as any)._id || e.course) === courseId);

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

  // Filter & Sort Courses dynamically
  const filteredCourses = useMemo(() => {
    let result = availableCourses.filter((c) => {
      // 1. Search Query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const titleMatch = c.title?.toLowerCase().includes(q);
        const codeMatch = c.code?.toLowerCase().includes(q);
        const descMatch = c.description?.toLowerCase().includes(q);
        const instructorMatch = c.instructor?.name?.toLowerCase().includes(q);
        if (!titleMatch && !codeMatch && !descMatch && !instructorMatch) return false;
      }

      // 2. Department filter
      if (selectedDept !== 'All Departments') {
        if (!c.department || c.department.toLowerCase() !== selectedDept.toLowerCase()) {
          return false;
        }
      }

      // 3. Module Type / Category filter
      if (selectedType !== 'All Types') {
        if (!c.category || c.category.toLowerCase() !== selectedType.toLowerCase()) {
          return false;
        }
      }

      // 4. Semester / Academic Year filter
      if (selectedSemester !== 'All Semesters') {
        if (!c.academicYear || c.academicYear !== selectedSemester) {
          return false;
        }
      }

      // 5. Lecturer filter
      if (selectedLecturer !== 'All Lecturers') {
        const instName = c.instructor?.name || '';
        const instId = typeof c.instructor === 'object' ? (c.instructor as any)?._id || '' : String(c.instructor || '');
        if (instName !== selectedLecturer && instId !== selectedLecturer) {
          return false;
        }
      }

      // 6. Top Filter Bar quick filter
      if (activeFilter && !activeFilter.startsWith('All')) {
        const matchDept = c.department?.toLowerCase() === activeFilter.toLowerCase();
        const matchCat = c.category?.toLowerCase() === activeFilter.toLowerCase();
        if (!matchDept && !matchCat) return false;
      }

      return true;
    });

    // Apply Sorting
    return result.sort((a, b) => {
      if (sortBy === 'Most Popular') {
        return (b.enrollmentCount || 0) - (a.enrollmentCount || 0);
      }
      if (sortBy === 'Newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === 'Alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [availableCourses, searchQuery, selectedDept, selectedType, selectedSemester, selectedLecturer, activeFilter, sortBy]);

  const clearAllFilters = () => {
    setSelectedDept('All Departments');
    setSelectedType('All Types');
    setSelectedSemester('All Semesters');
    setSelectedLecturer('All Lecturers');
    setActiveFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Browse Courses</h2>
      </div>

      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
        <span className="font-semibold text-slate-800 text-sm mr-1">Filter:</span>
        {topFilterButtons.map((f) => {
          const isActive =
            (f.startsWith('All') && (activeFilter === 'All' || activeFilter.startsWith('All'))) ||
            activeFilter === f;

          return (
            <button
              key={f}
              onClick={() => {
                if (f.startsWith('All')) {
                  setActiveFilter('All');
                  setSelectedDept('All Departments');
                  setSelectedType('All Types');
                } else {
                  setActiveFilter(f);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f}
            </button>
          );
        })}
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
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600 mr-3 font-semibold"
          >
            Clear
          </button>
        )}
        <button className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-sm">
          Search
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 bg-white border border-slate-200 rounded-2xl flex flex-col shrink-0 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Filters</h3>
            {(selectedDept !== 'All Departments' || selectedType !== 'All Types' || selectedSemester !== 'All Semesters' || selectedLecturer !== 'All Lecturers' || searchQuery || activeFilter !== 'All') && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Active</span>
            )}
          </div>

          <div className="p-5 space-y-6">
            {/* Department */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-3">Department</h4>
              <div className="space-y-2.5">
                {departmentOptions.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="dept"
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      checked={selectedDept === opt}
                      onChange={() => {
                        setSelectedDept(opt);
                        if (opt === 'All Departments') {
                          setActiveFilter('All');
                        } else {
                          setActiveFilter(opt);
                        }
                      }}
                    />
                    <span className={`text-sm font-medium ${selectedDept === opt ? 'text-blue-700 font-semibold' : 'text-slate-500 group-hover:text-slate-700'}`}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Module Type / Category */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-3">Module Type</h4>
              <div className="space-y-2.5">
                {categoryOptions.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="type"
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      checked={selectedType === opt}
                      onChange={() => setSelectedType(opt)}
                    />
                    <span className={`text-sm font-medium ${selectedType === opt ? 'text-blue-700 font-semibold' : 'text-slate-500 group-hover:text-slate-700'}`}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Academic Year / Semester Select */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Semester / Academic Year</h4>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              >
                {semesterOptions.map((sem, i) => (
                  <option key={i} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            {/* Lecturer Select */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Lecturer</h4>
              <select
                value={selectedLecturer}
                onChange={(e) => setSelectedLecturer(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              >
                {lecturerOptions.map((lec, i) => (
                  <option key={i} value={lec}>{lec}</option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={clearAllFilters}
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
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="Most Popular">Most Popular</option>
                <option value="Newest">Newest</option>
                <option value="Alphabetical">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full">
                <Loading />
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-500">
                <p className="text-base font-semibold text-slate-700 mb-1">No courses found</p>
                <p className="text-xs text-slate-400 mb-4">Try adjusting your filters or search terms.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredCourses.map((course) => {
                const enrolled = isEnrolled(course._id);
                const isSubmitting = enrollingId === course._id;
                const allLessonsCount = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;
                const quizLessonsCount = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.filter((l: any) => l.type === 'quiz').length || 0), 0) || 0;
                const checkpointQuestionsCount = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.reduce((qSum: number, l: any) => qSum + (l.questionMarkers?.length || 0), 0) || 0), 0) || 0;
                const totalQuizzesCount = quizLessonsCount + checkpointQuestionsCount;
                const categoryBadge = course.category || course.department || 'General';

                return (
                  <div key={course._id} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition group relative flex flex-col">

                    {/* Status Flags */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
                      {enrolled && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold tracking-wide shadow-sm">Enrolled</span>}
                    </div>

                    <div className="h-44 bg-slate-50 border-b border-slate-100 flex items-center justify-center text-6xl group-hover:bg-blue-50/30 transition-colors overflow-hidden">
                      {course.thumbnailUrl ? (
                        <img
                          src={resolveMediaUrl(course.thumbnailUrl)}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        "📚"
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 text-base line-clamp-1">{course.title}</h3>
                        {course.code && <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{course.code}</span>}
                      </div>
                      <p className="text-xs font-medium text-slate-400 mb-4 line-clamp-2">{course.description || 'No description provided'}</p>

                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
                        <span className="text-[10px]">👨‍🏫</span> {course.instructor?.name || 'Instructor'}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mb-4">
                        <span className="flex items-center gap-1"><span className="text-[10px]">📖</span> {allLessonsCount} lessons</span>
                        <span className="flex items-center gap-1"><span className="text-[10px]">📝</span> {totalQuizzesCount} quizzes</span>
                        <span className="flex items-center gap-1"><span className="text-[10px]">🧩</span> {course.modules?.length || 0} modules</span>
                      </div>

                      <div className="flex items-center justify-between mb-5">
                        <span className="text-xs font-bold text-slate-500">
                          {course.enrollmentCount ? `👥 ${course.enrollmentCount} enrolled` : '⭐ 4.8'}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600">
                          {categoryBadge}
                        </span>
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
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
