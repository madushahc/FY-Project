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

export default function MyProgress() {
  const barChartData = [
    { day: 'Mon', h: '35%' },
    { day: 'Tue', h: '50%' },
    { day: 'Wed', h: '45%' },
    { day: 'Thu', h: '75%' },
    { day: 'Fri', h: '60%' },
    { day: 'Sat', h: '85%' },
    { day: 'Sun', h: '70%' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">My Progress</h2>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Completion Rate</p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">68%</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ +8% this month</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Activities Done</p>
          <h3 className="text-3xl font-light text-blue-500 mb-2">42</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ 6 this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Avg Quiz Score</p>
          <h3 className="text-3xl font-light text-purple-500 mb-2">84%</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ +5%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Time Spent</p>
          <h3 className="text-3xl font-light text-orange-500 mb-2">24h</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ +3h this week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Overview */}
         <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-8">Engagement Overview</h3>
            <div className="flex flex-wrap justify-between gap-4 px-2">
               <DonutChart percentage={78} color="text-blue-600" label="Login Freq." subLabel="Login" />
               <DonutChart percentage={67} color="text-emerald-500" label="Task Rate" subLabel="Tasks" />
               <DonutChart percentage={84} color="text-purple-500" label="Quiz Score" subLabel="Quiz" />
               <DonutChart percentage={56} color="text-orange-500" label="Forum Activity" subLabel="Forum" />
               <DonutChart percentage={72} color="text-teal-500" label="Assignments" subLabel="Assign." />
            </div>
         </div>

         {/* Points Over Time */}
         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
            <h3 className="font-semibold text-slate-800 mb-8">Points Over Time</h3>
            <div className="flex-1 flex items-end justify-between gap-2 border-b border-slate-100 pb-2">
               {barChartData.map((bar) => (
                  <div key={bar.day} className="flex flex-col items-center w-full gap-2">
                     <div className="w-full bg-blue-500 rounded-t-lg transition hover:bg-blue-600 cursor-pointer" style={{ height: bar.h, minHeight: '10%' }}></div>
                     <span className="text-[10px] font-medium text-slate-500">{bar.day}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Course-by-Course Progress */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
         <h3 className="font-semibold text-slate-800 mb-8">Course-by-Course Progress</h3>
         <div className="space-y-6">
            {[
              { name: 'Web Technologies', progress: 92, color: 'bg-purple-500', bg: 'bg-purple-100', text: 'text-purple-600' },
              { name: 'Data Structures & Algorithms', progress: 78, color: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' },
              { name: 'Database Management Systems', progress: 55, color: 'bg-emerald-500', bg: 'bg-emerald-100', text: 'text-emerald-600' },
              { name: 'Software Engineering', progress: 34, color: 'bg-orange-500', bg: 'bg-orange-100', text: 'text-orange-600' },
            ].map((course) => (
              <div key={course.name} className="flex items-center gap-6">
                <span className="w-1/3 text-sm font-medium text-slate-700 truncate">{course.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className={`${course.color} h-2 rounded-full`} style={{ width: `${course.progress}%` }}></div>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${course.bg} ${course.text}`}>
                  {course.progress}%
                </div>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Learning Streak */}
         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-center">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              🔥 Learning Streak
            </h3>
            <div className="flex items-end gap-3">
               <span className="text-5xl font-light text-orange-500 leading-none">5</span>
               <div className="pb-1">
                  <p className="text-slate-700 font-medium">days in a row!</p>
                  <p className="text-xs text-slate-500">Keep going — 2 more days for a badge!</p>
               </div>
            </div>
         </div>

         {/* XP Progress */}
         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-center">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              ⭐ XP Progress
            </h3>
            <div className="flex justify-between items-end mb-2">
               <span className="text-slate-700 font-medium">Level 8 → Level 9</span>
               <span className="text-xs text-slate-500 font-medium">1,840 / 2,000 XP</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
         </div>
      </div>

    </div>
  );
}
