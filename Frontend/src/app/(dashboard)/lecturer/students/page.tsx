"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BarChart2, TrendingUp, Target, Award, AlertTriangle, CheckCircle2, BookOpen, ArrowRight, Brain, RefreshCw, Mail, Sparkles, Video, Clock, Calendar, Zap, ShieldAlert, FileText, Activity, Layers, Play, User } from 'lucide-react';
import api from '@/lib/api';
import Loading from '@/components/ui/Loading';

export default function LecturerStudents() {
   const router = useRouter();
   const [students, setStudents] = useState<any[]>([]);
   const [courses, setCourses] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedCourse, setSelectedCourse] = useState('All');
   const [viewingStudent, setViewingStudent] = useState<any | null>(null);
   const [studentAnalyticsMap, setStudentAnalyticsMap] = useState<Record<string, any>>({});
   const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);
   const [activeModalTab, setActiveModalTab] = useState<'overview' | 'video_quiz' | 'response_questions' | 'timeline_trends'>('overview');

   const fetchData = useCallback(async () => {
      try {
         const storedUserStr = localStorage.getItem('user');
         const currentUser = storedUserStr ? JSON.parse(storedUserStr) : null;
         const currentUserId = currentUser?._id?.toString();

         // 1. Fetch courses to populate dropdown
         const coursesRes = await api.get('/courses');
         const allCourses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
         const lecturerCourses = allCourses.filter((course: any) => {
            const instId = course.instructor?._id || course.instructor;
            return instId?.toString() === currentUserId;
         });
         setCourses(lecturerCourses);

         // 2. Fetch student enrollments
         const res = await api.get('/courses/lecturer/students');
         const enrollments = Array.isArray(res.data) ? res.data : [];

         const userMap = new Map();
         enrollments.forEach((enrollment: any) => {
            const u = enrollment.student;
            if (!u) return;

            const enrollmentCourseId = enrollment.course?._id || enrollment.course;
            const enrollmentCourseTitle = enrollment.course?.title || "Unknown Course";
            const rawProgress = Math.min(100, Math.max(0, Math.round(enrollment.progress || 0)));

            if (!userMap.has(u._id)) {
               userMap.set(u._id, {
                  id: u._id,
                  name: u.name,
                  email: u.email,
                  pts: u.points || 0,
                  coursesCount: 1,
                  enrollments: [{
                     courseId: enrollmentCourseId,
                     courseTitle: enrollmentCourseTitle,
                     progress: rawProgress
                  }],
                  completion: rawProgress,
                  initial: u.name?.charAt(0).toUpperCase() || 'U'
               });
            } else {
               const existing = userMap.get(u._id);
               existing.coursesCount += 1;
               existing.enrollments.push({
                  courseId: enrollmentCourseId,
                  courseTitle: enrollmentCourseTitle,
                  progress: rawProgress
               });
               const totalProgress = existing.enrollments.reduce((sum: number, item: any) => sum + Math.min(100, Math.max(0, item.progress || 0)), 0);
               existing.completion = Math.min(100, Math.max(0, Math.round(totalProgress / existing.enrollments.length)));
               userMap.set(u._id, existing);
            }
         });

         setStudents(Array.from(userMap.values()));
      } catch (err) {
         console.error("Failed to fetch students/courses", err);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchData();

      const handleFocus = () => {
         fetchData();
      };

      const intervalId = setInterval(() => {
         fetchData();
      }, 5000);

      window.addEventListener("focus", handleFocus);
      document.addEventListener("visibilitychange", handleFocus);

      return () => {
         window.removeEventListener("focus", handleFocus);
         document.removeEventListener("visibilitychange", handleFocus);
         clearInterval(intervalId);
      };
   }, [fetchData]);

   // Fetch individual student learning analytics data when student modal opens
   useEffect(() => {
      if (!viewingStudent?.id) return;
      const fetchStudentAnalytics = async () => {
         setLoadingAnalytics(true);
         try {
            const { data } = await api.get('/courses/analytics/interactive', {
               params: { studentId: viewingStudent.id }
            });
            const matchingStudent = data.studentRankings?.find(
               (s: any) => String(s.studentId) === String(viewingStudent.id)
            );
            if (matchingStudent) {
               setStudentAnalyticsMap((prev) => ({
                  ...prev,
                  [viewingStudent.id]: {
                     ...matchingStudent,
                     engagementScore: Math.min(100, Math.max(0, Math.round(matchingStudent.engagementScore || 0))),
                     completionRate: Math.min(100, Math.max(0, Math.round(matchingStudent.completionRate || 0))),
                     questionAccuracyRate: Math.min(100, Math.max(0, Math.round(matchingStudent.questionAccuracyRate || 0)))
                  }
               }));
            } else {
               setStudentAnalyticsMap((prev) => ({
                  ...prev,
                  [viewingStudent.id]: {
                     engagementScore: Math.min(100, Math.max(0, Math.round(viewingStudent.completion))),
                     completionRate: Math.min(100, Math.max(0, Math.round(viewingStudent.completion))),
                     questionAccuracyRate: 0,
                     totalQuestionsAttempted: 0,
                     totalQuestionsCorrect: 0,
                     avgResponseTime: 0,
                     isAtRisk: viewingStudent.completion < 40,
                     riskReason: viewingStudent.completion < 40 ? "Low lesson completion rate (< 40%)" : ""
                  }
               }));
            }
         } catch (err) {
            console.error("Failed to load student analytics", err);
         } finally {
            setLoadingAnalytics(false);
         }
      };
      fetchStudentAnalytics();
   }, [viewingStudent]);

   const activeStudents = students.filter(s => s.status === 'Active').length;
   const atRiskStudents = students.filter(s => s.completion < 40).length;
   const avgScore = students.length > 0 ? Math.min(100, Math.max(0, Math.round(students.reduce((acc, s) => acc + s.completion, 0) / students.length))) : 0;

   // Filter students based on search query and selected course
   const filteredStudents = students.filter(student => {
      const matchesSearch =
         student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         student.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse =
         selectedCourse === 'All' ||
         student.enrollments.some((e: any) => e.courseId === selectedCourse || e.courseTitle === selectedCourse);

      return matchesSearch && matchesCourse;
   });

   const activeAnalytics = viewingStudent ? studentAnalyticsMap[viewingStudent.id] : null;

   return (
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
         {/* Header Area */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
               <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <span>👥</span> Student Management
               </h2>
               <p className="text-xs sm:text-sm text-slate-500 mt-1">Monitor student progress, completion rates, and learning analytics</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
               <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search students..."
                     className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 bg-white shadow-sm"
                  />
               </div>
               <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm cursor-pointer"
               >
                  <option value="All">All Courses</option>
                  {courses.map(course => (
                     <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
               </select>
            </div>
         </div>

         {/* Metrics */}
         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
               <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">Total Students</p>
               <h3 className="text-2xl sm:text-3xl font-bold text-blue-600">{students.length}</h3>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
               <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">Active Today</p>
               <h3 className="text-2xl sm:text-3xl font-bold text-emerald-500">{activeStudents}</h3>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
               <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">At Risk</p>
               <h3 className="text-2xl sm:text-3xl font-bold text-red-500">{atRiskStudents}</h3>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
               <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">Avg Score</p>
               <h3 className="text-2xl sm:text-3xl font-bold text-purple-500">{avgScore}%</h3>
            </div>
         </div>

         {/* Student Table */}
         {loading ? (
            <Loading />
         ) : students.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-12 text-center text-slate-500">
               No students are currently enrolled in your courses.
            </div>
         ) : filteredStudents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-12 text-center text-slate-500">
               No students match your search filters.
            </div>
         ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[750px]">
                     <thead>
                        <tr className="border-b border-slate-100 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
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
                        {filteredStudents.map(student => (
                           <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-4 pl-6 pr-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                                       {student.initial}
                                    </div>
                                    <div className="min-w-0">
                                       <p className="text-sm font-semibold text-slate-800 truncate">{student.name}</p>
                                       <p className="text-xs text-blue-600 font-medium">{student.pts} pts</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-4 px-4 text-sm text-slate-500 font-medium truncate max-w-[180px]">
                                 {student.email}
                              </td>
                              <td className="py-4 px-4 text-sm text-slate-600 font-medium">
                                 {student.coursesCount} {student.coursesCount === 1 ? 'course' : 'courses'}
                              </td>
                              <td className="py-4 px-4 text-sm text-blue-600 font-bold">
                                 {student.pts}
                              </td>
                              <td className="py-4 px-4">
                                 <div className="flex items-center gap-2">
                                    <div className="w-16 sm:w-20 bg-slate-100 rounded-full h-2 shrink-0">
                                       <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${student.completion}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">{student.completion}%</span>
                                 </div>
                              </td>
                              <td className="py-4 px-4 text-sm text-slate-400 font-medium whitespace-nowrap">
                                 {student.login}
                              </td>
                              <td className="py-4 px-4 text-center">
                                 <span className={`px-3 py-1 text-[10px] font-bold rounded-full inline-block ${student.status === 'Active' ? 'bg-emerald-100/60 text-emerald-700' : 'bg-red-50 text-red-500'
                                    }`}>
                                    {student.status}
                                 </span>
                              </td>
                              <td className="py-4 pr-6 pl-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <button
                                       onClick={() => setViewingStudent(student)}
                                       className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-sm cursor-pointer"
                                    >
                                       View Details
                                    </button>

                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* Student Details & Learning Analytics Modal */}
         {viewingStudent && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
               <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">

                  {/* Modal Header */}
                  <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
                     <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md shrink-0 border border-indigo-400/30">
                           {viewingStudent.initial}
                        </div>
                        <div className="min-w-0">
                           <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-extrabold text-white text-base sm:text-lg truncate">{viewingStudent.name}</h3>
                              {activeAnalytics?.isAtRisk ? (
                                 <span className="px-2.5 py-0.5 bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[10px] font-black rounded-full flex items-center gap-1 shrink-0">
                                    <AlertTriangle className="w-3 h-3 text-rose-400" /> At Risk
                                 </span>
                              ) : (
                                 <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black rounded-full flex items-center gap-1 shrink-0">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Good Standing
                                 </span>
                              )}
                           </div>
                           <p className="text-xs text-slate-300 font-medium truncate flex items-center gap-2 mt-0.5">
                              <span>ID: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono text-indigo-300">{viewingStudent.id}</code></span>
                              <span className="text-slate-500">•</span>
                              <span>{viewingStudent.email}</span>
                           </p>
                        </div>
                     </div>
                     <button
                        onClick={() => setViewingStudent(null)}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition cursor-pointer shrink-0"
                     >
                        ✕
                     </button>
                  </div>

                  {/* Navigation Tabs Header */}
                  <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 sm:px-6 pt-2 overflow-x-auto custom-scrollbar gap-1 text-xs font-extrabold shrink-0">
                     <button
                        onClick={() => setActiveModalTab('overview')}
                        className={`px-3.5 py-2.5 rounded-t-xl transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                           activeModalTab === 'overview' 
                              ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs' 
                              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                        }`}
                     >
                        <Brain className="w-3.5 h-3.5" /> Overview & Progress
                     </button>
                     <button
                        onClick={() => setActiveModalTab('video_quiz')}
                        className={`px-3.5 py-2.5 rounded-t-xl transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                           activeModalTab === 'video_quiz' 
                              ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs' 
                              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                        }`}
                     >
                        <Video className="w-3.5 h-3.5" /> Video & Quiz Analytics
                     </button>
                     <button
                        onClick={() => setActiveModalTab('response_questions')}
                        className={`px-3.5 py-2.5 rounded-t-xl transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                           activeModalTab === 'response_questions' 
                              ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs' 
                              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                        }`}
                     >
                        <Target className="w-3.5 h-3.5" /> Response & Topic Analysis
                     </button>
                     <button
                        onClick={() => setActiveModalTab('timeline_trends')}
                        className={`px-3.5 py-2.5 rounded-t-xl transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                           activeModalTab === 'timeline_trends' 
                              ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs' 
                              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                        }`}
                     >
                        <TrendingUp className="w-3.5 h-3.5" /> Timeline & Trends
                     </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar">

                     {loadingAnalytics && !activeAnalytics ? (
                        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                           <RefreshCw className="w-7 h-7 animate-spin text-indigo-600" />
                           <span className="text-xs font-bold text-slate-600">Loading Comprehensive Individual Analytics...</span>
                        </div>
                     ) : (
                        <>
                           {/* TAB 1: OVERVIEW & LEARNING PROGRESS */}
                           {activeModalTab === 'overview' && (
                              <div className="space-y-5">
                                 {/* Student Metadata Card */}
                                 <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                       <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Individual Profile</span>
                                       <h4 className="text-base sm:text-lg font-black">{viewingStudent.name}</h4>
                                       <p className="text-xs text-slate-300 font-medium">
                                          Enrolled in <span className="text-indigo-200 font-bold">{viewingStudent.coursesCount} course(s)</span> • Active Student
                                       </p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                       <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-right">
                                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Class Rank</span>
                                          <span className="text-sm font-black text-indigo-300">#{activeAnalytics?.rank || (students.filter(s => (s.completion || 0) > (viewingStudent.completion || 0)).length + 1)} of {students.length}</span>
                                       </div>
                                       <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-right">
                                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Status</span>
                                          <span className="text-sm font-black text-emerald-400">
                                             {(activeAnalytics?.engagementScore || viewingStudent.completion) >= 75 ? '🌟 Highly Engaged' :
                                              (activeAnalytics?.engagementScore || viewingStudent.completion) >= 45 ? '🚀 Moderately Engaged' : '⚠️ Low Engagement'}
                                          </span>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Learning Progress Metrics (6 KPI Grid) */}
                                 <div>
                                    <h4 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                       <Brain className="w-4 h-4 text-indigo-600" /> Learning Progress Metrics
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                                       <div className="bg-indigo-50/80 p-3 rounded-2xl border border-indigo-100">
                                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-600 block mb-1">Engagement</span>
                                          <span className="text-base font-black text-indigo-950">⭐ {Math.round(activeAnalytics?.engagementScore ?? viewingStudent.completion ?? 0)}%</span>
                                       </div>
                                       <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100">
                                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-700 block mb-1">Course Progress</span>
                                          <span className="text-base font-black text-emerald-950">📊 {Math.round(activeAnalytics?.completionRate ?? viewingStudent.completion ?? 0)}%</span>
                                       </div>
                                       <div className="bg-purple-50/80 p-3 rounded-2xl border border-purple-100">
                                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-700 block mb-1">Lessons Done</span>
                                          <span className="text-base font-black text-purple-950">📦 {activeAnalytics?.lessonsCompletedCount || 0} / {activeAnalytics?.totalLessonsEngaged || 1}</span>
                                       </div>
                                       <div className="bg-blue-50/80 p-3 rounded-2xl border border-blue-100">
                                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-700 block mb-1">Video Watch %</span>
                                          <span className="text-base font-black text-blue-950">🎥 {Math.round(activeAnalytics?.completionRate ?? viewingStudent.completion ?? 0)}%</span>
                                       </div>
                                       <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-100">
                                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-700 block mb-1">Learning Time</span>
                                          <span className="text-base font-black text-amber-950">⏱️ {activeAnalytics?.totalLearningTimeMins || 0} mins</span>
                                       </div>
                                       <div className="bg-rose-50/80 p-3 rounded-2xl border border-rose-100">
                                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-rose-700 block mb-1">Total Points</span>
                                          <span className="text-base font-black text-rose-950">🏆 {activeAnalytics?.totalPoints ?? viewingStudent.pts} XP</span>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Student Engagement Breakdown Calculation */}
                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                    <h5 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                                       <span>Overall Engagement Score Calculation Breakdown</span>
                                       <span className="text-indigo-600 font-extrabold">{Math.round(activeAnalytics?.engagementScore ?? viewingStudent.completion ?? 0)} / 100</span>
                                    </h5>
                                    <div className="space-y-2 text-xs font-bold">
                                       <div>
                                          <div className="flex justify-between text-slate-600 mb-1">
                                             <span>Video Engagement (Watch Retention)</span>
                                             <span className="text-slate-800 font-extrabold">{Math.round((activeAnalytics?.completionRate ?? viewingStudent.completion ?? 0) * 0.40)} / 40 pts</span>
                                          </div>
                                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                             <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${Math.round(activeAnalytics?.completionRate ?? viewingStudent.completion ?? 0)}%` }}></div>
                                          </div>
                                       </div>
                                       <div>
                                          <div className="flex justify-between text-slate-600 mb-1">
                                             <span>Quiz Checkpoint Participation</span>
                                             <span className="text-slate-800 font-extrabold">{Math.round((activeAnalytics?.questionAccuracyRate ?? 0) * 0.30)} / 30 pts</span>
                                          </div>
                                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                             <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.round(activeAnalytics?.questionAccuracyRate ?? 0)}%` }}></div>
                                          </div>
                                       </div>
                                       <div>
                                          <div className="flex justify-between text-slate-600 mb-1">
                                             <span>Lesson Completion Rate</span>
                                             <span className="text-slate-800 font-extrabold">{Math.round((activeAnalytics?.completionRate ?? viewingStudent.completion ?? 0) * 0.20)} / 20 pts</span>
                                          </div>
                                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                             <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.round(activeAnalytics?.completionRate ?? viewingStudent.completion ?? 0)}%` }}></div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Enrolled Courses & Detailed Progress List */}
                                 <div className="space-y-3">
                                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                       <BookOpen className="w-4 h-4 text-indigo-600" /> Enrolled Courses & Detailed Breakdown
                                    </h4>
                                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                                       {viewingStudent.enrollments.map((enrollment: any, idx: number) => (
                                          <div key={idx} className="border border-slate-100 p-3.5 rounded-2xl bg-white hover:bg-slate-50/50 transition">
                                             <div className="flex items-center justify-between mb-2 gap-2">
                                                <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">{enrollment.courseTitle}</span>
                                                <span className="text-xs font-extrabold text-blue-600 shrink-0">{enrollment.progress}% Complete</span>
                                             </div>
                                             <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div
                                                   className="bg-blue-600 h-2 rounded-full transition-all duration-350"
                                                   style={{ width: `${enrollment.progress}%` }}
                                                ></div>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           )}

                           {/* TAB 2: VIDEO & QUIZ ANALYTICS */}
                           {activeModalTab === 'video_quiz' && (
                              <div className="space-y-5">
                                 {/* Video Learning Analysis */}
                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                       <Video className="w-4 h-4 text-indigo-600" /> Video Learning Analysis
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold">
                                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                                          <span className="text-slate-400 text-[10px] block uppercase">Total Videos Watched</span>
                                          <span className="text-slate-900 font-black text-base">{activeAnalytics?.lessonsCompletedCount || 0} videos</span>
                                       </div>
                                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                                          <span className="text-slate-400 text-[10px] block uppercase">Avg Watch %</span>
                                          <span className="text-indigo-600 font-black text-base">{Math.round(activeAnalytics?.completionRate ?? viewingStudent.completion ?? 0)}%</span>
                                       </div>
                                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                                          <span className="text-slate-400 text-[10px] block uppercase">Pause Count</span>
                                          <span className="text-amber-600 font-black text-base">{activeAnalytics?.pauseCount || 0} pauses</span>
                                       </div>
                                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                                          <span className="text-slate-400 text-[10px] block uppercase">Rewatch Count</span>
                                          <span className="text-emerald-600 font-black text-base">{activeAnalytics?.rewatchCount || 0} rewatches</span>
                                       </div>
                                    </div>

                                    {/* Video Watch Drop-Off Milestones */}
                                    <div className="space-y-2 pt-2">
                                       <span className="text-[11px] font-extrabold text-slate-600 block uppercase">Video Watch Retention Milestones</span>
                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
                                          <div className="bg-white p-3 rounded-xl border border-indigo-100 flex justify-between items-center">
                                             <span className="text-indigo-900 font-extrabold">🔒 75% Compulsory Lock</span>
                                             <span className={`px-2 py-0.5 rounded text-[10px] font-black ${(activeAnalytics?.completionRate ?? viewingStudent.completion ?? 0) >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                                {(activeAnalytics?.completionRate ?? viewingStudent.completion ?? 0) >= 75 ? 'Passed ✅' : 'In Progress'}
                                             </span>
                                          </div>
                                          <div className="bg-white p-3 rounded-xl border border-blue-100 flex justify-between items-center">
                                             <span className="text-blue-900 font-extrabold">🏆 100% Full Video Watch</span>
                                             <span className="text-blue-700 font-extrabold">{Math.round(activeAnalytics?.completionRate ?? viewingStudent.completion ?? 0)}%</span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Quiz / Checkpoint Performance Analysis */}
                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                       <Target className="w-4 h-4 text-indigo-600" /> Quiz & Checkpoint Performance Analysis
                                    </h4>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold">
                                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                                          <span className="text-slate-400 text-[10px] block uppercase">Attempted Quizzes</span>
                                          <span className="text-slate-900 font-black text-base">{activeAnalytics?.totalQuestionsAttempted || 0}</span>
                                       </div>
                                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                                          <span className="text-emerald-600 text-[10px] block uppercase">Correct Answers</span>
                                          <span className="text-emerald-700 font-black text-base">{activeAnalytics?.totalQuestionsCorrect || 0}</span>
                                       </div>
                                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                                          <span className="text-rose-600 text-[10px] block uppercase">Incorrect Answers</span>
                                          <span className="text-rose-700 font-black text-base">{Math.max(0, (activeAnalytics?.totalQuestionsAttempted || 0) - (activeAnalytics?.totalQuestionsCorrect || 0))}</span>
                                       </div>
                                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                                          <span className="text-purple-600 text-[10px] block uppercase">Quiz Accuracy</span>
                                          <span className="text-purple-700 font-black text-base">{activeAnalytics?.questionAccuracyRate || 0}%</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}

                           {/* TAB 3: RESPONSE & QUESTION ANALYSIS */}
                           {activeModalTab === 'response_questions' && (
                              <div className="space-y-5">
                                 {/* Response Time Analysis */}
                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center justify-between gap-2">
                                       <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-600" /> Response Time Analysis</span>
                                       <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                          Avg: {activeAnalytics?.avgResponseTime || 0}s / question
                                       </span>
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold">
                                       <div className="bg-white p-3 rounded-xl border border-emerald-100 space-y-1">
                                          <span className="text-emerald-700 font-extrabold block flex items-center gap-1">
                                             ⚡ Fast Responses (&lt;10s)
                                          </span>
                                          <span className="text-slate-900 font-black text-sm">
                                             {activeAnalytics?.fastResponseCount || 0} questions
                                          </span>
                                          <p className="text-[10px] text-slate-400 font-normal">High confidence rapid submissions</p>
                                       </div>
                                       <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                                          <span className="text-blue-700 font-extrabold block flex items-center gap-1">
                                             ⏱️ Normal Responses (10-25s)
                                          </span>
                                          <span className="text-slate-900 font-black text-sm">
                                             {activeAnalytics?.normalResponseCount || 0} questions
                                          </span>
                                          <p className="text-[10px] text-slate-400 font-normal">Standard deliberate processing</p>
                                       </div>
                                       <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
                                          <span className="text-amber-700 font-extrabold block flex items-center gap-1">
                                             🐢 Slow Responses (&gt;25s)
                                          </span>
                                          <span className="text-slate-900 font-black text-sm">
                                             {activeAnalytics?.slowResponseCount || 0} questions
                                          </span>
                                          <p className="text-[10px] text-slate-400 font-normal">Requires extra review time</p>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Real Answered Questions List */}
                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                       <Brain className="w-4 h-4 text-indigo-600" /> Real In-Video Checkpoint Response History
                                    </h4>

                                    {activeAnalytics?.answeredQuestionsList && activeAnalytics.answeredQuestionsList.length > 0 ? (
                                       <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                                          {activeAnalytics.answeredQuestionsList.map((q: any, idx: number) => (
                                             <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                   <p className="font-extrabold text-slate-800 truncate">{q.questionText}</p>
                                                   <p className="text-[10px] text-slate-400 font-medium">Time taken: {q.timeTaken}s</p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${q.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                                   {q.isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
                                                </span>
                                             </div>
                                          ))}
                                       </div>
                                    ) : (
                                       <div className="bg-white p-4 rounded-xl border border-slate-200 text-center text-slate-400 text-xs font-semibold">
                                          No in-video checkpoint responses recorded yet for this student.
                                       </div>
                                    )}
                                 </div>
                              </div>
                           )}

                           {/* TAB 4: TIMELINE & TRENDS */}
                           {activeModalTab === 'timeline_trends' && (
                              <div className="space-y-5">
                                 {/* Learning Activity Timeline */}
                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                       <Calendar className="w-4 h-4 text-indigo-600" /> Real Chronological Activity Log
                                    </h4>

                                    {activeAnalytics?.activityLogs && activeAnalytics.activityLogs.length > 0 ? (
                                       <div className="relative border-l-2 border-indigo-100 ml-3 pl-4 space-y-3 text-xs font-bold">
                                          {activeAnalytics.activityLogs.map((log: any, idx: number) => (
                                             <div key={idx} className="relative">
                                                <div className={`absolute -left-[23px] top-0.5 w-3 h-3 rounded-full ring-4 ring-white ${log.type === 'lesson_completed' ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                                                <span className="text-[10px] text-slate-400 block font-normal">
                                                   {new Date(log.timestamp).toLocaleString()}
                                                </span>
                                                <p className="text-slate-800 font-extrabold">{log.title}</p>
                                                {log.xp > 0 && <span className="text-indigo-600 text-[10px] font-bold">+{log.xp} XP Earned</span>}
                                             </div>
                                          ))}
                                       </div>
                                    ) : (
                                       <div className="bg-white p-4 rounded-xl border border-slate-200 text-center text-slate-400 text-xs font-semibold">
                                          No recent activity logs recorded in database for this student yet.
                                       </div>
                                    )}
                                 </div>

                                 {/* Interactive Performance Trends */}
                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                       <TrendingUp className="w-4 h-4 text-indigo-600" /> Realtime Performance Trends
                                    </h4>

                                    <div className="space-y-2.5 text-xs font-bold">
                                       <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                                          <div className="flex justify-between text-slate-700">
                                             <span>Engagement Score Trend</span>
                                             <span className="text-indigo-600 font-extrabold">{Math.round(activeAnalytics?.engagementScore ?? viewingStudent.completion ?? 0)}%</span>
                                          </div>
                                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                             <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.round(activeAnalytics?.engagementScore ?? viewingStudent.completion ?? 0)}%` }} />
                                          </div>
                                       </div>

                                       <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                                          <div className="flex justify-between text-slate-700">
                                             <span>Quiz Accuracy Trend</span>
                                             <span className="text-emerald-600 font-extrabold">🎯 {activeAnalytics?.questionAccuracyRate || 0}%</span>
                                          </div>
                                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                             <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${activeAnalytics?.questionAccuracyRate || 0}%` }} />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </>
                     )}

                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 shrink-0">
                     <a
                        href={`mailto:${viewingStudent.email}?subject=Learning Progress Update for ${encodeURIComponent(viewingStudent.name)}`}
                        className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                     >
                        <Mail className="w-4 h-4" /> Contact Student
                     </a>
                     <button
                        onClick={() => setViewingStudent(null)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition cursor-pointer"
                     >
                        Close
                     </button>
                  </div>

               </div>
            </div>
         )}
      </div>
   );
}
