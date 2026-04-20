"use client";

import React from 'react';
import { Camera, Check, Paperclip } from 'lucide-react';

export default function AddLesson() {
   return (
      <div className="max-w-7xl mx-auto space-y-6 pb-20 mt-2">
         <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold text-slate-800">Add Lesson</h2>
         </div>

         {/* Breadcrumb & Header Action */}
         <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg mb-6">
            <p className="text-sm font-medium text-slate-400">
               Data Structures & Algorithms <span className="mx-2">›</span> Module 3
            </p>
            <button className="px-6 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition shadow-sm">
               Save Lesson
            </button>
         </div>

         <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Lesson Content */}
            <div className="flex-1 space-y-6">
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">

                  <div>
                     <input type="text" defaultValue="Sorting Algorithms — Bubble Sort" className="w-fulltext-slate-800 font-bold border-none outline-none focus:ring-0 px-0 bg-transparent" readOnly />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Video Upload *</label>
                     <div className="w-full h-32 border-2 border-blue-200 bg-blue-50/30 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-blue-50 transition cursor-pointer mb-4">
                        <Camera className="w-6 h-6 mb-2 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600">Drag video or click to browse</span>
                        <span className="text-[10px] mt-1">MP4, MOV, AVI - max 500MB - HD recommended</span>
                     </div>

                     {/* Progress Bar Mock */}
                     <div className="bg-[#111827] rounded-xl p-4 overflow-hidden relative">
                        <div className="flex items-center gap-3 relative z-10">
                           <Camera className="w-5 h-5 text-slate-400" />
                           <div>
                              <p className="text-white text-sm font-medium mb-1">sorting_algorithms_lesson3.mp4</p>
                              <p className="text-slate-400 text-[10px]">22:14 - 184 MB - Uploading 67%</p>
                           </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 bg-blue-600" style={{ width: '67%' }}></div>
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Lesson Notes / Description</label>
                     <textarea rows={6} defaultValue="In this lesson, we explore bubble sort, one of the simplest sorting algorithms.&#10;We will analyze its time complexity O(n²) and discuss when to use it." className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm resize-none"></textarea>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Attachments (optional)</label>
                     <div className="relative">
                        <Paperclip className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                        <input type="text" placeholder="Attach slides, PDFs, code files..." className="w-full py-3.5 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm" />
                     </div>
                  </div>

                  {/* Action Area */}
                  <div className="flex gap-4 pt-4">
                     <button className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition border border-slate-200">
                        ← Back to Course
                     </button>
                     <button className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition border border-slate-200">
                        Save & Add Another
                     </button>
                     <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm ml-auto">
                        Save & Preview
                     </button>
                  </div>
               </div>
            </div>

            {/* Right Column - Settings */}
            <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
               {/* Lesson Settings Box */}
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                  <h3 className="font-bold text-slate-800">Lesson Settings</h3>

                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-1.5">Points Awarded</label>
                     <input type="text" defaultValue="10" className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-1.5">Duration (min)</label>
                     <input type="text" defaultValue="22" className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-1.5">Lesson Order in Module</label>
                     <input type="text" defaultValue="Lesson 3 of 6" className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-2">Lesson Visibility</label>
                     <div className="space-y-2">
                        <div className="border border-blue-400 bg-blue-50/30 rounded-xl p-3 flex gap-3 cursor-pointer">
                           <div className="mt-0.5 w-4 h-4 rounded-full border-4 border-blue-600 outline outline-1 outline-blue-600 bg-white shadow-sm flex-shrink-0"></div>
                           <div>
                              <h4 className="text-sm font-bold text-blue-800">Published</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Visible to students</p>
                           </div>
                        </div>
                        <div className="border border-slate-200 bg-white rounded-xl p-3 flex gap-3 cursor-pointer hover:bg-slate-50 transition">
                           <div className="mt-0.5 w-4 h-4 rounded-full bg-slate-200 flex-shrink-0"></div>
                           <div>
                              <h4 className="text-sm font-bold text-slate-700">Draft</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Hidden from students</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Criteria Box */}
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800">Completion Criteria</h3>

                  <div className="space-y-3">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded border bg-blue-500 border-blue-500 flex items-center justify-center transition group-hover:bg-blue-600">
                           <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Watch full video</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded border border-slate-300 bg-white flex items-center justify-center transition group-hover:border-blue-500">
                        </div>
                        <span className="text-sm font-medium text-slate-700">Answer reflection question</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded border border-slate-300 bg-white flex items-center justify-center transition group-hover:border-blue-500">
                        </div>
                        <span className="text-sm font-medium text-slate-700">Download materials</span>
                     </label>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
