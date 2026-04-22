"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useGamificationStore } from '@/store/useGamificationStore';

export default function GamificationSettings() {
  const { createBadge, fetchBadges, badges } = useGamificationStore();

  const [pointRules, setPointRules] = useState({
    lesson: 10,
    quiz: 50,
    assignment: 80,
    forum: 5
  });

  const [toggles, setToggles] = useState({
    quizChamp: true,
    hotStreak: true,
    completer: true
  });

  // Modal State
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newBadge, setNewBadge] = useState({
    name: 'Quiz Champion',
    description: 'Awarded for passing 5 quizzes with a score of 80% or higher.',
    icon: '🏆',
    category: 'Achievement',
    triggerEvent: 'Quiz Passed',
    thresholdValue: 5,
    pointsBonus: 25,
    isVisible: true
  });

  useEffect(() => {
     fetchBadges();
  }, [fetchBadges]);

  const handleCreateBadge = async () => {
     if (!newBadge.name || !newBadge.description || !newBadge.icon || !newBadge.triggerEvent) {
       alert("Please fill out all required fields.");
       return;
     }

     setIsSubmitting(true);
     try {
       await createBadge(newBadge);
       setIsBadgeModalOpen(false);
       await fetchBadges();
       // Reset
       setNewBadge({
         name: '',
         description: '',
         icon: '🏆',
         category: 'Achievement',
         triggerEvent: 'Quiz Passed',
         thresholdValue: 1,
         pointsBonus: 10,
         isVisible: true
       });
     } catch (err) {
       console.error("Failed to create badge", err);
       alert("Failed to create badge.");
     }
     setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
         <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
               <span>🎮</span> Gamification Settings
            </h2>
            <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 focus:outline-none hidden md:block">
               <option>Global Settings</option>
            </select>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Left Column: Points Configuration */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
               <span>⭐</span>
               <h3 className="font-semibold text-slate-800">Points Configuration</h3>
            </div>
            
            <div className="p-6 flex-1 space-y-6">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm font-semibold text-slate-700">Complete Lesson</p>
                     <p className="text-xs text-slate-400">When student finishes a lesson</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <input 
                        type="number" 
                        value={pointRules.lesson} 
                        onChange={(e) => setPointRules({...pointRules, lesson: parseInt(e.target.value)})}
                        className="w-16 border border-slate-200 rounded-lg p-2 text-center text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none" 
                     />
                     <span className="text-xs text-slate-400 font-medium whitespace-nowrap">pts</span>
                  </div>
               </div>

               <div className="w-full h-px bg-slate-50"></div>

               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm font-semibold text-slate-700">Pass Quiz</p>
                     <p className="text-xs text-slate-400">Score &gt;= 60%</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <input 
                        type="number" 
                        value={pointRules.quiz} 
                        onChange={(e) => setPointRules({...pointRules, quiz: parseInt(e.target.value)})}
                        className="w-16 border border-slate-200 rounded-lg p-2 text-center text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none" 
                     />
                     <span className="text-xs text-slate-400 font-medium whitespace-nowrap">pts</span>
                  </div>
               </div>

               <div className="w-full h-px bg-slate-50"></div>

               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm font-semibold text-slate-700">Submit Assignment</p>
                     <p className="text-xs text-slate-400">On-time submission</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <input 
                        type="number" 
                        value={pointRules.assignment} 
                        onChange={(e) => setPointRules({...pointRules, assignment: parseInt(e.target.value)})}
                        className="w-16 border border-slate-200 rounded-lg p-2 text-center text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none" 
                     />
                     <span className="text-xs text-slate-400 font-medium whitespace-nowrap">pts</span>
                  </div>
               </div>

               <div className="w-full h-px bg-slate-50"></div>

               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm font-semibold text-slate-700">Forum Post</p>
                     <p className="text-xs text-slate-400">Contribute a discussion</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <input 
                        type="number" 
                        value={pointRules.forum} 
                        onChange={(e) => setPointRules({...pointRules, forum: parseInt(e.target.value)})}
                        className="w-16 border border-slate-200 rounded-lg p-2 text-center text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none" 
                     />
                     <span className="text-xs text-slate-400 font-medium whitespace-nowrap">pts</span>
                  </div>
               </div>
            </div>

            <div className="p-6 pt-0 mt-auto">
               <button className="w-full bg-blue-600 text-white font-medium rounded-xl py-3 hover:bg-blue-700 transition shadow-sm">
                  Save Point Rules
               </button>
            </div>
         </div>

         {/* Right Column: Badge Criteria */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <span>🏅</span>
                  <h3 className="font-semibold text-slate-800">Active Badges</h3>
               </div>
               <button 
                  onClick={() => setIsBadgeModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm"
               >
                  + New Badge
               </button>
            </div>
            
            <div className="p-6 flex-1 space-y-4 max-h-[460px] overflow-y-auto">
               {badges.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No badges created yet.</p>
               ) : (
                  badges.map((badge, i) => (
                     <div key={badge._id || i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg shadow-sm">
                              {badge.icon}
                           </div>
                           <div>
                              <h4 className="text-sm font-semibold text-slate-800">{badge.name}</h4>
                              <p className="text-xs text-slate-500 w-[200px] truncate">{badge.description}</p>
                           </div>
                        </div>
                        <div 
                           className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${badge.active !== false ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                           <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${badge.active !== false ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>
      </div>

      {/* MODAL OVERLAY */}
      {isBadgeModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
               {/* Header */}
               <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     <span>🏅</span> Create New Badge
                  </h3>
                  <button onClick={() => setIsBadgeModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
                     <X className="w-4 h-4" />
                  </button>
               </div>
               
               {/* Scroll Zone */}
               <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  
                  {/* Badge Icon */}
                  <div>
                     <label className="block text-sm font-bold text-slate-800 mb-1">Badge Icon</label>
                     <p className="text-xs text-slate-400 mb-2">Choose an emoji or upload a custom icon:</p>
                     <div className="flex gap-2 flex-wrap">
                        {['🏆', '⚡', '🔥', '🧠', '🌟', '💎', '🎯', '🚀', '💪', '🎓', '👑', '⭐'].map((emoji) => {
                           const active = newBadge.icon === emoji;
                           return (
                              <button 
                                 key={emoji} 
                                 onClick={() => setNewBadge({...newBadge, icon: emoji})}
                                 className={`w-11 h-11 rounded-lg text-lg flex items-center justify-center transition border ${active ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                              >
                                 {emoji}
                              </button>
                           )
                        })}
                     </div>
                  </div>

                  {/* Name */}
                  <div>
                     <label className="block text-sm font-bold text-slate-800 mb-2">Badge Name *</label>
                     <input 
                        type="text" 
                        value={newBadge.name}
                        onChange={(e) => setNewBadge({...newBadge, name: e.target.value})}
                        className="w-full text-sm font-bold text-slate-800 p-3 border-2 border-blue-500 rounded-xl focus:outline-none" 
                     />
                  </div>

                  {/* Description */}
                  <div>
                     <label className="block text-sm font-bold text-slate-800 mb-2">Description</label>
                     <textarea 
                        rows={2} 
                        value={newBadge.description}
                        onChange={(e) => setNewBadge({...newBadge, description: e.target.value})}
                        className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-600 resize-none"
                     ></textarea>
                  </div>

                  {/* Category */}
                  <div>
                     <label className="block text-sm font-bold text-slate-800 mb-2">Badge Category</label>
                     <div className="flex gap-2">
                        {['Academic', 'Engagement', 'Streak', 'Achievement'].map((cat) => {
                           const active = newBadge.category === cat;
                           return (
                              <button 
                                 key={cat} 
                                 onClick={() => setNewBadge({...newBadge, category: cat})}
                                 className={`px-4 py-2 rounded-lg text-xs font-bold transition border ${active ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                              >
                                 {cat}
                              </button>
                           )
                        })}
                     </div>
                  </div>

                  {/* Award Criteria */}
                  <div>
                     <label className="block text-sm font-bold text-slate-800 mb-2">Award Criteria</label>
                     <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                           <div className="flex-1">
                              <label className="block text-xs font-bold text-slate-800 mb-1">Trigger Event</label>
                              <div className="relative">
                                 <select 
                                    className="w-full text-sm p-2.5 border border-slate-200 bg-white rounded-lg focus:outline-none focus:border-blue-500 text-slate-600 appearance-none"
                                    value={newBadge.triggerEvent}
                                    onChange={(e) => setNewBadge({...newBadge, triggerEvent: e.target.value})}
                                 >
                                    <option>Quiz Passed</option>
                                    <option>Lesson Completed</option>
                                    <option>Streak Maintained</option>
                                 </select>
                                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▾</span>
                              </div>
                           </div>
                           <div className="flex-[0.8]">
                              <label className="block text-xs font-bold text-slate-800 mb-1">Threshold</label>
                              <input 
                                 type="number" 
                                 value={newBadge.thresholdValue}
                                 onChange={(e) => setNewBadge({...newBadge, thresholdValue: parseInt(e.target.value) || 0})}
                                 className="w-full text-sm font-bold text-blue-600 p-2.5 border-2 border-blue-400 rounded-lg focus:outline-none" 
                              />
                           </div>
                        </div>
                        <p className="text-[11px] font-medium text-blue-600">This badge auto-awards when logic conditions match API triggers.</p>
                     </div>
                  </div>

                  {/* Points Bonus */}
                  <div>
                     <label className="block text-sm font-bold text-slate-800 mb-2">Points Bonus</label>
                     <div className="flex items-center gap-3">
                        <input 
                           type="number" 
                           value={newBadge.pointsBonus}
                           onChange={(e) => setNewBadge({...newBadge, pointsBonus: parseInt(e.target.value) || 0})}
                           className="w-24 text-sm font-bold text-slate-800 p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" 
                        />
                        <span className="text-xs font-medium text-slate-400">bonus XP awarded when badge is earned</span>
                     </div>
                  </div>

                  {/* Visibility */}
                  <div>
                     <label className="block text-sm font-bold text-slate-800 mb-2">Badge Visibility</label>
                     <div className="flex gap-4">
                        <label className="flex-1 border-2 border-blue-400 bg-blue-50/50 rounded-xl p-3 flex items-center gap-3 cursor-pointer" onClick={() => setNewBadge({...newBadge, isVisible: true})}>
                           <div className={`w-4 h-4 rounded-full border-4 ${newBadge.isVisible ? 'border-blue-600 outline outline-1 outline-blue-600 bg-white' : 'border-slate-200 bg-slate-200'}`}></div>
                           <span className="text-sm font-bold text-blue-800">Visible to student</span>
                        </label>
                        <label className="flex-1 border border-slate-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition" onClick={() => setNewBadge({...newBadge, isVisible: false})}>
                           <div className={`w-4 h-4 rounded-full border-4 ${!newBadge.isVisible ? 'border-blue-600 outline outline-1 outline-blue-600 bg-white' : 'border-slate-200 bg-slate-200'}`}></div>
                           <span className="text-sm font-bold text-slate-700">Hidden (surprise)</span>
                        </label>
                     </div>
                  </div>
               </div>

               {/* Footer */}
               <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 mt-auto rounded-b-2xl">
                  <button onClick={() => setIsBadgeModalOpen(false)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition">
                     Cancel
                  </button>
                  <div className="flex gap-3">
                     <button 
                        onClick={handleCreateBadge}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                     >
                        {isSubmitting ? 'Creating...' : 'Create Badge →'}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
