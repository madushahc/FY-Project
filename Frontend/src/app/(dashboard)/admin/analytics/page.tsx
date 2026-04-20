import React from 'react';

export default function AdminAnalytics() {
  const chartBars = [
    { label: 'Jan 20', color: 'bg-blue-500', height: '55%' },
    { label: 'Jan 22', color: 'bg-emerald-500', height: '80%' },
    { label: 'Jan 24', color: 'bg-blue-500', height: '65%' },
    { label: 'Jan 26', color: 'bg-emerald-500', height: '85%' },
    { label: 'Jan 28', color: 'bg-purple-500', height: '75%' },
    { label: 'Jan 30', color: 'bg-blue-500', height: '50%' },
    { label: 'Feb 1', color: 'bg-orange-500', height: '70%' },
    { label: 'Feb 3', color: 'bg-emerald-500', height: '90%' },
  ];

  const students = [
    { id: 1, name: 'Nimal Silva', completion: '95%', avg: '98%', pts: '2,340', active: 'Today', status: 'Active' },
    { id: 2, name: 'Kavitha Perera', completion: '78%', avg: '84%', pts: '1,840', active: 'Today', status: 'Active' },
    { id: 3, name: 'Amali Fernando', completion: '35%', avg: '52%', pts: '720', active: '5 days ago', status: 'At Risk' },
    { id: 4, name: 'Dilshan Jayasena', completion: '68%', avg: '75%', pts: '1,650', active: 'Yesterday', status: 'Active' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
         <h2 className="text-2xl font-semibold text-slate-800">Platform Analytics</h2>
         
         <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 focus:outline-none w-max shadow-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This Year</option>
         </select>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Activities</p>
          <h3 className="text-3xl font-light text-blue-600 mb-2">4,284</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ +342 this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Badges Awarded</p>
          <h3 className="text-3xl font-light text-orange-400 mb-2">1,247</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ +88 this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Points Distributed</p>
          <h3 className="text-3xl font-light text-purple-500 mb-2">284k</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ 18k this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Avg Engagement</p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">78%</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">▲ +5%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Chart Section */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-start mb-8">
               <h3 className="font-semibold text-slate-800">Engagement vs Completion Rate</h3>
               <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-md">Last 30 days</span>
            </div>
            
            {/* Simple Bar Chart Implementation */}
            <div className="flex-1 flex items-end justify-between gap-1 sm:gap-4 border-b border-slate-100 pb-2 px-2 min-h-[200px]">
               {chartBars.map((bar, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 gap-3">
                     <div className={`w-full max-w-[40px] rounded-t-lg transition hover:brightness-95 cursor-pointer ${bar.color}`} style={{ height: bar.height, minHeight: '10%' }}></div>
                     <span className="text-[10px] font-medium text-slate-400">{bar.label}</span>
                  </div>
               ))}
            </div>
            
            <div className="flex items-center gap-6 mt-6 px-2 text-xs font-medium text-slate-500">
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Engagement</div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Completion</div>
            </div>
         </div>

         {/* Top Courses Section */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-8">Top Courses by Completion</h3>
            <div className="space-y-6">
               {[
                 { name: 'Web Technologies', progress: 91, color: 'bg-emerald-500', text: 'text-emerald-600' },
                 { name: 'Data Structures', progress: 72, color: 'bg-blue-500', text: 'text-blue-600' },
                 { name: 'DBMS', progress: 58, color: 'bg-purple-500', text: 'text-purple-600' },
                 { name: 'Software Eng.', progress: 45, color: 'bg-orange-500', text: 'text-orange-600' },
               ].map((course) => (
                 <div key={course.name}>
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-medium text-slate-700">{course.name}</span>
                     <span className={`text-xs font-bold ${course.text}`}>{course.progress}%</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-2">
                     <div className={`${course.color} h-2 rounded-full`} style={{ width: `${course.progress}%` }}></div>
                   </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Student Performance Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
         <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Student Performance Overview</h3>
            <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition whitespace-nowrap hidden sm:block">
               Export CSV ↓
            </button>
         </div>
         <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
               <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 pl-6 pr-4">Student</th>
                  <th className="py-4 px-4 w-28">Completion</th>
                  <th className="py-4 px-4 w-28">Avg Quiz</th>
                  <th className="py-4 px-4 w-28">Points</th>
                  <th className="py-4 px-4 w-40">Last Active</th>
                  <th className="py-4 px-6 text-right">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {students.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                     <td className="py-4 pl-6 pr-4">
                        <p className="text-sm font-medium text-slate-800">{student.name}</p>
                     </td>
                     <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                        {student.completion}
                     </td>
                     <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                        {student.avg}
                     </td>
                     <td className="py-4 px-4 text-sm font-medium text-blue-600">
                        {student.pts}
                     </td>
                     <td className="py-4 px-4 text-sm font-medium text-slate-500">
                        {student.active}
                     </td>
                     <td className="py-4 px-6 text-right">
                        <span className={`px-4 py-1.5 text-xs font-bold rounded-full inline-block ${
                           student.status === 'Active' ? 'bg-emerald-100/50 text-emerald-600' : 'bg-red-50 text-red-500'
                        }`}>
                           {student.status}
                        </span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
