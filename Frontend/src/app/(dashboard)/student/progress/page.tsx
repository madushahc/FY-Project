"use client";

import React from 'react';

// Custom lightweight SVG Donut Chart
function DonutChart({ percentage, color, label, subLabel }: { percentage: number, color: string, label: string, subLabel: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r={radius} 
            stroke="currentColor" strokeWidth="8" fill="transparent" 
            className="text-slate-100" 
          />
          {/* Foreground progress circle */}
          <circle 
            cx="50" cy="50" r={radius} 
            stroke="currentColor" strokeWidth="8" fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            className={color} 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-lg font-bold ${color}`}>{percentage}%</span>
          <span className="text-[10px] text-slate-500 font-medium">{subLabel}</span>
        </div>
      </div>
      <span className="text-xs text-slate-500 font-medium mt-2 text-center">{label}</span>
    </div>
  );
}

import { useCourseStore } from '@/store/useCourseStore';
import { useUserStore } from '@/store/useUserStore';

export default function MyProgress() {
  const { myEnrollments, fetchMyEnrollments } = useCourseStore();
  const { user, initializeUser } = useUserStore();

  React.useEffect(() => {
    fetchMyEnrollments();
    initializeUser();
  }, [fetchMyEnrollments, initializeUser]);

  const barChartData = [
    { day: 'Mon', h: '35%' },
    { day: 'Tue', h: '50%' },
    { day: 'Wed', h: '45%' },
    { day: 'Thu', h: '75%' },
    { day: 'Fri', h: '60%' },
    { day: 'Sat', h: '85%' },
    { day: 'Sun', h: '70%' },
  ];

  const totalCourses = myEnrollments.length;
  const avgCompletion = totalCourses > 0 ? Math.round(myEnrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / totalCourses) : 0;
  const totalCompletedLessons = myEnrollments.reduce((acc, e) => acc + (e.completedLessons?.length || 0), 0);
  
  const currentLevel = Math.floor((user?.points || 0) / 200) + 1;
  const nextLevel = currentLevel + 1;
  const xpInCurrentLevel = (user?.points || 0) % 200;
  const xpProgressPercent = (xpInCurrentLevel / 200) * 100;
  
  const courseColors = [
    { bg: 'bg-blue-100', text: 'text-blue-600', fill: 'bg-blue-500' },
    { bg: 'bg-purple-100', text: 'text-purple-600', fill: 'bg-purple-500' },
    { bg: 'bg-emerald-100', text: 'text-emerald-600', fill: 'bg-emerald-500' },
    { bg: 'bg-orange-100', text: 'text-orange-600', fill: 'bg-orange-500' },
    { bg: 'bg-pink-100', text: 'text-pink-600', fill: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">My Progress</h2>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Completion Rate</p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">{avgCompletion}%</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">Across {totalCourses} courses</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Points</p>
          <h3 className="text-3xl font-light text-blue-500 mb-2">{user?.points || 0}</h3>
          <p className="text-blue-500 text-xs font-medium flex items-center gap-1">Level {currentLevel}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Completed Lessons</p>
          <h3 className="text-3xl font-light text-purple-500 mb-2">{totalCompletedLessons}</h3>
          <p className="text-purple-500 text-xs font-medium flex items-center gap-1">Keep learning!</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active Courses</p>
          <h3 className="text-3xl font-light text-orange-500 mb-2">{myEnrollments.filter(e => e.progress !== 100).length}</h3>
          <p className="text-orange-500 text-xs font-medium flex items-center gap-1">In progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Overview */}
         <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-8">Engagement Overview</h3>
            <div className="flex flex-wrap justify-between gap-4 px-2">
               {myEnrollments.length === 0 ? (
                 <p className="text-sm text-slate-500 py-6 text-center w-full">Enroll in courses to see your engagement overview.</p>
               ) : (
                 myEnrollments.slice(0, 5).map((enrollment, index) => {
                   const colorObj = courseColors[index % courseColors.length];
                   return (
                     <DonutChart 
                       key={enrollment._id} 
                       percentage={enrollment.progress || 0} 
                       color={colorObj.text} 
                       label={enrollment.course.title.substring(0, 15) + "..."} 
                       subLabel="Progress" 
                     />
                   );
                 })
               )}
            </div>
         </div>

         {/* Points Over Time */}
         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
            <h3 className="font-semibold text-slate-800 mb-8">Points Over Time</h3>
             <div className="flex-1 flex items-center justify-center p-6 text-center border-t border-slate-50 pt-8 mt-2">
                <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs">
                  Your points chart will populate here once historical tracking is fully enabled. Keep completing lessons to earn XP!
                </p>
             </div>
         </div>
      </div>

      {/* Course-by-Course Progress */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
         <h3 className="font-semibold text-slate-800 mb-8">Course-by-Course Progress</h3>
         <div className="space-y-6">
            {myEnrollments.length === 0 ? (
               <div className="text-sm text-slate-500 text-center py-4">You are not enrolled in any courses yet.</div>
            ) : (
              myEnrollments.map((enrollment, index) => {
                 const courseData = enrollment.course || {};
                 const progress = enrollment.progress || 0;
                 const colorObj = courseColors[index % courseColors.length];
                 return (
                 <div key={enrollment._id || index} className="flex items-center gap-6">
                   <span className="w-1/3 text-sm font-medium text-slate-700 truncate">{courseData.title || 'Unknown Course'}</span>
                   <div className="flex-1 bg-slate-100 rounded-full h-2">
                     <div className={`${colorObj.fill} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
                   </div>
                   <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${colorObj.bg} ${colorObj.text}`}>
                     {progress}%
                   </div>
                 </div>
               )})
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Learning Streak */}
         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-center">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              🔥 Learning Streak
            </h3>
            <div className="flex items-end gap-3">
               <span className="text-5xl font-light text-orange-500 leading-none">{totalCompletedLessons > 0 ? 1 : 0}</span>
               <div className="pb-1">
                  <p className="text-slate-700 font-medium">days in a row!</p>
                  <p className="text-xs text-slate-500">Log in tomorrow to extend your streak.</p>
               </div>
            </div>
         </div>

         {/* XP Progress */}
         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-center">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              ⭐ XP Progress
            </h3>
            <div className="flex justify-between items-end mb-2">
               <span className="text-slate-700 font-medium">Level {currentLevel} → Level {nextLevel}</span>
               <span className="text-xs text-slate-500 font-medium">{user?.points || 0} / {currentLevel * 200} XP</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${xpProgressPercent}%` }}></div>
            </div>
         </div>
      </div>

    </div>
  );
}
