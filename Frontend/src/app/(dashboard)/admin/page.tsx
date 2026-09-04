"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  BarChart2,
  ArrowRight,
  RefreshCw,
  Clock,
  Users,
  BookOpen,
  Activity,
  Award,
  GraduationCap,
  FileText,
  TrendingUp,
  CheckCircle2,
  Compass,
  Layers,
  ShieldCheck,
  Flame,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Real-time synchronization state
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch real-time administrative analytics reports
  const fetchDashboardData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await api.get('/analytics/admin-reports');
      setData(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load real-time dashboard data", err);
    } finally {
      if (isManual) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, []);

  // Initial fetch and 15s auto-polling when tab is visible
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await fetchDashboardData();
      if (isMounted) setLoading(false);
    };
    init();

    // Auto-polling interval
    const interval = setInterval(() => {
      if (autoRefresh && typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchDashboardData();
      }
    }, 15000);

    // Auto-refetch when user switches back to this tab
    const handleVisibilityOrFocus = () => {
      if (autoRefresh && typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchDashboardData();
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [fetchDashboardData, autoRefresh]);

  // Engagement telemetry chart data
  const chartData = useMemo(() => {
    const rawData = data?.engagement?.dailyActiveUsers || [];
    const colors = [
      'from-blue-600 to-indigo-500',
      'from-emerald-500 to-teal-400',
      'from-indigo-500 to-purple-500',
      'from-amber-500 to-orange-400'
    ];
    return rawData.map((d: any, idx: number) => ({
      h: `${Math.max(15, Math.min(100, d.v || 0))}%`,
      val: d.v || 0,
      gradient: colors[idx % colors.length],
      label: d.d || `D${idx + 1}`
    }));
  }, [data]);



  const coursePerformance = data?.coursePerformance?.courses || [];
  const topLecturers = data?.engagement?.topLecturers || [];
  const pointsDistribution = data?.gamification?.pointsDistribution || [];
  const recentBadges = data?.gamification?.recentBadges || [];

  return (
    <div className="space-y-6 pb-12">


      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute right-40 bottom-0 w-52 h-52 bg-orange-300 opacity-20 rounded-full blur-2xl translate-y-1/4"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              LMS Operations Console
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-1">Administrative Overview</h1>
          <p className="text-red-100 text-sm mb-6">Real-time academic telemetry & institutional performance • NSBM Green University</p>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                👥 <span className="font-bold">{data?.userActivity?.metrics?.totalUsers || 0}</span> Total Learners
              </div>
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                📚 <span className="font-bold">{data?.coursePerformance?.metrics?.totalCourses || 0}</span> Active Courses
              </div>
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                ⚡ <span className="font-bold">{data?.engagement?.metrics?.completionRate || 0}%</span> Engagement Index
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/analytics"
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-5 py-2.5 rounded-xl text-sm font-bold shadow transition duration-250 flex items-center gap-2 cursor-pointer"
              >
                <BarChart2 className="w-4 h-4 text-yellow-300" />
                <span>Learning Analytics ⭐</span>
              </Link>
              <Link
                href="/admin/courses"
                className="bg-white hover:bg-slate-50 text-red-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow transition duration-250 cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-red-700" />
                <span>Course Directory</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Active Students</p>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-3xl font-light text-blue-600 mb-2">
            {data?.engagement?.metrics?.activeStudents ?? data?.userActivity?.metrics?.totalUsers ?? 0}
          </h3>
          <p className="text-emerald-600 text-xs font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Platform-wide enrolled students</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Course Portfolio</p>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-3xl font-light text-emerald-600 mb-2">
            {data?.coursePerformance?.metrics?.totalCourses || 0}
          </h3>
          <p className="text-slate-500 text-xs font-medium">
            <span className="text-amber-600 font-semibold">{data?.coursePerformance?.metrics?.draftCourses || 0}</span> unpublished in draft
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Course Completions</p>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-3xl font-light text-purple-600 mb-2">
            {data?.coursePerformance?.metrics?.avgCompletion || 0}%
          </h3>
          <p className="text-slate-500 text-xs font-medium">
            Avg Quiz Score: <span className="text-purple-600 font-semibold">{data?.coursePerformance?.metrics?.avgQuizScore || 0}%</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Gamification Reward XP</p>
            <span className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-3xl font-light text-orange-500 mb-2">
            {(data?.gamification?.metrics?.totalPoints || 0).toLocaleString()} XP
          </h3>
          <p className="text-emerald-600 text-xs font-medium flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{data?.gamification?.metrics?.badgesAwarded || 0} badges issued</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Platform Telemetry & Gamification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Telemetry Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Daily Active Student Telemetry</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time daily activity patterns and session engagement</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Live Stream
              </span>
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-3 px-2 pb-2 pt-6">
              {chartData.map((bar: any, idx: number) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded shadow-sm">
                    {bar.val}%
                  </div>
                  <div
                    className={`w-full max-w-[48px] rounded-t-lg bg-gradient-to-t ${bar.gradient} opacity-90 group-hover:opacity-100 transition-all duration-300 shadow-sm cursor-pointer`}
                    style={{ height: bar.h }}
                  ></div>
                  <span className="text-[10px] font-medium text-slate-400 tracking-tight text-center truncate w-full">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-slate-400 text-sm">
              No engagement activity recorded yet.
            </div>
          )}

          {/* Sub-metrics footer */}
          <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-slate-100 text-center">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Enrollments</p>
              <p className="text-lg font-bold text-slate-800">{data?.coursePerformance?.metrics?.totalEnrollments || 0}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Avg Session Duration</p>
              <p className="text-lg font-bold text-slate-800">{data?.engagement?.metrics?.avgSession || 24} min</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Platform Logins</p>
              <p className="text-lg font-bold text-slate-800">{data?.engagement?.metrics?.totalLogins || 0}</p>
            </div>
          </div>
        </div>

        {/* Gamification & Point Streams */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">XP Distribution</h3>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                Gamification
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Learning points awarded across assignments, quizzes & interactive lessons</p>

            <div className="space-y-4">
              {pointsDistribution.map((item: any, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 font-semibold">{item.n}</span>
                    <span className="text-slate-500 font-bold">{item.p}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.c || 'bg-blue-500'}`}
                      style={{ width: `${item.p}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Badges Stream */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Recent Badges Awarded</h4>
              {recentBadges.length > 0 ? (
                <div className="space-y-2">
                  {recentBadges.slice(0, 4).map((badge: any, bIdx: number) => (
                    <div key={bIdx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <Award className={`w-4 h-4 ${badge.c || 'text-purple-600'}`} />
                        <span className="font-medium text-slate-800">{badge.n}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">{badge.v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No recent badge telemetry recorded.</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/admin/analytics"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center justify-between group cursor-pointer"
            >
              <span>Explore deep engagement matrix</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Course Performance Telemetry & Faculty Leadership */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Performance Matrix */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Academic Course Performance</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time enrolled cohort progress & assessment scores</p>
            </div>
            <Link
              href="/admin/courses"
              className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
            >
              <span>Manage all courses</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Course</th>
                  <th className="pb-3 px-3">Department</th>
                  <th className="pb-3 px-3">Instructor</th>
                  <th className="pb-3 px-3">Enrolled</th>
                  <th className="pb-3 px-3">Avg Progress</th>
                  <th className="pb-3 px-3">Avg Quiz</th>
                  <th className="pb-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {coursePerformance.slice(0, 5).map((course: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800 max-w-[180px] truncate">
                      {course.course}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-medium">
                      {course.dept || 'General'}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {course.lecturer || 'Unassigned'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {course.enrolled}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${course.color || 'bg-emerald-500'}`}
                            style={{ width: `${course.completion || 0}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-slate-700 text-[11px]">{course.completion}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {course.avgQuiz}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${course.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                      >
                        {course.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {coursePerformance.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs">
                No active courses available for telemetry reporting.
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Faculty */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">Faculty Leadership</h3>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                Lecturers
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Top performing academic instructors by engagement & course completions</p>

            <div className="space-y-3">
              {topLecturers.slice(0, 5).map((lec: any, lIdx: number) => (
                <div key={lIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                      {(lec.l || 'L').charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-slate-800">{lec.l}</p>
                      <p className="text-[11px] text-slate-400">{lec.c} Active Courses</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600">{lec.e}</span>
                    <p className="text-[10px] text-slate-400">{lec.comp} completions</p>
                  </div>
                </div>
              ))}

              {topLecturers.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No faculty records found.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/admin/reports"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center justify-between group cursor-pointer"
            >
              <span>View institutional research data</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Administrative Nav Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <Link
          href="/admin/users"
          className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-800 group-hover:text-red-600 transition-colors">User Management</h4>
          <p className="text-xs text-slate-500 mt-1">Manage student, lecturer, and administrative roles & security.</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-blue-600 gap-1">
            <span>Open directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/admin/courses"
          className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-800 group-hover:text-red-600 transition-colors">Course Governance</h4>
          <p className="text-xs text-slate-500 mt-1">Audit curriculums, lesson modules, drafts, and enrollments.</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-emerald-600 gap-1">
            <span>Open catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/admin/analytics"
          className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BarChart2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-800 group-hover:text-red-600 transition-colors">Learning Analytics ⭐</h4>
          <p className="text-xs text-slate-500 mt-1">Deep interactive video, quiz attempt, and student drop-off metrics.</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-purple-600 gap-1">
            <span>Launch engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/admin/reports"
          className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-800 group-hover:text-red-600 transition-colors">System Reports</h4>
          <p className="text-xs text-slate-500 mt-1">Export raw academic research data and comprehensive institutional audit logs.</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-orange-600 gap-1">
            <span>Export data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
