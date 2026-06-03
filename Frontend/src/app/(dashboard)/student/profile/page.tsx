"use client";

import React, { useState, useEffect } from 'react';
import { User, Bell, Edit3, LogOut, ChevronRight, CheckCircle2, Award, Clock, FileText, Target, BookOpen, MessageSquare } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import api from '@/lib/api';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const { user, initializeUser } = useUserStore();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    initializeUser();
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };
    fetchNotifications();
  }, [initializeUser]);

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-20 mt-2 flex flex-col h-full overflow-hidden">
      
      {/* Banner */}
      <div className="w-full h-48 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-sm">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <h1 className="text-xl font-medium opacity-90 relative">Manage your account, preferences and security settings</h1>
         
          <div className="flex items-end gap-5 relative">
            <div className="w-24 h-24 rounded-full bg-[#2A61D8] border-4 border-white flex items-center justify-center text-4xl font-bold shadow-sm z-10 text-white">
               {initials}
            </div>
            <div className="mb-2">
               <h2 className="text-2xl font-bold">{user?.name || 'Student Name'}</h2>
               <p className="text-blue-100 text-sm mb-2 opacity-90">{user?.role || 'Student'} · {user?.university || 'University'}</p>
               <div className="flex gap-2 text-xs font-bold">
                  <div className="px-3 py-1 bg-white text-blue-600 rounded-full flex items-center gap-1 shadow-sm">
                     Level {Math.floor((user?.points || 0) / 200) + 1} <span>⭐</span>
                  </div>
                  <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full shadow-sm">
                     {user?.points || 0} XP
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start pb-8">
         {/* Left Sidebar */}
         <div className="w-full lg:w-72 flex-shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col p-5 space-y-6 sticky top-4">
            <div>
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Account Settings</h3>
               <div className="space-y-1">
                  <button 
                    onClick={() => setActiveTab('Personal Info')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'Personal Info' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                     <User className="w-4 h-4" /> Personal Info
                  </button>
                  <button 
                    onClick={() => setActiveTab('Notifications')}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'Notifications' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                     <div className="flex items-center gap-3"><Bell className="w-4 h-4" /> Notifications</div>
                  </button>
               </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
               <button className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition">
                  Edit Profile
               </button>
               <button className="w-full py-2.5 bg-red-50 text-red-600 font-bold rounded-lg text-sm hover:bg-red-100 transition">
                  Logout
               </button>
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 w-full lg:w-auto space-y-6">
            
            {activeTab === 'Personal Info' && (
               <>
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                     <h3 className="font-bold text-slate-800 mb-6">Profile Photo</h3>
                     <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-[#2A61D8] text-white flex items-center justify-center text-3xl font-bold">K</div>
                        <div>
                           <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition mb-1">
                              Change Photo
                           </button>
                           <p className="text-xs text-slate-400">JPG, PNG or GIF · max 5MB</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700">Full Name</label>
                           <input type="text" defaultValue={user?.name || ''} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700">Email Address</label>
                           <input type="email" defaultValue={user?.email || ''} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700">University</label>
                           <input type="text" defaultValue={user?.university || ''} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700">Department</label>
                           <input type="text" defaultValue={user?.department || ''} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                     </div>

                     <div className="space-y-2 mb-8">
                        <label className="text-sm font-bold text-slate-700">Bio</label>
                        <textarea rows={4} defaultValue="Computer Science student passionate about algorithms and machine learning." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"></textarea>
                     </div>

                     <div className="flex gap-3">
                        <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition">Save Changes</button>
                        <button className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200 transition">Cancel</button>
                     </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                     <h3 className="font-bold text-slate-800 mb-4">Quick Stats</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                           <div className="text-3xl font-bold text-blue-600 mb-1">4</div>
                           <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Courses Enrolled</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 text-center">
                           <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
                           <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Assignments Submitted</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                           <div className="text-3xl font-bold text-blue-600 mb-1">8</div>
                           <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Quizzes Attempted</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 text-center">
                           <div className="text-3xl font-bold text-blue-600 mb-1">7</div>
                           <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Forum Posts</div>
                        </div>
                     </div>
                  </div>
               </>
            )}

            {activeTab === 'Notifications' && (
               <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="divide-y divide-slate-100">
                     {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 font-medium">You have no notifications.</div>
                     ) : (
                        notifications.map((notif, idx) => (
                           <div key={idx} className={`p-5 flex gap-4 hover:bg-slate-50 transition relative ${!notif.isRead ? 'bg-blue-50/30' : ''}`}>
                              {!notif.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                              
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 bg-slate-100">
                                 {notif.type === 'Assignment' ? '📝' : notif.type === 'Quiz' ? '⏳' : notif.type === 'Badge' ? '🏆' : '🔔'}
                              </div>
                              
                              <div className="flex-1">
                                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                    <h4 className={`text-sm font-bold flex items-center gap-2 ${!notif.isRead ? 'text-slate-800' : 'text-slate-700'}`}>
                                       {notif.title}
                                       {!notif.isRead && <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>}
                                    </h4>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                 </div>
                                 
                                 <p className="text-sm text-slate-600 mb-2 leading-relaxed">{notif.message}</p>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            )}
            
         </div>
      </div>
    </div>
  );
}
