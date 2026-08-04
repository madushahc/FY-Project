"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Award,
  HelpCircle,
  Lock,
  BookOpen,
  RefreshCw,
  Play,
  FileText,
  ExternalLink,
  Camera,
  Clock,
} from "lucide-react";
import api from "@/lib/api";
import {
  generateQrSvgDataUrl,
  generateLessonQrPayload,
} from "@/lib/qrCodeHelper";
import TermMatchingTask, { IMatchingPair } from "@/components/TermMatchingTask";
import CameraQrScanner from "@/components/CameraQrScanner";

export interface IQrMarker {
  _id?: string;
  timestamp: number; // For reading, timestamp represents scroll percentage (e.g. 25, 50, 75)
  code: string;
  label?: string;
  points?: number;
  timerSeconds?: number;
}

export interface IQuestionMarker {
  _id?: string;
  timestamp: number; // For reading, timestamp represents scroll percentage (e.g. 25, 50, 75)
  questionText: string;
  questionType?: "mcq" | "true-false" | "matching";
  options: string[];
  correctOption: number;
  matchingPairs?: IMatchingPair[];
  explanation?: string;
  points?: number;
  timerSeconds?: number;
}

interface Props {
  contentUrl?: string;
  description?: string;
  courseId: string;
  lessonId: string;
  qrMarkers?: IQrMarker[];
  questionMarkers?: IQuestionMarker[];
  onCompletionChange?: (isCompleted: boolean, progressData: any) => void;
  onPointsAwarded?: (points: number, reason: string) => void;
}

export default function InteractiveReadingPlayer({
  contentUrl,
  description = "",
  courseId,
  lessonId,
  qrMarkers = [],
  questionMarkers = [],
  onCompletionChange,
  onPointsAwarded,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [maxScrollReached, setMaxScrollReached] = useState<number>(0);

  // Student progress state
  const [scannedQrCodes, setScannedQrCodes] = useState<string[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showCompletionBanner, setShowCompletionBanner] =
    useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<boolean>(true);
  const [showCameraScanner, setShowCameraScanner] = useState<boolean>(false);

  const isCompletedRef = useRef<boolean>(false);
  const lastReportedPercentRef = useRef<number>(0);

  const sendReadingProgress = useCallback(
    async (pct: number) => {
      if (pct <= lastReportedPercentRef.current && pct < 90) return;
      if (pct - lastReportedPercentRef.current < 10 && pct < 90) return;
      lastReportedPercentRef.current = pct;
      try {
        const { data } = await api.post(
          `/courses/${courseId}/lessons/${lessonId}/watch-progress`,
          {
            watchPercent: pct,
          },
        );
        if (data.isLessonCompleted || pct >= 90) {
          if (!isCompletedRef.current) {
            isCompletedRef.current = true;
            setIsCompleted(true);
            setShowCompletionBanner(true);
            if (onCompletionChange) {
              onCompletionChange(true, data);
            }
          }
        }
      } catch (err) {
        console.error("Failed to record reading progress", err);
      }
    },
    [courseId, lessonId, onCompletionChange],
  );

  // Interactive UI modals
  const [activeQrMarker, setActiveQrMarker] = useState<IQrMarker | null>(null);
  const [activeQuestionMarker, setActiveQuestionMarker] =
    useState<IQuestionMarker | null>(null);
  const [inputQrCode, setInputQrCode] = useState<string>("");
  const [qrError, setQrError] = useState<string>("");
  const [scanningQr, setScanningQr] = useState<boolean>(false);
  const [qrTimer, setQrTimer] = useState<number>(30);
  const [dismissedMarkerCodes, setDismissedMarkerCodes] = useState<string[]>([]);

  useEffect(() => {
    if (!activeQrMarker) return;

    const totalSeconds = activeQrMarker.timerSeconds || 30;
    setQrTimer(totalSeconds);

    const interval = setInterval(() => {
      setQrTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const codeToDismiss = activeQrMarker.code;
          setDismissedMarkerCodes((prevList) => [...prevList, codeToDismiss]);
          setTimeout(() => {
            setActiveQrMarker(null);
            setShowCameraScanner(false);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQrMarker]);

  const [questionTimer, setQuestionTimer] = useState<number>(30);

  useEffect(() => {
    if (!activeQuestionMarker) return;

    const totalSeconds = activeQuestionMarker.timerSeconds || 30;
    setQuestionTimer(totalSeconds);

    const interval = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const qIdToDismiss = activeQuestionMarker._id
            ? String(activeQuestionMarker._id)
            : activeQuestionMarker.questionText;
          setDismissedMarkerCodes((prevList) => [...prevList, qIdToDismiss]);
          setTimeout(() => {
            setActiveQuestionMarker(null);
            setQuizFeedback(null);
            setSelectedOption(null);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuestionMarker]);

  // Quiz submission state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<any | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // Toast
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    points: number;
  } | null>(null);

  // Fetch student progress (on mount — restores state without triggering completion callback)
  const fetchProgress = useCallback(async () => {
    setLoadingProgress(true);
    try {
      const { data } = await api.get(
        `/courses/${courseId}/lessons/${lessonId}/progress`,
      );
      setScannedQrCodes(data.scannedQrCodes || []);
      setAnsweredQuestions(data.answeredQuestions || []);
      if (data.watchPercent !== undefined) {
        setScrollPercent(data.watchPercent);
        lastReportedPercentRef.current = data.watchPercent;
      }
      const alreadyCompleted = Boolean(
        data.allRequirementsMet || data.completed,
      );
      setIsCompleted(alreadyCompleted);
      isCompletedRef.current = alreadyCompleted;
      // Restore completed state to parent sidebar — isRestoring=true prevents markLessonCompleted from firing again
      if (alreadyCompleted && onCompletionChange) {
        onCompletionChange(true, { ...data, isRestoring: true });
      }
    } catch (e) {
      console.error("Failed to load reading progress", e);
    } finally {
      setLoadingProgress(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lessonId]);

  useEffect(() => {
    if (courseId && lessonId) {
      fetchProgress();
    }
  }, [courseId, lessonId, fetchProgress]);

  const calculateScrollPercent = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable <= 0) return 100;
      return Math.min(100, Math.round((scrollTop / totalScrollable) * 100));
    },
    [],
  );

  // Handle Scroll Progress from the main material viewport or an embedded iframe or window scroll
  const handleScroll = useCallback(() => {
    if (activeQuestionMarker || activeQrMarker) return;

    let currentPct = 0;

    // 1. Check inner scrollable container
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      currentPct = calculateScrollPercent(
        scrollTop,
        scrollHeight,
        clientHeight,
      );
    }

    // 2. Check main browser window scroll (fallback)
    if (typeof window !== "undefined") {
      const windowScrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const windowScrollHeight = document.documentElement.scrollHeight || 0;
      const windowClientHeight = window.innerHeight || 0;
      const windowPct = calculateScrollPercent(
        windowScrollTop,
        windowScrollHeight,
        windowClientHeight,
      );
      if (windowPct > currentPct) {
        currentPct = windowPct;
      }
    }

    // 3. Check iframe (if same-origin)
    if (iframeRef.current?.contentDocument) {
      try {
        const doc = iframeRef.current.contentDocument;
        const scrollTop =
          doc.documentElement.scrollTop || doc.body?.scrollTop || 0;
        const scrollHeight =
          doc.documentElement.scrollHeight || doc.body?.scrollHeight || 0;
        const clientHeight =
          doc.documentElement.clientHeight || doc.body?.clientHeight || 0;
        const iframePct = calculateScrollPercent(
          scrollTop,
          scrollHeight,
          clientHeight,
        );
        if (iframePct > currentPct) {
          currentPct = iframePct;
        }
      } catch {
        // Cross-origin restriction ignored
      }
    }

    if (currentPct <= 0) return;

    setScrollPercent((prev) => Math.max(prev, currentPct));
    setMaxScrollReached((prev) => Math.max(prev, currentPct));

    if (
      currentPct >= 90 ||
      (currentPct > 0 && currentPct - lastReportedPercentRef.current >= 10)
    ) {
      sendReadingProgress(currentPct);
    }

    // Check Question Markers triggered at this scroll percentage
    questionMarkers.forEach((q) => {
      const qId = q._id ? String(q._id) : q.questionText;
      const alreadyAnswered = answeredQuestions.some(
        (a) => a.questionMarkerId === qId && a.isCorrect,
      );
      const isDismissed = dismissedMarkerCodes.includes(qId);

      if (!alreadyAnswered && !isDismissed && currentPct >= q.timestamp) {
        setActiveQuestionMarker(q);
        setSelectedOption(null);
        setQuizFeedback(null);
        setQuestionStartTime(Date.now());
      }
    });

    // Check QR Markers triggered at this scroll percentage
    qrMarkers.forEach((qr) => {
      const isScanned = scannedQrCodes.includes(qr.code);
      const isDismissed = dismissedMarkerCodes.includes(qr.code);
      if (!isScanned && !isDismissed && currentPct >= qr.timestamp) {
        setActiveQrMarker(qr);
      }
    });
  }, [
    activeQrMarker,
    activeQuestionMarker,
    answeredQuestions,
    calculateScrollPercent,
    dismissedMarkerCodes,
    qrMarkers,
    scannedQrCodes,
    questionMarkers,
    sendReadingProgress,
  ]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!contentUrl || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const syncFromIframe = () => handleScroll();

    const attachListeners = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        doc.addEventListener("scroll", syncFromIframe);
        iframe.contentWindow?.addEventListener("resize", syncFromIframe);
        syncFromIframe();
      } catch (e) {
        // Cross-origin iframe fallback handled by button & window scroll
      }
    };

    iframe.addEventListener("load", attachListeners);
    window.addEventListener("resize", syncFromIframe);
    attachListeners();

    return () => {
      iframe.removeEventListener("load", attachListeners);
      window.removeEventListener("resize", syncFromIframe);
    };
  }, [contentUrl, handleScroll]);

  // Submit QR Code
  const handleVerifyQr = async (codeToSubmit?: string) => {
    const code = codeToSubmit || inputQrCode.trim();
    if (!code || !activeQrMarker) return;

    setScanningQr(true);
    setQrError("");

    try {
      const { data } = await api.post(
        `/courses/${courseId}/lessons/${lessonId}/qr-scan`,
        { code },
      );

      setScannedQrCodes(data.scannedQrCodes);
      setToastMessage({
        text: "QR Check-in Verified!",
        points: data.pointsAwarded,
      });

      if (data.pointsAwarded > 0 && onPointsAwarded) {
        onPointsAwarded(data.pointsAwarded, "Reading Check-in");
      }

      if (data.isLessonCompleted) {
        if (!isCompletedRef.current) {
          isCompletedRef.current = true;
          setIsCompleted(true);
          setShowCompletionBanner(true);
          if (onCompletionChange) {
            onCompletionChange(true, data);
          }
        }
      }

      setActiveQrMarker(null);
      setInputQrCode("");
      fetchProgress();
    } catch (err: any) {
      setQrError(err.response?.data?.message || "Invalid verification code.");
    } finally {
      setScanningQr(false);
    }
  };

  // Submit Verification Answer
  const handleAnswerSubmit = async (customPayload?: {
    studentResponse?: any;
    timeTakenSecs?: number;
  }) => {
    if (!activeQuestionMarker) return;

    setSubmittingQuiz(true);
    const qMarkerId =
      activeQuestionMarker._id?.toString() || activeQuestionMarker.questionText;
    const timeTaken =
      customPayload?.timeTakenSecs ||
      Math.max(
        1,
        Math.round((Date.now() - (questionStartTime || Date.now())) / 1000),
      );

    try {
      const { data } = await api.post(
        `/courses/${courseId}/lessons/${lessonId}/answer`,
        {
          questionMarkerId: qMarkerId,
          selectedOption: selectedOption !== null ? selectedOption : undefined,
          studentResponse:
            customPayload?.studentResponse !== undefined
              ? customPayload.studentResponse
              : selectedOption,
          timeTaken,
        },
      );

      setQuizFeedback(data);

      if (data.isCorrect) {
        setToastMessage({
          text: "Active Verification Passed!",
          points: data.pointsAwarded,
        });
        if (data.pointsAwarded > 0 && onPointsAwarded) {
          onPointsAwarded(data.pointsAwarded, "Active Verification");
        }
      }

      if (data.isLessonCompleted) {
        if (!isCompletedRef.current) {
          isCompletedRef.current = true;
          setIsCompleted(true);
          setShowCompletionBanner(true);
          if (onCompletionChange) {
            onCompletionChange(true, data);
          }
        }
      }

      fetchProgress();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit answer.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const resumeReading = () => {
    setActiveQuestionMarker(null);
    setQuizFeedback(null);
    setSelectedOption(null);
  };

  const totalQr = qrMarkers.length;
  const scannedCount = scannedQrCodes.length;
  const totalQ = questionMarkers.length;
  const answeredCorrectCount = answeredQuestions.filter(
    (q) => q.isCorrect,
  ).length;

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <Award className="w-5 h-5 text-slate-950" />
          <span>{toastMessage.text}</span>
          {toastMessage.points > 0 && (
            <span className="bg-slate-950 text-amber-300 text-xs px-2 py-0.5 rounded-full font-extrabold">
              +{toastMessage.points} PTS
            </span>
          )}
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Completion Banner Overlay */}
      {showCompletionBanner && (
        <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 animate-in fade-in rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="text-center px-6">
            <h3 className="text-2xl font-extrabold text-white mb-1">
              Lesson Completed! 🎉
            </h3>
            <p className="text-emerald-300 text-sm font-medium">
              You have successfully completed all requirements for this material.
              The next lesson has been unlocked.
            </p>
          </div>
          <button
            onClick={() => setShowCompletionBanner(false)}
            className="mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-lg cursor-pointer"
          >
            ✓ Continue Learning
          </button>
        </div>
      )}

      {/* Reading Controls Toolbar */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm">
            Interactive Learning Materials
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-slate-400">
            Reading Progress:{" "}
            <strong className="text-emerald-400 font-extrabold">
              {scrollPercent}%
            </strong>
          </span>
          {totalQr > 0 && (
            <span className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 text-amber-400">
              QR Scans: {scannedCount}/{totalQr}
            </span>
          )}
          {totalQ > 0 && (
            <span className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 text-blue-400">
              Tasks Passed: {answeredCorrectCount}/{totalQ}
            </span>
          )}
        </div>
      </div>

      {/* Visual Progress Bar Strip */}
      <div className="w-full bg-slate-800 h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 h-full transition-all duration-200 ease-out"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Scrollable Material Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative overflow-y-auto p-6 md:p-8 space-y-6 max-h-[580px] bg-slate-50/50 custom-scrollbar"
      >
        {/* Render Reading Text Description Material */}
        {description ? (
          <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4" /> Reading Material Content
            </div>
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
              {description}
            </div>
          </div>
        ) : null}

        {/* Render Uploaded Content/File/Document Material */}
        {contentUrl ? (
          <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-slate-100 p-3.5 border-b border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-2 font-bold text-slate-700">
                <ExternalLink className="w-4 h-4 text-blue-500" /> Attached
                Material / Uploaded Document
              </span>
              <a
                href={contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-extrabold text-xs transition"
              >
                Open in Full Window ↗
              </a>
            </div>
            <div className="w-full h-[650px] bg-slate-100">
              <iframe
                ref={iframeRef}
                src={contentUrl}
                className="w-full h-full border-none"
                onLoad={handleScroll}
              />
            </div>
          </div>
        ) : null}

        {!description && !contentUrl && (
          <div className="w-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-medium">
            No reading text or uploaded materials attached to this lesson.
          </div>
        )}

        {/* Material Reading Completion Footer */}
        {(description || contentUrl) && (
          <div className="w-full p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>
                {scrollPercent >= 90
                  ? "🎉 You have reached the bottom of the material. This lesson is completed!"
                  : "📜 Scroll down to the bottom of the material above to complete this lesson and unlock the next section."}
              </span>
            </div>
            {scrollPercent < 90 && !isCompleted && (
              <button
                onClick={() => {
                  setScrollPercent(100);
                  setMaxScrollReached(100);
                  sendReadingProgress(100);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-sm shrink-0 cursor-pointer"
              >
                ✓ Mark Material as Completed
              </button>
            )}
            {isCompleted && (
              <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Lesson Completed
              </span>
            )}
          </div>
        )}

        {/* Active Interactive Lesson Rating & Feedback Check-in Modal */}
        {activeQrMarker && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-100 relative">
              <button
                onClick={() => {
                  if (activeQrMarker) {
                    setDismissedMarkerCodes((prev) => [...prev, activeQrMarker.code]);
                  }
                  setActiveQrMarker(null);
                }}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0 text-xl">
                    ⭐
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-slate-800">
                      {activeQrMarker.label || "Lesson Feedback & Check-in"}
                    </h3>
                    <span className="text-[10px] text-amber-600 font-extrabold">
                      +{activeQrMarker.points || 15} PTS
                    </span>
                  </div>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-full border font-mono font-bold text-xs flex items-center gap-1 shrink-0 ${
                    qrTimer <= 5
                      ? "bg-red-50 border-red-300 text-red-600 animate-pulse"
                      : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>00:{qrTimer < 10 ? `0${qrTimer}` : qrTimer}s</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/70 text-amber-900 mb-4 text-center">
                <p className="text-xs font-bold mb-1">💬 {activeQrMarker.label || "How is this reading material so far?"}</p>
                <p className="text-[11px] text-amber-700 font-medium">
                  Rate or select quick feedback to claim your +{activeQrMarker.points || 15} XP reward!
                </p>
              </div>

              {/* Interactive Star Rating */}
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleVerifyQr(activeQrMarker.code)}
                    disabled={scanningQr}
                    className="p-2 text-2xl hover:scale-125 transition-transform cursor-pointer"
                    title={`Rate ${star} Stars`}
                  >
                    ⭐
                  </button>
                ))}
              </div>

              {/* Quick Feedback Chips */}
              <div className="space-y-2 mb-3">
                {[
                  "🎯 Clear & easy to understand!",
                  "⚡ Well structured & informative!",
                  "💡 Good summary, ready to read more!"
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleVerifyQr(activeQrMarker.code)}
                    disabled={scanningQr}
                    className="w-full p-2.5 bg-slate-50 hover:bg-amber-100/60 border border-slate-200 hover:border-amber-400 text-slate-700 font-bold text-xs rounded-xl transition text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>{chip}</span>
                    <span className="text-amber-600 text-[10px] font-extrabold">+15 PTS</span>
                  </button>
                ))}
              </div>

              {qrError && (
                <p className="text-xs text-red-500 font-bold mb-2">{qrError}</p>
              )}
            </div>
          </div>
        )}

        {/* Active Question Modal */}
        {activeQuestionMarker && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 relative">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Active Learning Checkpoint
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Verify your understanding to unlock the next section
                    </p>
                  </div>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-full border font-mono font-bold text-xs flex items-center gap-1.5 shrink-0 ${
                    questionTimer <= 5
                      ? "bg-red-50 border-red-300 text-red-600 animate-pulse"
                      : "bg-blue-50 border-blue-200 text-blue-700"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    00:
                    {questionTimer < 10 ? `0${questionTimer}` : questionTimer}s
                  </span>
                </div>
              </div>

              {questionTimer === 0 && !quizFeedback && (
                <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold flex items-center justify-between">
                  <span>⌛ Time's Up! Submit your answer now.</span>
                </div>
              )}

              <h3 className="text-base font-bold text-slate-800 mb-4">
                {activeQuestionMarker.questionText}
              </h3>

              {activeQuestionMarker.questionType === "matching" ? (
                <TermMatchingTask
                  pairs={activeQuestionMarker.matchingPairs || []}
                  onVerify={(matches, timeTakenSecs) => {
                    handleAnswerSubmit({
                      studentResponse: matches,
                      timeTakenSecs,
                    });
                  }}
                  isSubmitting={submittingQuiz}
                  explanation={activeQuestionMarker.explanation}
                  feedback={quizFeedback}
                  onRetry={() => setQuizFeedback(null)}
                />
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {(activeQuestionMarker.options.length > 0
                      ? activeQuestionMarker.options
                      : ["True", "False"]
                    ).map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      let optStyle =
                        "border-slate-200 bg-white hover:border-blue-400 text-slate-700";

                      if (quizFeedback) {
                        if (idx === quizFeedback.correctOption) {
                          optStyle =
                            "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold";
                        } else if (isSelected && !quizFeedback.isCorrect) {
                          optStyle = "border-red-500 bg-red-50 text-red-800";
                        }
                      } else if (isSelected) {
                        optStyle =
                          "border-blue-600 bg-blue-50 text-blue-800 font-bold";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={!!quizFeedback}
                          onClick={() => setSelectedOption(idx)}
                          className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition flex items-center justify-between ${optStyle}`}
                        >
                          <span>
                            <span className="font-bold mr-2">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {opt}
                          </span>
                          {quizFeedback &&
                            idx === quizFeedback.correctOption && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                            )}
                        </button>
                      );
                    })}
                  </div>

                  {quizFeedback && (
                    <div
                      className={`p-3 rounded-xl mb-4 text-xs font-medium ${
                        quizFeedback.isCorrect
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      <p className="font-bold mb-1">
                        {quizFeedback.isCorrect
                          ? `🎉 Checkpoint Passed! +${quizFeedback.pointsAwarded} PTS`
                          : "❌ Incorrect answer. Please review."}
                      </p>
                      {quizFeedback.explanation && (
                        <p>{quizFeedback.explanation}</p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    {!quizFeedback ? (
                      <button
                        onClick={() => handleAnswerSubmit()}
                        disabled={selectedOption === null || submittingQuiz}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition disabled:opacity-50 shadow-sm"
                      >
                        {submittingQuiz ? "Submitting..." : "Submit Answer"}
                      </button>
                    ) : !quizFeedback.isCorrect ? (
                      <button
                        onClick={() => {
                          setQuizFeedback(null);
                          setSelectedOption(null);
                        }}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <RefreshCw className="w-4 h-4" /> Retry Question
                      </button>
                    ) : (
                      <button
                        onClick={resumeReading}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <BookOpen className="w-4 h-4" /> Resume Reading
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
