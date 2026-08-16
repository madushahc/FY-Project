"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
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
  Clock,
} from "lucide-react";
import api from "@/lib/api";
import TermMatchingTask, { IMatchingPair } from "@/components/TermMatchingTask";

export interface IQuestionMarker {
  _id?: string;
  timestamp: number; // For reading, timestamp represents scroll percentage (e.g. 25, 50, 75)
  questionText: string;
  questionType?: "mcq" | "true-false" | "matching" | "feedback";
  options: string[];
  correctOption: number;
  matchingPairs?: IMatchingPair[];
  explanation?: string;
  hiddenPrompt?: string;
  points?: number;
  timerSeconds?: number;
}

interface Props {
  contentUrl?: string;
  description?: string;
  courseId: string;
  lessonId: string;
  questionMarkers?: IQuestionMarker[];
  onCompletionChange?: (isCompleted: boolean, progressData: any) => void;
  onPointsAwarded?: (points: number, reason: string) => void;
}

export default function InteractiveReadingPlayer({
  contentUrl,
  description = "",
  courseId,
  lessonId,
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
  const [activeQuestionMarker, setActiveQuestionMarker] =
    useState<IQuestionMarker | null>(null);
  const [dismissedMarkerCodes, setDismissedMarkerCodes] = useState<string[]>([]);
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
    if (activeQuestionMarker) return;

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
  }, [
    activeQuestionMarker,
    answeredQuestions,
    calculateScrollPercent,
    dismissedMarkerCodes,
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

  const totalQ = questionMarkers.length;
  const answeredCorrectCount = answeredQuestions.filter(
    (q) => q.isCorrect,
  ).length;

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm relative">




      {/* Scrollable Material Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
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



      </div>
    </div>
  );
}
