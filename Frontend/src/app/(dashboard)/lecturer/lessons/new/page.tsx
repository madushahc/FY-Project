"use client";

import React, { useState } from 'react';
import { Camera, FileText, Check, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddLesson() {
  const router = useRouter();

  return (
    <div className="space-y-6 pb-20 mt-2 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-semibold text-slate-800">Add Lesson</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-slate-400 text-sm font-medium">
           <span className="text-slate-400 hover:text-slate-600 cursor-pointer">Data Structures & Algorithms</span>
           <span className="mx-2">›</span>
           <span className="text-slate-600 font-bold">Module 3</span>
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-sm">
           Save Lesson
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
         
         {/* Left Column - Lesson Content */}
         <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-slate-400 text-sm mb-4">Sorting Algorithms — Bubble Sort</h3>
            <h2 className="text-lg font-bold text-slate-800 mb-6">Module 3 — Sorting Algorithms</h2>

            <div className="space-y-6">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Video Upload *</label>
                  <div className="w-full h-32 border-2 border-blue-200 bg-blue-50/50 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition mb-4">
                     <Camera className="w-6 h-6 mb-2 text-slate-400" />
                     <span className="text-sm font-medium text-slate-500">Drag video or click to browse</span>
                     <span className="text-[10px] text-slate-400 mt-1">MP4, MOV, AVI · max 500MB · HD recommended</span>
                  </div>
                  
                  {/* Uploading State */}
                  <div className="w-full bg-[#161B2B] rounded-xl p-4 relative overflow-hidden">
                     <div className="flex items-center gap-3 relative z-10">
                        <div className="bg-slate-800 p-2 rounded-lg"><div className="w-4 h-4 bg-slate-600 rounded-sm"></div></div>
                        <div>
                           <p className="text-white text-sm font-bold">sorting_algorithms_lesson3.mp4</p>
                           <p className="text-slate-400 text-[10px] font-medium mt-0.5">22:14 • 184 MB • Uploading 67%</p>
                        </div>
                     </div>
                     <div className="absolute bottom-0 left-0 h-1 bg-blue-500 w-[67%]"></div>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lesson Notes / Description</label>
                  <textarea 
                     rows={6}
                     defaultValue="In this lesson, we explore bubble sort, one of the simplest sorting algorithms. We will analyze its time complexity O(n²) and discuss when to use it."
                     className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-sm font-medium resize-none"
                  ></textarea>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Attachments (optional)</label>
                  <div className="relative">
                     <LinkIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                     <input 
                        type="text" 
                        placeholder="Attach slides, PDFs, code files..." 
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 bg-slate-50/50" 
                     />
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
               <button onClick={() => router.back()} className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition text-sm">
                  ← Back to Course
               </button>
               <div className="flex gap-4">
                  <button className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition text-sm">
                     Save & Add Another
                  </button>
                  <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-sm">
                     Save & Preview
                  </button>
               </div>
            </div>
         </div>

         {/* Right Column - Settings */}
         <div className="w-full lg:w-1/3 space-y-6">
            
            {/* Lesson Settings */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-5">Lesson Settings</h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-2">Points Awarded</label>
                     <input type="text" defaultValue="10" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-2">Duration (min)</label>
                     <input type="text" defaultValue="22" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-2">Lesson Order in Module</label>
                     <input type="text" defaultValue="Lesson 3 of 6" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 bg-slate-50/50" />
                  </div>
                  
                  <div className="pt-2">
                     <label className="block text-xs font-bold text-slate-700 mb-3">Lesson Visibility</label>
                     <div className="space-y-2">
                        <div className="border border-blue-400 bg-blue-50/50 rounded-lg p-3 flex gap-3 cursor-pointer">
                           <div className="mt-0.5 w-4 h-4 rounded-full border-4 border-blue-600 bg-white flex-shrink-0"></div>
                           <div>
                              <h4 className="text-sm font-bold text-blue-800 leading-none">Published</h4>
                              <p className="text-[10px] text-slate-400 mt-1">Visible to students</p>
                           </div>
                        </div>
                        <div className="border border-slate-200 bg-white rounded-lg p-3 flex gap-3 cursor-pointer hover:bg-slate-50 transition">
                           <div className="mt-0.5 w-4 h-4 rounded-full bg-slate-200 flex-shrink-0"></div>
                           <div>
                              <h4 className="text-sm font-bold text-slate-600 leading-none">Draft</h4>
                              <p className="text-[10px] text-slate-400 mt-1">Hidden from students</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Completion Criteria */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-5">Completion Criteria</h3>
               <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                     <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-600 border border-blue-600">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                     </div>
                     <span className="text-sm font-medium text-slate-700">Watch full video</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                     <div className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-300">
                     </div>
                     <span className="text-sm font-medium text-slate-600">Answer reflection question</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                     <div className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-300">
                     </div>
                     <span className="text-sm font-medium text-slate-600">Download materials</span>
                  </label>
               </div>
            </div>

         </div>
      </div>

    </div>
  );
}
