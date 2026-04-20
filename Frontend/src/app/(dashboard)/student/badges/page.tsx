import React from 'react';

export default function BadgeGallery() {
  const earnedBadges = [
    { title: 'First Champion', desc: 'Top 3 leaderboard', icon: '🏆', color: 'bg-orange-500' },
    { title: 'Speed Learner', desc: '5 lessons in 1 day', icon: '⚡', color: 'bg-blue-500' },
    { title: 'On Fire', desc: '5-day streak', icon: '🔥', color: 'bg-emerald-500' },
    { title: 'Quiz Master', desc: 'Perfect quiz score', icon: '🧠', color: 'bg-purple-500' },
    { title: 'Star Student', desc: '1000 XP earned', icon: '⭐', color: 'bg-yellow-500' },
    { title: 'Collaborator', desc: '10 forum posts', icon: '💬', color: 'bg-blue-400' },
    { title: 'Bookworm', desc: 'Complete a course', icon: '📚', color: 'bg-teal-500' },
    { title: 'On Target', desc: 'Submit on time 5x', icon: '🎯', color: 'bg-pink-500' },
  ];

  const lockedBadges = [
    { title: 'Rocket Learner', desc: 'Complete 3 courses', icon: '🚀' },
    { title: 'Diamond Coder', desc: '2000 XP earned', icon: '💎' },
    { title: 'Rank #1', desc: 'Top leaderboard', icon: '🥇' },
    { title: 'Graduate', desc: 'All courses done', icon: '🎓' },
  ];

  return (
    <div className="space-y-8">
      <div>
         <h2 className="text-2xl font-semibold text-slate-800 mb-1 flex items-center gap-2">
            <span>🏅</span> Badge Gallery
         </h2>
         <p className="text-slate-500 text-sm">8 earned • 4 locked</p>
      </div>

      {/* Earned Badges Section */}
      <div>
         <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Earned Badges</h3>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 xl:gap-6">
            {earnedBadges.map((badge, i) => (
               <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm ${badge.color}`}>
                     {badge.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">{badge.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{badge.desc}</p>
               </div>
            ))}
         </div>
      </div>

      {/* Locked Badges Section */}
      <div>
         <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Locked Badges</h3>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 xl:gap-6">
            {lockedBadges.map((badge, i) => (
               <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 bg-slate-200">
                     {badge.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">{badge.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{badge.desc}</p>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
