import React from 'react';

export default function Leaderboard() {
  const leaderboardData = [
    { rank: '🥇', num: 1, name: 'Nimal Silva', score: '2,340', isMe: false, initial: 'N' },
    { rank: '🥈', num: 2, name: 'Suresh Bandara', score: '2,180', isMe: false, initial: 'S' },
    { rank: '🥉', num: 3, name: 'Kavitha Perera (You)', score: '1,840', isMe: true, initial: 'K' },
    { rank: '4', num: 4, name: 'Amali Fernando', score: '1,720', isMe: false, initial: 'A' },
    { rank: '5', num: 5, name: 'Dilshan Jayasena', score: '1,650', isMe: false, initial: 'D' },
    { rank: '6', num: 6, name: 'Priya Wickramasinghe', score: '1,540', isMe: false, initial: 'P' },
    { rank: '7', num: 7, name: 'Roshan Kumara', score: '1,480', isMe: false, initial: 'R' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Leaderboard</h2>

      {/* Podium Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm pt-6 overflow-hidden">
        <h3 className="text-sm font-semibold text-slate-800 px-6 flex items-center gap-2 mb-10">
          <span>🏆</span> Weekly Leaderboard
        </h3>

        <div className="flex justify-center items-end h-64 gap-2 md:gap-6 px-4 pb-8">
          
          {/* Rank 2 (Suresh) */}
          <div className="flex flex-col items-center translate-y-4">
            <span className="text-sm text-slate-600 mb-2 font-medium">Suresh</span>
            <div className="relative z-10 -mb-5 w-10 h-10 rounded-full bg-slate-400 border-4 border-white flex items-center justify-center text-white text-xs shadow-sm">
               🥈
            </div>
            <div className="w-24 md:w-32 h-28 bg-slate-200 rounded-t-xl flex justify-center pt-8">
              <span className="text-slate-500 font-medium">{leaderboardData[1].score}</span>
            </div>
          </div>

          {/* Rank 1 (Nimal) */}
          <div className="flex flex-col items-center">
            <span className="text-sm text-slate-800 mb-2 font-medium">Nimal</span>
            <div className="relative z-10 -mb-5 w-12 h-12 rounded-full bg-yellow-500 border-4 border-white flex items-center justify-center text-white text-sm shadow-sm scale-110">
               🥇
            </div>
            <div className="w-24 md:w-32 h-40 bg-yellow-400 rounded-t-xl flex justify-center pt-10">
              <span className="text-yellow-900 font-medium">{leaderboardData[0].score}</span>
            </div>
          </div>

          {/* Rank 3 (You) */}
          <div className="flex flex-col items-center translate-y-8">
            <span className="text-sm text-blue-600 mb-2 font-medium flex items-center gap-1">You <span className="text-xs">✨</span></span>
            <div className="relative z-10 -mb-5 w-10 h-10 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white text-xs shadow-sm">
               🥉
            </div>
            <div className="w-24 md:w-32 h-24 bg-blue-500 rounded-t-xl flex justify-center pt-6">
              <span className="text-white font-medium">{leaderboardData[2].score}</span>
            </div>
          </div>

        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="flex flex-col">
           {leaderboardData.map((user, idx) => (
             <div 
               key={user.num} 
               className={`flex items-center justify-between p-4 px-6 md:px-8 border-b border-slate-100 last:border-0 ${
                 user.isMe ? 'bg-blue-50' : 'hover:bg-slate-50'
               }`}
             >
                <div className="flex items-center gap-4 md:gap-6">
                  <span className={`w-6 text-center text-sm font-bold ${
                    user.num <= 3 ? (user.num === 1 ? 'text-yellow-500' : user.num === 2 ? 'text-slate-400' : 'text-orange-400') : 'text-slate-300'
                  }`}>
                    {user.num <= 3 ? user.rank : user.num}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    user.isMe ? 'bg-blue-600' : 'bg-blue-500'
                  }`}>
                    {user.initial}
                  </div>
                  <span className={`text-sm md:text-base ${user.isMe ? 'font-medium text-blue-700' : 'text-slate-700'}`}>
                    {user.name}
                  </span>
                </div>
                <span className={`text-sm md:text-base font-medium ${user.isMe ? 'text-blue-600' : 'text-blue-500'}`}>
                  {user.score}
                </span>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
