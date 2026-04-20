"use client";

import React, { useState } from 'react';
import { FileText, Clock, CheckCircle2, ChevronRight, X, CloudUpload } from 'lucide-react';

export default function StudentAssignments() {
  const [activeTab, setActiveTab] = useState('Pending');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const pendingAssignments = [
    { title: 'Software Engineering Assignment 2 — UML Class Diagram', course: 'Software Engineering', due: 'Today, 11:59 PM', points: 80, badge: 'On Target', badgeProgress: '3/5', status: 'Due Soon', statusColor: 'text-orange-600 bg-orange-100', urgency: 'high' },
    { title: 'Database Design Case Study', course: 'Database Management', due: 'Jan 28, 2025', points: 100, status: 'Not Started', statusColor: 'text-slate-600 bg-slate-100', urgency: 'normal' },
    { title: 'React State Management Report', course: 'Web Technologies', due: 'Feb 2, 2025', points: 50, status: 'Not Started', statusColor: 'text-slate-600 bg-slate-100', urgency: 'normal' }
  ];

  const submittedAssignments = [
    { title: 'Data Structures Tree Traversal', course: 'Algorithms', submitted: 'Jan 22, 2025', points: 100, status: 'Graded', statusColor: 'text-emerald-600 bg-emerald-100', score: '95/100' },
    { title: 'UX Research Methods', course: 'HCI', submitted: 'Jan 15, 2025', points: 50, status: 'Pending Grade', statusColor: 'text-blue-600 bg-blue-100', score: '-/50' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 relative">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-semibold text-slate-800">Assignments</h2>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
         <button className={`pb-4 px-2 font-semibold text-sm transition-colors relative ${activeTab === 'Pending' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('Pending')}>
            Pending ({pendingAssignments.length})
            {activeTab === 'Pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
         </button>
         <button className={`pb-4 px-2 font-semibold text-sm transition-colors relative ${activeTab === 'Submitted' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('Submitted')}>
            Submitted ({submittedAssignments.length})
            {activeTab === 'Submitted' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
         </button>
      </div>

      <div className="space-y-4">
         {activeTab === 'Pending' ? pendingAssignments.map((a, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${a.urgency === 'high' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                     <FileText className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-800 text-lg mb-1">{a.title}</h3>
                     <p className="text-sm font-medium text-slate-500 mb-2">{a.course}</p>
                     <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className={`px-2.5 py-1 rounded-md ${a.statusColor}`}>{a.status}</span>
                        <span className="flex items-center gap-1 text-slate-600"><Clock className="w-3.5 h-3.5" /> Due: {a.due}</span>
                        <span className="text-blue-600">+{a.points} pts</span>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-2 shrink-0">
                  <button 
                     onClick={() => setIsSubmitModalOpen(true)}
                     className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm w-full md:w-auto"
                  >
                     Submit Assignment
                  </button>
                  {a.badge && <p className="text-[10px] font-bold text-slate-400">🎯 {a.badge} progress: {a.badgeProgress}</p>}
               </div>
            </div>
         )) : submittedAssignments.map((a, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${a.status === 'Graded' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-500'}`}>
                     <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-800 text-lg mb-1">{a.title}</h3>
                     <p className="text-sm font-medium text-slate-500 mb-2">{a.course}</p>
                     <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className={`px-2.5 py-1 rounded-md ${a.statusColor}`}>{a.status}</span>
                        <span className="text-slate-600">Submitted: {a.submitted}</span>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Score</p>
                     <p className={`text-2xl font-bold ${a.status === 'Graded' ? 'text-emerald-600' : 'text-slate-600'}`}>{a.score}</p>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* SUBMIT MODAL */}
      {isSubmitModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl flex flex-col overflow-hidden">
               {/* Header */}
               <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     <FileText className="w-5 h-5 text-slate-400" /> Submit Assignment
                  </h3>
                  <button onClick={() => setIsSubmitModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition">
                     <X className="w-4 h-4" />
                  </button>
               </div>
               
               <div className="p-6 space-y-6">
                  {/* Info */}
                  <div>
                     <p className="text-xs font-bold text-slate-500 mb-0.5">Course:</p>
                     <h4 className="text-sm font-bold text-slate-800 mb-1">Software Engineering Assignment 2 — UML Class Diagram</h4>
                     <p className="text-xs font-medium text-slate-400">Due: Today 11:59 PM · Points: +80</p>
                  </div>

                  {/* Upload Area */}
                  <div className="w-full h-32 border-2 border-blue-200 bg-blue-50/30 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-500 hover:bg-blue-50 transition cursor-pointer">
                     <CloudUpload className="w-8 h-8 mb-2 text-slate-400" />
                     <span className="text-sm font-bold text-slate-700">Drag & drop your file here</span>
                     <span className="text-xs font-medium text-blue-500 mb-1">or click to browse</span>
                     <span className="text-[10px] text-slate-400">PDF, DOCX, ZIP · Max 25MB</span>
                  </div>

                  {/* Uploaded File Block */}
                  <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                     <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">📄</div>
                        <div>
                           <p className="text-sm font-bold text-slate-800">UML_Class_Diagram_SE_Assignment2.pdf</p>
                           <p className="text-[10px] font-medium text-slate-400">2.4 MB · PDF · Ready to upload</p>
                        </div>
                     </div>
                     <button className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition">
                        <X className="w-4 h-4" />
                     </button>
                  </div>

                  {/* Gamification Banner */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm font-bold text-blue-600">
                     <p>On-time submission bonus:</p>
                     <p>+80 pts + 🎯 "On Target" badge progress (3/5)</p>
                  </div>

                  {/* Notes */}
                  <div>
                     <label className="block text-xs font-bold text-slate-600 mb-2">Notes to instructor (optional):</label>
                     <textarea rows={3} placeholder="Add any comments or notes about your submission..." className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm resize-none"></textarea>
                  </div>
               </div>

               {/* Footer */}
               <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-white text-sm">
                  <button onClick={() => setIsSubmitModalOpen(false)} className="px-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition">
                     Cancel
                  </button>
                  <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
                     Submit Assignment → +80 pts
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
