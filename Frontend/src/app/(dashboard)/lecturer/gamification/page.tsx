"use client";

import React, { useState, useEffect } from 'react';
import {
  X, Award, ShieldAlert, Star, Trophy, Users, Send, Settings,
  Check, RefreshCw, Plus, Sparkles, BookOpen, MessageSquare, Clock, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useGamificationStore } from '@/store/useGamificationStore';
import api from '@/lib/api';

export default function GamificationSettings() {
  const {
    createBadge,
    fetchBadges,
    badges,
    awardPoints,
    awardBadge,
    toggleBadgeActive
  } = useGamificationStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'rules' | 'badges'>('rules');

  // Point Rules State
  const [pointRules, setPointRules] = useState({
    lesson: 10,
    quiz: 50,
    assignment: 80,
    forum: 5
  });
  const [savingRules, setSavingRules] = useState(false);

  // Manual Award State
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [awardType, setAwardType] = useState<'points' | 'badge'>('points');
  const [pointsToAward, setPointsToAward] = useState(50);
  const [pointsReason, setPointsReason] = useState('Outstanding Performance');
  const [badgeToAward, setBadgeToAward] = useState('');
  const [isAwarding, setIsAwarding] = useState(false);

  // Modal State
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for New Badge
  const [newBadge, setNewBadge] = useState({
    name: '',
    description: '',
    icon: '🏆',
    category: 'Achievement',
    triggerEvent: 'Manual Award',
    thresholdValue: 1,
    pointsBonus: 10,
    isVisible: true
  });

  useEffect(() => {
    fetchBadges();

    // Fetch current rules
    const fetchRules = async () => {
      try {
        const res = await api.get('/gamification/rules');
        if (res.data) {
          setPointRules({
            lesson: res.data.lesson || 10,
            quiz: res.data.quiz || 50,
            assignment: res.data.assignment || 80,
            forum: res.data.forum || 5
          });
        }
      } catch (err) {
        console.error("Failed to fetch rules", err);
      }
    };

    // Fetch students list
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await api.get('/courses/lecturer/students');
        setStudents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchRules();
    fetchStudents();
  }, [fetchBadges]);

  const handleSaveRules = async () => {
    setSavingRules(true);
    try {
      await api.post('/gamification/rules', pointRules);
      alert("Point rules saved successfully!");
    } catch (err) {
      console.error("Failed to save rules", err);
      alert("Failed to save point rules.");
    } finally {
      setSavingRules(false);
    }
  };

  const handleToggleBadge = async (badgeId: string) => {
    try {
      await toggleBadgeActive(badgeId);
    } catch (err) {
      console.error("Failed to toggle badge active state", err);
      alert("Failed to update badge state.");
    }
  };

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
      // Reset form
      setNewBadge({
        name: '',
        description: '',
        icon: '🏆',
        category: 'Achievement',
        triggerEvent: 'Manual Award',
        thresholdValue: 1,
        pointsBonus: 10,
        isVisible: true
      });
      alert("New badge created successfully!");
    } catch (err) {
      console.error("Failed to create badge", err);
      alert("Failed to create badge.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualAward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }

    setIsAwarding(true);
    try {
      if (awardType === 'points') {
        if (!pointsToAward || pointsToAward <= 0) {
          alert("Please enter a valid points value.");
          setIsAwarding(false);
          return;
        }
        await awardPoints(selectedStudent, pointsToAward, pointsReason);
        alert(`Successfully awarded ${pointsToAward} XP points to student!`);
        setPointsToAward(50);
        setPointsReason('Outstanding Performance');
      } else {
        if (!badgeToAward) {
          alert("Please select a badge to award.");
          setIsAwarding(false);
          return;
        }
        await awardBadge(selectedStudent, badgeToAward);
        alert(`Successfully awarded the "${badgeToAward}" badge to student!`);
        setBadgeToAward('');
      }
      setSelectedStudent('');
    } catch (err) {
      console.error("Manual award failed", err);
      alert("Failed to process manual award.");
    } finally {
      setIsAwarding(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">

      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-12 pointer-events-none">
          <Trophy className="w-80 h-80 rotate-12" />
        </div>
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="bg-white/20 text-white font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" /> Gamification Hub
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Gamified Classroom Engine</h1>
          <p className="text-indigo-100 font-medium text-sm leading-relaxed">
            Drive student engagement, reward consistency, and build custom milestone achievements. Adjust point weights, create custom badges, and manually reward high achievers from a single control center.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 bg-slate-100/50 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition ${activeTab === 'rules'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <Settings className="w-4 h-4" /> Point Rules & Manual Awards
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition ${activeTab === 'badges'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <Award className="w-4 h-4" /> Badges Library ({badges.length})
        </button>
      </div>

      {/* Tab Content 1: Rules & Manual Awards */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Points Configuration Card */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-yellow-50 rounded-xl text-yellow-500 text-lg">⭐</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Point Multipliers</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Determine how much XP students gain automatically</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">

                {/* Complete Lesson Rule */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 border border-slate-150 p-4.5 rounded-2xl transition hover:bg-slate-50">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Complete Lesson</p>
                      <p className="text-xs text-slate-400 font-medium">Earned when a student completes a course reading unit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      value={pointRules.lesson}
                      onChange={(e) => setPointRules({ ...pointRules, lesson: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-20 border-2 border-slate-200 rounded-xl p-2.5 text-center text-sm font-bold text-slate-800 focus:border-blue-500 focus:outline-none bg-white transition"
                    />
                    <span className="text-xs font-bold text-slate-400">XP</span>
                  </div>
                </div>

                {/* Pass Quiz Rule */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 border border-slate-150 p-4.5 rounded-2xl transition hover:bg-slate-50">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Pass Quiz</p>
                      <p className="text-xs text-slate-400 font-medium">Earned for passing quizzes with score &gt;= 60%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      value={pointRules.quiz}
                      onChange={(e) => setPointRules({ ...pointRules, quiz: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-20 border-2 border-slate-200 rounded-xl p-2.5 text-center text-sm font-bold text-slate-800 focus:border-blue-500 focus:outline-none bg-white transition"
                    />
                    <span className="text-xs font-bold text-slate-400">XP</span>
                  </div>
                </div>

                {/* Submit Assignment Rule */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 border border-slate-150 p-4.5 rounded-2xl transition hover:bg-slate-50">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Submit Assignment</p>
                      <p className="text-xs text-slate-400 font-medium">Base XP awarded for grading submission</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      value={pointRules.assignment}
                      onChange={(e) => setPointRules({ ...pointRules, assignment: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-20 border-2 border-slate-200 rounded-xl p-2.5 text-center text-sm font-bold text-slate-800 focus:border-blue-500 focus:outline-none bg-white transition"
                    />
                    <span className="text-xs font-bold text-slate-400">XP</span>
                  </div>
                </div>

                {/* Forum Post Rule */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 border border-slate-150 p-4.5 rounded-2xl transition hover:bg-slate-50">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Forum Contribution</p>
                      <p className="text-xs text-slate-400 font-medium">Earned for posting helpful class threads or replies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      value={pointRules.forum}
                      onChange={(e) => setPointRules({ ...pointRules, forum: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-20 border-2 border-slate-200 rounded-xl p-2.5 text-center text-sm font-bold text-slate-800 focus:border-blue-500 focus:outline-none bg-white transition"
                    />
                    <span className="text-xs font-bold text-slate-400">XP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
              <button
                onClick={handleSaveRules}
                disabled={savingRules}
                className="w-full bg-blue-650 text-white font-bold rounded-2xl py-3.5 hover:bg-blue-700 transition shadow-md disabled:opacity-50"
              >
                {savingRules ? 'Updating Config...' : 'Apply Point Rule Config'}
              </button>
            </div>
          </div>

          {/* Manual Award Hub */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2.5">
              <span className="p-2 bg-indigo-50 rounded-xl text-indigo-500 text-lg">👨‍🎓</span>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Manual Award Hub</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Directly gift XP or badges to students</p>
              </div>
            </div>

            <form onSubmit={handleManualAward} className="p-6 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">

                {/* Select Student */}
                <div>
                  <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-2">1. Select Student</label>
                  {loadingStudents ? (
                    <div className="h-10 bg-slate-50 rounded-xl animate-pulse"></div>
                  ) : (
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 bg-white"
                      required
                    >
                      <option value="">-- Choose Student --</option>
                      {students.map((student: any) => (
                        <option key={student._id} value={student._id}>
                          {student.name} ({student.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Award Type Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-2">2. Reward Type</label>
                  <div className="grid grid-cols-2 gap-2 border border-slate-150 p-1 rounded-xl bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setAwardType('points')}
                      className={`py-2 text-xs font-bold rounded-lg transition ${awardType === 'points'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      ⭐ XP Points
                    </button>
                    <button
                      type="button"
                      onClick={() => setAwardType('badge')}
                      className={`py-2 text-xs font-bold rounded-lg transition ${awardType === 'badge'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      🏆 Custom Badge
                    </button>
                  </div>
                </div>

                {/* Conditional Fields based on Award Type */}
                {awardType === 'points' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Amount (XP)</label>
                      <input
                        type="number"
                        min={1}
                        value={pointsToAward}
                        onChange={(e) => setPointsToAward(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Reason for Award</label>
                      <input
                        type="text"
                        value={pointsReason}
                        onChange={(e) => setPointsReason(e.target.value)}
                        placeholder="e.g. Great forum helper"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-850 focus:outline-none focus:border-indigo-500 bg-white"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Select Badge</label>
                    <select
                      value={badgeToAward}
                      onChange={(e) => setBadgeToAward(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 bg-white"
                      required
                    >
                      <option value="">-- Choose Badge --</option>
                      {badges.filter(b => b.active !== false).map((badge) => (
                        <option key={badge._id} value={badge.name}>
                          {badge.icon} {badge.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isAwarding || !selectedStudent}
                className="w-full bg-indigo-600 text-white font-bold rounded-2xl py-3.5 hover:bg-indigo-700 transition shadow-md mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {isAwarding ? 'Processing Award...' : 'Send Manual Reward'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab Content 2: Badges Library */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Milestone & Manual Badges</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Toggle active badges or create new achievements for your course</p>
            </div>
            <button
              onClick={() => setIsBadgeModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Badge
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.length === 0 ? (
              <div className="col-span-full bg-white border border-slate-250 p-12 text-center rounded-3xl">
                <p className="text-slate-500 font-semibold mb-2">No badges have been seeded or created yet.</p>
                <button
                  onClick={() => setIsBadgeModalOpen(true)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Create the first badge now
                </button>
              </div>
            ) : (
              badges.map((badge) => (
                <div
                  key={badge._id}
                  className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between relative ${badge.active !== false ? 'border-slate-200' : 'border-slate-100 opacity-60'
                    }`}
                >
                  <div>
                    {/* Badge Category Tag & Toggle */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full ${badge.category === 'Streak' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                          badge.category === 'Academic' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            badge.category === 'Engagement' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                              'bg-slate-50 text-slate-650 border border-slate-150'
                        }`}>
                        {badge.category || 'Achievement'}
                      </span>

                      {/* Interactive Active Toggle */}
                      <button
                        onClick={() => handleToggleBadge(badge._id)}
                        title={badge.active !== false ? "Disable Badge" : "Enable Badge"}
                        className="text-slate-400 hover:text-blue-600 transition"
                      >
                        {badge.active !== false ? (
                          <ToggleRight className="w-9 h-9 text-blue-600" />
                        ) : (
                          <ToggleLeft className="w-9 h-9 text-slate-350" />
                        )}
                      </button>
                    </div>

                    {/* Emoji representation */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-slate-100 flex items-center justify-center text-3xl shadow-sm mb-4">
                      {badge.icon}
                    </div>

                    <h4 className="text-base font-extrabold text-slate-800 mb-1">{badge.name}</h4>
                    <p className="text-xs text-slate-450 leading-relaxed font-semibold mb-4">{badge.description}</p>
                  </div>

                  {/* Criteria info footer */}
                  <div className="border-t border-slate-100/80 pt-4 mt-2 flex flex-col gap-1.5 text-[11px] font-bold text-slate-500">
                    <div className="flex justify-between">
                      <span>Trigger Event:</span>
                      <span className="text-slate-700">{badge.triggerEvent || 'Manual Award'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Threshold:</span>
                      <span className="text-slate-700">{badge.thresholdValue || 1} action(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonus Reward:</span>
                      <span className="text-blue-650">+{badge.pointsBonus || 0} XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={badge.active !== false ? "text-emerald-600" : "text-slate-400"}>
                        {badge.active !== false ? "Active (Auto-Awarding)" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW BADGE MODAL OVERLAY */}
      {isBadgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-500" /> Create Custom Badge
              </h3>
              <button
                onClick={() => setIsBadgeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-650 transition shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll Zone */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">

              {/* Badge Icon Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">1. Badge Icon Emoji</label>
                <div className="flex gap-2.5 flex-wrap">
                  {['🏆', '⚡', '🔥', '🧠', '🌟', '💎', '🎯', '🚀', '💪', '🎓', '👑', '⭐', '🎨', '💻', '💡', '🔍'].map((emoji) => {
                    const active = newBadge.icon === emoji;
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewBadge({ ...newBadge, icon: emoji })}
                        className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition border-2 ${active ? 'border-blue-500 bg-blue-50/50 shadow-sm scale-110' : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                      >
                        {emoji}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">2. Badge Name *</label>
                <input
                  type="text"
                  value={newBadge.name}
                  onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                  className="w-full text-sm font-bold text-slate-850 p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="e.g. Creative Genius"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">3. Description / Criteria details</label>
                <textarea
                  rows={2}
                  value={newBadge.description}
                  onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                  className="w-full text-sm p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 resize-none bg-white font-medium"
                  placeholder="e.g. Awarded to students showing outstanding visual layout and structural cleanliness in their work."
                  required
                ></textarea>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">4. Category</label>
                <div className="flex gap-2 flex-wrap">
                  {['Academic', 'Engagement', 'Streak', 'Achievement'].map((cat) => {
                    const active = newBadge.category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewBadge({ ...newBadge, category: cat })}
                        className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition border-2 ${active ? 'bg-blue-50/50 border-blue-500 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Award Criteria Select */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">5. Auto-Award Parameters</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Trigger Event</label>
                    <select
                      className="w-full text-xs font-bold p-2.5 border border-slate-200 bg-white rounded-lg focus:outline-none focus:border-blue-500 text-slate-600"
                      value={newBadge.triggerEvent}
                      onChange={(e) => setNewBadge({ ...newBadge, triggerEvent: e.target.value })}
                    >
                      <option value="Manual Award">Manual Award (Lecturer Controlled)</option>
                      <option value="Quiz Passed">Quiz Passed</option>
                      <option value="Lesson Completed">Lesson Completed</option>
                      <option value="Streak Maintained">Streak Maintained</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-28">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Threshold</label>
                    <input
                      type="number"
                      min={1}
                      value={newBadge.thresholdValue}
                      disabled={newBadge.triggerEvent === 'Manual Award'}
                      onChange={(e) => setNewBadge({ ...newBadge, thresholdValue: Math.max(1, parseInt(e.target.value) || 0) })}
                      className="w-full text-xs font-bold p-2.5 border border-slate-250 bg-white rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                </div>
                {newBadge.triggerEvent !== 'Manual Award' ? (
                  <p className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                    <span>✨</span> Automatically awarded to student upon the {newBadge.thresholdValue}th {newBadge.triggerEvent}.
                  </p>
                ) : (
                  <p className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                    <span>💡</span> Hand-picked & awarded to individual students by the lecturer.
                  </p>
                )}
              </div>

              {/* Points Bonus */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">6. Reward Points (XP)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    value={newBadge.pointsBonus}
                    onChange={(e) => setNewBadge({ ...newBadge, pointsBonus: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-24 text-sm font-bold text-slate-800 p-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-400">Bonus XP points granted to student upon receipt</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 mt-auto rounded-b-3xl">
              <button
                type="button"
                onClick={() => setIsBadgeModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateBadge}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-650 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Publish New Badge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
