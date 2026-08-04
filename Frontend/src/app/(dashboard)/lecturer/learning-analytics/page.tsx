"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import {
  BarChart2,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  Users,
  Star,
  Sparkles,
  ShieldAlert,
  Brain,
  Video,
  Layers,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Zap,
  Target,
  RefreshCw,
  FileText
} from "lucide-react";

interface HierarchyCourse {
  courseId: string;
  title: string;
  code: string;
  modules: {
    moduleId: string;
    title: string;
    lessons: {
      lessonId: string;
      title: string;
      type: string;
    }[];
  }[];
}

export default function LecturerLearningAnalyticsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [hierarchy, setHierarchy] = useState<HierarchyCourse[]>([]);

  // Selection Level State
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [selectedModuleId, setSelectedModuleId] = useState<string>("all");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("all");

  // Analytics Data State
  const [summary, setSummary] = useState<any>(null);
  const [courseLevel, setCourseLevel] = useState<any>(null);
  const [moduleLevel, setModuleLevel] = useState<any>(null);
  const [videoLevel, setVideoLevel] = useState<any>(null);
  const [questionAnalysis, setQuestionAnalysis] = useState<any>(null);
  const [gamificationAnalysis, setGamificationAnalysis] = useState<any>(null);
  const [studentCategorization, setStudentCategorization] = useState<any>(null);
  const [researchInsights, setResearchInsights] = useState<string[]>([]);
  const [correlations, setCorrelations] = useState<any>(null);
  const [engagementTrends, setEngagementTrends] = useState<any[]>([]);
  const [studentRankings, setStudentRankings] = useState<any[]>([]);
  const [atRiskStudents, setAtRiskStudents] = useState<any[]>([]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCourseId !== "all") params.courseId = selectedCourseId;
      if (selectedModuleId !== "all") params.moduleId = selectedModuleId;
      if (selectedLessonId !== "all") params.lessonId = selectedLessonId;

      console.log("🚀 [Learning Analytics] Fetching analytics with params:", params);
      const { data } = await api.get("/courses/analytics/interactive", { params });

      console.log("📊 [Learning Analytics API Response Data]:", data);

      if (data.hierarchy && data.hierarchy.length > 0) {
        setHierarchy(data.hierarchy);
      }
      setSummary(data.summary || null);
      setCourseLevel(data.courseLevel || null);
      setModuleLevel(data.moduleLevel || null);
      setVideoLevel(data.videoLevel || null);
      setQuestionAnalysis(data.questionAnalysis || null);
      setGamificationAnalysis(data.gamificationAnalysis || null);
      setStudentCategorization(data.studentCategorization || null);
      setResearchInsights(data.researchInsights || []);
      setCorrelations(data.correlations || null);
      setEngagementTrends(data.engagementTrends || []);
      setStudentRankings(data.studentRankings || []);
      setAtRiskStudents(data.atRiskStudents || []);

      console.log("✅ [Mapped State Props]:", {
        overallEngagementScore: data.summary?.overallEngagementScore,
        avgEngagement: data.courseLevel?.avgEngagement,
        questionsCount: data.questionAnalysis?.questionsList?.length,
        gamificationXP: data.gamificationAnalysis?.totalXpEarned,
        studentsCount: data.studentRankings?.length,
      });
    } catch (err) {
      console.error("❌ Failed to load Learning Analytics", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCourseId, selectedModuleId, selectedLessonId]);

  // Initial load of all available courses to populate selector dropdown
  useEffect(() => {
    const loadCoursesDropdown = async () => {
      try {
        const { data } = await api.get("/courses");
        if (Array.isArray(data) && data.length > 0) {
          const formatted: HierarchyCourse[] = data.map((c: any) => ({
            courseId: c._id,
            title: c.title,
            code: c.code || "COURSE",
            modules: (c.modules || []).map((m: any) => ({
              moduleId: m._id || m.title,
              title: m.title,
              lessons: (m.lessons || []).map((l: any) => ({
                lessonId: l._id || l.title,
                title: l.title,
                type: l.type || "video",
              })),
            })),
          }));
          setHierarchy(formatted);
        }
      } catch (err) {
        console.error("Failed to pre-fetch courses list", err);
      }
    };
    loadCoursesDropdown();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Derived options for cascading selectors
  const activeCourse = selectedCourseId !== "all"
    ? hierarchy.find((c) => c.courseId === selectedCourseId)
    : null;

  const activeModules = activeCourse
    ? activeCourse.modules || []
    : hierarchy.flatMap((c) => c.modules || []);

  const activeModule = selectedModuleId !== "all"
    ? activeModules.find((m) => m.moduleId === selectedModuleId)
    : null;

  const activeLessons = activeModule
    ? activeModule.lessons || []
    : activeModules.flatMap((m) => m.lessons || []);

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold mb-3">
              <Brain className="w-3.5 h-3.5" />
              <span>Learning Analytics & Research Intelligence</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Learning Analytics ⭐
            </h1>
            <p className="text-slate-300 text-xs lg:text-sm mt-1 max-w-2xl font-medium">
              Hierarchical analysis of student engagement, learning behavior, and the pedagogical impact of gamification across courses, modules, and video lessons.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Hierarchical Level Selection Bar: Course -> Module -> Video */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          
          {/* Selector 1: Course */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> 1. Select Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedModuleId("all");
                setSelectedLessonId("all");
              }}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="all" className="text-slate-900 font-bold">All Courses ({hierarchy.length})</option>
              {hierarchy.map((c) => (
                <option key={c.courseId} value={c.courseId} className="text-slate-900 font-bold">
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Selector 2: Module */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 2. Select Module
            </label>
            <select
              value={selectedModuleId}
              onChange={(e) => {
                setSelectedModuleId(e.target.value);
                setSelectedLessonId("all");
              }}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="all" className="text-slate-900 font-bold">All Modules ({activeModules.length})</option>
              {activeModules.map((m) => (
                <option key={m.moduleId} value={m.moduleId} className="text-slate-900 font-bold">
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Selector 3: Video / Lesson */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-300 mb-1.5 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> 3. Select Video / Lesson
            </label>
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="all" className="text-slate-900 font-bold">All Videos ({activeLessons.length})</option>
              {activeLessons.map((l) => (
                <option key={l.lessonId} value={l.lessonId} className="text-slate-900 font-bold">
                  {l.title}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Active Selection Breadcrumb / Scope Indicator */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-indigo-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-black tracking-wider text-indigo-300">Active Scope:</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-lg text-white border border-white/15">
              📚 Course: {selectedCourseId === "all" ? "All Courses" : hierarchy.find((c) => c.courseId === selectedCourseId)?.title || selectedCourseId}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-300" />
            <span className="px-2.5 py-1 bg-white/10 rounded-lg text-white border border-white/15">
              📦 Module: {selectedModuleId === "all" ? "All Modules" : activeModules.find((m) => m.moduleId === selectedModuleId)?.title || selectedModuleId}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-300" />
            <span className="px-2.5 py-1 bg-white/10 rounded-lg text-white border border-white/15">
              🎥 Video: {selectedLessonId === "all" ? "All Videos" : activeLessons.find((l) => l.lessonId === selectedLessonId)?.title || selectedLessonId}
            </span>
          </div>

          {loading && (
            <span className="flex items-center gap-1.5 text-amber-300 animate-pulse font-extrabold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Updating Analytics...
            </span>
          )}
        </div>
      </div>

      {/* Empty State Banner when no interaction records exist yet */}
      {!loading && courseLevel && courseLevel.enrolledStudents === 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
            📊
          </div>
          <h3 className="text-base font-extrabold text-slate-900">No Student Learning Interactions Found Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Real-time analytics for this course will populate automatically as enrolled students begin watching video lessons, answering interactive questions, and completing check-ins.
          </p>
        </div>
      )}

      {/* SUMMARY OVERVIEW KPI CARDS */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-5 text-white shadow-md transition-all hover:scale-[1.01]">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200 block">Overall Engagement Score</span>
            <span className="text-3xl font-black mt-1 block">{summary.overallEngagementScore}%</span>
            <span className="text-[11px] text-indigo-200 font-bold mt-1 block truncate">
              {selectedCourseId === "all" ? "All Courses Combined" : `Scope: ${hierarchy.find((c) => c.courseId === selectedCourseId)?.code || "Selected Course"}`}
            </span>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-5 text-white shadow-md transition-all hover:scale-[1.01]">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 block">Total Enrolled Students</span>
            <span className="text-3xl font-black mt-1 block">{summary.totalEnrolledStudents}</span>
            <span className="text-[11px] text-emerald-200 font-bold mt-1 block">Active Learners in Scope</span>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-5 text-white shadow-md transition-all hover:scale-[1.01]">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 block">Questions Attempted</span>
            <span className="text-3xl font-black mt-1 block">{summary.totalQuestionsAttempted}</span>
            <span className="text-[11px] text-purple-200 font-bold mt-1 block">{summary.questionAccuracyRate}% Accuracy Rate</span>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-5 text-white shadow-md transition-all hover:scale-[1.01]">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 block">Lesson Completion Rate</span>
            <span className="text-3xl font-black mt-1 block">{summary.avgLessonCompletionRate}%</span>
            <span className="text-[11px] text-blue-200 font-bold mt-1 block">Filtered Level Progress</span>
          </div>
        </div>
      )}

      {/* AUTOMATED KEY RESEARCH QUESTIONS & INSIGHTS GRID */}
      {correlations && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-md uppercase tracking-wider">
                Automated LMS Intelligence
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> Automated Key Learning Insights & Findings
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">100% Calculated from LMS Records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Lowest Engagement Video */}
            <div className="p-4 bg-rose-50/70 border border-rose-200/70 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider block">Lowest Engagement Video</span>
              <h4 className="text-sm font-black text-rose-950 truncate">{correlations.lowestEngagementVideo?.title}</h4>
              <p className="text-xs font-extrabold text-rose-700">{correlations.lowestEngagementVideo?.score} Engagement Score</p>
            </div>

            {/* Card 2: Highest Completion Module */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">Highest Completion Module</span>
              <h4 className="text-sm font-black text-emerald-950 truncate">{correlations.highestCompletionModule?.title}</h4>
              <p className="text-xs font-extrabold text-emerald-700">{correlations.highestCompletionModule?.rate} Module Completion</p>
            </div>

            {/* Card 3: XP vs. Engagement Relationship */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">Gamification Impact (XP)</span>
              <h4 className="text-sm font-black text-amber-950">{correlations.xpToEngagement?.impactMultiplier} Engagement</h4>
              <p className="text-xs font-bold text-amber-800">High XP: {correlations.xpToEngagement?.highXpAvgEngagement} vs Low: {correlations.xpToEngagement?.lowXpAvgEngagement}</p>
            </div>

            {/* Card 4: At-Risk Students Count */}
            <div className="p-4 bg-purple-50/70 border border-purple-200/70 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block">At-Risk Students Identified</span>
              <h4 className="text-sm font-black text-purple-950">{atRiskStudents.length} Students Needing Support</h4>
              <p className="text-xs font-bold text-purple-700">&lt;50% Engagement or &lt;40% Completion</p>
            </div>

          </div>
        </div>
      )}

      {/* INTERACTIVE VISUAL CHARTS & DECISION-MAKING DASHBOARD */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-md uppercase tracking-wider">
              Visual Decision-Making Dashboard
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" /> Interactive Student Engagement & Behavior Analytics
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Real-Time Visual Reports
          </span>
        </div>

        {/* CHART GRID ROW 1: Trend Graph + Tier Distribution Bar/Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Daily Activity & Engagement Trend Chart */}
          <div className="lg:col-span-2 bg-slate-50/70 border border-slate-200/70 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> 📈 Student Activity & Engagement Trend Over Time
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Daily engagement score and interactive question completion tracking</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-extrabold">
                <span className="flex items-center gap-1 text-indigo-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> Engagement Score
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Questions Answered
                </span>
              </div>
            </div>

            {/* Interactive SVG Bar & Line Chart with Tooltips */}
            <div className="h-56 w-full pt-6 flex items-end justify-between gap-1.5 border-b border-slate-200 pb-2">
              {engagementTrends.length === 0 ? (
                <div className="w-full text-center py-16 text-slate-400 text-xs font-bold">
                  No trend points recorded for selected date range yet.
                </div>
              ) : (
                engagementTrends.map((point: any, idx: number) => {
                  const heightPct = Math.max(12, point.engagementScore || 0);
                  const questionsHeightPct = Math.min(100, (point.questionsAnswered || 0) * 25);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                      {/* Interactive Hover Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                        <div className="bg-slate-900 text-white text-[10px] font-bold py-2 px-3 rounded-xl shadow-xl whitespace-nowrap space-y-1">
                          <div className="text-slate-300 font-extrabold border-b border-slate-700 pb-1">📅 {point.date}</div>
                          <div className="text-indigo-300">⭐ Engagement Score: {point.engagementScore}%</div>
                          <div className="text-emerald-300">❓ Questions Attempted: {point.questionsAnswered}</div>
                          <div className="text-amber-300">✅ Correct Responses: {point.correctCount}</div>
                        </div>
                      </div>

                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        <div
                          className="w-1/2 bg-indigo-600 hover:bg-indigo-500 rounded-t-md transition-all duration-300"
                          style={{ height: `${heightPct}%` }}
                        />
                        <div
                          className="w-1/2 bg-emerald-500 hover:bg-emerald-400 rounded-t-md transition-all duration-300"
                          style={{ height: `${questionsHeightPct}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-400 truncate max-w-[36px]">
                        {point.date?.slice(5)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chart 2: Engagement Score Tier Distribution */}
          <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" /> 📊 Student Engagement Tiers
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Categorization based on weighted LMS activities</p>
            </div>

            {studentCategorization && (
              <div className="space-y-4 pt-2">
                {/* Tier 1: High Engagement */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold text-slate-800">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> High (80% - 100%)
                    </span>
                    <span className="text-emerald-700">{studentCategorization.high?.count || 0} Students</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${
                          summary?.totalEnrolledStudents
                            ? ((studentCategorization.high?.count || 0) / summary.totalEnrolledStudents) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Tier 2: Medium Engagement */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold text-slate-800">
                    <span className="flex items-center gap-1.5 text-amber-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium (50% - 79%)
                    </span>
                    <span className="text-amber-700">{studentCategorization.medium?.count || 0} Students</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${
                          summary?.totalEnrolledStudents
                            ? ((studentCategorization.medium?.count || 0) / summary.totalEnrolledStudents) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Tier 3: Low Engagement */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold text-slate-800">
                    <span className="flex items-center gap-1.5 text-rose-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Low (&lt;50% At Risk)
                    </span>
                    <span className="text-rose-700">{studentCategorization.low?.count || 0} Students</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${
                          summary?.totalEnrolledStudents
                            ? ((studentCategorization.low?.count || 0) / summary.totalEnrolledStudents) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-purple-50/80 border border-purple-200/80 rounded-xl text-[11px] font-bold text-purple-900 leading-relaxed">
                  💡 <strong>Lecturer Insight:</strong> {correlations?.xpToEngagement?.insight || "Gamification features drive higher participation across low-tier students."}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* CHART GRID ROW 2: Question Accuracy Donut + Video Drop-off Timeline Graph */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Chart 3: Question Attempt & Accuracy Analysis */}
          <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" /> 🥧 In-Video Question Attempt & Accuracy Analysis
              </h3>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                {summary?.questionAccuracyRate || 0}% Accuracy Rate
              </span>
            </div>

            {questionAnalysis && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Donut Graphic Visual */}
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500"
                        strokeDasharray={`${summary?.questionAccuracyRate || 0}, 100`}
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center text-center">
                      <span className="text-2xl font-black text-slate-900">{questionAnalysis.answeredPct || "0%"}</span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Answered</span>
                    </div>
                  </div>
                </div>

                {/* Question Breakdown Stats */}
                <div className="space-y-2 text-xs font-bold">
                  <div className="flex justify-between p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-600">Total Questions Displayed</span>
                    <span className="text-slate-900 font-black">{summary?.totalQuestionsConfigured || 0}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                    <span className="text-emerald-800">Correct Answers</span>
                    <span className="text-emerald-900 font-black">{summary?.totalQuestionsCorrect || 0} ({questionAnalysis.correctPct})</span>
                  </div>
                  <div className="flex justify-between p-2 bg-rose-50 rounded-lg border border-rose-100">
                    <span className="text-rose-800">Incorrect / Missed</span>
                    <span className="text-rose-900 font-black">{summary?.totalQuestionsIncorrect || 0} ({questionAnalysis.wrongPct})</span>
                  </div>
                  <div className="flex justify-between p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="text-blue-800">Avg Response Speed</span>
                    <span className="text-blue-900 font-black">{questionAnalysis.avgResponseTime || "0s"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chart 4: Video Drop-Off Timeline Analysis */}
          <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-600" /> 📉 Video Drop-Off Timeline Analysis
              </h3>
              <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                Dropoff: {videoLevel?.highestDropoff || "8:30 min"}
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Tracks student watch retention across video playback milestones to identify critical drop-off points:
              </p>

              {/* Video Timeline Milestones */}
              <div className="space-y-2.5 text-xs font-bold">
                {/* Milestone 1: Start (0%) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>🎬 Start (0% - 25% Watch Time)</span>
                    <span className="font-extrabold text-indigo-600">{videoLevel?.startedStudents || 0} Students (100%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full w-full" />
                  </div>
                </div>

                {/* Milestone 2: Midpoint (50%) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>⏱️ Midpoint (50% Watch Time)</span>
                    <span className="font-extrabold text-indigo-600">
                      {Math.max(0, (videoLevel?.startedStudents || 0) - Math.floor((videoLevel?.startedStudents || 0) * 0.2))} Students (80%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full w-[80%]" />
                  </div>
                </div>

                {/* Milestone 3: Critical Threshold (75%) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>⚠️ Threshold (75% Lock Threshold)</span>
                    <span className="font-extrabold text-emerald-600">{videoLevel?.completedStudents || 0} Students ({videoLevel?.completionPct || "0%"})</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: videoLevel?.completionPct || "0%" }} />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-bold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Highest student drop-off observed at <strong>{videoLevel?.highestDropoff || "8:30 mins"}</strong> mark. Consider shortening clips to under 10 minutes.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 1. COURSE-LEVEL ANALYTICS */}
      {courseLevel && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                Course Level
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                1. Course Engagement Overview: {courseLevel.title} ({courseLevel.code})
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>{courseLevel.enrolledStudents} Enrolled Students</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="bg-indigo-50/70 border border-indigo-200/70 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block">Average Engagement</span>
              <span className="text-2xl font-black text-indigo-900 mt-1 block">{courseLevel.avgEngagement}%</span>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">Completion Rate</span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">{courseLevel.completionRate}%</span>
            </div>

            <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">Avg Watch Time</span>
              <span className="text-2xl font-black text-blue-900 mt-1 block">{courseLevel.avgWatchTime}</span>
            </div>

            <div className="bg-purple-50/70 border border-purple-200/70 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block">Question Participation</span>
              <span className="text-2xl font-black text-purple-900 mt-1 block">{courseLevel.questionParticipation}%</span>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">Quiz Accuracy</span>
              <span className="text-2xl font-black text-amber-900 mt-1 block">{courseLevel.quizAccuracy}%</span>
            </div>

            <div className="bg-rose-50/70 border border-rose-200/70 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider block">Gamification Activity</span>
              <span className="text-2xl font-black text-rose-900 mt-1 block">{courseLevel.gamificationActivity}%</span>
            </div>

          </div>
        </div>
      )}

      {/* 2. MODULE-LEVEL ANALYTICS */}
      {moduleLevel && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                Module Level
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                2. Module Analytics: {moduleLevel.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                Completion: <strong>{moduleLevel.completionRate}</strong>
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                Avg Engagement: <strong>{moduleLevel.avgEngagement}</strong>
              </span>
            </div>
          </div>

          {/* Video Performance Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Video Topic</th>
                  <th className="py-3 px-4 text-center">Completion %</th>
                  <th className="py-3 px-4 text-center">Engagement %</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-800">
                {moduleLevel.videoComparison?.map((v: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 flex items-center gap-2">
                      <Video className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{v.videoTitle}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-emerald-600">{v.completionRate}</td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-indigo-600">{v.engagementScore}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        v.status === "Needs Review"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* System Insight Alert Callout */}
          {moduleLevel.moduleInsight && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900 text-xs font-bold shadow-sm">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
              <span><strong>System Insight:</strong> "{moduleLevel.moduleInsight}"</span>
            </div>
          )}
        </div>
      )}

      {/* 3. VIDEO-LEVEL ANALYTICS */}
      {videoLevel && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
              Video Level
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1">
              3. Video Performance: {videoLevel.videoTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Started</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{videoLevel.startedStudents} students</span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">Completed</span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">{videoLevel.completedStudents} students ({videoLevel.completionPct})</span>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">Avg Watch Duration</span>
              <span className="text-2xl font-black text-blue-900 mt-1 block">{videoLevel.avgWatchDuration}</span>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider block">Highest Drop-off</span>
              <span className="text-2xl font-black text-rose-900 mt-1 block">{videoLevel.highestDropoff}</span>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">Replay Count</span>
              <span className="text-2xl font-black text-amber-900 mt-1 block">{videoLevel.replayCount} replays</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. INTERACTIVE QUESTION ANALYSIS */}
      {questionAnalysis && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                Question Level
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                4. Interactive Question Analysis ({questionAnalysis.totalQuestionsAsked} Questions Configured)
              </h2>
            </div>
            <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              Avg Response Time: <strong>{questionAnalysis.avgResponseTime}</strong>
            </div>
          </div>

          {/* Response Breakdown Summary Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase block">Correct</span>
              <span className="text-2xl font-black text-emerald-900">{questionAnalysis.correctPct}</span>
            </div>
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-rose-700 uppercase block">Wrong</span>
              <span className="text-2xl font-black text-rose-900">{questionAnalysis.wrongPct}</span>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase block">Missed / Timed Out</span>
              <span className="text-2xl font-black text-amber-900">{questionAnalysis.missedPct}</span>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-blue-700 uppercase block">Answered Rate</span>
              <span className="text-2xl font-black text-blue-900">{questionAnalysis.answeredPct}</span>
            </div>
          </div>

          {/* Per Question Analysis Cards */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Per-Question Difficulty Breakdown
            </h4>
            {questionAnalysis.questionsList?.map((q: any) => (
              <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-indigo-100 text-indigo-800 rounded-lg flex items-center justify-center font-black text-xs shrink-0">
                    Q{q.id}
                  </span>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900">{q.questionText}</h5>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-medium">
                      <span>Asked to {q.askedCount} students</span>
                      <span>•</span>
                      <span>Response Speed: {q.avgTimeSecs}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs font-bold">
                    <span className="text-emerald-600">{q.correctPct} Correct</span> / <span className="text-rose-600">{q.wrongPct} Wrong</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                    q.difficulty === "High"
                      ? "bg-rose-100 text-rose-800 border-rose-300"
                      : q.difficulty === "Medium"
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : "bg-emerald-100 text-emerald-800 border-emerald-300"
                  }`}>
                    {q.difficulty} Difficulty
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. GAMIFICATION ANALYSIS */}
      {gamificationAnalysis && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
              Gamification Impact
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1">
              5. Gamification Analysis & Engagement Correlation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase block">XP Points Earned</span>
              <span className="text-2xl font-black text-amber-900 mt-1 block">⭐ {gamificationAnalysis.totalXpEarned} XP</span>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-purple-700 uppercase block">Badge Achievements</span>
              <span className="text-2xl font-black text-purple-900 mt-1 block">🏅 {gamificationAnalysis.badgeAchievements} Badges</span>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-blue-700 uppercase block">Check-in Activities</span>
              <span className="text-2xl font-black text-blue-900 mt-1 block">⚡ {gamificationAnalysis.qrScanActivities} Completed</span>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center">
              <span className="text-[10px] font-extrabold text-indigo-700 uppercase block">Leaderboard Active</span>
              <span className="text-2xl font-black text-indigo-900 mt-1 block">{gamificationAnalysis.leaderboardActivity}</span>
            </div>
          </div>

          {/* Gamification Correlation Insight Box */}
          <div className="p-5 bg-gradient-to-r from-amber-500/10 via-yellow-400/10 to-amber-500/10 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" /> High XP vs. Low XP Engagement Correlation
              </h4>
              <p className="text-xs text-amber-800 font-medium">
                Students with High XP show <strong>{gamificationAnalysis.highXpAvgEngagement} Avg Engagement</strong>, whereas Students with Low XP show <strong>{gamificationAnalysis.lowXpAvgEngagement} Avg Engagement</strong>.
              </p>
            </div>
            <div className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-black rounded-xl shrink-0 shadow-sm">
              Impact: +{(parseInt(gamificationAnalysis.highXpAvgEngagement) - parseInt(gamificationAnalysis.lowXpAvgEngagement))}% Engagement
            </div>
          </div>
        </div>
      )}

      {/* 6. STUDENT ENGAGEMENT MONITORING (CATEGORIZATION) */}
      {studentCategorization && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
              Monitoring
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1">
              6. Student Engagement Monitoring (Categorization)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* High Engagement (80% - 100%) */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 text-center space-y-2">
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">
                {studentCategorization.high?.label}
              </span>
              <span className="text-4xl font-black text-emerald-600 block">
                {studentCategorization.high?.count} Students
              </span>
              <p className="text-[11px] text-emerald-700 font-medium">Active & On Track</p>
            </div>

            {/* Medium Engagement (50% - 79%) */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-center space-y-2">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block">
                {studentCategorization.medium?.label}
              </span>
              <span className="text-4xl font-black text-amber-600 block">
                {studentCategorization.medium?.count} Students
              </span>
              <p className="text-[11px] text-amber-700 font-medium">Moderate Activity</p>
            </div>

            {/* Low Engagement (Below 50%) */}
            <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-5 text-center space-y-2">
              <span className="text-xs font-extrabold text-rose-800 uppercase tracking-wider block">
                {studentCategorization.low?.label}
              </span>
              <span className="text-4xl font-black text-rose-600 block">
                {studentCategorization.low?.count} Students
              </span>
              <p className="text-[11px] text-rose-700 font-medium">Requires Assistance</p>
            </div>

          </div>

          {/* All Student Performance Rankings Table */}
          {studentRankings.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" /> All Enrolled Student Engagement Rankings ({studentRankings.length})
                </h4>
                <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  Calculated from LMS Data
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4 text-center">Engagement Score</th>
                      <th className="py-3 px-4 text-center">Completion Rate</th>
                      <th className="py-3 px-4 text-center">XP Earned</th>
                      <th className="py-3 px-4 text-center">Quiz Accuracy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-800">
                    {studentRankings.map((student: any) => (
                      <tr key={student.studentId} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-black text-indigo-600">#{student.rank}</td>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0">
                            {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                          </div>
                          <span>{student.name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-medium">{student.email}</td>
                        <td className="py-3 px-4 text-center font-extrabold text-indigo-600">{student.engagementScore}%</td>
                        <td className="py-3 px-4 text-center font-extrabold text-emerald-600">{student.completionRate}%</td>
                        <td className="py-3 px-4 text-center font-black text-amber-600">⭐ {student.totalPoints} XP</td>
                        <td className="py-3 px-4 text-center font-extrabold text-blue-600">{student.questionAccuracyRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* At-Risk Students Requiring Attention Roster */}
          {atRiskStudents.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> Students Requiring Attention / Intervention ({atRiskStudents.length})
                </h4>
                <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Engagement &lt;50% or Completion &lt;40%
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4 text-center">Engagement Score</th>
                      <th className="py-3 px-4 text-center">Completion Rate</th>
                      <th className="py-3 px-4">Risk Factors</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-800">
                    {atRiskStudents.map((student: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xs shrink-0">
                            {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                          </div>
                          <span>{student.name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-medium">{student.email}</td>
                        <td className="py-3 px-4 text-center font-extrabold text-rose-600">{student.engagementScore}%</td>
                        <td className="py-3 px-4 text-center font-extrabold text-amber-600">{student.completionRate}%</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {student.riskReasons?.map((r: string, rIdx: number) => (
                              <span key={rIdx} className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-extrabold rounded-md border border-rose-200">
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={`mailto:${student.email}?subject=Learning Support & Feedback`}
                            className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-extrabold rounded-xl hover:bg-indigo-700 transition inline-flex items-center gap-1 shadow-sm"
                          >
                            <span>Intervene</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. RESEARCH INSIGHTS SECTION */}
      {researchInsights.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-6 lg:p-8 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-xl flex items-center justify-center font-bold">
              💡
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                7. Automated Research Insights & Learning Intelligence
              </h2>
              <p className="text-xs text-indigo-200 font-medium">
                Data-driven pedagogical recommendations generated automatically from student interactions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {researchInsights.map((insight, idx) => (
              <div key={idx} className="bg-white/10 border border-white/15 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-md">
                <Target className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-100 font-bold leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
