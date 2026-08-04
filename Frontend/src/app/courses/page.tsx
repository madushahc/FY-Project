"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, User, Star, ArrowRight, Award, Flame, Users } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import { useCourseStore } from '@/store/useCourseStore';
import { useUserStore } from '@/store/useUserStore';
import Loading from '@/components/ui/Loading';

// Type definition for courses in this file
interface CourseDisplay {
  id: string;
  title: string;
  code: string;
  department: string;
  description: string;
  instructorName: string;
  modulesCount: number;
  rating: number;
  type: string;
  emoji: string;
  colorClass: string;
}



export default function CoursesPage() {
  const { availableCourses, fetchAvailableCourses, myEnrollments, fetchMyEnrollments, loading } = useCourseStore();
  const { user } = useUserStore();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  useEffect(() => {
    fetchAvailableCourses();
    if (user) {
      fetchMyEnrollments();
    }
  }, [user]);

  // Calculate dynamic stats from availableCourses or fall back to mock numbers
  const getStats = () => {
    const courses = availableCourses && availableCourses.length > 0 ? availableCourses : [];

    const totalCoursesCount = courses.length;
    const totalStudentsCount = courses.reduce((acc, c) => acc + (c.enrollmentCount || 0), 0);

    // Count unique lecturers based on name, email or ID
    const uniqueLecturers = new Set(
      courses
        .map(c => c.instructor?.email || c.instructor?.name || (c.instructor as any)?._id || c.instructor)
        .filter(Boolean)
    );
    const totalLecturersCount = uniqueLecturers.size;

    // Calculate dynamic completion rate from actual logged-in user enrollments
    let completion = 0; // Default baseline rate
    if (user && myEnrollments && myEnrollments.length > 0) {
      const totalProgress = myEnrollments.reduce((acc, e) => acc + (e.progress || 0), 0);
      completion = Math.round(totalProgress / myEnrollments.length);
    }

    return {
      totalCourses: totalCoursesCount > 0 ? `${totalCoursesCount}` : "0",
      totalStudents: totalStudentsCount > 0 ? `${totalStudentsCount}` : "0",
      completionRate: `${completion}%`,
      totalLecturers: totalLecturersCount > 0 ? `${totalLecturersCount}` : "0"
    };
  };

  const stats = getStats();

  // Convert API courses to display format, fallback to Mock if empty
  const getCoursesToDisplay = (): CourseDisplay[] => {


    return availableCourses.map(c => {
      // Pick a color theme class based on department
      let colorClass = "bg-blue-50 text-blue-600 border-blue-100";
      let emoji = "📚";

      const dept = c.department?.toLowerCase() || '';
      if (dept.includes('comput')) {
        colorClass = "bg-purple-50 text-purple-600 border-purple-100";
        emoji = "💻";
      } else if (dept.includes('busin') || dept.includes('mgt') || dept.includes('acc')) {
        colorClass = "bg-emerald-50 text-emerald-600 border-emerald-100";
        emoji = "📊";
      } else if (dept.includes('engin')) {
        colorClass = "bg-orange-50 text-orange-600 border-orange-100";
        emoji = "⚙️";
      }

      return {
        id: c._id,
        title: c.title,
        code: c.code || "CRSE",
        department: c.department || "General",
        description: c.description || "No description provided for this course.",
        instructorName: c.instructor?.name || "Lecturer",
        modulesCount: c.modules?.length || 0,
        rating: 4.5, // Default/Mock rating
        type: c.category || "Core",
        emoji: emoji,
        colorClass: colorClass
      };
    });
  };

  const handleEnrollClick = (courseId: string) => {
    if (user) {
      // If user is lecturer or admin, they shouldn't enroll, but they can go to their dashboard
      const role = user.role?.toUpperCase();
      if (role === 'LECTURER') {
        router.push('/lecturer/courses');
      } else if (role === 'ADMIN') {
        router.push('/admin/courses');
      } else {
        // Redirect to student browse-courses or enrollment route
        router.push(`/student/browse-courses`);
      }
    } else {
      // Guest users go to registration
      router.push('/register');
    }
  };

  const filteredCourses = getCoursesToDisplay().filter(course => {
    // Search Query Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchCode = course.code.toLowerCase().includes(q);
      const matchInstructor = course.instructorName.toLowerCase().includes(q);
      const matchDesc = course.description.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchInstructor && !matchDesc) return false;
    }

    // Department Filter
    if (selectedDept !== 'All') {
      if (course.department.toLowerCase() !== selectedDept.toLowerCase()) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      <div>
        {/* Navbar */}
        <PublicNavbar />

        {/* Hero Section */}
        <section className="relative bg-[#1E40AF] px-6 py-16 md:py-24 text-white overflow-hidden">
          {/* Subtle Background Gradients/Shapes */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 40%)" }}></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <BookOpen className="w-4 h-4 text-blue-200" />
              <span className="text-xs font-semibold tracking-wide text-blue-50">Course Catalog</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Expand Your Knowledge
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
              Browse academic courses designed to challenge and inspire you. Join EduQuest today, complete assignments, pass quizzes, earn XP, and compete on the leaderboard!
            </p>
          </div>
        </section>

        {/* Stats Summary Bar */}
        <section className="relative z-20 -mt-8 px-6">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-slate-800">{stats.totalCourses}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Total Courses</p>
            </div>
            <div className="border-l border-slate-100">
              <p className="text-3xl font-bold text-slate-800">{stats.totalStudents}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Students Enrolled</p>
            </div>
            <div className="border-l border-slate-100">
              <p className="text-3xl font-bold text-slate-800">{stats.completionRate}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Completion Rate</p>
            </div>
            <div className="border-l border-slate-100">
              <p className="text-3xl font-bold text-slate-800">{stats.totalLecturers}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Expert Lecturers</p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3">Filters</h3>

              {/* Search Bar */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">Search Course</label>
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    placeholder="Title, code, lecturer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-700 font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Department Radio Group */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-600 block">Department</label>
                <div className="space-y-2.5">
                  {['All', 'Computing', 'Business', 'Engineering'].map((dept) => (
                    <label key={dept} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="department"
                        checked={selectedDept === dept}
                        onChange={() => setSelectedDept(dept)}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={`text-sm font-medium transition-colors ${selectedDept === dept ? 'text-blue-600 font-semibold' : 'text-slate-500 group-hover:text-slate-800'
                        }`}>
                        {dept === 'All' ? 'All Departments' : dept}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Filters button */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDept('All');
                }}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
              >
                Reset Filters
              </button>
            </div>

            {/* Promotion Widget */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-20%] w-[120px] h-[120px] rounded-full bg-white/10 blur-xl"></div>
              <Award className="w-8 h-8 text-blue-200 mb-4" />
              <h4 className="font-bold text-lg mb-2">Gamified Quest</h4>
              <p className="text-xs text-blue-100 leading-relaxed font-medium">
                Every quiz you solve and every assignment you submit on time earns you XP points. Climb your university leaderboard and unlock unique badges!
              </p>
            </div>
          </div>

          {/* Right Grid of Courses */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-400">
              <span>Showing {filteredCourses.length} Courses</span>
            </div>

            {loading ?
              <Loading />
              :
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 group flex flex-col"
                  >
                    {/* Course Card Header (Theme Background) */}
                    <div className="h-36 bg-slate-50 border-b border-slate-100 flex items-center justify-center text-5xl relative group-hover:scale-102 transition duration-300">
                      <span>{course.emoji}</span>

                      <div className="absolute top-4 left-4">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-600 rounded-full shadow-sm border border-slate-100">
                          {course.code}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border shadow-sm ${course.colorClass}`}>
                          {course.type}
                        </span>
                      </div>
                    </div>

                    {/* Course Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-extrabold text-blue-600 tracking-wider uppercase">
                          {course.department}
                        </p>
                        <h4 className="font-bold text-slate-800 text-base leading-snug line-clamp-1 group-hover:text-blue-600 transition">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-50 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="line-clamp-1">{course.instructorName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            <span>{course.modulesCount} modules</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{course.rating}</span>
                          </div>
                          <button
                            onClick={() => handleEnrollClick(course.id)}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition"
                          >
                            Enroll Now <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </section>

        {/* Why study with us section */}
        <section className="bg-slate-900 text-white py-16 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Learn on EduQuest?</h2>
              <p className="text-slate-400 max-w-xl mx-auto font-medium text-sm md:text-base">
                We've combined strict university courses with gamification loops to keep you motivated.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-800/40 border border-slate-700/30 rounded-3xl p-6 text-left space-y-4">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  🔥
                </div>
                <h4 className="font-bold text-lg text-white">Earn XP & Level Up</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Earn points for every lecture note read, assignment submitted, and quiz finished. Watch your character level up.
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/30 rounded-3xl p-6 text-left space-y-4">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  🏆
                </div>
                <h4 className="font-bold text-lg text-white">Earn Badges</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Unlock beautiful badges by completing milestones like "Perfect Score" or "Fast Learner", and show them on your profile.
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/30 rounded-3xl p-6 text-left space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  👥
                </div>
                <h4 className="font-bold text-lg text-white">Compete on Leaderboards</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Challenge your batchmates. Track your standing in real-time, climb the ranks, and secure the top spot!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-blue-600 py-16 px-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-white/10 blur-2xl"></div>
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h3 className="text-3xl font-bold tracking-tight">Ready to start your adventure?</h3>
            <p className="text-blue-100 font-medium text-sm md:text-base">
              Create your free EduQuest account today and experience gamified learning at your university.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition transform hover:-translate-y-0.5"
              >
                Sign Up Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
