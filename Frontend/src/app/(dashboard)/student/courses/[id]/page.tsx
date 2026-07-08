"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourseStore } from '@/store/useCourseStore';
import { ArrowLeft, Check, Play, FileText, PenTool, Link as LinkIcon, BookOpen, ExternalLink } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import Link from 'next/link';

export default function CoursePlayerView() {
  const params = useParams();
  const router = useRouter();
  const { activeCourse, fetchCourseById, loading, error, myEnrollments, markLessonCompleted, fetchMyEnrollments } = useCourseStore();
  
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchCourseById(params.id as string);
      fetchMyEnrollments();
    }
  }, [params.id, fetchCourseById, fetchMyEnrollments]);

  if (loading) {
    return <Loading />;
  }

  if (error || !activeCourse) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-2xl flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
        <p>{error || "Course not found."}</p>
        <button onClick={() => router.push('/student/courses')} className="mt-4 px-4 py-2 bg-white rounded-lg font-medium border border-red-200 shadow-sm hover:bg-red-50">
          Go Back
        </button>
      </div>
    );
  }

  const modules = activeCourse.modules || [];
  const activeModule = modules[activeModuleIndex];
  const activeLesson = activeModule?.lessons?.[activeLessonIndex];

  const currentEnrollment = myEnrollments.find(e => (e.course as any)._id === activeCourse._id || (e.course as any) === activeCourse._id);
  const completedLessons = (currentEnrollment as any)?.completedLessons || [];

  // Calculate overall progress
  let totalLessons = 0;
  modules.forEach(m => { totalLessons += (m.lessons?.length || 0); });
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons.length / totalLessons) * 100);

  const getLessonIcon = (type: string, isCompleted: boolean) => {
    if (isCompleted) return <Check className="w-4 h-4 text-white" strokeWidth={3} />;
    switch(type) {
      case 'video': return <Play className="w-3.5 h-3.5 ml-0.5" />;
      case 'reading': return <BookOpen className="w-3.5 h-3.5" />;
      case 'assignment': return <PenTool className="w-3.5 h-3.5" />;
      case 'quiz': return <FileText className="w-3.5 h-3.5" />;
      case 'link': return <LinkIcon className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const getLessonMeta = (type: string) => {
    switch(type) {
      case 'video': return '🎥 Video';
      case 'reading': return '📖 Reading';
      case 'assignment': return '📎 Assignment';
      case 'quiz': return '📝 Quiz';
      case 'link': return '🔗 External Link';
      default: return '📄 Content';
    }
  };

  const handleLessonSelect = (modIdx: number, lesIdx: number) => {
    setActiveModuleIndex(modIdx);
    setActiveLessonIndex(lesIdx);
  };

  const goToNext = () => {
    if (!activeModule) return;
    if (activeLessonIndex < activeModule.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else if (activeModuleIndex < modules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveLessonIndex(0);
    }
  };

  const goToPrev = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    } else if (activeModuleIndex > 0) {
      setActiveModuleIndex(activeModuleIndex - 1);
      setActiveLessonIndex((modules[activeModuleIndex - 1].lessons?.length || 1) - 1);
    }
  };

  const renderContentArea = () => {
    if (!activeLesson) return <div className="p-12 text-center text-slate-500">No content available.</div>;

    const fullUrl = activeLesson.contentUrl?.startsWith('/') 
       ? `http://localhost:5000${activeLesson.contentUrl}` 
       : activeLesson.contentUrl;

    if (activeLesson.type === 'video' && fullUrl) {
      return (
        <div className="w-full bg-black relative flex items-center justify-center shrink-0 overflow-hidden" style={{ height: '500px' }}>
          <video 
            controls 
            className="w-full h-full" 
            src={fullUrl} 
            autoPlay
            onEnded={() => {
              if (activeLesson._id) {
                markLessonCompleted(activeCourse._id, activeLesson._id);
              }
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (activeLesson.type === 'reading' && fullUrl) {
      return (
        <div className="w-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden" style={{ height: '500px' }}>
          <iframe src={fullUrl} className="w-full h-full border-none"></iframe>
        </div>
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
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] -mt-2">
      {/* Left Outline Panel */}
      <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden flex-shrink-0 relative">
        <div className="p-5 border-b border-slate-200 bg-white z-10 shrink-0">
          <h3 className="font-medium text-slate-800 mb-1 leading-tight">{activeCourse.title}</h3>
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
                   
                   return (
                     <div 
                       key={lesson._id || lIdx} 
                       onClick={() => handleLessonSelect(mIdx, lIdx)}
                       className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                         isActive ? 'bg-blue-50/50' : isCompleted ? 'hover:bg-slate-50 opacity-80' : 'hover:bg-slate-50'
                       }`}
                     >
                       <div className="flex items-center gap-3 w-full">
                         <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                           isCompleted ? 'bg-emerald-500 shadow-emerald-500/30' : isActive ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-slate-100 text-slate-500 border border-slate-200 shadow-none'
                         }`}>
                           {getLessonIcon(lesson.type, isCompleted)}
                         </div>
                         <div className="min-w-0 flex-1">
                            <h4 className={`text-sm font-medium truncate ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                              {lesson.title}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                              {getLessonMeta(lesson.type)}
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
                disabled={!modules.length || (activeModuleIndex === modules.length - 1 && activeLessonIndex === modules[modules.length - 1].lessons.length - 1)}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-sm"
             >
               Next <ArrowLeft className="w-4 h-4 rotate-180" />
             </button>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden relative">
           
           {renderContentArea()}

           {/* Lesson Notes / Description */}
           <div className="p-6 flex-1 overflow-y-auto bg-white border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                📝 Lesson Description
              </h3>
              <p className="text-slate-600 text-sm font-medium mb-6 whitespace-pre-wrap">
                {activeLesson?.description || "No description provided for this lesson."}
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
