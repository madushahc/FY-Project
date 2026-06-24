"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Edit2, Trash2, X, Plus } from 'lucide-react';

export default function AdminUserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      password: '', // password not updated in this form
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

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
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
        const fullUpdate = {
          ...updateData,
          name: `${formData.firstName} ${formData.lastName}`
        };
        const res = await api.put(`/users/${editingUser._id}`, fullUpdate);
        setUsers(users.map(u => u._id === editingUser._id ? res.data : u));
      } else {
        // Add flow
        const res = await api.post('/users', formData);
        setUsers([res.data, ...users]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Action failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500 font-medium">Create, update, and remove student, lecturer, and admin accounts</p>
        </div>
        
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm w-max flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
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
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
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
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
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
                    <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-600">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-500 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-6 pl-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(user)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal Dialog */}
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
              {editingUser ? 'Edit User Profile' : 'Add New User'}
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Last Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
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
                {isSubmitting ? 'Saving changes...' : editingUser ? 'Save Profile' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
