"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Edit2, Trash2, X, Plus, Search, Filter } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    role: 'Student',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    university: 'NSBM Green University',
    department: 'Computing',
    phoneNumber: '',
    jobTitle: '',
    location: '',
    website: '',
    bio: ''
  });
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        api.get('/analytics/admin-reports'),
        api.get('/users')
      ]);
      setData(analyticsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  useEffect(() => {
     const init = async () => {
       await fetchDashboardData();
       setLoading(false);
     };
     init();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      role: 'Student',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      university: 'NSBM Green University',
      department: 'Computing',
      phoneNumber: '',
      jobTitle: '',
      location: '',
      website: '',
      bio: ''
    });
    setSubmitError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      role: user.role,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '', // Password is not required on edit
      university: user.university || 'NSBM Green University',
      department: user.department || 'Computing',
      phoneNumber: user.phoneNumber || '',
      jobTitle: user.jobTitle || '',
      location: user.location || '',
      website: user.website || '',
      bio: user.bio || ''
    });
    setSubmitError('');
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter((u: any) => u._id !== userId));
        // Refresh analytics counters
        const res = await api.get('/analytics/admin-reports');
        setData(res.data);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      if (editingUser) {
        // Edit flow
        const { password, ...updateData } = formData;
        // Include name
        const fullUpdate = {
          ...updateData,
          name: `${formData.firstName} ${formData.lastName}`
        };
        const res = await api.put(`/users/${editingUser._id}`, fullUpdate);
        setUsers(users.map((u: any) => u._id === editingUser._id ? res.data : u));
      } else {
        // Add flow
        const res = await api.post('/users', formData);
        setUsers([res.data, ...users]);
      }
      setIsModalOpen(false);
      // Refresh count details on the dashboard
      const res = await api.get('/analytics/admin-reports');
      setData(res.data);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to submit. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chart data height percentages and specific colors from the image
  const chartData = data?.engagement?.dailyActiveUsers?.map((d: any, idx: number) => {
     const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-indigo-400', 'bg-orange-400'];
     return { h: `${d.v}%`, color: colors[idx % colors.length] };
  }) || [];

  if (loading) {
     return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        {/* Abstract background shapes */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute right-32 bottom-0 w-48 h-48 bg-orange-300 opacity-20 rounded-full blur-2xl translate-y-1/4"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Admin Control Panel 🛠️</h1>
          <p className="text-red-100 text-sm mb-6">Platform-wide system overview • NSBM Green University</p>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                👥 {data?.userActivity?.metrics?.totalUsers || 0} Users
              </div>
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                📚 {data?.coursePerformance?.metrics?.totalCourses || 0} Courses
              </div>
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                ⚡ {data?.engagement?.metrics?.completionRate || 0}% Engagement
              </div>
            </div>

            <button 
              onClick={handleOpenAdd}
              className="bg-white hover:bg-slate-50 text-red-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow transition duration-250 cursor-pointer"
            >
              + Quick Add User
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Students</p>
          <h3 className="text-3xl font-light text-blue-500 mb-2">{data?.userActivity?.metrics?.totalUsers || 0}</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> 22 this month
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active Users</p>
          <h3 className="text-3xl font-light text-purple-500 mb-2">{data?.userActivity?.metrics?.activeUsers || 0}</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> 3 new
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Active Courses</p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">{data?.coursePerformance?.metrics?.totalCourses || 0}</h3>
          <p className="text-emerald-400 text-xs font-medium">
            {data?.coursePerformance?.metrics?.draftCourses || 0} in draft
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Platform Engagement</p>
          <h3 className="text-3xl font-light text-orange-400 mb-2">{data?.engagement?.metrics?.completionRate || 0}%</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> +5% this month
          </p>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-semibold text-slate-800">Platform-Wide Engagement</h3>
          <button className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-medium">
            Last 30 days
          </button>
        </div>

        <div className="h-64 flex items-end justify-between gap-2 px-2 pb-2">
          {chartData.map((bar: any, idx: number) => (
            <div
              key={idx}
              className={`w-full max-w-[40px] rounded-t-md ${bar.color} opacity-90 hover:opacity-100 transition-opacity cursor-pointer`}
              style={{ height: bar.h }}
            ></div>
          ))}
        </div>
      </div>

      {/* User Directory / Management Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg">User Directory</h3>
            <p className="text-xs text-slate-500 font-medium">Search and manage student, lecturer, and admin accounts</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-205 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 w-full sm:w-60"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-850 focus:outline-none focus:border-blue-500 bg-slate-50"
              >
                <option value="All">All Roles</option>
                <option value="Student">Students</option>
                <option value="Lecturer">Lecturers</option>
                <option value="Admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="border border-slate-100 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-4 pl-6 pr-4">User</th>
                <th className="py-4 px-4 w-32">Role</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Contact / Website</th>
                <th className="py-4 pr-6 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users
                .filter((u: any) => {
                  const matchQuery = 
                    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    u.department?.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchRole = roleFilter === 'All' || u.role === roleFilter;
                  return matchQuery && matchRole;
                })
                .map((u: any) => {
                  const initials = u.name?.charAt(0).toUpperCase() || 'U';
                  const roleColors = 
                    u.role === 'Student' ? 'bg-blue-55 text-blue-600' :
                    u.role === 'Lecturer' ? 'bg-purple-55 text-purple-600' :
                    'bg-red-55 text-red-600';
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            u.role === 'Student' ? 'bg-blue-600' : 
                            u.role === 'Lecturer' ? 'bg-purple-600' : 
                            'bg-red-600'
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{u.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${roleColors}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                        {u.department || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                        {u.role === 'Lecturer' && u.website ? (
                          <a href={u.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {u.website.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          u.phoneNumber || '—'
                        )}
                      </td>
                      <td className="py-3.5 pr-6 pl-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-medium">No users loaded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto text-left">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {editingUser ? 'Edit User Profile' : 'Quick Add User'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg text-center">
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                  >
                    <option value="Student">Student</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Department</label>
                  <input 
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">First Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Last Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Email Address</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              {!editingUser && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Password</label>
                  <input 
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">University</label>
                <input 
                  type="text"
                  required
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              {/* Dynamic inputs based on Role */}
              {formData.role === 'Student' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Phone Number</label>
                      <input 
                        type="text"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Location</label>
                      <input 
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Bio</label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50"
                    />
                  </div>
                </>
              )}

              {formData.role === 'Lecturer' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Job Title</label>
                      <input 
                        type="text"
                        placeholder="e.g. Senior Lecturer, Professor"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Website</label>
                      <input 
                        type="url"
                        placeholder="https://..."
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Phone Number</label>
                      <input 
                        type="text"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Location</label>
                      <input 
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Bio</label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50"
                    />
                  </div>
                </>
              )}

              {formData.role === 'Admin' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Job Title</label>
                      <input 
                        type="text"
                        placeholder="e.g. IT Administrator, System Admin"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Phone Number</label>
                      <input 
                        type="text"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Bio</label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-slate-50"
                    />
                  </div>
                </>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50 mt-4 cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : editingUser ? 'Save Profile' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
