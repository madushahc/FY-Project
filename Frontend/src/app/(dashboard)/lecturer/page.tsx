"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCourseStore } from '@/store/useCourseStore';
import Loading from '@/components/ui/Loading';
import api from '@/lib/api';

export default function LecturerDashboard() {
  const { myCourses, fetchMyCreatedCourses, loading } = useCourseStore();
  const [user, setUser] = useState<any>(null);
  
  const [stats, setStats] = useState({
    participationRate: '0%',
    pendingGrades: '0',
    avgCompletion: '0%'
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchMyCreatedCourses();
  }, [fetchMyCreatedCourses]);

  useEffect(() => {
    const getStats = async () => {
      if (myCourses.length === 0) {
        setStatsLoading(false);
        return;
      }
      setStatsLoading(true);
      try {
        // 1. Fetch lecturer students (enrollments)
        const studentsRes = await api.get('/courses/lecturer/students');
        const enrollments = studentsRes.data || [];
        const totalEnrollments = enrollments.length;
        
        const avgComp = totalEnrollments > 0
          ? Math.round(enrollments.reduce((acc: number, curr: any) => acc + (curr.progress || 0), 0) / totalEnrollments)
          : 0;
          
        const partRate = totalEnrollments > 0
          ? Math.round((enrollments.filter((curr: any) => curr.progress > 0).length / totalEnrollments) * 100)
          : 0;

        // 2. Fetch all assignments and count pending submissions
        let totalPendingGrades = 0;
        for (const course of myCourses) {
          try {
            const assignRes = await api.get(`/assignments/course/${course._id}`);
            const assignments = assignRes.data || [];
            for (const assn of assignments) {
              try {
                const subsRes = await api.get(`/submissions/assignment/${assn._id}`);
                const submissions = subsRes.data || [];
                const pendingCount = submissions.filter((sub: any) => sub.status !== 'Graded').length;
                totalPendingGrades += pendingCount;
              } catch (e) {}
            }
          } catch (e) {}
        }

        setStats({
          participationRate: totalEnrollments > 0 ? `${partRate}%` : '0%',
          pendingGrades: `${totalPendingGrades}`,
          avgCompletion: totalEnrollments > 0 ? `${avgComp}%` : '0%'
        });
      } catch (err) {
        console.error("Failed to fetch lecturer analytics:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    getStats();
  }, [myCourses]);

  const activeCourseCount = myCourses.length;
  const totalStudents = myCourses.reduce((acc, course) => acc + (course.enrollmentCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute right-32 bottom-0 w-48 h-48 bg-indigo-300 opacity-20 rounded-full blur-2xl translate-y-1/4"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Good morning, {user?.name || 'Lecturer'}! 👨‍🏫</h1>
          <p className="text-purple-100 text-sm mb-6">{activeCourseCount} courses active • {totalStudents} students enrolled • {statsLoading ? '...' : stats.pendingGrades} assignments to grade</p>
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
               📚 {activeCourseCount} Courses
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
               👥 {totalStudents} Students
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active Students</p>
          <h3 className="text-3xl font-light text-purple-600 mb-2">{totalStudents}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Participation Rate</p>
          <h3 className="text-3xl font-light text-blue-500 mb-2">{statsLoading ? "..." : stats.participationRate}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Pending Grades</p>
          <h3 className="text-3xl font-light text-red-500 mb-2">{statsLoading ? "..." : stats.pendingGrades}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Avg Completion</p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">{statsLoading ? "..." : stats.avgCompletion}</h3>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-slate-800">My Courses</h3>
              <Link href="/lecturer/courses" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                + New Course
              </Link>
            </div>
            
            {loading ? (
               <Loading />
            ) : myCourses.length === 0 ? (
               <div className="text-center p-8 text-slate-500">No courses created yet.</div>
            ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 pl-2">Course</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {myCourses.map((course) => (
                        <tr key={course._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 pl-2 text-sm font-medium text-slate-700">{course.title}</td>
                          <td className="py-4 text-sm text-slate-600 font-medium">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold leading-none ${course.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                               {course.status || 'Draft'}
                            </span>
                          </td>
                          <td className="py-4 text-right pr-2">
                             <Link href={`/lecturer/courses/${course._id}/edit`} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-200 transition">
                              Manage
                             </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/lecturer/courses" className="block text-center w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                  + Create Course
                </Link>
                <Link href="/lecturer/activities" className="block text-center w-full bg-slate-100 text-slate-700 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-200 transition">
                  <span className="mr-2">📝</span> Grade Assignments
                </Link>
                <Link href="/lecturer/gamification" className="block text-center w-full bg-slate-100 text-slate-700 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-200 transition">
                  <span className="mr-2">🎮</span> Game Settings
                </Link>
             </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
