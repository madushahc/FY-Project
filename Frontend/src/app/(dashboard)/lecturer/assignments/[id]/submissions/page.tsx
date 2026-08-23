"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  FileText,
  Award,
  Star,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  X,
  BookOpen
} from 'lucide-react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import Loading from '@/components/ui/Loading';
import api from '@/lib/api';

export default function AssignmentSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const {
    submissions,
    fetchSubmissionsByAssignment,
    gradeSubmission,
    loading: assignmentLoading
  } = useAssignmentStore();

  const {
    badges,
    fetchBadges,
    loading: badgesLoading
  } = useGamificationStore();

  const [assignment, setAssignment] = useState<any>(null);
  const [assignmentLoadingLocal, setAssignmentLoadingLocal] = useState(true);

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Grading Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [bonusPoints, setBonusPoints] = useState<number>(0);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (assignment?.rubric && assignment.rubric.length > 0) {
      const sum = Object.values(rubricScores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      setScore(sum);
    }
  }, [rubricScores, assignment]);

  useEffect(() => {
    if (assignmentId) {
      const fetchAssignmentDetails = async () => {
        try {
          const res = await api.get(`/assignments/${assignmentId}`);
          setAssignment(res.data);
        } catch (err) {
          console.error("Failed to load assignment details:", err);
        } finally {
          setAssignmentLoadingLocal(false);
        }
      };

      fetchAssignmentDetails();
      fetchSubmissionsByAssignment(assignmentId);
      fetchBadges();
    }
  }, [assignmentId, fetchSubmissionsByAssignment, fetchBadges]);

  const handleOpenGradingModal = (submission: any) => {
    setSelectedSubmission(submission);
    setScore(submission.score !== undefined ? submission.score : 0);
    setFeedback(submission.feedback || '');
    setBonusPoints(0);
    setSelectedBadge('');

    const initialScores: Record<string, number> = {};
    if (assignment?.rubric && assignment.rubric.length > 0) {
      assignment.rubric.forEach((rub: any) => {
        const existingGrade = submission.rubricGrades?.find((rg: any) => rg.criteria === rub.criteria);
        initialScores[rub.criteria] = existingGrade ? existingGrade.score : 0;
      });
    }
    setRubricScores(initialScores);

    setIsGradingModalOpen(true);
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    if (score < 0 || score > (assignment?.points)) {
      alert(`Score must be between 0 and ${assignment?.points}`);
      return;
    }

    const rubricGradesPayload = assignment?.rubric && assignment.rubric.length > 0
      ? assignment.rubric.map((rub: any) => ({
        criteria: rub.criteria,
        points: rub.points,
        score: rubricScores[rub.criteria] || 0
      }))
      : undefined;

    setIsSaving(true);
    try {
      await gradeSubmission(
        selectedSubmission._id,
        score,
        feedback,
        bonusPoints,
        selectedBadge || undefined,
        rubricGradesPayload
      );

      // Refresh list
      await fetchSubmissionsByAssignment(assignmentId);
      setIsGradingModalOpen(false);
      setSelectedSubmission(null);
    } catch (err) {
      console.error("Failed to save grade:", err);
      alert("Failed to grade submission.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub: any) => {
    const studentName = sub.student?.name || '';
    const studentEmail = sub.student?.email || '';
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = statusFilter === 'All' ||
      (statusFilter === 'Graded' && sub.status === 'Graded') ||
      (statusFilter === 'Pending' && sub.status !== 'Graded');

    return matchesSearch && matchesFilter;
  });

  const getFileDownloadUrl = (fileUrl: string) => {
    if (!fileUrl) return '#';
    if (fileUrl.startsWith('http')) return fileUrl;
    return `http://localhost:5000${fileUrl}`;
  };

  // Stats calculation
  const totalSubmissions = submissions.length;
  const gradedCount = submissions.filter((s: any) => s.status === 'Graded').length;
  const pendingCount = totalSubmissions - gradedCount;
  const avgScore = gradedCount > 0
    ? Math.round(submissions.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / gradedCount)
    : 0;

  if (assignmentLoadingLocal || badgesLoading) {
    return <Loading />;
  }

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800">Assignment Not Found</h3>
        <p className="text-slate-500 mb-6">The requested assignment could not be retrieved.</p>
        <Link href="/lecturer/activities" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">
          Back to Activities
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Back Button */}
      <div className="flex flex-col gap-4">
        <Link href="/lecturer/activities" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition w-fit">
          <ChevronLeft className="w-4 h-4" /> Back to Activities
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{assignment.title}</h1>
            <p className="text-sm font-semibold text-slate-400">Course Assignment Details & Submissions</p>
          </div>
          <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full h-[40px] flex items-center gap-2">
            <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span className="text-sm font-bold text-blue-600">Max Points: {assignment.points}</span>
          </div>
        </div>
      </div>

      {/* Assignment Overview & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Assignment Metadata Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-700">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-sm">Instructions & Rubric</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {assignment.instructions}
            </p>
            {assignment.rubric && assignment.rubric.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Rubric</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assignment.rubric.map((rub: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-xs bg-white border border-slate-150 p-2.5 rounded-lg font-bold text-slate-700">
                      <span>🎯 {rub.criteria}</span>
                      <span className="text-blue-600">{rub.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Due: {new Date(assignment.deadline).toLocaleString()}</span>
            <span>Submission Type: {assignment.submissionType || 'File Upload'}</span>
          </div>
        </div>

        {/* Stats Column */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Submissions</p>
            <div>
              <h3 className="text-3xl font-light text-slate-800 mb-1">{totalSubmissions}</h3>
              <p className="text-slate-500 text-xs font-semibold">students turned in</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Graded</p>
            <div>
              <h3 className="text-3xl font-light text-emerald-500 mb-1">{gradedCount}</h3>
              <p className="text-emerald-500 text-xs font-semibold">{pendingCount} pending grading</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between col-span-2">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Average Score</p>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-4xl font-light text-blue-600 mb-1">
                  {avgScore} <span className="text-sm font-semibold text-slate-400">/ {assignment.points}</span>
                </h3>
                <p className="text-blue-500 text-xs font-semibold">average student score</p>
              </div>
              {/* Simple progress ring representation */}
              <div className="w-12 h-12 rounded-full border-4 border-blue-50 flex items-center justify-center relative shrink-0">
                <span className="text-[10px] font-bold text-blue-600">{Math.round((avgScore / assignment.points) * 100 || 0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">

        {/* Filters Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-800">Student Submissions</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
              {filteredSubmissions.length} shown
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-56 font-medium text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Submissions</option>
                <option value="Graded">Graded</option>
                <option value="Pending">Pending Grading</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {assignmentLoading ? (
            <div className="p-12"><Loading /></div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium">
              No submissions match the current filters.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 pl-6 pr-4">Student</th>
                  <th className="py-4 px-4">Date Submitted</th>
                  <th className="py-4 px-4">Attachment</th>
                  <th className="py-4 px-4">Notes</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-center">Grade</th>
                  <th className="py-4 pr-6 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSubmissions.map((sub: any) => {
                  const student = sub.student || {};
                  return (
                    <tr key={sub._id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 pl-6 pr-4">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{student.name || 'Unknown Student'}</p>
                          <p className="text-xs text-slate-400 font-medium">{student.email || ''}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600 font-semibold whitespace-nowrap">
                        <div className="space-y-1">
                          <p>{new Date(sub.submittedAt).toLocaleDateString()}</p>
                          {sub.isLate && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-500 border border-red-100">
                              LATE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <a
                          href={getFileDownloadUrl(sub.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition whitespace-nowrap"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-500" /> Download File
                        </a>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-xs text-slate-500 font-medium truncate" title={sub.studentNotes}>
                          {sub.studentNotes || <span className="italic text-slate-350">No notes</span>}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full whitespace-nowrap ${sub.status === 'Graded' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-50 text-orange-600'}`}>
                          {sub.status === 'Graded' ? 'Graded' : 'Pending Grade'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-sm font-bold text-slate-700">
                        {sub.status === 'Graded' && sub.score !== undefined ? (
                          `${sub.score} / ${assignment.points}`
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-4 pr-6 pl-4 text-right">
                        <button
                          onClick={() => handleOpenGradingModal(sub)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${sub.status === 'Graded'
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                            }`}
                        >
                          {sub.status === 'Graded' ? 'Edit Grade' : 'Grade Sub'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* GRADING AND GAMIFICATION MODAL */}
      {isGradingModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[90vh] animate-in fade-in zoom-in-95">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" /> Grade Submission
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Student: {selectedSubmission.student?.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsGradingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-250 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveGrade} className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* Numeric Grade Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Score Awarded</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={assignment.points}
                      value={score}
                      onChange={e => setScore(Number(e.target.value))}
                      disabled={assignment.rubric && assignment.rubric.length > 0}
                      className="w-full pl-4 pr-16 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm font-bold bg-white disabled:bg-slate-100 disabled:text-slate-550 disabled:cursor-not-allowed"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      / {assignment.points}
                    </span>
                  </div>
                </div>

                {/* GAMIFICATION ELEMENT 1: Bonus Points */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> Extra XP (Bonus)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={bonusPoints}
                      onChange={e => setBonusPoints(Number(e.target.value))}
                      className="w-full pl-4 pr-12 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Rubric Criteria Grading Section */}
              {assignment.rubric && assignment.rubric.length > 0 && (
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🎯</span> Rubric Evaluation Breakdown
                  </h4>
                  <div className="space-y-3">
                    {assignment.rubric.map((rub: any, idx: number) => (
                      <div key={idx} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                          <span>{rub.criteria}</span>
                          <span className="text-slate-400">Max Score: {rub.points}</span>
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={rub.points}
                          value={rubricScores[rub.criteria] !== undefined ? rubricScores[rub.criteria] : 0}
                          onChange={e => {
                            const val = Math.min(rub.points, Math.max(0, Number(e.target.value) || 0));
                            setRubricScores({
                              ...rubricScores,
                              [rub.criteria]: val
                            });
                          }}
                          className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Feedback Comments</label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Provide comments, advice or grading breakdowns for the student..."
                  className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm leading-relaxed"
                  required
                ></textarea>
              </div>

              {/* GAMIFICATION ELEMENT 2: Badge Awarding */}
              <div className="bg-blue-50/40 border border-blue-100/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Award Custom Badge (Gamification)</span>
                </div>

                <div>
                  <select
                    value={selectedBadge}
                    onChange={e => setSelectedBadge(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Select Badge to Award --</option>
                    {badges.map((badge: any) => (
                      <option key={badge._id} value={badge.name}>
                        {badge.icon || '🏆'} {badge.name} ({badge.description})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 font-medium mt-1.5 leading-relaxed">
                    Instructors can select from standard milestone badges or custom badges they have configured. Awarding badges shows up in the student's gallery instantly!
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsGradingModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSaving ? 'Saving Grade...' : 'Submit Grade & Rewards'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
