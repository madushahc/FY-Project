"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, X, CloudUpload } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import api from '@/lib/api';
import Loading from '@/components/ui/Loading';

export default function StudentAssignments() {
  const { myEnrollments, fetchMyEnrollments } = useCourseStore();
  const { mySubmissions, fetchMySubmissions, submitAssignment } = useAssignmentStore();
  
  const [activeTab, setActiveTab] = useState('Pending');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  
  const [allAssignments, setAllAssignments] = useState<any[]>([]);
  const [loadingObj, setLoadingObj] = useState(true);

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [studentNotes, setStudentNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMyEnrollments();
    fetchMySubmissions();
  }, [fetchMyEnrollments, fetchMySubmissions]);

  // Aggregate pending assignments dynamically
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoadingObj(true);
      try {
        let agg: any[] = [];
        for (const enrollment of myEnrollments) {
           const courseId = enrollment.course?._id || enrollment.course;
           if (!courseId) continue;
           const res = await api.get(`/assignments/course/${courseId}`);
           
           // Inject course name into assignments for UI layout
           const mapped = res.data.map((a: any) => ({
             ...a,
             courseName: enrollment.course?.title || 'Unknown Course'
           }));
           agg = [...agg, ...mapped];
        }
        setAllAssignments(agg);
      } catch (err) {
        console.error("Failed to load assignments", err);
      }
      setLoadingObj(false);
    };

    if (myEnrollments.length > 0) {
      fetchAssignments();
    } else {
       setLoadingObj(false); // Finished loading empty
    }
  }, [myEnrollments]);

  // Filter out assignments that have already been submitted
  const submittedIds = new Set(mySubmissions.map(s => (s.assignment?._id || s.assignment)));
  const pendingAssignments = allAssignments.filter(a => !submittedIds.has(a._id));

  const handleOpenSubmit = (assignment: any) => {
     setSelectedAssignment(assignment);
     setIsSubmitModalOpen(true);
     setFile(null);
     setStudentNotes('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!selectedAssignment || !file) return;

     setSubmitting(true);
     try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('assignmentId', selectedAssignment._id); // Needed for backend req payload via auth if attached
        if (studentNotes) formData.append('studentNotes', studentNotes);

        await submitAssignment(selectedAssignment._id, formData);
        
        // Refresh local UI states
        await fetchMySubmissions();
        setIsSubmitModalOpen(false);
     } catch (err) {
        console.error("Submission error", err);
        alert("Failed to submit assignment.");
     }
     setSubmitting(false);
  };

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
            Submitted ({mySubmissions.length})
            {activeTab === 'Submitted' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
         </button>
      </div>

      <div className="space-y-4">
         {loadingObj ? (
            <Loading />
         ) : activeTab === 'Pending' ? (
           pendingAssignments.length === 0 ? (
             <div className="text-center py-12 text-slate-500">You have no pending assignments! 🎉</div>
           ) : (
             pendingAssignments.map((a) => (
              <div key={a._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-500">
                       <FileText className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800 text-lg mb-1">{a.title}</h3>
                       <p className="text-sm font-medium text-slate-500 mb-2">{a.courseName}</p>
                       <div className="flex items-center gap-4 text-xs font-semibold">
                          <span className="px-2.5 py-1 rounded-md text-orange-600 bg-orange-100">Due Soon</span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <Clock className="w-3.5 h-3.5" /> Due: {new Date(a.deadline).toLocaleDateString()}
                          </span>
                          <span className="text-blue-600">+{a.totalPoints || 100} pts</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-2 shrink-0">
                    <button 
                       onClick={() => handleOpenSubmit(a)}
                       className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm w-full md:w-auto"
                    >
                       Submit
                    </button>
                 </div>
              </div>
            ))
           )
         ) : (
           mySubmissions.length === 0 ? (
             <div className="text-center py-12 text-slate-500">No past submissions to display.</div>
           ) : (
             mySubmissions.map((s) => {
               const assignmentData = s.assignment || {};
               return (
                  <div key={s._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col gap-4">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                           <div className={`p-3 rounded-xl ${s.status === 'Graded' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-500'}`}>
                              <CheckCircle2 className="w-6 h-6" />
                           </div>
                           <div>
                              <h3 className="font-bold text-slate-800 text-lg mb-1">{assignmentData.title || 'Assignment'}</h3>
                              <div className="flex items-center gap-4 text-xs font-semibold mt-2">
                                 {s.status === 'Graded' ? (
                                   <span className="px-2.5 py-1 rounded-md text-emerald-600 bg-emerald-100">Graded</span>
                                 ) : (
                                   <span className="px-2.5 py-1 rounded-md text-blue-600 bg-blue-100">Pending Grade</span>
                                 )}
                                 <span className="text-slate-600">Submitted: {new Date(s.submittedAt).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                           <div className="text-right">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Score</p>
                              <p className={`text-2xl font-bold ${s.status === 'Graded' ? 'text-emerald-600' : 'text-slate-600'}`}>
                                 {s.score !== undefined && s.score !== null ? `${s.score}/${assignmentData.totalPoints || 100}` : '-/100'}
                              </p>
                           </div>
                        </div>
                     </div>
                     {s.status === 'Graded' && (
                        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 mt-1 space-y-3">
                           {s.feedback && (
                              <div>
                                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <span>💬</span> Lecturer Feedback
                                 </h4>
                                 <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                    "{s.feedback}"
                                 </p>
                              </div>
                           )}
                           
                           {s.rubricGrades && s.rubricGrades.length > 0 && (
                              <div className="pt-2 border-t border-slate-100/80">
                                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <span>🎯</span> Rubric Breakdown
                                 </h4>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {s.rubricGrades.map((rg: any, idx: number) => (
                                       <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-700 bg-white border border-slate-150 p-2.5 rounded-lg shadow-sm">
                                          <span>{rg.criteria}</span>
                                          <span className="text-blue-650">{rg.score} / {rg.points} pts</span>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               )
             })
           )
         )}
      </div>

      {/* SUBMIT MODAL */}
      {isSubmitModalOpen && selectedAssignment && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="bg-white w-full max-w-xl rounded-2xl shadow-xl flex flex-col overflow-hidden">
               {/* Header */}
               <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     <FileText className="w-5 h-5 text-slate-400" /> Submit Assignment
                  </h3>
                  <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition">
                     <X className="w-4 h-4" />
                  </button>
               </div>
               
               <div className="p-6 space-y-6">
                  {/* Info */}
                  <div>
                     <p className="text-xs font-bold text-slate-500 mb-0.5">Course: {selectedAssignment.courseName}</p>
                     <h4 className="text-sm font-bold text-slate-800 mb-1">{selectedAssignment.title}</h4>
                     <p className="text-xs font-medium text-slate-400">Due: {new Date(selectedAssignment.deadline).toLocaleDateString()} · Points: +{selectedAssignment.totalPoints || 100}</p>
                  </div>

                  {/* Upload Area */}
                  <label className="w-full h-32 border-2 border-blue-200 bg-blue-50/30 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-500 hover:bg-blue-50 transition cursor-pointer relative overflow-hidden">
                     <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                     <CloudUpload className="w-8 h-8 mb-2 text-slate-400" />
                     {file ? (
                        <span className="text-sm font-bold text-slate-700">{file.name} (Ready)</span>
                     ) : (
                        <>
                           <span className="text-sm font-bold text-slate-700">Drag & drop your file here</span>
                           <span className="text-xs font-medium text-blue-500 mb-1">or click to browse</span>
                        </>
                     )}
                  </label>

                  {/* Notes */}
                  <div>
                     <label className="block text-xs font-bold text-slate-600 mb-2">Notes to instructor (optional):</label>
                     <textarea 
                       rows={3} 
                       value={studentNotes}
                       onChange={e => setStudentNotes(e.target.value)}
                       placeholder="Add any comments or notes about your submission..." 
                       className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm resize-none"
                     ></textarea>
                  </div>
               </div>

               {/* Footer */}
               <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-white text-sm">
                  <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="px-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition">
                     Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                     {submitting ? 'Uploading...' : 'Submit Assignment →'}
                  </button>
               </div>
            </form>
         </div>
      )}
    </div>
  );
}
