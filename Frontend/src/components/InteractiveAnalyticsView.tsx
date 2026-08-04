"use client";

import React, { useEffect, useState } from "react";
import { Star, HelpCircle, Award, Users, CheckCircle2, TrendingUp, RefreshCw, BarChart2 } from "lucide-react";
import api from "@/lib/api";

export default function InteractiveAnalyticsView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/courses/analytics/interactive");
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load interactive analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-600">Loading Interactive Video Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
        <h3 className="font-bold mb-1">Could not load interactive report</h3>
        <p className="text-xs">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-3 px-4 py-1.5 bg-white border border-red-300 rounded-lg text-xs font-bold shadow-sm hover:bg-red-100"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { summary, lessonAnalytics = [], studentSummary = [] } = data || {};

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 font-bold text-xs rounded-full border border-blue-400/30 mb-2">
            <ZapIcon /> Interactive Video Module Monitoring
          </div>
          <h2 className="text-xl font-bold">Student Video Attention & Check-in Analytics</h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Real-time tracking of embedded QR code check-ins, checkpoint questions, and student participation.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engagement Check-ins</span>
            <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{summary?.totalQrScans || 0}</div>
          <p className="text-xs text-slate-500 font-medium mt-1">Verified student ratings & feedback</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verifications Answered</span>
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{summary?.totalQuestionsAttempted || 0}</div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Accuracy Rate: <strong className="text-blue-600">{summary?.questionAccuracyRate || 0}%</strong>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Response Time</span>
            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{summary?.avgResponseTimeSecs || 0}s</div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Avg Attempts / Task: <strong className="text-purple-600">{summary?.avgAttemptsPerQuestion || "1.0"}</strong>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Points Awarded</span>
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">+{summary?.totalInteractivePoints || 0}</div>
          <p className="text-xs text-slate-500 font-medium mt-1">Earned via active verifications</p>
        </div>
      </div>

      {/* Interactive Video Lessons Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Lesson Active Verification Performance</h3>
            <p className="text-xs text-slate-400 font-medium">Breakdown of verification checkpoints across video and reading lessons</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 uppercase font-extrabold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Course & Lesson</th>
                <th className="p-4">Format</th>
                <th className="p-4 text-center">Engagement Prompts</th>
                <th className="p-4 text-center">Configured Questions</th>
                <th className="p-4 text-center">Students Engaged</th>
                <th className="p-4 text-center">Correct Answers</th>
                <th className="p-4 text-center">Avg Response Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {lessonAnalytics.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No interactive video lessons configured yet.
                  </td>
                </tr>
              ) : (
                lessonAnalytics.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{item.lessonTitle}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.courseCode} - {item.courseTitle} ({item.moduleTitle})</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[10px] ${item.lessonType === 'video' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {item.lessonType === 'video' ? '🎥 Video' : '📖 Reading'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                        {item.qrCount} QR
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                        {item.questionCount} Tasks
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-slate-800">{item.studentsParticipatedCount}</td>
                    <td className="p-4 text-center font-bold text-emerald-600">{item.questionsCorrectCount}</td>
                    <td className="p-4 text-center font-bold text-purple-600">{item.avgResponseTimeSecs ? `${item.avgResponseTimeSecs}s` : 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Video Participation Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Student Video Check-in Log</h3>
            <p className="text-xs text-slate-400 font-medium">Individual student check-in & interactive task progress</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 uppercase font-extrabold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4 text-center">Lessons Attended</th>
                <th className="p-4 text-center">QR Codes Scanned</th>
                <th className="p-4 text-center">Questions Correct</th>
                <th className="p-4 text-center">Interactive XP Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {studentSummary.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No student interaction records yet.
                  </td>
                </tr>
              ) : (
                studentSummary.map((s: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{s.name}</div>
                      <div className="text-[11px] text-slate-400">{s.email}</div>
                    </td>
                    <td className="p-4 text-center font-bold text-slate-700">{s.lessonsEngaged}</td>
                    <td className="p-4 text-center font-bold text-amber-600">{s.totalQrScanned}</td>
                    <td className="p-4 text-center font-bold text-blue-600">{s.totalQuestionsAnswered}</td>
                    <td className="p-4 text-center font-bold text-emerald-600">+{s.totalInteractivePoints} PTS</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ZapIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-blue-400 fill-current" viewBox="0 0 24 24">
      <path d="M13 2L3 14h7v8l10-12h-7z" />
    </svg>
  );
}
