"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { QrCode, CheckCircle2, AlertCircle, Award, HelpCircle, Lock, Play, Pause, RefreshCw, Clock, Camera } from "lucide-react";
import api from "@/lib/api";
import { generateQrSvgDataUrl, generateLessonQrPayload } from "@/lib/qrCodeHelper";
import TermMatchingTask, { IMatchingPair } from "@/components/TermMatchingTask";
import CameraQrScanner from "@/components/CameraQrScanner";

export interface IQrMarker {
  _id?: string;
  timestamp: number;
  code: string;
  label?: string;
  points?: number;
  timerSeconds?: number;
}

export interface IQuestionMarker {
  _id?: string;
  timestamp: number;
  questionText: string;
  questionType?: 'mcq' | 'true-false' | 'matching';
  options: string[];
  correctOption: number;
  matchingPairs?: IMatchingPair[];
  explanation?: string;
  points?: number;
  timerSeconds?: number;
}

interface Props {
  videoUrl: string;
  courseId: string;
  lessonId: string;
  qrMarkers?: IQrMarker[];
  questionMarkers?: IQuestionMarker[];
  onCompletionChange?: (isCompleted: boolean, progressData: any) => void;
  onUnlockNextLesson?: (lessonId: string, data: any) => void;
  onPointsAwarded?: (points: number, reason: string) => void;
}

export default function InteractiveVideoPlayer({
  videoUrl,
  courseId,
  lessonId,
  qrMarkers = [],
  questionMarkers = [],
  onCompletionChange,
  onUnlockNextLesson,
  onPointsAwarded
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Student progress state
  const [scannedQrCodes, setScannedQrCodes] = useState<string[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<any[]>([]);
  const [watchPercent, setWatchPercent] = useState<number>(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState<number>(0);
  const [videoWatched, setVideoWatched] = useState<boolean>(false);
  const [minWatchPercentRequired, setMinWatchPercentRequired] = useState<number>(75);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<boolean>(true);
  const [seekingWarning, setSeekingWarning] = useState<string | null>(null);
  const [showCameraScanner, setShowCameraScanner] = useState<boolean>(false);

  // Refs that mirror state for use inside event handlers (avoids stale closures)
  const maxWatchedTimeRef = useRef<number>(0);
  const isCompletedRef = useRef<boolean>(false);
  const seekWarningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Interactive UI modals
  const [activeQrMarker, setActiveQrMarker] = useState<IQrMarker | null>(null);
  const [activeQuestionMarker, setActiveQuestionMarker] = useState<IQuestionMarker | null>(null);
  const [inputQrCode, setInputQrCode] = useState<string>("");
  const [qrError, setQrError] = useState<string>("");
  const [questionTimer, setQuestionTimer] = useState<number>(30);
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
          // Timer expired without response: dismiss QR modal, mark as handled so it never triggers again, and resume playback
          const codeToDismiss = activeQrMarker.code;
          setDismissedMarkerCodes((prevList) => [...prevList, codeToDismiss]);
          setTimeout(() => {
            setActiveQrMarker(null);
            setShowCameraScanner(false);
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
              setIsPlaying(true);
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQrMarker]);

  useEffect(() => {
    if (!activeQuestionMarker) return;

    const totalSeconds = activeQuestionMarker.timerSeconds || 30;
    setQuestionTimer(totalSeconds);

    const interval = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Timer expired without response: dismiss Question modal, mark as handled, and resume playback
          const qIdToDismiss = activeQuestionMarker._id?.toString() || activeQuestionMarker.questionText;
          setDismissedMarkerCodes((prevList) => [...prevList, qIdToDismiss]);
          setTimeout(() => {
            setActiveQuestionMarker(null);
            setQuizFeedback(null);
            setSelectedOption(null);
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
              setIsPlaying(true);
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuestionMarker]);
  const [scanningQr, setScanningQr] = useState<boolean>(false);

  // Quiz submission state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<any | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; points: number } | null>(null);

  const lastReportedPercentRef = useRef<number>(0);

  // Send watch progress to backend — triggers onUnlockNextLesson at >=75% and onCompletionChange at 100%
  const sendWatchProgress = useCallback(async (pct: number, timeSec: number) => {
    if (pct <= lastReportedPercentRef.current && pct < 75) return;
    lastReportedPercentRef.current = pct;
    try {
      const { data } = await api.post(`/courses/${courseId}/lessons/${lessonId}/watch-progress`, {
        watchPercent: pct,
        currentTime: timeSec
      });
      if (data.watchPercent !== undefined) setWatchPercent(data.watchPercent);
      if (data.videoWatched !== undefined) setVideoWatched(data.videoWatched);

      // 1. Unlock Next Lesson at 75% Watch Threshold
      if ((data.isNextUnlocked || pct >= 75) && onUnlockNextLesson) {
        onUnlockNextLesson(lessonId, data);
      }

      // 2. Mark Current Lesson Completed ONLY at 100% (or backend completion trigger)
      if (data.isLessonCompleted || pct >= 100) {
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
      console.error("Failed to record watch progress", err);
    }
  }, [courseId, lessonId, onCompletionChange, onUnlockNextLesson]);

  // Fetch student progress for this lesson (on mount — restores state without triggering completion callback)
  const fetchProgress = useCallback(async () => {
    setLoadingProgress(true);
    try {
      const { data } = await api.get(`/courses/${courseId}/lessons/${lessonId}/progress`);
      setScannedQrCodes(data.scannedQrCodes || []);
      setAnsweredQuestions(data.answeredQuestions || []);
      setWatchPercent(data.watchPercent || 0);
      setMaxWatchedTime(data.maxWatchedTime || 0);
      maxWatchedTimeRef.current = data.maxWatchedTime || 0;
      lastContinuousTimeRef.current = data.maxWatchedTime || 0;
      setVideoWatched(data.videoWatched || false);
      setMinWatchPercentRequired(data.minWatchPercentRequired || 75);
      lastReportedPercentRef.current = data.watchPercent || 0;

      if ((data.isNextUnlocked || (data.watchPercent || 0) >= 75) && onUnlockNextLesson) {
        onUnlockNextLesson(lessonId, { ...data, isRestoring: true });
      }

      const alreadyCompleted = Boolean(data.completed || data.allRequirementsMet);
      setIsCompleted(alreadyCompleted);
      isCompletedRef.current = alreadyCompleted;
      if (alreadyCompleted && onCompletionChange) {
        onCompletionChange(true, { ...data, isRestoring: true });
      }
      if (data.maxWatchedTime && videoRef.current && videoRef.current.currentTime < data.maxWatchedTime && !alreadyCompleted) {
        videoRef.current.currentTime = data.maxWatchedTime;
      }
    } catch (e) {
      console.error("Failed to load lesson progress", e);
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

  const lastContinuousTimeRef = useRef<number>(0);

  // Video time tracking and trigger check
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    const delta = time - lastContinuousTimeRef.current;

    // Detect forward seek/jump during active playback or scrubbing
    if (time > maxWatchedTimeRef.current + 1.0 && (delta > 1.5 || delta < -50)) {
      videoRef.current.currentTime = maxWatchedTimeRef.current;
      if (seekWarningTimerRef.current) clearTimeout(seekWarningTimerRef.current);
      setSeekingWarning("⏩ Step forward is disabled. Please watch the lesson video continuously.");
      seekWarningTimerRef.current = setTimeout(() => setSeekingWarning(null), 4000);
      lastContinuousTimeRef.current = maxWatchedTimeRef.current;
      return;
    }

    // Only advance maxWatchedTime during smooth continuous playback
    if (time > maxWatchedTimeRef.current && (delta <= 1.5 || lastContinuousTimeRef.current === 0)) {
      maxWatchedTimeRef.current = time;
      setMaxWatchedTime(time);
    }

    lastContinuousTimeRef.current = time;

    const dur = duration || videoRef.current.duration || 1;
    const calculatedPercent = Math.min(100, Math.round((maxWatchedTimeRef.current / dur) * 100));
    setWatchPercent((prev) => Math.max(prev, calculatedPercent));

    // Periodically send watch progress to backend (every 5% increase or at 95% threshold)
    if (calculatedPercent >= lastReportedPercentRef.current + 5 || calculatedPercent >= minWatchPercentRequired) {
      sendWatchProgress(calculatedPercent, time);
    }

    // Check Question Marker triggers (pause video when reaching timestamp)
    questionMarkers.forEach((q) => {
      const qId = q._id?.toString() || q.questionText;
      const alreadyAnswered = answeredQuestions.some(
        (a) => a.questionMarkerId === qId && a.isCorrect
      );
      const isDismissed = dismissedMarkerCodes.includes(qId);

      if (!alreadyAnswered && !isDismissed && Math.abs(time - q.timestamp) < 1.2) {
        if (activeQuestionMarker?._id !== q._id) {
          videoRef.current?.pause();
          setIsPlaying(false);
          setActiveQuestionMarker(q);
          setSelectedOption(null);
          setQuizFeedback(null);
          setQuestionStartTime(Date.now());
        }
      }
    });

    // Check Engagement Check-in Marker triggers (pause video when reaching timestamp)
    qrMarkers.forEach((qr) => {
      const isScanned = scannedQrCodes.includes(qr.code);
      const isDismissed = dismissedMarkerCodes.includes(qr.code);
      if (!isScanned && !isDismissed && Math.abs(time - qr.timestamp) < 2.0) {
        if (!activeQrMarker || activeQrMarker.code !== qr.code) {
          videoRef.current?.pause();
          setIsPlaying(false);
          setActiveQrMarker(qr);
        }
      }
    });
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      if (maxWatchedTimeRef.current > 0 && !isCompletedRef.current && videoRef.current.currentTime < maxWatchedTimeRef.current) {
        videoRef.current.currentTime = maxWatchedTimeRef.current;
      }
    }
  };

  // Submit QR Code Verification
  const handleVerifyQr = async (codeToSubmit?: string) => {
    const code = codeToSubmit || inputQrCode.trim();
    if (!code || !activeQrMarker) return;

    setScanningQr(true);
    setQrError("");

    try {
      const { data } = await api.post(`/courses/${courseId}/lessons/${lessonId}/qr-scan`, { code });

      setScannedQrCodes(data.scannedQrCodes);
      setToastMessage({ text: "QR Code Scanned Successfully!", points: data.pointsAwarded });

      if (data.pointsAwarded > 0 && onPointsAwarded) {
        onPointsAwarded(data.pointsAwarded, "QR Code Scan");
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

      // Close modal and immediately resume video playback
      setActiveQrMarker(null);
      setShowCameraScanner(false);
      setInputQrCode("");
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      fetchProgress();
    } catch (err: any) {
      setQrError(err.response?.data?.message || "Invalid QR Code verification code.");
    } finally {
      setScanningQr(false);
    }
  };

  // Submit In-Video Question Answer
  const handleAnswerSubmit = async (customPayload?: { studentResponse?: any; timeTakenSecs?: number }) => {
    if (!activeQuestionMarker) return;

    setSubmittingQuiz(true);
    const qMarkerId = activeQuestionMarker._id?.toString() || activeQuestionMarker.questionText;
    const timeTaken = customPayload?.timeTakenSecs || Math.max(1, Math.round((Date.now() - (questionStartTime || Date.now())) / 1000));

    try {
      const { data } = await api.post(`/courses/${courseId}/lessons/${lessonId}/answer`, {
        questionMarkerId: qMarkerId,
        selectedOption: selectedOption !== null ? selectedOption : undefined,
        studentResponse: customPayload?.studentResponse !== undefined ? customPayload.studentResponse : selectedOption,
        timeTaken
      });

      setQuizFeedback(data);

      if (data.isCorrect) {
        setToastMessage({ text: "Verification Successful!", points: data.pointsAwarded });
        if (data.pointsAwarded > 0 && onPointsAwarded) {
          onPointsAwarded(data.pointsAwarded, "Active Verification");
        }

        // On correct answer, show success feedback briefly then auto-dismiss and immediately resume video playback
        setTimeout(() => {
          setActiveQuestionMarker(null);
          setQuizFeedback(null);
          setSelectedOption(null);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          }
        }, 1200);
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

  const resumePlayback = () => {
    setActiveQuestionMarker(null);
    setQuizFeedback(null);
    setSelectedOption(null);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const totalQr = qrMarkers.length;
  const scannedCount = scannedQrCodes.length;
  const totalQ = questionMarkers.length;
  const answeredCorrectCount = answeredQuestions.filter((q) => q.isCorrect).length;

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl relative">
      {/* Toast Banner for Points */}
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
            className="ml-2 text-slate-900 hover:text-slate-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Seeking restriction warning toast */}
      {seekingWarning && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <Lock className="w-4 h-4 text-slate-950 shrink-0" />
          <span>{seekingWarning}</span>
        </div>
      )}

      {/* Main Video Viewport */}
      <div className="relative w-full bg-black flex items-center justify-center min-h-[380px] lg:min-h-[480px]">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full max-h-[520px] object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onSeeking={() => {
            if (!videoRef.current) return;
            const targetTime = videoRef.current.currentTime;
            // Strictly disable stepping / seeking forward into un-watched sections
            if (targetTime > maxWatchedTimeRef.current + 0.3) {
              videoRef.current.currentTime = maxWatchedTimeRef.current;
              if (seekWarningTimerRef.current) clearTimeout(seekWarningTimerRef.current);
              setSeekingWarning("⏩ Step forward is disabled. Please watch the lesson video continuously.");
              seekWarningTimerRef.current = setTimeout(() => setSeekingWarning(null), 4000);
            }
          }}
          onEnded={() => {
            sendWatchProgress(100, duration || videoRef.current?.currentTime || 0);
          }}
          controls
        />

        {/* Completion Banner Overlay */}
        {showCompletionBanner && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div className="text-center px-6">
              <h3 className="text-2xl font-extrabold text-white mb-1">Lesson Completed! 🎉</h3>
              <p className="text-emerald-300 text-sm font-medium">
                You have successfully completed all requirements for this lesson.
                The next lesson has been unlocked.
              </p>
            </div>
            <button
              onClick={() => setShowCompletionBanner(false)}
              className="mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-lg"
            >
              ✓ Continue
            </button>
          </div>
        )}

        {/* Video Overlay: Active Interactive Lesson Rating & Feedback Check-in */}
        {activeQrMarker && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-100 relative">
              <button
                onClick={() => {
                  if (activeQrMarker) {
                    setDismissedMarkerCodes((prev) => [...prev, activeQrMarker.code]);
                  }
                  setActiveQrMarker(null);
                  if (videoRef.current) {
                    videoRef.current.play().catch(() => {});
                    setIsPlaying(true);
                  }
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
                    <span className="text-[10px] text-amber-600 font-extrabold">+{activeQrMarker.points || 15} PTS</span>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full border font-mono font-bold text-xs flex items-center gap-1 shrink-0 ${qrTimer <= 5
                  ? "bg-red-50 border-red-300 text-red-600 animate-pulse"
                  : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>00:{qrTimer < 10 ? `0${qrTimer}` : qrTimer}s</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/70 text-amber-900 mb-4 text-center">
                <p className="text-xs font-bold mb-1">💬 {activeQrMarker.label || "How is this video lesson going so far?"}</p>
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
                  "🎯 Clear & easy to follow!",
                  "⚡ Great explanation & pacing!",
                  "💡 Good content, ready for more!"
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleVerifyQr(activeQrMarker.code)}
                    disabled={scanningQr}
                    className="w-full p-2.5 bg-slate-50 hover:bg-amber-100/60 border border-slate-200 hover:border-amber-400 text-slate-700 font-bold text-xs rounded-xl transition text-left flex items-center justify-between"
                  >
                    <span>{chip}</span>
                    <span className="text-amber-600 text-[10px] font-extrabold">+15 PTS</span>
                  </button>
                ))}
              </div>

              {qrError && <p className="text-xs text-red-500 font-bold mb-2">{qrError}</p>}
            </div>
          </div>
        )}

        {/* Video Overlay: Active Question Modal */}
        {activeQuestionMarker && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 relative">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      In-Video Checkpoint Question
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Answer correctly to continue watching and earn +{activeQuestionMarker.points || 20} points
                    </p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full border font-mono font-bold text-xs flex items-center gap-1.5 shrink-0 ${questionTimer <= 5
                  ? "bg-red-50 border-red-300 text-red-600 animate-pulse"
                  : "bg-blue-50 border-blue-200 text-blue-700"
                  }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>00:{questionTimer < 10 ? `0${questionTimer}` : questionTimer}s</span>
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

              {activeQuestionMarker.questionType === 'matching' ? (
                <TermMatchingTask
                  pairs={activeQuestionMarker.matchingPairs || []}
                  onVerify={(matches, timeTakenSecs) => {
                    handleAnswerSubmit({ studentResponse: matches, timeTakenSecs });
                  }}
                  isSubmitting={submittingQuiz}
                  explanation={activeQuestionMarker.explanation}
                  feedback={quizFeedback}
                  onRetry={() => setQuizFeedback(null)}
                />
              ) : (
                <>
                  {/* Options (MCQ & True/False) */}
                  <div className="space-y-2 mb-4">
                    {(activeQuestionMarker.options.length > 0
                      ? activeQuestionMarker.options
                      : ["True", "False"]
                    ).map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      let optStyle = "border-slate-200 bg-white hover:border-blue-400 text-slate-700";

                      if (quizFeedback) {
                        if (idx === quizFeedback.correctOption) {
                          optStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold";
                        } else if (isSelected && !quizFeedback.isCorrect) {
                          optStyle = "border-red-500 bg-red-50 text-red-800";
                        }
                      } else if (isSelected) {
                        optStyle = "border-blue-600 bg-blue-50 text-blue-800 font-bold";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={!!quizFeedback}
                          onClick={() => setSelectedOption(idx)}
                          className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition flex items-center justify-between ${optStyle}`}
                        >
                          <span>
                            <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                          </span>
                          {quizFeedback && idx === quizFeedback.correctOption && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quiz Feedback Result */}
                  {quizFeedback && (
                    <div
                      className={`p-3 rounded-xl mb-4 text-xs font-medium ${quizFeedback.isCorrect
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                    >
                      <p className="font-bold mb-1">
                        {quizFeedback.isCorrect
                          ? `🎉 Verification Passed! +${quizFeedback.pointsAwarded} Points`
                          : "❌ Incorrect answer. Please try again."}
                      </p>
                      {quizFeedback.explanation && <p>{quizFeedback.explanation}</p>}
                      {quizFeedback.attempts && (
                        <p className="mt-1 text-[11px] text-slate-500 font-bold">Attempts: {quizFeedback.attempts}</p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
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
                        onClick={resumePlayback}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Play className="w-4 h-4" /> Continue Video
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
