"use client";

import React, { useState } from 'react';
import { Clock, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function Quiz() {
  const [selectedOption, setSelectedOption] = useState<string | null>('B');

  return (
    <div className="max-w-4xl mx-auto mt-4">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-6">
         <div>
            <div className="inline-block px-3 py-1 bg-yellow-100/80 text-yellow-800 text-[10px] font-bold rounded-full mb-3 shadow-sm border border-yellow-200/50">
               📝 Quiz • DSA Module 3
            </div>
            <h1 className="text-3xl font-semibold text-slate-800 mb-1">Sorting Algorithms Quiz</h1>
            <p className="text-slate-500 text-sm">5 questions • 50 points • 15 min limit</p>
         </div>
         <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm">
            <Clock className="w-4 h-4" />
            12:34
         </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-8">
         <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '20%' }}></div>
         </div>
         <span className="text-sm font-medium text-slate-500 shrink-0">1 of 5</span>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-8 md:p-10">
            <p className="text-blue-600 font-bold text-xs tracking-wider mb-3 uppercase">Question 1</p>
            <h2 className="text-2xl font-medium text-slate-800 mb-8 max-w-2xl leading-snug">
               What is the average time complexity of Merge Sort?
            </h2>

            <div className="space-y-4">
               {[
                 { letter: 'A', text: 'O(n²)' },
                 { letter: 'B', text: 'O(n log n)' },
                 { letter: 'C', text: 'O(log n)' },
                 { letter: 'D', text: 'O(n)' },
               ].map((opt) => {
                 const isSelected = selectedOption === opt.letter;
                 return (
                   <div 
                     key={opt.letter}
                     onClick={() => setSelectedOption(opt.letter)}
                     className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                       isSelected 
                         ? 'border-emerald-500 bg-emerald-50' 
                         : 'border-slate-100 hover:border-slate-200'
                     }`}
                   >
                      <div className="flex items-center gap-4">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                           isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                         }`}>
                            {opt.letter}
                         </div>
                         <span className="text-slate-800 font-medium">
                            {opt.text}
                         </span>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-emerald-500" strokeWidth={3} />
                      )}
                   </div>
                 );
               })}
            </div>
         </div>

         {/* Footer Actions */}
         <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <button className="px-5 py-2.5 bg-slate-100 text-slate-600 font-medium rounded-xl flex items-center gap-2 hover:bg-slate-200 transition text-sm">
               <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-sm text-sm">
               Submit → +10 pts
            </button>
         </div>
      </div>
    </div>
  );
}
