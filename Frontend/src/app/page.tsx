"use client";

import Link from 'next/link';
import { GraduationCap, ArrowRight, Users, BookOpen, Trophy } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <PublicNavbar />

      {/* 
        ----------------------------
        HERO SECTION
        ----------------------------
      */}
      <section className="relative bg-[#1E40AF] px-8 py-20 lg:py-28 overflow-hidden">
        {/* Subtle Background Gradients/Shapes */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 40%)" }}></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          
          {/* LEFT: Text Content */}
          <div className="text-white space-y-8 relative z-20">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <GraduationCap className="w-4 h-4 text-blue-200" />
              <span className="text-xs font-semibold tracking-wide text-blue-50">Sri Lanka's #1 Gamified Learning Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              Learn. <span className="text-blue-300">Earn Points.</span><br />
              Level Up. Succeed.
            </h1>

            {/* Subtext */}
            <p className="text-lg lg:text-xl text-blue-100 max-w-xl font-medium leading-relaxed opacity-90">
              Engage with interactive courses, earn XP badges and compete on leaderboards at your university. Learning has never been this rewarding.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/courses" className="px-8 py-4 bg-transparent border-2 border-white/30 hover:bg-white/10 text-white font-bold rounded-xl transition">
                Browse Courses
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 pt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
                <Users className="w-4 h-4 text-emerald-300" />
                <span className="text-sm font-semibold">2,400+ Students</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
                <BookOpen className="w-4 h-4 text-blue-300" />
                <span className="text-sm font-semibold">48 Courses</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold">94% Pass Rate</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Floating UI Mockup */}
          <div className="relative xl:translate-x-12 z-20">
            {/* The Main Glass Container */}
            <div className="bg-[#1f2937]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl relative w-full max-w-2xl ml-auto">
              
              {/* Window Controls */}
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>

              {/* Inner Widgets Grid */}
              <div className="grid grid-cols-2 gap-4 lg:gap-6 relative">
                
                {/* Total Points Widget */}
                <div className="bg-white/10 rounded-xl p-5 border border-white/5">
                  <p className="text-xs font-semibold text-blue-200 mb-2">Total Points</p>
                  <h3 className="text-3xl font-bold text-white mb-2">1,840</h3>
                  <p className="text-[10px] font-bold text-emerald-400">+120 this week</p>
                </div>

                {/* Leaderboard Rank Widget */}
                <div className="bg-white/10 rounded-xl p-5 border border-white/5">
                  <p className="text-xs font-semibold text-blue-200 mb-2">Leaderboard Rank</p>
                  <h3 className="text-3xl font-bold text-orange-400 mb-2">#3</h3>
                  <p className="text-[10px] font-bold text-emerald-400">Up 2 positions ▲</p>
                </div>

                {/* Course Progress Component */}
                <div className="bg-white/10 rounded-xl p-5 border border-white/5 col-span-2">
                  <p className="text-xs font-semibold text-white mb-4">Course Progress</p>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[11px] text-blue-200 font-medium mb-1.5">
                        <span>DSA</span>
                        <span className="text-white">75%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-blue-200 font-medium mb-1.5">
                        <span>DBMS</span>
                        <span className="text-white">82%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Gamers / Students pills */}
                <div className="col-span-2 flex flex-wrap gap-4">
                  <div className="flex-1 bg-white/10 rounded-xl p-4 border border-white/5">
                    <p className="text-xs font-medium text-blue-100 flex items-center gap-1 mb-1">
                      <span className="text-[10px]">🔥</span> Kavitha P.
                    </p>
                    <p className="text-lg font-bold text-white">1840 pts</p>
                  </div>
                  <div className="flex-1 bg-[#1e3a8a]/60 rounded-xl p-4 border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] transform -translate-y-1">
                    <p className="text-xs font-medium text-white flex items-center gap-1 mb-1">
                      <span className="text-[10px]">🥇</span> Nimal S.
                    </p>
                    <p className="text-lg font-bold text-white">2340 pts</p>
                  </div>
                  <div className="flex-1 bg-white/10 rounded-xl p-4 border border-white/5">
                    <p className="text-xs font-medium text-blue-100 flex items-center gap-1 mb-1">
                      <span className="text-[10px]">🥈</span> Suresh B.
                    </p>
                    <p className="text-lg font-bold text-white">2180 pts</p>
                  </div>
                </div>

                {/* Recent Badges Row */}
                <div className="col-span-2 bg-white/5 rounded-xl p-5 border border-white/5">
                  <p className="text-xs font-semibold text-white mb-4">Recent Badges</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-lg shadow-inner">🏆</div>
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg shadow-inner">⚡</div>
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-lg shadow-inner">🔥</div>
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-lg shadow-inner">🧠</div>
                    <div className="w-10 h-10 rounded-full bg-slate-500/20 border border-slate-500/30 flex items-center justify-center text-lg shadow-inner opacity-40">🌟</div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Background Glow behind the mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] -z-10 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* 
        ----------------------------
        HOW IT WORKS SECTION
        ----------------------------
      */}
      <section className="py-24 px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight mb-4">How EduQuest Works</h2>
            <p className="text-slate-500 font-medium">Three simple steps to transform your learning experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
               <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-2xl shadow-inner">
                    📚
                  </div>
                  <span className="text-4xl font-bold text-blue-100 italic -mt-2">01</span>
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-3">Enroll in Courses</h3>
               <p className="text-sm text-slate-500 leading-relaxed font-medium">
                 Browse and enroll in curated university courses tailored to your department.
               </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
               <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-center text-2xl shadow-inner">
                    ⭐
                  </div>
                  <span className="text-4xl font-bold text-blue-100 italic -mt-2">02</span>
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-3">Learn & Earn Points</h3>
               <p className="text-sm text-slate-500 leading-relaxed font-medium">
                 Complete lessons, pass quizzes, submit assignments and earn XP for every activity.
               </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
               <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-center text-2xl shadow-inner">
                    🏆
                  </div>
                  <span className="text-4xl font-bold text-blue-100 italic -mt-2">03</span>
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-3">Compete & Level Up</h3>
               <p className="text-sm text-slate-500 leading-relaxed font-medium">
                 Climb the leaderboard, unlock badges and level up your learning profile.
               </p>
            </div>

          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
