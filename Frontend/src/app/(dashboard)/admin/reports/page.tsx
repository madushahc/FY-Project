"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('Course Performance');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');

  const getThirtyDaysAgo = () => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  };

  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getThirtyDaysAgo());
  const [endDate, setEndDate] = useState(getToday());

  const exportToCSV = (data: any[], headersMap: Record<string, string>, filename: string) => {
    if (!data || data.length === 0) return;
    const fields = Object.keys(headersMap);
    const csvRows = [];
    
    // Add header row
    csvRows.push(fields.map(f => headersMap[f]).join(','));
    
    // Add data rows
    for (const row of data) {
      const values = fields.map(field => {
        const val = row[field] !== undefined ? row[field] : '';
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join('\n'));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    window.print();
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/admin-reports', {
          params: { startDate, endDate }
        });
        setReportData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [startDate, endDate]);

  const navItems = [
    { title: 'Engagement Report', desc: 'Student activity & participation', icon: '📊' },
    { title: 'Gamification Report', desc: 'Points, badges & leaderboard', icon: '🏆' },
    { title: 'Course Performance', desc: 'Completion rates & quiz scores', icon: '📚' },
    { title: 'User Activity Report', desc: 'Login frequency & time spent', icon: '👥' },
  ];

  const renderCoursePerformance = () => {
    if (loading || !reportData) return <div className="p-12 text-center text-slate-500">Loading...</div>;
    const { courses, metrics } = reportData.coursePerformance;

    // Dynamically derive departments from the courses list
    const uniqueDepartments = Array.from(
      new Set([
        'All Departments',
        ...courses
          .map((c: any) => c.dept)
          .filter((dept: any): dept is string => !!dept && typeof dept === 'string' && dept.trim() !== '')
      ])
    );

    const filteredCourses = courses.filter((c: any) => {
      if (deptFilter === 'All Departments') return true;
      return c.dept?.toLowerCase().includes(deptFilter.toLowerCase());
    });

    const filteredMetrics = {
      totalCourses: filteredCourses.length,
      draftCourses: filteredCourses.filter((c: any) => c.status === 'Draft').length,
      totalEnrollments: filteredCourses.reduce((acc: number, c: any) => acc + (c.enrolled || 0), 0),
      avgCompletion: filteredCourses.length > 0 ? Math.round(filteredCourses.reduce((acc: number, c: any) => acc + (c.completion || 0), 0) / filteredCourses.length) : 0,
      avgQuizScore: (() => {
        const scores = filteredCourses
          .map((c: any) => parseInt(c.avgQuiz))
          .filter((s: number) => !isNaN(s));
        return scores.length > 0 ? Math.round(scores.reduce((acc: number, s: number) => acc + s, 0) / scores.length) : 0;
      })()
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2 mb-1">
                 <span>📚</span> Course Performance Report
              </h2>
              <p className="text-sm text-slate-500 font-medium ml-8">
                {deptFilter === 'All Departments' ? 'All Departments' : deptFilter} · Filtered Range
              </p>
           </div>
           <div className="flex items-center gap-3">
              <select
                 value={deptFilter}
                 onChange={e => setDeptFilter(e.target.value)}
                 className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
              >
                 {uniqueDepartments.map((dept: any) => (
                   <option key={dept} value={dept}>{dept}</option>
                 ))}
              </select>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 shadow-sm">
                 Range: {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()}
              </span>
           </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">Total Courses</p>
             <h3 className="text-2xl font-light text-blue-600 mb-1">{filteredMetrics.totalCourses}</h3>
             <p className="text-emerald-500 text-[10px] font-bold">{filteredMetrics.draftCourses} in draft</p>
           </div>
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">Avg Completion</p>
             <h3 className="text-2xl font-light text-emerald-500 mb-1">{filteredMetrics.avgCompletion}%</h3>
             <p className="text-slate-500 text-[10px] font-medium">Across filtered courses</p>
           </div>
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">Total Enrollments</p>
             <h3 className="text-2xl font-light text-purple-500 mb-1">{filteredMetrics.totalEnrollments}</h3>
             <p className="text-slate-500 text-[10px] font-medium">Filtered registrations</p>
           </div>
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">Avg Quiz Score</p>
             <h3 className="text-2xl font-light text-orange-500 mb-1">{filteredMetrics.avgQuizScore}%</h3>
             <p className="text-slate-500 text-[10px] font-medium">From student attempts</p>
           </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden">
           <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2"><span>📊</span> Completion Rate by Course</h3>
           <div className="space-y-4">
              {filteredCourses.map((course: any, i: number) => (
                <div key={`${course.course}-${i}`} className="flex items-center gap-4">
                  <span className="w-1/3 text-xs font-semibold text-slate-600 truncate">{course.course}</span>
                  <div className="flex-1 bg-slate-100 rounded-md h-2.5">
                    <div className={`${course.color} h-2.5 rounded-md`} style={{ width: `${course.completion}%` }}></div>
                  </div>
                  <span className={`text-xs font-bold w-8 text-right ${course.text}`}>{course.completion}%</span>
                </div>
              ))}
           </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-100">
               <h3 className="font-semibold text-slate-800">Course-by-Course Breakdown</h3>
               <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const courseHeaders = {
                        course: 'Course Name',
                        dept: 'Department',
                        lecturer: 'Lecturer',
                        enrolled: 'Enrolled Students',
                        completion: 'Completion Rate (%)',
                        avgQuiz: 'Average Quiz Score',
                        status: 'Status'
                      };
                      exportToCSV(filteredCourses, courseHeaders, 'course_performance.csv');
                    }}
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm whitespace-nowrap"
                  >
                    Export CSV
                  </button>
               </div>
            </div>
           <div className="w-full overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                   <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 pl-6 pr-4">Course</th><th className="py-4 px-4">Lecturer</th>
                      <th className="py-4 px-4 text-center">Enrolled</th><th className="py-4 px-4">Completion</th>
                      <th className="py-4 px-4 text-center">Avg Quiz</th><th className="py-4 pr-6 pl-4 text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {filteredCourses.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                         <td className="py-4 pl-6 pr-4 text-sm font-bold text-slate-800 whitespace-nowrap">{row.course}</td>
                         <td className="py-4 px-4 text-sm font-medium text-slate-600 whitespace-nowrap">{row.lecturer}</td>
                         <td className="py-4 px-4 text-sm font-medium text-slate-600 text-center">{row.enrolled}</td>
                         <td className="py-4 px-4 min-w-[120px]">
                            <div className="flex items-center gap-2">
                               <div className="w-full bg-slate-100 rounded-full h-1.5"><div className={`${row.color} h-1.5 rounded-full`} style={{ width: `${row.completion}%` }}></div></div>
                               <span className={`text-[11px] font-bold ${row.text} w-6`}>{row.completion}%</span>
                            </div>
                         </td>
                         <td className="py-4 px-4 text-sm font-medium text-slate-600 text-center">{row.avgQuiz}</td>
                         <td className="py-4 pr-6 px-4 text-right"><span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-600">{row.status}</span></td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    );
  };

  const renderEngagementReport = () => {
    if (loading || !reportData) return <div className="p-12 text-center text-slate-500">Loading...</div>;
    const { metrics, dailyActiveUsers, topLecturers } = reportData.engagement;

     return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2 mb-1"><span>📊</span> Engagement Report</h2>
              <p className="text-sm text-slate-500 font-medium ml-8">Platform-wide · Filtered Range</p>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 shadow-sm">
                  Range: {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()}
               </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active Students</p>
               <h3 className="text-3xl font-bold text-blue-600 mb-1">{metrics.activeStudents}</h3>
               <p className="text-slate-500 text-xs font-medium">Registered students</p>
             </div>
             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Logins</p>
               <h3 className="text-3xl font-bold text-blue-600 mb-1">{metrics.totalLogins.toLocaleString()}</h3>
               <p className="text-slate-500 text-xs font-medium">Estimated logins</p>
             </div>
             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Avg Session</p>
               <h3 className="text-3xl font-bold text-blue-600 mb-1">{metrics.avgSession} min</h3>
               <p className="text-slate-500 text-xs font-medium">Average session duration</p>
             </div>
             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Completion Rate</p>
               <h3 className="text-3xl font-bold text-blue-600 mb-1">{metrics.completionRate}%</h3>
               <p className="text-slate-500 text-xs font-medium">Average student progress</p>
             </div>
          </div>

          <div className="bg-white border flex flex-col border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6">
             <h3 className="font-semibold text-slate-800 mb-6">Daily Active Users</h3>
             <div className="flex-1 flex items-end gap-2 h-48 relative">
               {dailyActiveUsers.map((bar: any, i: number) => (
                 <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                    <div className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors" style={{ height: `${bar.v}%` }}></div>
                    {bar.d && <span className="absolute -bottom-6 text-[10px] font-medium text-slate-400">{bar.d}</span>}
                 </div>
               ))}
             </div>
             <div className="h-6"></div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden w-full">
             <div className="p-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Top Performing Lecturers</h3>
             </div>
             <div className="overflow-x-auto w-full">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white border-b border-slate-100">
                     <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-4 pl-6 pr-4">Lecturer</th>
                        <th className="py-4 px-4">Courses</th>
                        <th className="py-4 px-4">Avg Engagement</th>
                        <th className="py-4 px-4">Completions</th>
                        <th className="py-4 pr-6 pl-4">Badges Given</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {topLecturers.map((row: any, i: number) => (
                       <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 pl-6 pr-4 font-bold text-slate-800">{row.l}</td>
                          <td className="py-4 px-4 text-slate-600">{row.c}</td>
                          <td className="py-4 px-4 font-bold text-blue-600">{row.e}</td>
                          <td className="py-4 px-4 text-slate-600">{row.comp}</td>
                          <td className="py-4 pr-6 pl-4 text-slate-600">{row.bg}</td>
                       </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>

           <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={downloadPDF}
                className="px-4 py-2 border border-slate-200 bg-white text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
              >
                📥 Download PDF
              </button>
              <button 
                onClick={() => {
                  const lecturerHeaders = {
                    l: 'Lecturer Name',
                    c: 'Courses Taught',
                    e: 'Average Engagement',
                    comp: 'Course Completions',
                    bg: 'Badges Given'
                  };
                  exportToCSV(topLecturers, lecturerHeaders, 'lecturer_engagement.csv');
                }}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
              >
                📊 Export CSV
              </button>
           </div>
        </div>
     );
  };

  const renderGamificationReport = () => {
    if (loading || !reportData) return <div className="p-12 text-center text-slate-500">Loading...</div>;
    const { metrics, pointsDistribution, recentBadges } = reportData.gamification;

     return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 min-w-0">
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2 mb-1"><span>🏆</span> Gamification Report</h2>
              <p className="text-sm text-slate-500 font-medium ml-8">Platform-wide · Filtered Range</p>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 shadow-sm font-medium">
                  Range: {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()}
               </span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Total Points Awarded</p>
               <h3 className="text-3xl font-light text-blue-600 mb-1">{metrics.totalPoints.toLocaleString()}</h3>
               <p className="text-slate-500 text-[10px] font-medium">XP accumulated by students</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Badges Awarded</p>
               <h3 className="text-3xl font-light text-orange-500 mb-1">{metrics.badgesAwarded.toLocaleString()}</h3>
               <p className="text-slate-500 text-[10px] font-medium">Total badges earned</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Active Leaderboard Players</p>
               <h3 className="text-3xl font-light text-emerald-500 mb-1">{metrics.activePlayers}</h3>
               <p className="text-slate-500 text-[10px] font-medium">Active students participating</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Avg XP Per Student</p>
               <h3 className="text-3xl font-light text-purple-600 mb-1">{metrics.avgXp}</h3>
               <p className="text-slate-500 text-[10px] font-medium">Average student XP level</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white border rounded-xl p-5"><h4 className="font-bold mb-4">⭐ Points Distribution by Activity</h4>
                <div className="space-y-4">
                   {pointsDistribution.map((item: any) => (
                      <div key={item.n} className="flex justify-between items-center text-sm">
                         <span className="w-24 text-slate-600">{item.n}</span>
                         <div className="flex-1 mx-4 bg-slate-100 h-2 rounded-full"><div className={`h-2 rounded-full ${item.c}`} style={{width:`${item.p}%`}}></div></div>
                         <span className={`w-8 font-bold ${item.t}`}>{item.p}%</span>
                      </div>
                   ))}
                </div>
             </div>
             <div className="bg-white border rounded-xl p-5"><h4 className="font-bold mb-4">🏅 Badges Awarded This Month</h4>
                <div className="space-y-3">
                   {recentBadges.map((b: any,i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                         <span className="text-slate-600">{b.n}</span><span className={`font-bold ${b.c}`}>{b.v}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
     );
  };

  const renderUserActivityReport = () => {
    if (loading || !reportData) return <div className="p-12 text-center text-slate-500">Loading...</div>;
    const { metrics, users } = reportData.userActivity;

    const filteredUsers = users.filter((u: any) => 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
    );

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 min-w-0">
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2 mb-1"><span>👥</span> User Activity Report</h2>
              <p className="text-sm text-slate-500 font-medium ml-8">Platform-wide · Filtered Range</p>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 shadow-sm font-medium">
                  Range: {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()}
               </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Total Users</p>
               <h3 className="text-3xl font-light text-blue-600 mb-1">{metrics.totalUsers}</h3>
               <p className="text-slate-500 text-[10px] font-medium">Registered user base</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Active Users</p>
               <h3 className="text-3xl font-light text-emerald-500 mb-1">{metrics.activeUsers}</h3>
               <p className="text-slate-500 text-[10px] font-medium">Active platform members</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-slate-100">
               <p className="text-slate-500 text-[9px] font-bold uppercase mb-2">Total Logins</p>
               <h3 className="text-3xl font-light text-purple-600 mb-1">{metrics.totalLogins.toLocaleString()}</h3>
               <p className="text-slate-500 text-[10px] font-medium">Logins recorded</p>
             </div>
          </div>
          
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
             <div className="bg-blue-600 flex justify-between items-center px-5 py-3">
                <h4 className="text-white font-bold text-sm">Individual User Activity</h4>
                <div className="flex gap-2">
                   <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="bg-blue-800 text-white placeholder:text-blue-300 text-xs px-3 py-1.5 rounded-lg border-none outline-none" 
                   />
                   <button 
                      onClick={() => {
                        const userHeaders = {
                          name: 'User Name',
                          email: 'Email',
                          role: 'Role',
                          logins: 'Login Count',
                          avgSession: 'Average Session Duration',
                          lastLogin: 'Last Login',
                          timeSpent: 'Total Time Spent',
                          status: 'Status'
                        };
                        exportToCSV(filteredUsers, userHeaders, 'user_activity.csv');
                      }}
                      className="bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                   >
                     Export CSV
                   </button>
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-200">
                     <tr><th className="py-3 px-5">User</th><th className="py-3 px-3">Role</th><th className="py-3 px-3">Logins</th><th className="py-3 px-3">Avg Session</th><th className="py-3 px-3">Last Login</th><th className="py-3 px-3">Time Spent</th><th className="py-3 px-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-6 text-slate-500 text-sm">No users match your query</td>
                        </tr>
                     ) : (
                        filteredUsers.map((u: any, i: number) => (
                           <tr key={i} className="hover:bg-slate-50">
                              <td className="py-3 px-5"><div className="font-bold text-slate-800">{u.name}</div><div className="text-[10px] text-slate-500">{u.email}</div></td>
                              <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${u.role === 'Student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{u.role}</span></td>
                              <td className="py-3 px-3 font-bold text-slate-700">{u.logins}x</td><td className="py-3 px-3 text-slate-600">{u.avgSession}</td><td className="py-3 px-3 text-emerald-600 font-medium">{u.lastLogin}</td><td className="py-3 px-3 text-slate-600">{u.timeSpent}</td>
                              <td className="py-3 px-3"><span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">{u.status}</span></td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
             </div>
          </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 mt-2 flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <h2 className="text-2xl font-semibold text-slate-800">Reports</h2>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">From</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="w-px h-5 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">To</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start h-full pb-8">
         {/* Left Sidebar Menu */}
         <div className="w-full lg:w-72 flex-shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden sticky top-4">
            <div className="p-5 border-b border-slate-100">
               <h3 className="font-semibold text-slate-800">Report Types</h3>
            </div>
            <div className="flex flex-col">
               {navItems.map((item) => (
                  <button 
                     key={item.title}
                     onClick={() => setActiveTab(item.title)}
                     className={`text-left flex items-start gap-4 p-5 transition-colors border-b border-slate-100 last:border-0 ${
                        activeTab === item.title ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                     }`}
                  >
                     <span className={`text-2xl ${activeTab === item.title ? 'scale-110 transition-transform' : ''}`}>{item.icon}</span>
                     <div>
                        <h4 className={`font-semibold text-sm ${activeTab === item.title ? 'text-blue-700' : 'text-slate-700'}`}>{item.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">{item.desc}</p>
                     </div>
                  </button>
               ))}
            </div>
         </div>

         {/* Right Main Content */}
         <div className="flex-1 w-full lg:w-auto">
            {activeTab === 'Course Performance' && renderCoursePerformance()}
            {activeTab === 'Gamification Report' && renderGamificationReport()}
            {activeTab === 'User Activity Report' && renderUserActivityReport()}
            {activeTab === 'Engagement Report' && renderEngagementReport()}
         </div>
      </div>
    </div>
  );
}
