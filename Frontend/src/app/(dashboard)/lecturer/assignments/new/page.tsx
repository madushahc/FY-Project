"use client";

import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCourseStore } from '@/store/useCourseStore';
import api from '@/lib/api';

export default function AddAssignment() {
  const router = useRouter();
  const { myCourses, fetchMyCreatedCourses } = useCourseStore();

  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [instructions, setInstructions] = useState('');
  const [points, setPoints] = useState('100');
  const [deadline, setDeadline] = useState('');
  const [penalty, setPenalty] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     fetchMyCreatedCourses();
  }, [fetchMyCreatedCourses]);

  const handlePublish = async () => {
     if (!title || !course || !instructions || !deadline) {
        alert("Please fill out all required fields.");
        return;
     }
     
     setLoading(true);
     try {
        await api.post('/assignments', {
           title,
           course,
           instructions,
           points: Number(points),
           deadline: new Date(deadline),
           latePenaltyPercent: Number(penalty),
           isPublished: true
        });
        alert("Assignment published successfully!");
        router.push('/lecturer/activities');
     } catch(err) {
        console.error("Failed to publish assignment", err);
        alert("Failed to publish assignment.");
     }
     setLoading(false);
  };

  return (
    <div className="space-y-6 pb-20 mt-2 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-semibold text-slate-800">Add Assignment</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <input 
           type="text" 
           placeholder="Assignment Title (e.g. UML Class Diagram)" 
           value={title}
           onChange={(e) => setTitle(e.target.value)}
           className="text-xl font-medium text-slate-800 bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none w-[400px] pb-1 transition-colors placeholder:text-slate-400"
        />
        <button onClick={handlePublish} disabled={loading} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-sm text-sm disabled:opacity-50">
           {loading ? 'Saving...' : 'Save Assignment'}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
         <div className="space-y-8">
            
            <div>
               <label className="block text-sm font-bold text-slate-800 mb-2">Select Course *</label>
               <select 
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-sm font-medium shadow-sm"
               >
                  <option value="">Select a course...</option>
                  {myCourses.map((c: any) => (
                     <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
               </select>
            </div>

            {/* Instructions */}
            <div>
               <label className="block text-sm font-bold text-slate-800 mb-2">Assignment Instructions *</label>
               <textarea 
                  rows={5}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Design a comprehensive class diagram..."
                  className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-sm font-medium resize-none shadow-sm"
               ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
               <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Points Value *</label>
                  <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 shadow-sm" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Submission Deadline *</label>
                  <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 shadow-sm" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Late Submission Penalty (%)</label>
                  <input type="number" value={penalty} onChange={(e) => setPenalty(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 shadow-sm" />
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
               <button onClick={() => router.back()} className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition text-sm">
                  Cancel
               </button>
               <button onClick={handlePublish} disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-sm disabled:opacity-50">
                  {loading ? 'Publishing...' : 'Publish Assignment'}
               </button>
            </div>

         </div>
      </div>
    </div>
  );
}
