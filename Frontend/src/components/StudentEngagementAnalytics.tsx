"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import {
  BarChart2,
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  Search,
  Filter,
  RefreshCw,
  Users,
  Star,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  MessageSquare,
  FileText,
  UserX
} from "lucide-react";

interface SummaryData {
  overallEngagementScore: number;
  totalEnrolledStudents: number;
  totalCourses: number;
  totalLessons: number;
  totalQuestionsConfigured: number;
  totalQuestionsAttempted: number;
  totalQuestionsCorrect: number;
  totalQuestionsIncorrect: number;
  questionParticipationRate: number;
  questionAccuracyRate: number;
  avgResponseTimeSecs: number;
  avgLessonCompletionRate: number;
  totalSkippedInteractions: number;
  totalCheckInsCompleted: number;
  avgLessonRating: number;
  atRiskStudentCount: number;
}

interface TrendPoint {
  date: string;
  engagementScore: number;
  questionsAnswered: number;
  correctCount: number;
}

interface CourseSummary {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  instructorName: string;
  enrolledStudentsCount: number;
  avgEngagementScore: number;
  completedLessonsSum: number;
  totalQuestionsAnswered: number;
  atRiskCount: number;
}

interface StudentRanking {
  rank: number;
  studentId: string;
  name: string;
  email: string;
  profilePhoto?: string;
  courseName: string;
  engagementScore: number;
  completionRate: number;
  questionAccuracyRate: number;
  totalQuestionsAttempted: number;
  totalQuestionsCorrect: number;
  totalCheckIns: number;
  totalPoints: number;
  avgResponseTime: number;
  isAtRisk: boolean;
  riskReason?: string;
  lastActiveDate?: string | null;
}

interface FilterOptions {
  courses: { id: string; title: string; code: string }[];
  students: { id: string; name: string }[];
}

export default function StudentEngagementAnalytics({ role = "LECTURER" }: { role?: "LECTURER" | "ADMIN" }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [students, setStudents] = useState<StudentRanking[]>([]);
  const [atRiskList, setAtRiskList] = useState<StudentRanking[]>([]);
  const [availableFilters, setAvailableFilters] = useState<FilterOptions>({ courses: [], students: [] });

  // Filters State
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedLesson, setSelectedLesson] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("30d");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"overview" | "rankings" | "atRisk" | "courses">("overview");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCourse !== "all") params.courseId = selectedCourse;
      if (selectedLesson !== "all") params.lessonId = selectedLesson;
      if (selectedDateRange !== "all") params.dateRange = selectedDateRange;

      const endpoint = role === "ADMIN" ? "/analytics/engagement" : "/courses/analytics/interactive";
      const { data } = await api.get(endpoint, { params });

      setSummary(data.summary || null);
      setTrends(data.engagementTrends || []);
      setCourses(data.courseSummaries || []);
      setStudents(data.studentRankings || []);
      setAtRiskList(data.atRiskStudents || []);
      if (data.availableFilters) {
        setAvailableFilters((prev) => ({
          courses: data.availableFilters.courses?.length > 0 ? data.availableFilters.courses : prev.courses,
          students: data.availableFilters.students?.length > 0 ? data.availableFilters.students : prev.students
        }));
      }
    } catch (err) {
      console.error("Failed to load engagement analytics", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse, selectedLesson, selectedDateRange, role]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-300";
    if (score >= 50) return "bg-amber-100 text-amber-800 border-amber-300";
    return "bg-rose-100 text-rose-800 border-rose-300 animate-pulse";
  };

  return (
    <div className="space-y-6">

      {/* Header & Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Engagement Insights</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Student Engagement Analytics
            </h1>
            <p className="text-slate-300 text-xs lg:text-sm mt-1 max-w-2xl font-medium">
              Monitor active student participation during video lessons, question responses, knowledge checks, and interactive check-ins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAnalytics}
              className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md cursor-pointer"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-3 relative z-10">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1 block">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2.5 bg-white/10 border border-white/15 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="all" className="text-slate-900 font-bold">All Courses ({availableFilters.courses.length})</option>
              {availableFilters.courses.map((c) => (
                <option key={c.id} value={c.id} className="text-slate-900 font-bold">
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1 block">Time Frame</label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full p-2.5 bg-white/10 border border-white/15 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="7d" className="text-slate-900 font-bold">Last 7 Days</option>
              <option value="30d" className="text-slate-900 font-bold">Last 30 Days</option>
              <option value="90d" className="text-slate-900 font-bold">Last 90 Days</option>
              <option value="all" className="text-slate-900 font-bold">All Time</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1 block">Search Student</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs font-bold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Level Metric Cards Grid */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Overall Engagement Score */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engagement Score</span>
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <BarChart2 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{summary.overallEngagementScore}%</span>
              <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> High
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Calculated across lesson completion, question responses & ratings
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${summary.overallEngagementScore}%` }}
              />
            </div>
          </div>

          {/* Card 2: Question Participation & Accuracy */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question Accuracy</span>
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{summary.questionAccuracyRate}%</span>
              <span className="text-xs font-bold text-slate-500">({summary.totalQuestionsCorrect} / {summary.totalQuestionsAttempted})</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Correct answers submitted during lesson video checkpoints
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${summary.questionAccuracyRate}%` }}
              />
            </div>
          </div>

          {/* Card 3: Avg Response Time & Skipped */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Response Time</span>
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{summary.avgResponseTimeSecs}s</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {summary.totalSkippedInteractions} Skipped
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Average seconds taken per interactive question
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, summary.avgResponseTimeSecs * 3)}%` }}
              />
            </div>
          </div>

          {/* Card 4: At-Risk Students Warning */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">At-Risk Students</span>
              <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-600">{summary.atRiskStudentCount}</span>
              <span className="text-xs font-bold text-rose-600">Students (&lt;50% score)</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Need immediate intervention or additional support
            </p>
            <button
              onClick={() => setActiveTab("atRisk")}
              className="mt-3 text-xs font-extrabold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View At-Risk Roster</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm">
        {[
          { id: "overview", label: "📊 Engagement Overview", icon: BarChart2 },
          { id: "rankings", label: `🏆 Student Rankings (${students.length})`, icon: Award },
          { id: "atRisk", label: `⚠️ At-Risk Students (${atRiskList.length})`, icon: ShieldAlert, badge: atRiskList.length },
          { id: "courses", label: `📚 Course Summaries (${courses.length})`, icon: BookOpen },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & TREND CHARTS */}
      {activeTab === "overview" && (
        <div className="space-y-6">

          {/* Engagement Trend Graph */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> Engagement Trends Over Time
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Daily tracking of overall student engagement score and question completion
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" /> Engagement Score
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Questions Answered
                </span>
              </div>
            </div>

            {/* Visual SVG Chart */}
            <div className="h-64 w-full pt-4 flex items-end justify-between gap-2 border-b border-slate-200 pb-2">
              {trends.map((point, idx) => {
                const heightPct = Math.max(15, point.engagementScore);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20">
                      <div className="bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap">
                        <div>📅 {point.date}</div>
                        <div>⭐ Score: {point.engagementScore}%</div>
                        <div>❓ Questions: {point.questionsAnswered}</div>
                      </div>
                    </div>

                    <div className="w-full flex items-end justify-center gap-1 h-48">
                      <div
                        className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-t-lg transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 truncate max-w-[40px]">
                      {point.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Completion Rates Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" /> Lesson Completion Rate
              </h4>
              <div className="text-center py-4">
                <div className="text-4xl font-black text-blue-600 mb-1">
                  {summary?.avgLessonCompletionRate}%
                </div>
                <p className="text-xs font-bold text-slate-600">Average Lesson Watch/Read Progress</p>
              </div>
              <div className="space-y-2 text-xs font-bold text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Total Lessons Available</span>
                  <span className="text-slate-900">{summary?.totalLessons}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Active Enrolled Students</span>
                  <span className="text-slate-900">{summary?.totalEnrolledStudents}</span>
                </div>
              </div>
            </div>

            {/* In-Video Questions Performance */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" /> In-Video Question Stats
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Correct Responses</span>
                  <span className="text-emerald-600 font-extrabold">{summary?.totalQuestionsCorrect}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${summary?.questionAccuracyRate}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Incorrect Responses</span>
                  <span className="text-rose-600 font-extrabold">{summary?.totalQuestionsIncorrect}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${100 - (summary?.questionAccuracyRate || 0)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Lesson Rating & Check-in Feedback */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Student Feedback & Ratings
              </h4>
              <div className="text-center py-2">
                <div className="text-4xl font-black text-amber-500 mb-1 flex items-center justify-center gap-1">
                  <span>{summary?.avgLessonRating}</span>
                  <span className="text-2xl">⭐</span>
                </div>
                <p className="text-xs font-bold text-slate-600">Average Lesson Satisfaction</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium text-center">
                💬 <strong>{summary?.totalCheckInsCompleted} Check-ins Completed</strong> by students across video & reading materials.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: STUDENT RANKINGS & LEADERBOARD */}
      {activeTab === "rankings" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" /> Student Engagement Leaderboard
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Ranked by overall engagement score combining lesson progress, question accuracy & check-ins
              </p>
            </div>
            <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              Showing {filteredStudents.length} Students
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4 text-center">Engagement Score</th>
                  <th className="py-3.5 px-4 text-center">Completion</th>
                  <th className="py-3.5 px-4 text-center">Accuracy</th>
                  <th className="py-3.5 px-4 text-center">Questions</th>
                  <th className="py-3.5 px-4 text-center">Avg Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-800">
                {filteredStudents.map((student) => (
                  <tr key={student.studentId} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6">
                      {student.rank === 1 && <span className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded-full font-black text-[11px] shadow-sm">🥇 #1</span>}
                      {student.rank === 2 && <span className="px-2.5 py-1 bg-slate-300 text-slate-900 rounded-full font-black text-[11px]">🥈 #2</span>}
                      {student.rank === 3 && <span className="px-2.5 py-1 bg-amber-600 text-white rounded-full font-black text-[11px]">🥉 #3</span>}
                      {student.rank > 3 && <span className="text-slate-500 font-extrabold">#{student.rank}</span>}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 text-indigo-700 font-extrabold rounded-full flex items-center justify-center shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            {student.name}
                            {student.isAtRisk && (
                              <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[9px] font-black uppercase">
                                At-Risk
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-600">{student.courseName}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${getScoreBadgeColor(student.engagementScore)}`}>
                        {student.engagementScore}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-extrabold text-slate-700">{student.completionRate}%</td>
                    <td className="py-4 px-4 text-center font-extrabold text-emerald-600">{student.questionAccuracyRate}%</td>
                    <td className="py-4 px-4 text-center text-slate-600">{student.totalQuestionsAttempted}</td>
                    <td className="py-4 px-4 text-center text-slate-500">{student.avgResponseTime}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AT-RISK STUDENTS ROSTER */}
      {activeTab === "atRisk" && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6">
            <h3 className="text-base font-extrabold text-rose-900 flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> At-Risk Students Roster & Early Warnings
            </h3>
            <p className="text-xs text-rose-700 font-medium">
              Students identified with low engagement scores (&lt;50%) or low lesson completion rates (&lt;40%) requiring proactive intervention.
            </p>
          </div>

          {atRiskList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {atRiskList.map((student) => (
                <div key={student.studentId} className="bg-white border border-rose-200 rounded-2xl p-5 shadow-sm space-y-3 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 text-rose-700 font-black rounded-full flex items-center justify-center text-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">{student.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{student.email}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-rose-100 text-rose-800 font-black text-xs rounded-full border border-rose-300">
                      Score: {student.engagementScore}%
                    </span>
                  </div>

                  <div className="p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl text-xs text-rose-900 font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Risk Reason: {student.riskReason || "Low engagement score"}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold pt-1">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase">Completion</span>
                      <span className="text-slate-900 font-extrabold">{student.completionRate}%</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase">Accuracy</span>
                      <span className="text-emerald-600 font-extrabold">{student.questionAccuracyRate}%</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase">Check-ins</span>
                      <span className="text-amber-600 font-extrabold">{student.totalCheckIns}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <a
                      href={`mailto:${student.email}`}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contact / Send Reminder</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-base font-extrabold text-slate-900">No At-Risk Students Found! 🎉</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
                All enrolled students are actively engaging with course lessons and meeting required standards.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: COURSE SUMMARIES */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div key={course.courseId} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-md uppercase tracking-wider">
                    {course.courseCode}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1">{course.courseTitle}</h4>
                  <p className="text-xs text-slate-400 font-medium">Instructor: {course.instructorName}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-black border ${getScoreBadgeColor(course.avgEngagementScore)}`}>
                  {course.avgEngagementScore}%
                </div>
              </div>

              <div className="space-y-2 text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between py-1">
                  <span>Enrolled Students</span>
                  <span className="text-slate-900 font-extrabold">{course.enrolledStudentsCount}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Questions Answered</span>
                  <span className="text-emerald-600 font-extrabold">{course.totalQuestionsAnswered}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>At-Risk Students</span>
                  <span className={course.atRiskCount > 0 ? "text-rose-600 font-extrabold" : "text-slate-400"}>
                    {course.atRiskCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
