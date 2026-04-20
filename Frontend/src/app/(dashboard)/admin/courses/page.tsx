import React from 'react';

export default function AdminAllCourses() {
  const courses = [
    { id: 1, title: 'Data Structures & Algorithms', code: 'CS301', lecturer: 'Dr. Rajapaksa', dept: 'Computing', students: 52, progress: 72, color: 'bg-blue-500', status: 'Published' },
    { id: 2, title: 'Database Management Systems', code: 'CS302', lecturer: 'Dr. Rajapaksa', dept: 'Computing', students: 48, progress: 58, color: 'bg-emerald-500', status: 'Published' },
    { id: 3, title: 'Web Technologies', code: 'CS303', lecturer: 'Dr. Silva', dept: 'Computing', students: 45, progress: 91, color: 'bg-purple-500', status: 'Published' },
    { id: 4, title: 'Software Engineering', code: 'CS304', lecturer: 'Dr. Rajapaksa', dept: 'Computing', students: 47, progress: 0, color: 'bg-slate-200', status: 'Draft' },
    { id: 5, title: 'Business Analytics', code: 'BA201', lecturer: 'Dr. Peris', dept: 'Business', students: 38, progress: 66, color: 'bg-orange-500', status: 'Published' },
    { id: 6, title: 'Introduction to Programming', code: 'CS101', lecturer: 'Dr. Kumar', dept: 'Computing', students: 68, progress: 100, color: 'bg-emerald-500', status: 'Archived' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">All Courses</h2>

      {/* Top Header Row with Metrics and Actions */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-6">
         
         <div className="flex flex-wrap gap-4 flex-1">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Courses</p>
               <h3 className="text-3xl font-light text-blue-600 mb-2">18</h3>
               <p className="text-emerald-500 text-xs font-medium">6 in development</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Published</p>
               <h3 className="text-3xl font-light text-emerald-500 mb-2">12</h3>
               <p className="text-emerald-500 text-xs font-medium">actively running</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Draft</p>
               <h3 className="text-3xl font-light text-orange-400 mb-2">4</h3>
               <p className="text-emerald-500 text-xs font-medium">awaiting publish</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Archived</p>
               <h3 className="text-3xl font-light text-slate-600 mb-2">2</h3>
               <p className="text-emerald-500 text-xs font-medium">completed courses</p>
            </div>
         </div>

         <div className="flex items-center gap-3 pt-2">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm whitespace-nowrap">
               + New Course
            </button>
            <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 focus:outline-none">
               <option>All Departments</option>
               <option>Computing</option>
               <option>Business</option>
            </select>
         </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
               <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-5 pl-6 pr-4">Course</th>
                  <th className="py-5 px-4 w-20">Code</th>
                  <th className="py-5 px-4">Lecturer</th>
                  <th className="py-5 px-4">Dept</th>
                  <th className="py-5 px-4 text-center">Students</th>
                  <th className="py-5 px-4 w-40">Completion</th>
                  <th className="py-5 px-4 text-center">Status</th>
                  <th className="py-5 pr-6 pl-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {courses.map(course => (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                     <td className="py-4 pl-6 pr-4">
                        <p className="text-sm font-bold text-slate-800">{course.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{course.code}</p>
                     </td>
                     <td className="py-4 px-4 text-sm text-slate-500 font-medium">
                        {course.code}
                     </td>
                     <td className="py-4 px-4 text-sm text-slate-600 font-medium">
                        {course.lecturer}
                     </td>
                     <td className="py-4 px-4 text-sm text-slate-500 font-medium">
                        {course.dept}
                     </td>
                     <td className="py-4 px-4 text-sm text-slate-600 text-center font-medium">
                        {course.students}
                     </td>
                     <td className="py-4 px-4">
                        {course.progress > 0 ? (
                           <div className="flex items-center gap-3">
                              <div className="w-full bg-slate-100 rounded-full h-1.5 flex-1 max-w-[100px]">
                                 <div className={`${course.color} h-1.5 rounded-full`} style={{ width: `${course.progress}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-slate-400 w-8">{course.progress}%</span>
                           </div>
                        ) : (
                           <div className="w-8 border-b-2 border-slate-200 ml-2"></div>
                        )}
                     </td>
                     <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1.5 text-[10px] font-bold rounded-full ${
                           course.status === 'Published' ? 'bg-emerald-100/50 text-emerald-600' : 
                           course.status === 'Draft' ? 'bg-orange-100/50 text-orange-600' : 
                           'bg-slate-100 text-slate-500'
                        }`}>
                           {course.status}
                        </span>
                     </td>
                     <td className="py-4 pr-6 pl-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                              Edit
                           </button>
                           {course.status === 'Draft' ? (
                              <button className="px-4 py-1.5 bg-blue-600 border border-transparent rounded-lg text-xs font-bold text-white hover:bg-blue-700 transition">
                                 Publish
                              </button>
                           ) : (
                              <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                                 View
                              </button>
                           )}
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
