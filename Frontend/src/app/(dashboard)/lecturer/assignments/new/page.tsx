"use client";

import React from 'react';
import { Paperclip } from 'lucide-react';

export default function AddAssignment() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 mt-2">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-2xl font-semibold text-slate-800">Add Assignment</h2>
      </div>

      {/* Header Action */}
      <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg mb-6">
         <input type="text" defaultValue="Software Engineering Assignment 2 — UML Class Diagram" className="text-lg font-medium text-slate-600 bg-transparent border-none outline-none w-1/2 p-2" readOnly />
         <button className="px-6 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition shadow-sm">
            Save Assignment
         </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
         <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Assignment Instructions *</label>
            <textarea rows={6} defaultValue="Design a comprehensive class diagram for a Library Management System.&#10;Include all major classes, attributes, methods, and relationships.&#10;Use correct UML notation including visibility, data types, and multiplicity." className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm resize-none"></textarea>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Points Value *</label>
               <input type="text" defaultValue="80" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Submission Deadline *</label>
               <input type="text" defaultValue="Jan 27, 2025 11:59 PM" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm" />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Late Submission Penalty (%)</label>
               <input type="text" defaultValue="10" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Submission Type</label>
               <div className="relative">
                  <select className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm appearance-none bg-white">
                     <option>File Upload (PDF, DOCX, ZIP)</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">▾</span>
               </div>
            </div>
         </div>

         <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Reference Materials (optional)</label>
            <div className="w-full h-24 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition cursor-pointer">
               <span className="flex items-center gap-2 text-sm"><Paperclip className="w-4 h-4" /> Attach rubric, reference PDFs, or starter files...</span>
               <span className="text-[10px] mt-1 text-slate-400">Max file size: 50MB</span>
            </div>
         </div>

         <div className="space-y-4 pt-4 border-t border-slate-100 mt-8">
            <h3 className="text-sm font-bold text-slate-800">Grading Rubric</h3>
            <div className="space-y-3">
               <div className="flex justify-between items-center p-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white shadow-sm">
                  <span>Correct Class Identification</span>
                  <span className="font-bold text-blue-600">25 pts</span>
               </div>
               <div className="flex justify-between items-center p-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white shadow-sm">
                  <span>Attributes & Methods</span>
                  <span className="font-bold text-blue-600">20 pts</span>
               </div>
               <div className="flex justify-between items-center p-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white shadow-sm">
                  <span>Relationships & Multiplicity</span>
                  <span className="font-bold text-blue-600">25 pts</span>
               </div>
               <div className="flex justify-between items-center p-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white shadow-sm">
                  <span>UML Notation & Formatting</span>
                  <span className="font-bold text-blue-600">10 pts</span>
               </div>
            </div>
            
            <p className="text-xs font-bold text-blue-600 mt-4">Gamification: On-time submission earns +80 pts + progress toward "On Target" badge</p>
         </div>

         <div className="flex justify-end gap-4 pt-6 border-t border-slate-100 mt-8">
            <button className="px-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition shadow-sm">
               Save as Draft
            </button>
            <button className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm">
               Publish Assignment
            </button>
         </div>
      </div>
    </div>
  );
}
