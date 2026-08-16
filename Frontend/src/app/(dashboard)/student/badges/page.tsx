"use client";

import React, { useEffect } from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useUserStore } from '@/store/useUserStore';
import Loading from '@/components/ui/Loading';

const SYSTEM_BADGES = [
  {
    _id: "sys_bronze",
    name: "Bronze Medal",
    description: "Earned by accumulating 100+ XP points.",
    icon: "🥉",
  },
  {
    _id: "sys_silver",
    name: "Silver Medal",
    description: "Earned by accumulating 500+ XP points.",
    icon: "🥈",
  },
  {
    _id: "sys_gold",
    name: "Gold Medal",
    description: "Earned by accumulating 1,000+ XP points.",
    icon: "🥇",
  },
  {
    _id: "sys_first_step",
    name: "First Step",
    description: "Earned by completing your first course.",
    icon: "🚀",
  },
  {
    _id: "sys_course_master",
    name: "Course Master",
    description: "Earned by completing 3 or more courses.",
    icon: "🎓",
  },
];

export default function BadgeGallery() {
  const { badges = [], loading: gamificationLoading, fetchBadges } = useGamificationStore();
  const { user, fetchUserProfile, loading: userLoading } = useUserStore();

  useEffect(() => {
    fetchUserProfile();
    fetchBadges();
  }, [fetchUserProfile, fetchBadges]);

  if (userLoading || gamificationLoading) {
    return <Loading />;
  }

  // Ensure user.badges is an array of strings
  const userBadgeNames: string[] = Array.isArray(user?.badges) ? user.badges : [];

  // Combine MongoDB database badges with fallback catalog
  const allKnownBadges = [...badges];

  SYSTEM_BADGES.forEach((sb) => {
    if (!allKnownBadges.some((b: any) => b && b.name && b.name.toLowerCase() === sb.name.toLowerCase())) {
      allKnownBadges.push(sb);
    }
  });

  // Filter earned badges vs locked badges
  const earnedBadges: any[] = [];
  const lockedBadges: any[] = [];

  allKnownBadges.forEach((b) => {
    const isEarned = userBadgeNames.some(
      (name) => String(name).trim().toLowerCase() === String(b.name).trim().toLowerCase()
    );
    if (isEarned) {
      earnedBadges.push(b);
    } else {
      lockedBadges.push(b);
    }
  });

  // Include any extra user.badges that were not in allKnownBadges fallback
  userBadgeNames.forEach((badgeName) => {
    if (
      badgeName &&
      !earnedBadges.some(
        (eb) => String(eb.name).trim().toLowerCase() === String(badgeName).trim().toLowerCase()
      )
    ) {
      earnedBadges.push({
        name: badgeName,
        description: "Special Achievement Awarded",
        icon: "🏆",
      });
    }
  });

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
        <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">
          Earned Badges ({earnedBadges.length})
        </h3>
        {earnedBadges.length === 0 ? (
          <div className="text-sm text-slate-500 p-6 bg-slate-50 rounded-xl border border-slate-200">
            You haven't earned any badges yet. Complete tasks, earn XP, and finish courses to unlock them!
          </div>
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
        <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">
          Locked Badges ({lockedBadges.length})
        </h3>
        {lockedBadges.length === 0 ? (
          <div className="text-sm text-emerald-500 p-6 bg-emerald-50 rounded-xl border border-emerald-200 font-medium">
            You have unlocked every badge! Congratulations! 🎉
          </div>
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
