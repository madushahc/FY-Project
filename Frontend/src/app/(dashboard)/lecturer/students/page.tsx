"use client";

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '@/lib/api';
import Loading from '@/components/ui/Loading';

export default function LecturerStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [viewingStudent, setViewingStudent] = useState<any | null>(null);

  useEffect(() => {
     const fetchData = async () => {
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
                       progress: enrollment.progress || 0
                    }],
                    completion: enrollment.progress || 0,
                    login: 'Active',
                    status: 'Active',
                    initial: u.name?.charAt(0).toUpperCase() || 'U'
                 });
              } else {
                 const existing = userMap.get(u._id);
                 existing.coursesCount += 1;
                 existing.enrollments.push({
                    courseId: enrollmentCourseId,
                    courseTitle: enrollmentCourseTitle,
                    progress: enrollment.progress || 0
                 });
                 const totalProgress = existing.enrollments.reduce((sum: number, item: any) => sum + item.progress, 0);
                 existing.completion = Math.round(totalProgress / existing.enrollments.length);
                 userMap.set(u._id, existing);
              }
           });
           
           setStudents(Array.from(userMap.values()));
        } catch(err) {
           console.error("Failed to fetch students/courses", err);
        }
        setLoading(false);
     };
     fetchData();
  }, []);

  const activeStudents = students.filter(s => s.status === 'Active').length;
  const atRiskStudents = students.filter(s => s.completion < 40).length;
  const avgScore = students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.completion, 0) / students.length) : 0;

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students..." 
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64 text-slate-700" 
               />
            </div>
            <select 
               value={selectedCourse}
               onChange={(e) => setSelectedCourse(e.target.value)}
               className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 focus:outline-none"
            >
               <option value="All">All Courses</option>
               {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.title}</option>
               ))}
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
         <Loading />
      ) : students.length === 0 ? (
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center text-slate-500">
            No students are currently enrolled in your courses.
         </div>
      ) : filteredStudents.length === 0 ? (
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center text-slate-500">
            No students match your search filters.
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
               {filteredStudents.map(student => (
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
                        {student.coursesCount} courses
                     </td>
                     <td className="py-4 px-4 text-sm text-blue-600 font-medium">
                        {student.pts}
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
                        <button 
                           onClick={() => setViewingStudent(student)}
                           className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                        >
                           View
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
      )}

      {/* Student Details Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {viewingStudent.initial}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{viewingStudent.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{viewingStudent.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingStudent(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-650 transition"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">Total Points</span>
                  <span className="text-xl font-bold text-blue-600">⭐ {viewingStudent.pts} XP</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">Average Completion</span>
                  <span className="text-xl font-bold text-purple-600">📊 {viewingStudent.completion}%</span>
                </div>
              </div>
              
              {/* Course Progress List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-650 uppercase tracking-wider">Enrolled Courses & Progress</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {viewingStudent.enrollments.map((enrollment: any, idx: number) => (
                    <div key={idx} className="border border-slate-100 p-4 rounded-2xl bg-white hover:bg-slate-50/50 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-800">{enrollment.courseTitle}</span>
                        <span className="text-xs font-bold text-blue-600">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-350" 
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
              <button 
                onClick={() => setViewingStudent(null)}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm"
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
