"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCourseStore } from '@/store/useCourseStore';
import api from '@/lib/api';
import Loading from '@/components/ui/Loading';

export default function LecturerActivities() {
   const router = useRouter();
   const { myCourses, fetchMyCreatedCourses } = useCourseStore();

   const [activities, setActivities] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   const fetchAllActivities = useCallback(async () => {
      if (myCourses.length === 0) {
         setLoading(false);
         return;
      }

      try {
         let compiledFeed: any[] = [];

         for (const course of myCourses) {
            // 1) Fetch Quizzes with submission stats
            try {
               const quizRes = await api.get(`/quizzes/course/${course._id}`);
               if (Array.isArray(quizRes.data)) {
                  const courseQuizzes = await Promise.all(quizRes.data.map(async (q: any) => {
                     let subs = '0 (0%)';
                     try {
                        const statsRes = await api.get(`/quizzes/${q._id}/stats`);
                        subs = `${statsRes.data.totalSubmissions || 0} (${statsRes.data.averageScore || 0}%)`;
                     } catch (e) { }

                     const hasDeadline = Boolean(q.deadline);
                     const isPastDue = hasDeadline && new Date(q.deadline) < new Date();

                     return {
                        id: `quiz_${q._id}`,
                        title: q.title,
                        type: 'Quiz',
                        course: course.title,
                        points: `+${q.totalPoints || 0}`,
                        due: hasDeadline
                           ? new Date(q.deadline).toLocaleDateString()
                           : (q.timeLimit ? `${q.timeLimit} mins` : 'No Deadline'),
                        subs,
                        status: isPastDue ? 'Past Due' : 'Active',
                        typeColor: 'bg-blue-50 text-blue-600',
                        statusColor: isPastDue ? 'bg-red-50 text-red-600' : 'bg-emerald-100/50 text-emerald-600',
                        difficultyLevel: q.difficultyLevel || 'Medium',
                        isFinalQuiz: Boolean(q.isFinalQuiz),
                        rawDate: q.createdAt
                     };
                  }));
                  compiledFeed = [...compiledFeed, ...courseQuizzes];
               }
            } catch (err) {
               console.error(`Failed to fetch quizzes for course ${course._id}`, err);
            }

            // 2) Fetch Assignments with submission stats
            try {
               const assignRes = await api.get(`/assignments/course/${course._id}`);
               if (Array.isArray(assignRes.data)) {
                  const courseAssignments = await Promise.all(assignRes.data.map(async (a: any) => {
                     let subs = '0 (0%)';
                     try {
                        const statsRes = await api.get(`/submissions/stats/${a._id}`);
                        subs = `${statsRes.data.totalSubmissions || 0} (${statsRes.data.averageScore || 0}%)`;
                     } catch (e) { }

                     const isPastDue = a.deadline ? new Date(a.deadline) < new Date() : false;

                     return {
                        id: `assn_${a._id}`,
                        title: a.title,
                        type: 'Assignment',
                        course: course.title,
                        points: `+${a.totalPoints || 0}`,
                        due: a.deadline ? new Date(a.deadline).toLocaleDateString() : 'No Deadline',
                        subs,
                        status: isPastDue ? 'Past Due' : 'Active',
                        typeColor: 'bg-orange-50 text-orange-600',
                        statusColor: isPastDue ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600',
                        rawDate: a.createdAt
                     };
                  }));
                  compiledFeed = [...compiledFeed, ...courseAssignments];
               }
            } catch (err) {
               console.error(`Failed to fetch assignments for course ${course._id}`, err);
            }
         }

         // Sort newest to oldest
         compiledFeed.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

         setActivities(compiledFeed);
      } catch (error) {
         console.error("Failed to load aggregated activities", error);
      } finally {
         setLoading(false);
      }
   }, [myCourses]);

   useEffect(() => {
      fetchMyCreatedCourses();
   }, [fetchMyCreatedCourses]);

   useEffect(() => {
      fetchAllActivities();

      const handleFocus = () => {
         fetchMyCreatedCourses();
         fetchAllActivities();
      };

      const intervalId = setInterval(() => {
         fetchAllActivities();
      }, 5000);

      window.addEventListener("focus", handleFocus);
      document.addEventListener("visibilitychange", handleFocus);

      return () => {
         window.removeEventListener("focus", handleFocus);
         document.removeEventListener("visibilitychange", handleFocus);
         clearInterval(intervalId);
      };
   }, [myCourses, fetchAllActivities, fetchMyCreatedCourses]);

   return (
      <div className="space-y-6 max-w-7xl mx-auto pb-20">
         {/* Header Area */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-2">
            <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
               <span>📝</span> Activity Management
            </h2>

            <div className="flex items-center gap-3">
               <button
                  onClick={() => router.push('/lecturer/quizzes/new')}
                  className="bg-slate-50 cursor-pointer border border-slate-200 text-slate-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition shadow-sm whitespace-nowrap"
               >
                  + New Quiz
               </button>
               <button
                  onClick={() => router.push('/lecturer/assignments/new')}
                  className="bg-slate-50 cursor-pointer border border-slate-200 text-slate-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition shadow-sm whitespace-nowrap"
               >
                  + Assignment
               </button>
            </div>
         </div>

         {/* Metrics Block - Abstract Logic */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active</p>
               <h3 className="text-3xl font-light text-emerald-500 mb-1">{activities.filter(a => a.status === 'Active').length}</h3>
               <p className="text-emerald-500 text-xs font-semibold">activities running</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Managed</p>
               <h3 className="text-3xl font-light text-blue-500 mb-1">{activities.length}</h3>
               <p className="text-blue-500 text-xs font-semibold">assignments & quizzes</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Submissions (Total)</p>
               <h3 className="text-3xl font-light text-blue-600 mb-1">
                  {activities.reduce((acc, a) => {
                     if (a.subs && a.subs !== 'N/A') {
                        const count = parseInt(a.subs.split(' ')[0]);
                        return acc + (isNaN(count) ? 0 : count);
                     }
                     return acc;
                  }, 0)}
               </h3>
               <p className="text-blue-500 text-xs font-semibold">total attempts & submissions</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Avg Score</p>
               <h3 className="text-3xl font-light text-emerald-500 mb-1">
                  {(() => {
                     let totalAvg = 0;
                     let count = 0;
                     activities.forEach(a => {
                        if (a.subs && a.subs !== 'N/A') {
                           const match = a.subs.match(/\((\d+)%\)/);
                           if (match) {
                              totalAvg += parseInt(match[1]);
                              count++;
                           }
                        }
                     });
                     return count > 0 ? `${Math.round(totalAvg / count)}%` : '--%';
                  })()}
               </h3>
               <p className="text-emerald-500 text-xs font-semibold">across all activities</p>
            </div>
         </div>

         {/* Activities Table */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            {loading ? (
               <Loading />
            ) : activities.length === 0 ? (
               <div className="text-center py-12 text-slate-500 font-medium">
                  No activities found. Create an assignment or quiz to see it here!
               </div>
            ) : (
               <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                     <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-5 pl-6 pr-4">Title</th>
                        <th className="py-5 px-4 text-center">Type</th>
                        <th className="py-5 px-4">Course</th>
                        <th className="py-5 px-4">Points</th>
                        <th className="py-5 px-4">Due</th>
                        <th className="py-5 px-4 text-center">Submissions</th>
                        <th className="py-5 px-4 text-center">Status</th>
                        <th className="py-5 pr-6 pl-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {activities.map((activity) => (
                        <tr key={activity.id} className="hover:bg-slate-50 transition-colors cursor-default">
                           <td className="py-5 pl-6 pr-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                 <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                                 {activity.isFinalQuiz && (
                                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-purple-100 text-purple-700 border border-purple-200">
                                       🎓 Adaptive Final
                                    </span>
                                 )}
                              </div>
                           </td>
                           <td className="py-5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                 <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${activity.typeColor}`}>
                                    {activity.type}
                                 </span>
                                 {activity.type === 'Quiz' && (
                                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                                       activity.difficultyLevel === 'Easy'
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                          : activity.difficultyLevel === 'Hard'
                                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                                          : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                       {activity.difficultyLevel === 'Easy' ? '🌱 Easy' : activity.difficultyLevel === 'Hard' ? '🔥 Hard' : '⚡ Medium'}
                                    </span>
                                 )}
                              </div>
                           </td>
                           <td className="py-5 px-4 text-sm text-slate-500 font-medium whitespace-nowrap">
                              {activity.course}
                           </td>
                           <td className="py-5 px-4 text-sm font-bold text-blue-600">
                              {activity.points}
                           </td>
                           <td className="py-5 px-4 text-sm text-slate-500 font-medium whitespace-nowrap">
                              {activity.due}
                           </td>
                           <td className="py-5 px-4 text-sm text-slate-600 text-center font-medium">
                              {activity.subs}
                           </td>
                           <td className="py-5 px-4 text-center">
                              <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${activity.statusColor} whitespace-nowrap`}>
                                 {activity.status}
                              </span>
                           </td>
                           <td className="py-5 pr-6 pl-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 {activity.type === 'Assignment' ? (
                                    <button
                                       onClick={() => router.push(`/lecturer/assignments/${activity.id.replace('assn_', '')}/submissions`)}
                                       className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-transparent rounded-lg text-xs font-bold hover:bg-blue-100 transition whitespace-nowrap cursor-pointer"
                                    >
                                       Grade
                                    </button>
                                 ) : (
                                    <button
                                       disabled
                                       className="px-4 py-1.5 bg-slate-50 text-slate-400 border border-transparent rounded-lg text-xs font-bold cursor-not-allowed whitespace-nowrap"
                                    >
                                       Auto-Graded
                                    </button>
                                 )}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>
      </div>
   );
}
