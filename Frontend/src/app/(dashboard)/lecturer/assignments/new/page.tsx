"use client";

import React from 'react';
import { Link as LinkIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddAssignment() {
  const router = useRouter();

  return (
    <div className="space-y-6 pb-20 mt-2 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-semibold text-slate-800">Add Assignment</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-slate-400">
           Software Engineering Assignment 2 — <span className="text-slate-600">UML Class Diagram</span>
        </h2>
        <button className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-sm text-sm">
           Save Assignment
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
         <div className="space-y-8">
            
            {/* Instructions */}
            <div>
               <label className="block text-sm font-bold text-slate-800 mb-2">Assignment Instructions *</label>
               <textarea 
                  rows={5}
                  defaultValue="Design a comprehensive class diagram for a Library Management System.&#10;Include all major classes, attributes, methods, and relationships.&#10;Use correct UML notation including visibility, data types, and multiplicity."
                  className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-sm font-medium resize-none shadow-sm"
               ></textarea>
            </div>

            {/* Grid Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
               <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Points Value *</label>
                  <input type="text" defaultValue="80" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 shadow-sm" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Submission Deadline *</label>
                  <input type="text" defaultValue="Jan 27, 2025 11:59 PM" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 shadow-sm" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Late Submission Penalty (%)</label>
                  <input type="text" defaultValue="10" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 shadow-sm" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Submission Type</label>
                  <input type="text" defaultValue="File Upload (PDF, DOCX, ZIP)" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 shadow-sm" />
               </div>
            </div>

            {/* Reference Materials */}
            <div>
               <label className="block text-sm font-bold text-slate-800 mb-2">Reference Materials (optional)</label>
               <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-[60%]" />
                  <input 
                     type="text" 
                     placeholder="Attach rubric, reference PDFs, or starter files..." 
                     className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none text-sm text-slate-500 bg-slate-50/50 shadow-sm" 
                  />
                  <div className="text-[10px] text-slate-400 mt-1 pl-1">Max file size: 50MB</div>
               </div>
            </div>

            {/* Grading Rubric */}
            <div>
               <label className="block text-sm font-bold text-slate-800 mb-4">Grading Rubric</label>
               <div className="space-y-3">
                  {[
                     { desc: 'Correct Class Identification', pts: '25 pts' },
                     { desc: 'Attributes & Methods', pts: '20 pts' },
                     { desc: 'Relationships & Multiplicity', pts: '25 pts' },
                     { desc: 'UML Notation & Formatting', pts: '10 pts' },
                  ].map((r, i) => (
                     <div key={i} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl bg-slate-50/50 shadow-sm">
                        <span className="text-sm font-medium text-slate-700">{r.desc}</span>
                        <span className="text-sm font-bold text-blue-600">{r.pts}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Gamification Callout */}
            <div className="pt-2">
               <p className="text-sm font-bold text-blue-600">
                  Gamification: On-time submission earns +80 pts + progress toward "On Target" badge
               </p>
            </div>

            <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-slate-100">
               <button className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition text-sm">
                  Save as Draft
               </button>
               <button onClick={() => router.back()} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-sm">
                  Publish Assignment
               </button>
            </div>

         </div>
      </div>
    </div>
  );
}
