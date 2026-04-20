import React from 'react';
import { Search } from 'lucide-react';

export default function LecturerStudents() {
  const students = [
    { id: 1, name: 'Nimal Silva', pts: '2340', email: 'n.silva@uni.lk', courses: 3, score: '2,340', completion: 95, login: 'Today', status: 'Active', initial: 'N' },
    { id: 2, name: 'Kavitha Perera', pts: '1840', email: 'k.perera@uni.lk', courses: 4, score: '1,840', completion: 78, login: 'Today', status: 'Active', initial: 'K' },
    { id: 3, name: 'Suresh Bandara', pts: '2180', email: 's.bandara@uni.lk', courses: 3, score: '2,180', completion: 82, login: 'Yesterday', status: 'Active', initial: 'S' },
    { id: 4, name: 'Amali Fernando', pts: '720', email: 'a.fernando@uni.lk', courses: 2, score: '720', completion: 35, login: '2 days ago', status: 'At Risk', initial: 'A' },
    { id: 5, name: 'Dilshan Jayasena', pts: '1650', email: 'd.jayasena@uni.lk', courses: 3, score: '1,650', completion: 68, login: 'Yesterday', status: 'Active', initial: 'D' },
    { id: 6, name: 'Priya Wickramasinghe', pts: '1540', email: 'p.wick@uni.lk', courses: 2, score: '1,540', completion: 71, login: '3 days ago', status: 'Active', initial: 'P' },
  ];

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
                  placeholder="Search students..." 
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64 text-slate-700" 
               />
            </div>
            <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 focus:outline-none">
               <option>All Courses</option>
               <option>Data Structures</option>
               <option>Database Systems</option>
            </select>
         </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Students</p>
          <h3 className="text-3xl font-light text-blue-600">52</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active Today</p>
          <h3 className="text-3xl font-light text-emerald-500">18</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">At Risk</p>
          <h3 className="text-3xl font-light text-red-500">7</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Avg Score</p>
          <h3 className="text-3xl font-light text-purple-500">79%</h3>
        </div>
      </div>

      {/* Student Table */}
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
               {students.map(student => (
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
                        {student.courses} courses
                     </td>
                     <td className="py-4 px-4 text-sm text-blue-600 font-medium">
                        {student.score}
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
                        <button className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
                           View
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
