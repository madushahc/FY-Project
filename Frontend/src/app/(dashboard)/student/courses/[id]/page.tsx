"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourseStore } from '@/store/useCourseStore';
import { useUserStore } from '@/store/useUserStore';
import { ArrowLeft, Check, Play, FileText, PenTool, Link as LinkIcon, BookOpen, ExternalLink, Lock, HelpCircle, Award } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import InteractiveVideoPlayer from '@/components/InteractiveVideoPlayer';
import InteractiveReadingPlayer from '@/components/InteractiveReadingPlayer';

export default function CoursePlayerView() {
  const params = useParams();
  const router = useRouter();
  const { activeCourse, loading, error, myEnrollments } = useCourseStore();
  // fetchUserProfile and fetchGamification are read via getState() in useCallback to avoid re-render subscriptions

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isInteractiveCompleted, setIsInteractiveCompleted] = useState<boolean>(false);
  const [sessionCompletedLessons, setSessionCompletedLessons] = useState<Set<string>>(new Set());
  const [unlockedLessons, setUnlockedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (params.id) {
      // Use getState() to get stable function references that won't trigger re-renders
      const { fetchCourseById, fetchMyEnrollments } = useCourseStore.getState();
      fetchCourseById(params.id as string);
      fetchMyEnrollments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // All hooks must be declared before any early returns (Rules of Hooks)
  const handlePointsEarned = useCallback(() => {
    const { fetchUserProfile, fetchGamification } = useUserStore.getState();
    fetchUserProfile();
    fetchGamification();
  }, []);

  const handleUnlockNextLesson = useCallback((unlockedLessonId: string, _data: any) => {
    if (unlockedLessonId) {
      setUnlockedLessons((prev) => {
        const next = new Set(prev);
        next.add(String(unlockedLessonId));
        return next;
      });
    }
  }, []);

  const handleLessonCompletionChange = useCallback((completed: boolean, _data: any) => {
    setTimeout(() => {
      setIsInteractiveCompleted(completed);
      if (completed) {
        const { markLessonCompleted, activeCourse, myEnrollments } = useCourseStore.getState();
        const lesson = activeCourse?.modules?.[activeModuleIndex]?.lessons?.[activeLessonIndex];
        if (lesson?._id) {
          setSessionCompletedLessons((prev) => {
            const next = new Set(prev);
            next.add(String(lesson._id));
            return next;
          });
        }
        if (!_data?.isRestoring && activeCourse?._id && lesson?._id) {
          const enrollment = myEnrollments.find(e => e?.course && ((e.course as any)._id === activeCourse._id || (e.course as any) === activeCourse._id));
          const completedLessons = (enrollment as any)?.completedLessons || [];
          const alreadyDone = completedLessons.some((id: any) => String(id) === String(lesson._id));
          if (!alreadyDone) {
            markLessonCompleted(activeCourse._id, lesson._id);
          }
        }
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModuleIndex, activeLessonIndex]);

  if (loading && !activeCourse) {
    return <Loading />;
  }

  if (!loading && !activeCourse) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h3 className="text-xl font-bold text-slate-800">Course No Longer Available</h3>
        <p className="text-sm text-slate-500">This course has been removed by the lecturer or administrator.</p>
        <button
          onClick={() => router.push("/student/courses")}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition shadow-sm"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  const modules = activeCourse?.modules || [];
  const activeModule = modules[activeModuleIndex];
  const activeLesson = activeModule?.lessons?.[activeLessonIndex];

  const currentEnrollment = myEnrollments.find(e => e?.course && ((e.course as any)._id === activeCourse?._id || (e.course as any) === activeCourse?._id));
  const completedLessons = (currentEnrollment as any)?.completedLessons || [];

  // Calculate overall progress safely capped at 100%
  let totalLessons = 0;
  const validLessonIds = new Set<string>();
  modules.forEach((m: any) => {
    m.lessons?.forEach((l: any) => {
      totalLessons++;
      if (l._id) validLessonIds.add(String(l._id));
      if (l.title) validLessonIds.add(String(l.title));
    });
  });
  const validCompletedCount = completedLessons.filter((id: any) => validLessonIds.has(String(id))).length;
  const progressPercent = totalLessons === 0 ? 0 : Math.min(100, Math.round((validCompletedCount / totalLessons) * 100));

  // Flatten all lessons across modules into a single ordered sequence
  const flatLessons: { mIdx: number; lIdx: number; lesson: any }[] = [];
  modules.forEach((m, mIdx) => {
    m.lessons?.forEach((l: any, lIdx: number) => {
      flatLessons.push({ mIdx, lIdx, lesson: l });
    });
  });

  const isLessonCompleted = (lessonId: string, mIdx: number, lIdx: number) => {
    if (!lessonId) return false;
    const strId = String(lessonId);
    if (sessionCompletedLessons.has(strId)) return true;
    if (completedLessons.some((id: any) => String(id) === strId)) return true;
    if (mIdx === activeModuleIndex && lIdx === activeLessonIndex && isInteractiveCompleted) return true;
    return false;
  };

  // Determine if a lesson in the menu is locked (must reach 75% or complete preceding lesson first)
  const isLessonLocked = (targetMIdx: number, targetLIdx: number) => {
    const targetIdx = flatLessons.findIndex(
      (item) => item.mIdx === targetMIdx && item.lIdx === targetLIdx
    );
    if (targetIdx <= 0) return false; // The first lesson in the course is always unlocked

    const prevItem = flatLessons[targetIdx - 1];
    if (!prevItem || !prevItem.lesson?._id) return false;
    const prevId = String(prevItem.lesson._id);

    const prevUnlocked = unlockedLessons.has(prevId);
    const prevCompleted = isLessonCompleted(prevId, prevItem.mIdx, prevItem.lIdx);

    return !(prevUnlocked || prevCompleted);
  };

  // Gating check: Is the active lesson completed (100%) or has unlocked the next lesson (75% watched)?
  const isActiveLessonDone = Boolean(activeLesson?._id) && (
    isLessonCompleted(activeLesson._id, activeModuleIndex, activeLessonIndex) ||
    unlockedLessons.has(String(activeLesson._id))
  );

  const getLessonIcon = (type: string, isCompleted: boolean, isLocked: boolean) => {
    if (isCompleted) return <Check className="w-4 h-4 text-white" strokeWidth={3} />;
    if (isLocked) return <Lock className="w-3.5 h-3.5 text-slate-400" />;
    switch (type) {
      case 'video': return <Play className="w-3.5 h-3.5 ml-0.5" />;
      case 'reading': return <BookOpen className="w-3.5 h-3.5" />;
      case 'assignment': return <PenTool className="w-3.5 h-3.5" />;
      case 'quiz': return <FileText className="w-3.5 h-3.5" />;
      case 'link': return <LinkIcon className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const getLessonMeta = (type: string) => {
    switch (type) {
      case 'video': return '🎥 Video';
      case 'reading': return '📖 Reading';
      case 'assignment': return '📎 Assignment';
      case 'quiz': return '📝 Quiz';
      case 'link': return '🔗 External Link';
      default: return '📄 Content';
    }
  };

  const handleLessonSelect = (modIdx: number, lesIdx: number) => {
    if (isLessonLocked(modIdx, lesIdx)) {
      alert("Lesson Locked 🔒: You must watch at least 75% of the previous video to unlock this lesson!");
      return;
    }
    setActiveModuleIndex(modIdx);
    setActiveLessonIndex(lesIdx);
    setIsInteractiveCompleted(false);
  };

  const goToNext = () => {
    if (!activeModule || !activeLesson) return;
    if (!isActiveLessonDone) {
      alert("Lesson Locked 🔒: Please watch at least 75% of the video to unlock the next lesson!");
      return;
    }

    if (activeLessonIndex < activeModule.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
      setIsInteractiveCompleted(false);
    } else if (activeModuleIndex < modules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveLessonIndex(0);
      setIsInteractiveCompleted(false);
    }
  };

  const goToPrev = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
      setIsInteractiveCompleted(false);
    } else if (activeModuleIndex > 0) {
      setActiveModuleIndex(activeModuleIndex - 1);
      setActiveLessonIndex((modules[activeModuleIndex - 1].lessons?.length || 1) - 1);
      setIsInteractiveCompleted(false);
    }
  };

  const renderContentArea = () => {
    if (!activeLesson) return <div className="p-12 text-center text-slate-500">No content available.</div>;

    const fullUrl = activeLesson.contentUrl?.startsWith('/')
      ? `http://localhost:5000${activeLesson.contentUrl}`
      : activeLesson.contentUrl;

    if (activeLesson.type === 'video' && fullUrl) {
      return (
        <InteractiveVideoPlayer
          videoUrl={fullUrl}
          courseId={activeCourse?._id || ''}
          lessonId={activeLesson._id || activeLesson.title}
          questionMarkers={activeLesson.questionMarkers || []}
          onCompletionChange={handleLessonCompletionChange}
          onUnlockNextLesson={handleUnlockNextLesson}
          onPointsAwarded={handlePointsEarned}
        />
      );
    }

    if (activeLesson.type === 'reading') {
      return (
        <InteractiveReadingPlayer
          contentUrl={fullUrl}
          description={activeLesson.description}
          courseId={activeCourse?._id || ''}
          lessonId={activeLesson._id || activeLesson.title}
          questionMarkers={activeLesson.questionMarkers || []}
          onCompletionChange={handleLessonCompletionChange}
          onPointsAwarded={handlePointsEarned}
        />
      );
    }

    if (activeLesson.type === 'link' && fullUrl) {
      return (
        <div className="w-full bg-blue-50 flex flex-col items-center justify-center shrink-0" style={{ height: '400px' }}>
          <LinkIcon className="w-16 h-16 text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold text-blue-800 mb-2">External Resource</h3>
          <p className="text-slate-500 mb-6 max-w-md text-center">This lesson redirects to an external link. Please click the button below to view it.</p>
          <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-sm">
            Open Link <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      );
    }

    return (
      <div className="w-full bg-slate-50 flex items-center justify-center shrink-0" style={{ height: '400px' }}>
        <p className="text-slate-400 font-medium">{getLessonMeta(activeLesson.type)} Viewer Not Yet Available for this type.</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)] -mt-2">
      {/* Left Outline Panel */}
      <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden flex-shrink-0 relative">
        <div className="p-5 border-b border-slate-200 bg-white z-10 shrink-0">
          <h3 className="font-medium text-slate-800 mb-1 leading-tight">{activeCourse?.title}</h3>
          <p className="text-xs text-slate-500 mb-3 font-medium">Course Progress · {progressPercent}% complete</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {modules.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No modules in this course yet.</div>
          ) : (
            modules.map((moduleItem, mIdx) => (
              <div key={moduleItem._id || mIdx} className="space-y-1">
                <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {moduleItem.title}
                </div>
                {moduleItem.lessons?.map((lesson: any, lIdx: number) => {
                  const isActive = mIdx === activeModuleIndex && lIdx === activeLessonIndex;
                  const isCompleted = completedLessons.includes(lesson._id);
                  const isLocked = isLessonLocked(mIdx, lIdx);

                  return (
                    <div
                      key={lesson._id || lIdx}
                      onClick={() => handleLessonSelect(mIdx, lIdx)}
                      className={`p-3 rounded-xl flex items-center justify-between transition-colors ${isLocked
                        ? 'opacity-50 cursor-not-allowed bg-slate-50'
                        : isActive
                          ? 'bg-blue-50/50 cursor-pointer'
                          : isCompleted
                            ? 'hover:bg-slate-50 opacity-80 cursor-pointer'
                            : 'hover:bg-slate-50 cursor-pointer'
                        }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isCompleted
                          ? 'bg-emerald-500 shadow-emerald-500/30'
                          : isLocked
                            ? 'bg-slate-200 text-slate-400'
                            : isActive
                              ? 'bg-blue-600 text-white shadow-blue-500/30'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                          {getLessonIcon(lesson.type, isCompleted, isLocked)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className={`text-sm font-medium truncate ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-2">
                            <span>{getLessonMeta(lesson.type)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 shrink-0 gap-4">
          <div>
            {activeModule && (
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full mb-2 mr-2">
                {activeModule.title}
              </div>
            )}
            {completedLessons.includes(activeLesson?._id) && (
              <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full mb-2">
                Completed
              </div>
            )}
            <h2 className="text-2xl font-medium text-slate-800 mb-1">
              {activeLesson ? activeLesson.title : 'Select a lesson'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {activeLesson ? getLessonMeta(activeLesson.type) : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={goToPrev}
              disabled={activeModuleIndex === 0 && activeLessonIndex === 0}
              className="px-4 py-2 bg-slate-50 text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={goToNext}
              disabled={!modules.length || (activeModuleIndex === modules.length - 1 && activeLessonIndex === modules[modules.length - 1].lessons.length - 1) || !isActiveLessonDone}
              className={`px-6 py-2 text-white font-medium rounded-xl transition flex items-center gap-2 text-sm shadow-sm ${!isActiveLessonDone
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {!isActiveLessonDone ? (
                <>Locked <Lock className="w-3.5 h-3.5" /></>
              ) : (
                <>Next <ArrowLeft className="w-4 h-4 rotate-180" /></>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden relative">

          {renderContentArea()}


        </div>

      </div>
    </div>
  );
}

