"use client";

import React from 'react';
import { ArrowLeft, Check, Play, FileText, PenTool } from 'lucide-react';

export default function LessonView() {
  const lessons = [
    { id: 1, title: 'Intro to Arrays', meta: '🎥 12 min', state: 'completed', points: '+10' },
    { id: 2, title: 'Linked Lists', meta: '🎥 18 min', state: 'completed', points: '+10' },
    { id: 3, title: 'Sorting Algorithms', meta: '🎥 22 min', state: 'active', points: null },
    { id: 4, title: 'Binary Trees', meta: '🎥 20 min', state: 'locked', points: null, isNumber: true },
    { id: 5, title: 'Graph Traversal', meta: '📝 Quiz', state: 'locked', points: null, isNumber: true },
    { id: 6, title: 'Dynamic Programming', meta: '📎 Assignment', state: 'locked', points: null, isNumber: true },
    { id: 7, title: 'Greedy Algorithms', meta: '🎥 16 min', state: 'locked', points: null, isNumber: true },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] -mt-2">
      {/* Left Outline Panel */}
      <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden flex-shrink-0 relative">
        <div className="p-5 border-b border-slate-200 bg-white z-10 shrink-0">
          <h3 className="font-medium text-slate-800 mb-1">Data Structures & Algorithms</h3>
          <p className="text-xs text-slate-500 mb-3 font-medium">Module 3 of 6 · 78% complete</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {lessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                lesson.state === 'active' 
                  ? 'bg-blue-50/50' 
                  : lesson.state === 'completed'
                    ? 'hover:bg-slate-50'
                    : 'hover:bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  lesson.state === 'completed' ? 'bg-emerald-500 text-white' :
                  lesson.state === 'active' ? 'bg-blue-600 text-white shadow-blue-500/30' :
                  'bg-slate-100 text-slate-500 font-medium text-xs border border-slate-200 shadow-none'
                }`}>
                  {lesson.state === 'completed' ? <Check className="w-4 h-4 text-white" strokeWidth={3} /> :
                   lesson.state === 'active' ? <Play className="w-3.5 h-3.5 ml-0.5 fill-white" /> :
                   lesson.id}
                </div>
                <div>
                   <h4 className={`text-sm font-medium ${lesson.state === 'active' ? 'text-blue-700' : 'text-slate-700'}`}>
                     {lesson.title}
                   </h4>
                   <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                     {lesson.meta}
                   </p>
                </div>
              </div>
              
              {lesson.state === 'completed' && lesson.points && (
                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold rounded-full">
                  {lesson.points}
                </div>
              )}
              {lesson.state === 'active' && (
                <div className="px-2 py-0.5 bg-blue-100/50 text-blue-600 border border-blue-100 text-[11px] font-bold rounded-full">
                  Active
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 shrink-0 gap-4">
           <div>
             <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full mb-2">
               Lesson 3 of 6
             </div>
             <h2 className="text-2xl font-medium text-slate-800 mb-1">Sorting Algorithms</h2>
             <p className="text-sm text-slate-500 font-medium">🎥 22 min · <span className="text-yellow-500">⭐</span> +10 pts on completion</p>
           </div>
           <div className="flex gap-3">
             <button className="px-4 py-2 bg-slate-50 text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-100 transition flex items-center gap-2 text-sm shadow-sm">
               <ArrowLeft className="w-4 h-4" /> Previous
             </button>
             <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition flex items-center gap-2 text-sm shadow-sm">
               Next <ArrowLeft className="w-4 h-4 rotate-180" />
             </button>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden relative">
           {/* Video Player */}
           <div className="w-full bg-[#4A3285] relative flex items-center justify-center shrink-0 overflow-hidden" style={{ height: '60%' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-blue-900/40 pointer-events-none"></div>
              
              <button className="w-20 h-20 rounded-full border-2 border-white bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all z-10 group shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <Play className="w-8 h-8 text-white ml-2 fill-white opacity-90 group-hover:opacity-100" />
              </button>
              
              <span className="absolute left-6 bottom-[72px] text-white/80 text-sm font-medium">Sorting Algorithms Explained — Click to Play</span>

              {/* Custom Video Controls */}
              <div className="absolute bottom-0 left-0 w-full px-6 py-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-4 text-xs font-medium text-white/90">
                  <span>8:22</span>
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full relative cursor-pointer overflow-hidden">
                     <div className="absolute left-0 top-0 h-full bg-white rounded-full w-[38%] shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                  </div>
                  <span>22:00</span>
                </div>
              </div>
           </div>

           {/* Lesson Notes */}
           <div className="p-6 flex-1 overflow-y-auto">
              <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                📝 Lesson Notes
              </h3>
              <p className="text-slate-600 text-sm font-medium mb-6">
                In this lesson, we explore the fundamental sorting algorithms used in computer science. 
              </p>

              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-6">
                <h4 className="text-blue-700 text-xs font-bold mb-3">Key Algorithms Covered</h4>
                <ul className="text-blue-600 text-[13px] font-medium flex flex-wrap gap-x-6 gap-y-2">
                  <li className="flex items-center gap-1">Bubble Sort O(n²)</li>
                  <li className="flex items-center gap-1">· Merge Sort O(n log n)</li>
                  <li className="flex items-center gap-1">· Quick Sort O(n log n)</li>
                  <li className="flex items-center gap-1">· Heap Sort O(n log n)</li>
                </ul>
              </div>

              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-sm shadow-blue-500/20">
                Proceed to Quiz → +50 pts
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
