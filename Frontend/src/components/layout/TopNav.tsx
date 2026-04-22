import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Star } from 'lucide-react';
import Link from 'next/link';

export default function TopNav({ pageName = "Dashboard", points = 1840, role = 'STUDENT' }: { pageName?: string, points?: number, role?: string }) {
   const [showNotifs, setShowNotifs] = useState(false);
   const notifRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
            setShowNotifs(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const notifications = [
      { type: 'award', icon: '🏆', title: 'Badge Unlocked!', desc: 'First Champion badge earned.', time: '2 min ago', read: false },
      { type: 'points', icon: '⭐', title: 'Points Awarded', desc: 'You earned 50 pts on DSA Quiz.', time: '1h ago', read: false },
      { type: 'grade', icon: '📝', title: 'Assignment Graded', desc: 'SE Assignment 2: 85/100.', time: '3h ago', read: false },
      { type: 'deadline', icon: '⏰', title: 'Deadline Reminder', desc: 'DBMS Report due tomorrow.', time: 'Yesterday', read: true },
      { type: 'enroll', icon: '📚', title: 'New Lesson Added', desc: 'Module 4 updated in DSA.', time: '2 days ago', read: true },
   ];

   return (
      <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
         <div className="flex items-center gap-4">
            <h2 className="text-xl font-medium text-slate-800">{pageName}</h2>
         </div>

         <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative w-64 hidden md:block">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input
                  type="text"
                  placeholder="Search courses, activities..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
               />
            </div>

            {/* Points Pill (only for Student) */}
            {role === 'STUDENT' && (
               <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full h-[36px]">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-blue-600">{points.toLocaleString()} XP</span>
                  <div className="w-8 h-1.5 bg-blue-200 rounded-full ml-1 overflow-hidden">
                     <div className="h-full bg-blue-600" style={{ width: '80%' }}></div>
                  </div>
               </div>
            )}

            {/* Notif */}
            <div className="relative" ref={notifRef}>
               <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 transition ${showNotifs ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
               >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>

               {/* Popup */}
               {showNotifs && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                     <div className="p-4 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                     </div>
                     <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                        {notifications.map((notif, i) => (
                           <div key={i} className={`p-4 flex gap-3 hover:bg-slate-50 transition relative ${!notif.read ? 'bg-blue-50/20' : ''}`}>
                              {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>}
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0">
                                 {notif.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-start mb-0.5">
                                    <h4 className={`text-xs font-bold truncate pr-2 ${!notif.read ? 'text-slate-800' : 'text-slate-700'}`}>{notif.title}</h4>
                                    {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1"></span>}
                                 </div>
                                 <p className="text-xs text-slate-500 mb-1 leading-tight">{notif.desc}</p>
                                 <span className="text-[10px] font-medium text-slate-400">{notif.time}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                     <div className="p-3 border-t border-slate-100 bg-slate-50">
                        <Link href={`/${role.toLowerCase()}/profile`} onClick={() => setShowNotifs(false)} className="w-full py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg flex items-center justify-center hover:bg-blue-100 transition">
                           View All Notifications →
                        </Link>
                     </div>
                  </div>
               )}
            </div>

            {/* Profile */}
            <Link href={`/${role.toLowerCase()}/profile`} className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 hover:ring-2 hover:ring-blue-500 transition cursor-pointer">
               <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${role}`} alt="avatar" className="w-full h-full object-cover" />
            </Link>
         </div>
      </header>
   );
}
