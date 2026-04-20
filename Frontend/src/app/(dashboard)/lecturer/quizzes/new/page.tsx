"use client";

import React from 'react';
import { Check } from 'lucide-react';

export default function AddQuiz() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 mt-2">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-2xl font-semibold text-slate-800">Add Quiz</h2>
      </div>

      {/* Header Action */}
      <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg mb-6">
         <p className="text-lg font-medium text-slate-400 px-2">
            Data Structures & Algorithms <span className="mx-1">›</span> Module 3
         </p>
         <button className="px-6 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition shadow-sm">
            Save Quiz
         </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
         {/* Left Column - Questions List */}
         <div className="flex-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
               <h3 className="font-bold text-slate-800 mb-2">Questions</h3>
               
               <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-5 relative">
                  <div>
                     <label className="block text-sm font-bold text-blue-600 mb-2">Question 1</label>
                     <input type="text" defaultValue="What is the average time complexity of Merge Sort?" className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800 text-sm bg-white" />
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-slate-500 mb-3">Answer Choices</label>
                     <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <div className="w-4 h-4 rounded-full border border-slate-300 bg-slate-50"></div>
                           <input type="text" defaultValue="A. O(n²)" className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:outline-none text-slate-600 bg-white" />
                        </div>
                        <div className="flex items-center gap-3 relative">
                           <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                           </div>
                           <input type="text" defaultValue="B. O(n log n)" className="w-full text-sm p-2 border border-emerald-500 rounded-lg focus:outline-none text-emerald-700 font-medium bg-emerald-50/30" />
                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600">Correct answer</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-4 h-4 rounded-full border border-slate-300 bg-slate-50"></div>
                           <input type="text" defaultValue="C. O(log n)" className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:outline-none text-slate-600 bg-white" />
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-4 h-4 rounded-full border border-slate-300 bg-slate-50"></div>
                           <input type="text" defaultValue="D. O(n)" className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:outline-none text-slate-600 bg-white" />
                        </div>
                     </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                     <button className="px-5 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg hover:bg-red-100 transition">
                        Delete
                     </button>
                  </div>
               </div>

               <button className="w-full py-4 bg-blue-50/50 border border-blue-200 rounded-xl text-blue-600 font-bold text-sm hover:bg-blue-50 transition border-dashed">
                  + Add Another Question
               </button>

               <div className="flex justify-between gap-4 pt-6 mt-6 border-t border-slate-100">
                  <button className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition border border-slate-200">
                     ← Back to Activities
                  </button>
                  <button className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center justify-center">
                     Save & Publish Quiz
                  </button>
               </div>
            </div>
         </div>

         {/* Right Column - Settings */}
         <div className="w-full lg:w-[340px] space-y-6 flex-shrink-0">
            {/* Quiz Settings */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
               <h3 className="font-bold text-slate-800">Quiz Settings</h3>
               
               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Total Points</label>
                  <input type="text" defaultValue="50" className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Time Limit (min)</label>
                  <input type="text" defaultValue="15" className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Passing Score (%)</label>
                  <input type="text" defaultValue="60" className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Attempts Allowed</label>
                  <div className="relative">
                     <select className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700 text-sm appearance-none bg-white">
                        <option>1 attempt only</option>
                        <option>2 attempts</option>
                        <option>Unlimited</option>
                     </select>
                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">▾</span>
                  </div>
               </div>
            </div>

            {/* Availability Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
               <h3 className="font-bold text-slate-800">Due Date & Availability</h3>
               
               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Available From</label>
                  <input type="text" defaultValue="Jan 27, 2025" className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Due Date</label>
                  <input type="text" defaultValue="Feb 3, 2025" className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
