"use client";

import React, { useEffect, useState } from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useUserStore } from '@/store/useUserStore';

export default function BadgeGallery() {
  const { badges, loading, fetchBadges } = useGamificationStore();
  const { user, initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
    fetchBadges();
  }, [fetchBadges, initializeUser]);

  if (loading) {
     return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // Ensure user.badges is an array
  const userBadgeNames = Array.isArray(user?.badges) ? user.badges : [];

  // Sort them dynamically based on user profile
  const earnedBadges = badges.filter(b => userBadgeNames.includes(b.name));
  const lockedBadges = badges.filter(b => !userBadgeNames.includes(b.name));

  // Fallback for visual mock if DB is completely empty. We don't want a blank UI.
  const fallbackIconColor = 'bg-blue-500';

  return (
    <div className="space-y-8">
      <div>
         <h2 className="text-2xl font-semibold text-slate-800 mb-1 flex items-center gap-2">
            <span>🏅</span> Badge Gallery
         </h2>
         <p className="text-slate-500 text-sm">{earnedBadges.length} earned • {lockedBadges.length} locked</p>
      </div>

      {/* Earned Badges Section */}
      <div>
         <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Earned Badges</h3>
         {earnedBadges.length === 0 ? (
            <div className="text-sm text-slate-500 p-6 bg-slate-50 rounded-xl border border-slate-200">You haven't earned any badges yet. Complete tasks to unlock them!</div>
         ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 xl:gap-6">
               {earnedBadges.map((badge, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                     <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm ${fallbackIconColor}`}>
                        {badge.icon || '🏆'}
                     </div>
                     <h4 className="text-sm font-semibold text-slate-800 mb-1">{badge.name}</h4>
                     <p className="text-[10px] text-slate-400 font-medium">{badge.description}</p>
                  </div>
               ))}
            </div>
         )}
      </div>

      {/* Locked Badges Section */}
      <div>
         <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Locked Badges</h3>
         {lockedBadges.length === 0 ? (
            <div className="text-sm text-emerald-500 p-6 bg-emerald-50 rounded-xl border border-emerald-200 font-medium">You have unlocked every badge! Congratulations! 🎉</div>
         ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 xl:gap-6">
               {lockedBadges.map((badge, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                     <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 bg-slate-200">
                        {badge.icon || '🔒'}
                     </div>
                     <h4 className="text-sm font-semibold text-slate-800 mb-1">{badge.name}</h4>
                     <p className="text-[10px] text-slate-400 font-medium">{badge.description}</p>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
}
