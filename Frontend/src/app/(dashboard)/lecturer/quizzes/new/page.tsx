"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

export default function AddQuiz() {
  const router = useRouter();

  return (
    <div className="space-y-6 pb-20 mt-2 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-semibold text-slate-800">Add Quiz</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-slate-400">
           Data Structures & Algorithms › <span className="text-slate-600">Module 3</span>
        </h2>
        <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-sm">
           Save Quiz
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
         
         {/* Left Column - Questions */}
         <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/30 mb-6">
               <h3 className="text-sm font-bold text-blue-600 mb-4">Question 1</h3>
               
               <input 
                  type="text" 
                  defaultValue="What is the average time complexity of Merge Sort?" 
                  className="w-full p-4 border border-slate-200 rounded-xl mb-6 focus:outline-none focus:border-blue-500 text-sm font-medium text-slate-700 shadow-sm"
               />

               <h4 className="text-xs font-bold text-slate-700 mb-3">Answer Choices</h4>
               <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 w-full p-3 border border-slate-200 rounded-xl bg-white shadow-sm">
                     <div className="w-4 h-4 rounded-full bg-slate-200 flex-shrink-0"></div>
                     <span className="text-sm font-medium text-slate-600">A. O(n²)</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 w-full p-3 border border-emerald-400 rounded-xl bg-emerald-50/50 shadow-sm">
                     <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                           <Check className="w-3 h-3 text-white stroke-[3]" />
                        </div>
                        <span className="text-sm font-bold text-emerald-800">B. O(n log n)</span>
                     </div>
                     <span className="text-xs font-bold text-emerald-600 pr-2">Correct answer</span>
                  </div>
                  <div className="flex items-center gap-3 w-full p-3 border border-slate-200 rounded-xl bg-white shadow-sm">
                     <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 flex-shrink-0"></div>
                     <span className="text-sm font-medium text-slate-600">C. O(log n)</span>
                  </div>
                  <div className="flex items-center gap-3 w-full p-3 border border-slate-200 rounded-xl bg-white shadow-sm">
                     <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 flex-shrink-0"></div>
                     <span className="text-sm font-medium text-slate-600">D. O(n)</span>
                  </div>
               </div>

               <div className="flex justify-end">
                  <button className="px-5 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition text-sm">
                     Delete
                  </button>
               </div>
            </div>

            <button className="w-full py-4 border border-blue-200 bg-blue-50/50 text-blue-600 font-bold rounded-xl text-sm shadow-sm hover:bg-blue-50 transition mb-10">
               + Add Another Question
            </button>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
               <button onClick={() => router.back()} className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition text-sm">
                  ← Back to Activities
               </button>
               <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-sm">
                  Save & Publish Quiz
               </button>
            </div>
         </div>

         {/* Right Column - Settings */}
         <div className="w-full lg:w-1/3 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-5">Quiz Settings</h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-2">Total Points</label>
                     <input type="text" defaultValue="50" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-2">Time Limit (min)</label>
                     <input type="text" defaultValue="15" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-2">Passing Score (%)</label>
                     <input type="text" defaultValue="60" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-2">Attempts Allowed</label>
                     <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium appearance-none bg-white">
                        <option>1 attempt only ▾</option>
                     </select>
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-5">Due Date & Availability</h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-2">Available From</label>
                     <input type="text" defaultValue="Jan 27, 2025" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-2">Due Date</label>
                     <input type="text" defaultValue="Feb 3, 2025" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium" />
                  </div>
               </div>
            </div>

         </div>
      </div>

    </div>
  );
}
