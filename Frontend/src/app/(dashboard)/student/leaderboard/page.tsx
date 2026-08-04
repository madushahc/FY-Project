"use client";

import React, { useEffect, useState } from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import Loading from '@/components/ui/Loading';

export default function Leaderboard() {
  const { leaderboard, fetchLeaderboard, loading } = useGamificationStore();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
     const storedUser = localStorage.getItem('user');
     if (storedUser) setCurrentUser(JSON.parse(storedUser));
     
     fetchLeaderboard();
  }, []);

  const mapRanks = () => {
     let mapped = leaderboard.map((u: any, idx: number) => {
        let rankStr = `${idx + 1}`;
        if (idx === 0) rankStr = '🥇';
        if (idx === 1) rankStr = '🥈';
        if (idx === 2) rankStr = '🥉';

        return {
           num: idx + 1,
           rank: rankStr,
           name: currentUser && currentUser._id === u._id ? `${u.name} (You)` : u.name,
           score: u.points.toLocaleString(),
           isMe: currentUser && currentUser._id === u._id,
           initial: u.name ? u.name[0].toUpperCase() : 'U'
        };
     });
     
     // Pad out to at least 3 for podium
     while (mapped.length < 3) {
        mapped.push({
           num: mapped.length + 1,
           rank: mapped.length === 1 ? '🥈' : '🥉', 
           name: '---', 
           score: '0', 
           isMe: false, 
           initial: '-'
        });
     }
     
     return mapped;
  };

  const dynamicData = mapRanks();

  if (loading && leaderboard.length === 0) {
      return <Loading />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Leaderboard</h2>

      {/* Podium Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm pt-6 overflow-hidden">
        <h3 className="text-sm font-semibold text-slate-800 px-6 flex items-center gap-2 mb-10">
          <span>🏆</span> Weekly Leaderboard
        </h3>

        <div className="flex justify-center items-end h-64 gap-2 md:gap-6 px-4 pb-8">
          
          {/* Rank 2 */}
          <div className="flex flex-col items-center translate-y-4">
            <span className="text-xs md:text-sm text-slate-600 mb-2 font-medium w-20 truncate text-center">{dynamicData[1].name.replace(' (You)', '')}</span>
            <div className="relative z-10 -mb-5 w-10 h-10 rounded-full bg-slate-400 border-4 border-white flex items-center justify-center text-white text-xs shadow-sm">
               🥈
            </div>
            <div className="w-24 md:w-32 h-28 bg-slate-200 rounded-t-xl flex justify-center pt-8">
              <span className="text-slate-500 font-medium">{dynamicData[1].score}</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm text-slate-800 mb-2 font-medium w-24 truncate text-center">{dynamicData[0].name.replace(' (You)', '')}</span>
            <div className="relative z-10 -mb-5 w-12 h-12 rounded-full bg-yellow-500 border-4 border-white flex items-center justify-center text-white text-sm shadow-sm scale-110">
               🥇
            </div>
            <div className="w-24 md:w-32 h-40 bg-yellow-400 rounded-t-xl flex justify-center pt-10">
              <span className="text-yellow-900 font-medium">{dynamicData[0].score}</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center translate-y-8">
            <span className="text-xs md:text-sm text-blue-600 mb-2 font-medium flex items-center justify-center gap-1 w-20 truncate text-center">
               {dynamicData[2].name.replace(' (You)', '')}
            </span>
            <div className="relative z-10 -mb-5 w-10 h-10 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white text-xs shadow-sm">
               🥉
            </div>
            <div className="w-24 md:w-32 h-24 bg-blue-500 rounded-t-xl flex justify-center pt-6">
              <span className="text-white font-medium">{dynamicData[2].score}</span>
            </div>
          </div>

        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="flex flex-col">
           {dynamicData.map((user, idx) => (
             <div 
               key={user.num} 
               className={`flex items-center justify-between p-4 px-6 md:px-8 border-b border-slate-100 last:border-0 ${
                 user.isMe ? 'bg-blue-50' : 'hover:bg-slate-50'
               }`}
             >
                <div className="flex items-center gap-4 md:gap-6">
                  <span className={`w-6 text-center text-sm font-bold ${
                    user.num <= 3 ? (user.num === 1 ? 'text-yellow-500' : user.num === 2 ? 'text-slate-400' : 'text-blue-400') : 'text-slate-300'
                  }`}>
                    {user.num <= 3 ? user.rank : user.num}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                    user.isMe ? 'bg-blue-600' : 'bg-blue-500'
                  }`}>
                    {user.initial}
                  </div>
                  <span className={`text-sm md:text-base ${user.isMe ? 'font-medium text-blue-700' : 'text-slate-700'}`}>
                    {user.name} {user.isMe && <span className="text-xs ml-1">✨</span>}
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
