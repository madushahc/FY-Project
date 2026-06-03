"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminUserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchUsers = async () => {
        try {
           const res = await api.get('/users');
           setUsers(res.data);
        } catch (err) {
           console.error("Failed to load users", err);
        }
        setLoading(false);
     };
     fetchUsers();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
         <h2 className="text-2xl font-semibold text-slate-800">User Management</h2>
         
         {/* Note: + Add User is shown in the screenshot in the Top Nav area, but putting it contextually here makes better sense for the component layout assuming TopNav is global */}
         <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm w-max">
            + Add User
         </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
               <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-5 pl-6 pr-4">User</th>
                  <th className="py-5 px-4 w-32">Role</th>
                  <th className="py-5 px-4">Department</th>
                  <th className="py-5 px-4 w-28">Status</th>
                  <th className="py-5 px-4">Joined</th>
                  <th className="py-5 pr-6 pl-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                  <tr>
                     <td colSpan={6} className="py-12 text-center">
                        <div className="flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
                     </td>
                  </tr>
               ) : users.length === 0 ? (
                  <tr>
                     <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">No users found.</td>
                  </tr>
               ) : (
                  users.map(user => (
                     <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 pl-6 pr-4">
                           <div className="flex items-center gap-4">
                              <div className={`w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm`}>
                                 {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                 <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                                 <p className="text-[11px] text-slate-400 mt-0.5">{user.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-medium">
                           <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${
                              user.role === 'Student' ? 'bg-blue-50 text-blue-600' : 
                              user.role === 'Lecturer' ? 'bg-purple-50 text-purple-600' : 
                              'bg-red-50 text-red-600'
                           }`}>
                              {user.role}
                           </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600 font-medium">
                           {user.department || 'N/A'}
                        </td>
                        <td className="py-4 px-4">
                           <span className={`px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-600`}>
                              Active
                           </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-500 font-medium">
                           {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 pr-6 pl-4 text-right">
                           <button className="px-5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                              Edit
                           </button>
                        </td>
                     </tr>
                  ))
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
