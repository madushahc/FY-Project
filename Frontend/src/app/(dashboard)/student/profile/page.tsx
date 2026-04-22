"use client";

import React, { useState } from 'react';
import { User, Bell, Edit3, LogOut, ChevronRight, CheckCircle2, Award, Clock, FileText, Target, BookOpen, MessageSquare } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Personal Info');

  const notifications = [
    { type: 'award', icon: '🏆', title: 'Badge Unlocked — First Champion!', desc: "You've reached the Top 3 on the leaderboard. +120 bonus XP awarded.", time: '2 min ago', xp: '+120', read: false },
    { type: 'points', icon: '⭐', title: 'Points Awarded — DSA Quiz Complete', desc: 'You scored 90% on Sorting Algorithms Quiz and earned 50 points.', time: '1 hour ago', xp: '+50', read: false },
    { type: 'grade', icon: '📝', title: 'Assignment Graded — SE Assignment 2', desc: 'Dr. Rajapaksa has graded your UML Class Diagram. Score: 85/100.', time: '3 hours ago', tag: '85/100', read: false },
    { type: 'enroll', icon: '📚', title: 'Enrollment Confirmed — Web Technologies', desc: "You're now enrolled in CS303 Web Technologies. Classes start Jan 27.", time: 'Yesterday', read: true },
    { type: 'deadline', icon: '⏰', title: 'Deadline Reminder — DBMS Assignment', desc: 'DBMS Normalization Report is due tomorrow at 11:59 PM. Submit on time for +100 pts.', time: 'Yesterday', tag: 'Due Tomorrow', warning: true, read: true },
    { type: 'rank', icon: '📈', title: 'Rank Changed — You moved up!', desc: 'Great work! Your leaderboard rank improved from #5 to #3 this week.', time: '2 days ago', tag: '#3 ▲', purple: true, read: true },
    { type: 'quiz', icon: '📝', title: 'Quiz Result — Binary Trees Quiz', desc: 'You passed with 78%. Review your answers to improve. 40 pts earned.', time: '2 days ago', xp: '+40', read: true },
    { type: 'announce', icon: '📢', title: 'Announcement — Course Update', desc: 'Dr. Rajapaksa added 3 new lessons to Module 4 of Data Structures.', time: '3 days ago', read: true },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-20 mt-2 flex flex-col h-full overflow-hidden">
      
      {/* Banner */}
      <div className="w-full h-48 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-sm">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <h1 className="text-xl font-medium opacity-90 relative">Manage your account, preferences and security settings</h1>
         
         <div className="flex items-end gap-5 relative">
            <div className="w-24 h-24 rounded-full bg-[#2A61D8] border-4 border-white flex items-center justify-center text-4xl font-bold shadow-sm z-10 text-white">
               K
            </div>
            <div className="mb-2">
               <h2 className="text-2xl font-bold">Kavitha Perera</h2>
               <p className="text-blue-100 text-sm mb-2 opacity-90">Student · NSBM Green University</p>
               <div className="flex gap-2 text-xs font-bold">
                  <div className="px-3 py-1 bg-white text-blue-600 rounded-full flex items-center gap-1 shadow-sm">
                     Level 8 <span>⭐</span>
                  </div>
                  <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full shadow-sm">
                     1,840 XP
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
                           <input type="text" defaultValue="Kavitha Perera" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700">Email Address</label>
                           <input type="email" defaultValue="k.perera@nsbm.lk" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700">Index Number</label>
                           <input type="text" defaultValue="CSC/21/001" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700">Department</label>
                           <input type="text" defaultValue="Faculty of Computing" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
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
                     {notifications.map((notif, idx) => (
                        <div key={idx} className={`p-5 flex gap-4 hover:bg-slate-50 transition relative ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                           {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                           
                           <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 bg-slate-100">
                              {notif.icon}
                           </div>
                           
                           <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                 <h4 className={`text-sm font-bold flex items-center gap-2 ${!notif.read ? 'text-slate-800' : 'text-slate-700'}`}>
                                    {notif.title}
                                    {!notif.read && <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>}
                                 </h4>
                                 <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
                              </div>
                              
                              <p className="text-sm text-slate-600 mb-2 leading-relaxed">{notif.desc}</p>
                              
                              {(notif.xp || notif.tag) && (
                                 <div className="flex gap-2">
                                    {notif.xp && <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-orange-100 text-orange-600">{notif.xp}</span>}
                                    {notif.tag && (
                                       <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                                          notif.warning ? 'bg-amber-100 text-amber-700' :
                                          notif.purple ? 'bg-purple-100 text-purple-700' :
                                          'bg-emerald-100 text-emerald-700'
                                       }`}>
                                          {notif.tag}
                                       </span>
                                    )}
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            
         </div>
      </div>
    </div>
  );
}
