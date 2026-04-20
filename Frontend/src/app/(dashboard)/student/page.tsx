import React from 'react';
import Link from 'next/link';

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        {/* Abstract background shapes */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute right-32 bottom-0 w-48 h-48 bg-teal-200 opacity-20 rounded-full blur-2xl translate-y-1/4"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Kavitha! 👋</h1>
          <p className="text-blue-100 text-sm mb-6">You have 2 quizzes due today and 1 new badge unlocked!</p>
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
               🔥 5-day streak
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
               ⭐ 1,840 XP earned
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
               🏅 8 badges
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Points</p>
          <h3 className="text-3xl font-light text-blue-600 mb-2">1,840</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> +120 this week
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Badges Earned</p>
          <h3 className="text-3xl font-light text-orange-500 mb-2">8</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> 1 new badge
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Leaderboard Rank</p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">#3</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> Up 2 positions
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Courses Active</p>
          <h3 className="text-3xl font-light text-pink-500 mb-2">4</h3>
          <p className="text-red-400 text-xs font-medium">
            2 in progress
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-slate-800">Course Progress</h3>
              <Link href="/student/courses" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View all <span className="text-lg leading-none">→</span>
              </Link>
            </div>
            
            <div className="space-y-6">
              {[
                { name: 'Data Structures & Algorithms', progress: 78, color: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' },
                { name: 'Database Management Systems', progress: 55, color: 'bg-emerald-500', bg: 'bg-emerald-100', text: 'text-emerald-600' },
                { name: 'Web Technologies', progress: 92, color: 'bg-purple-500', bg: 'bg-purple-100', text: 'text-purple-600' },
                { name: 'Software Engineering', progress: 34, color: 'bg-orange-500', bg: 'bg-orange-100', text: 'text-orange-600' },
              ].map((course) => (
                <div key={course.name}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-slate-700">{course.name}</p>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${course.bg} ${course.text}`}>
                      {course.progress}%
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`${course.color} h-2 rounded-full`} style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-6">
          {/* Your Points Widget */}
          <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>⭐</span> Your Points
            </p>
            <h3 className="text-4xl font-light mb-1">1,840</h3>
            <p className="text-blue-100 text-xs mb-6">+120 this week • Level 8</p>
            
            <div>
              <div className="flex justify-between text-xs font-medium text-blue-100 mb-2">
                <span>Progress to Level 9</span>
                <span>1,840 / 2,000 XP</span>
              </div>
              <div className="w-full bg-blue-700/50 rounded-full h-1.5">
                <div className="bg-white h-1.5 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>

          {/* Top Learners List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <span>🏆</span> Top Learners
                </h3>
                <Link href="/student/leaderboard" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Full →
                </Link>
             </div>
             <div>
               {[
                 { rank: '🥇', name: 'Nimal Silva', score: '2,340', isMe: false, initial: 'N', color: 'bg-blue-600' },
                 { rank: '🥈', name: 'Suresh Bandara', score: '2,180', isMe: false, initial: 'S', color: 'bg-blue-600' },
                 { rank: '🥉', name: 'Kavitha (You)', score: '1,840', isMe: true, initial: 'K', color: 'bg-blue-600' },
                 { rank: '4', name: 'Amali Fernando', score: '1,720', isMe: false, initial: 'A', color: 'bg-blue-600' },
               ].map((learner, i) => (
                 <div key={i} className={`flex items-center justify-between p-3 px-5 border-b border-slate-50 last:border-0 ${learner.isMe ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-center text-sm font-bold ${learner.isMe ? 'text-blue-600' : 'text-slate-400'}`}>
                        {learner.rank}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${learner.color}`}>
                        {learner.initial}
                      </div>
                      <span className={`text-sm ${learner.isMe ? 'font-medium text-blue-700' : 'text-slate-600'}`}>
                        {learner.name} {learner.isMe && '✨'}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${learner.isMe ? 'text-blue-600' : 'text-blue-500'}`}>
                      {learner.score}
                    </span>
                 </div>
               ))}
             </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
