"use client";

import React from 'react';
import { ArrowLeft, Check, Play, FileText, PenTool, PlayCircle } from 'lucide-react';

export default function LessonView() {
  const lessons = [
    { id: 1, title: 'Intro to Arrays', meta: '🎥 12 min', state: 'completed', points: '+10' },
    { id: 2, title: 'Linked Lists', meta: '🎥 18 min', state: 'completed', points: '+10' },
    { id: 3, title: 'Sorting Algorithms', meta: '🎥 22 min', state: 'active', points: null },
    { id: 4, title: 'Binary Trees', meta: '🎥 20 min', state: 'locked', points: null },
    { id: 5, title: 'Graph Traversal', meta: '📝 Quiz', state: 'locked', points: null },
    { id: 6, title: 'Dynamic Programming', meta: '📎 Assignment', state: 'locked', points: null },
    { id: 7, title: 'Greedy Algorithms', meta: '🎥 16 min', state: 'locked', points: null },
  ];

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)] -mt-2">
      {/* Left Outline Panel */}
      <div className="w-80 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-5 border-b border-slate-200 bg-white z-10 shrink-0">
          <h3 className="font-semibold text-slate-800 mb-1">Data Structures & Algorithms</h3>
          <p className="text-xs text-slate-500 mb-3">Module 3 of 6 • 78% complete</p>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {lessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                lesson.state === 'active' 
                  ? 'bg-blue-50 border border-blue-100' 
                  : lesson.state === 'completed'
                    ? 'hover:bg-slate-50 border border-transparent'
                    : 'hover:bg-slate-50 border border-transparent opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  lesson.state === 'completed' ? 'bg-emerald-500 text-white' :
                  lesson.state === 'active' ? 'bg-blue-600 text-white' :
                  'bg-slate-100 text-slate-500 font-medium text-sm'
                }`}>
                  {lesson.state === 'completed' ? <Check className="w-4 h-4 text-white" strokeWidth={3} /> :
                   lesson.state === 'active' ? <Play className="w-4 h-4 ml-0.5 fill-white" /> :
                   lesson.id}
                </div>
                <div>
                   <h4 className={`text-sm font-medium ${lesson.state === 'active' ? 'text-blue-700' : 'text-slate-700'}`}>
                     {lesson.title}
                   </h4>
                   <p className="text-xs text-slate-500 flex items-center gap-1">
                     {lesson.meta}
                   </p>
                </div>
              </div>
              
              {lesson.state === 'completed' && lesson.points && (
                <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  {lesson.points}
                </div>
              )}
              {lesson.state === 'active' && (
                <div className="px-2.5 py-1 bg-blue-100/50 text-blue-700 text-xs font-bold rounded-full">
                  Active
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 shrink-0">
           <div>
             <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full mb-2">
               Lesson 3 of 6
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-1">Sorting Algorithms</h2>
             <p className="text-sm text-slate-500">🎥 22 min • ⭐ +10 pts on completion</p>
           </div>
           <div className="flex gap-2">
             <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition flex items-center gap-2">
               <ArrowLeft className="w-4 h-4" /> Previous
             </button>
             <button className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
               Next <ArrowLeft className="w-4 h-4 rotate-180" />
             </button>
           </div>
        </div>

        {/* Video Player */}
        <div className="w-full bg-[#4A3285] rounded-t-2xl relative flex items-center justify-center shrink-0" style={{ height: '50%' }}>
           <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent"></div>
           
           <button className="w-20 h-20 rounded-full border-2 border-white/40 bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/40 hover:scale-105 transition-all z-10 group">
             <Play className="w-8 h-8 text-white ml-2 fill-white opacity-80 group-hover:opacity-100" />
           </button>
           <span className="absolute bottom-16 text-white/70 font-medium">Sorting Algorithms Explained — Click to Play</span>

           {/* Custom Video Controls */}
           <div className="absolute bottom-0 left-0 w-full p-4 bg-black/20 backdrop-blur-md">
             <div className="flex items-center gap-4 text-xs font-medium text-white/80">
               <span>8:22</span>
               <div className="flex-1 h-1.5 bg-white/20 rounded-full relative cursor-pointer">
                  <div className="absolute left-0 top-0 h-full bg-white rounded-full w-[38%] shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
               </div>
               <span>22:00</span>
             </div>
           </div>
        </div>

        {/* Lesson Notes */}
        <div className="bg-white border border-slate-200 border-t-0 p-6 rounded-b-2xl shadow-sm flex-1 overflow-y-auto">
           <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
             📝 Lesson Notes
           </h3>
           <p className="text-slate-600 text-sm mb-6">
             In this lesson, we explore the fundamental sorting algorithms used in computer science. 
           </p>

           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
             <h4 className="text-blue-800 text-sm font-semibold mb-2">Key Algorithms Covered</h4>
             <ul className="text-blue-700 text-sm flex gap-4">
               <li className="flex items-center gap-1">• Bubble Sort O(n²)</li>
               <li className="flex items-center gap-1">• Merge Sort O(n log n)</li>
               <li className="flex items-center gap-1">• Quick Sort O(n log n)</li>
               <li className="flex items-center gap-1">• Heap Sort O(n log n)</li>
             </ul>
           </div>

           <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
             Proceed to Quiz → +50 pts
           </button>
        </div>
      </div>
    </div>
  );
}
