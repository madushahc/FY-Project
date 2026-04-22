"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Camera, Plus, Video, PenTool, FileText, Link as LinkIcon, PlayCircle, FileSearch, Trash2, GripVertical, Settings } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';

export default function NewCourseWizard() {
  const router = useRouter();
  const { createCourse, loading } = useCourseStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [descLength, setDescLength] = useState(0);

  const handlePublish = async () => {
    try {
      await createCourse({
        title: title || 'Untitled Course',
        description: description || 'No description provided.',
        status: 'Published'
      });
      router.push('/lecturer/courses');
    } catch (e) {
      console.error('Failed to create course', e);
      alert('Failed to publish course. See console for details.');
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
         <div className="relative flex justify-between items-center max-w-3xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -z-10 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-[2px] bg-emerald-500 -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
            
            {[
               { num: 1, label: 'Basic Info' },
               { num: 2, label: 'Content' },
               { num: 3, label: 'Settings' },
               { num: 4, label: 'Gamification' },
            ].map(step => {
               const isCompleted = currentStep > step.num;
               const isActive = currentStep === step.num;
               return (
                  <div key={step.num} className="flex flex-col items-center gap-2 bg-white px-2 cursor-pointer" onClick={() => setCurrentStep(step.num)}>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                        isCompleted ? 'bg-emerald-500 text-white shadow-sm' : 
                        isActive ? 'bg-blue-600 text-white shadow-sm' : 
                        'bg-slate-100 text-slate-400'
                     }`}>
                        {isCompleted ? <Check className="w-4 h-4 ml-0.5" strokeWidth={3} /> : step.num}
                     </div>
                     <span className={`text-xs font-bold ${
                        isCompleted ? 'text-emerald-500' : 
                        isActive ? 'text-blue-600' : 'text-slate-400'
                     }`}>
                        {step.label}
                     </span>
                  </div>
               );
            })}
         </div>
      </div>
    );
  };

  const renderStep1 = () => (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2">
         <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Course Title *</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Advanced Database Systems" 
              className="w-full p-3 border-2 border-blue-500 rounded-xl bg-white focus:outline-none text-slate-800 font-bold"  
            />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Course Code *</label>
               <input type="text" placeholder="CS401" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
               <input type="text" placeholder="Faculty of Computing" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
         </div>
         <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Short Description *</label>
            <div className="relative">
               <textarea 
                  rows={4} 
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setDescLength(e.target.value.length); }}
                  placeholder="This course covers advanced database concepts including indexing, query optimization..." 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 resize-none pb-8" 
               ></textarea>
               <div className="absolute right-3 bottom-3 text-xs text-slate-400 font-medium">{descLength}/500</div>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Credit Hours</label>
               <input type="text" placeholder="3" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Academic Year</label>
               <input type="text" placeholder="2024/2025" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
               <input type="text" placeholder="Jan 27, 2025" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">End Date</label>
               <input type="text" placeholder="May 15, 2025" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Max Enrollment</label>
               <input type="text" placeholder="60" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty Level</label>
               <input type="text" placeholder="Intermediate" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
         </div>
         <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Course Thumbnail</label>
            <div className="w-48 h-32 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition cursor-pointer">
               <Camera className="w-6 h-6 mb-2 text-slate-400" />
               <span className="text-sm font-medium text-blue-500">Upload Image</span>
               <span className="text-[10px] mt-1">PNG, JPG - max 5MB</span>
            </div>
         </div>
      </div>
  );

  const renderStep2 = () => (
     <div className="flex flex-col lg:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-2">
        {/* Left Column: Course Structure */}
        <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-shrink-0">
           <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Course Structure</h3>
              <p className="text-xs text-slate-400 font-medium">Drag modules & lessons to reorder</p>
           </div>
           
           <div className="p-5 space-y-3">
              {/* Active Module 1 */}
              <div className="border border-blue-200 rounded-xl overflow-hidden shadow-sm">
                 <div className="bg-blue-50 px-4 py-3 flex items-center justify-between cursor-pointer">
                    <h4 className="text-sm font-bold text-blue-700 shrink-0">▾ Module 1: Introduction to Arrays</h4>
                    <button className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-white px-2 py-1 rounded shadow-sm border border-blue-100">+ Add</button>
                 </div>
              </div>
              
              {/* Inactive Module 2 & 3 */}
              {['Module 2: Linked Lists', 'Module 3: Sorting Algorithms'].map((m) => (
                 <div key={m} className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
                    <div className="bg-white px-4 py-3 flex items-center justify-between cursor-pointer">
                       <h4 className="text-sm font-bold text-slate-700 shrink-0 flex items-center gap-1"><GripVertical className="w-3 h-3 text-slate-300"/> ▸ {m}</h4>
                       <button className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">+ Add</button>
                    </div>
                 </div>
              ))}

              {/* Items for current active module (pretending Module 3 is expanded based on screenshot, wait, it's M1 items outside?) */}
              {/* Based on screenshot, items are below Module 3, let's render them as part of the list */}
              <div className="ml-6 space-y-2 relative before:absolute before:left-[-12px] before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
                 <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between shadow-sm relative before:absolute before:left-[-12px] before:top-1/2 before:w-3 before:h-px before:bg-slate-200">
                    <div className="flex items-center gap-2">
                       <PenTool className="w-4 h-4 text-orange-500" />
                       <span className="text-xs font-semibold text-slate-700">Quiz 1: Arrays Basics</span>
                    </div>
                    <GripVertical className="w-3 h-3 text-slate-300 cursor-grab" />
                 </div>
                 <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between shadow-sm relative before:absolute before:left-[-12px] before:top-1/2 before:w-3 before:h-px before:bg-slate-200">
                    <div className="flex items-center gap-2">
                       <FileText className="w-4 h-4 text-slate-400" />
                       <span className="text-xs font-semibold text-slate-700">Lesson 2: Array Operations</span>
                    </div>
                    <GripVertical className="w-3 h-3 text-slate-300 cursor-grab" />
                 </div>
              </div>

              <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold border border-blue-100 hover:bg-blue-100 transition mt-4">
                 + Add New Module
              </button>
           </div>
        </div>

        {/* Right Column: Editor */}
        <div className="flex-1 space-y-5">
           
           {/* Add Content Panel */}
           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-1">Add Content to Module 1</h3>
              <p className="text-xs text-slate-400 font-medium mb-4">Select a content type to add:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group">
                    <div className="flex items-start justify-between">
                       <div className="flex gap-3">
                          <div className="text-2xl pt-1">🎬</div>
                          <div>
                             <h4 className="font-bold text-blue-800 text-sm mb-0.5">Video Lesson</h4>
                             <p className="text-[11px] text-slate-500">Upload MP4/MOV, add notes & attachments</p>
                          </div>
                       </div>
                    </div>
                    <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-[11px] font-bold text-blue-600 bg-white border border-blue-100 px-3 py-1 rounded shadow-sm">+ Add</button>
                    </div>
                 </div>

                 <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group">
                    <div className="flex items-start justify-between">
                       <div className="flex gap-3">
                          <div className="text-2xl pt-1">📝</div>
                          <div>
                             <h4 className="font-bold text-orange-800 text-sm mb-0.5">Quiz</h4>
                             <p className="text-[11px] text-slate-500">Multiple choice, true/false, short answer</p>
                          </div>
                       </div>
                    </div>
                    <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-[11px] font-bold text-orange-600 bg-white border border-orange-100 px-3 py-1 rounded shadow-sm">+ Add</button>
                    </div>
                 </div>

                 <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group">
                    <div className="flex items-start justify-between">
                       <div className="flex gap-3">
                          <div className="text-2xl pt-1">📎</div>
                          <div>
                             <h4 className="font-bold text-red-700 text-sm mb-0.5">Assignment</h4>
                             <p className="text-[11px] text-slate-500">File submission with rubric & deadline</p>
                          </div>
                       </div>
                    </div>
                    <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-[11px] font-bold text-red-600 bg-white border border-red-100 px-3 py-1 rounded shadow-sm">+ Add</button>
                    </div>
                 </div>

                 <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group">
                    <div className="flex items-start justify-between">
                       <div className="flex gap-3">
                          <div className="text-2xl pt-1">📄</div>
                          <div>
                             <h4 className="font-bold text-emerald-800 text-sm mb-0.5">Reading Material</h4>
                             <p className="text-[11px] text-slate-500">PDF, slides, or external link</p>
                          </div>
                       </div>
                    </div>
                    <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-[11px] font-bold text-emerald-600 bg-white border border-emerald-100 px-3 py-1 rounded shadow-sm">+ Add</button>
                    </div>
                 </div>

                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group md:col-span-2">
                    <div className="flex items-start justify-between">
                       <div className="flex gap-3">
                          <div className="text-2xl pt-1">🔗</div>
                          <div>
                             <h4 className="font-bold text-slate-700 text-sm mb-0.5">External Resource</h4>
                             <p className="text-[11px] text-slate-500">YouTube video, website, or tool</p>
                          </div>
                       </div>
                    </div>
                    <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded shadow-sm">+ Add</button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Editor View */}
           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden border-t-0 p-0">
               <div className="bg-blue-600 px-6 py-3">
                  <h3 className="font-bold text-white text-sm">Currently editing: Lesson 1 — What is an Array?</h3>
               </div>
               <div className="p-6 space-y-5">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Lesson Title</label>
                     <input type="text" defaultValue="What is an Array? Introduction & Applications" className="w-full p-3 bg-white border border-blue-500 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Video</label>
                     <div className="w-full bg-[#1e293b] text-slate-300 rounded-xl py-3 px-4 flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-slate-800 transition">
                        intro_arrays.mp4 · 12:30 · Uploaded ▾
                     </div>
                  </div>
                  <div>
                     <span className="text-sm font-bold text-slate-700">Points: 10</span>
                  </div>
               </div>
           </div>
           
        </div>
     </div>
  );

  const renderStep3 = () => (
     <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
         {/* Settings Section */}
         <div className="space-y-6">
            
            <div className="p-6 pb-2 border-b border-slate-100">
               <h3 className="font-bold text-slate-800 mb-4 bg-blue-600 text-white rounded-lg px-4 py-2 mt-[-24px] mx-[-24px]">Enrollment Settings</h3>
               
               <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700">Enrollment Type</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="border border-blue-500 bg-blue-50/30 rounded-xl p-4 flex items-start gap-3 cursor-pointer">
                        <div className="w-5 h-5 rounded-full border-[5px] border-blue-500 bg-white shrink-0 mt-0.5"></div>
                        <div>
                           <h5 className="font-bold text-blue-700 text-sm">Open Enrollment</h5>
                           <p className="text-xs text-slate-400 mt-1 font-medium">Any student can self-enroll</p>
                        </div>
                     </div>
                     <div className="border border-slate-200 bg-white rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 bg-white shrink-0 mt-0.5"></div>
                        <div>
                           <h5 className="font-bold text-slate-700 text-sm">Restricted</h5>
                           <p className="text-xs text-slate-400 mt-1 font-medium">Lecturer approves each student</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 pb-2 border-b border-slate-100">
               <div className="space-y-4 mb-4">
                  <h4 className="text-sm font-bold text-slate-700">Course Visibility</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="border border-blue-400 bg-blue-50/20 rounded-xl p-4 flex items-start gap-3 cursor-pointer">
                        <div className="text-lg shrink-0 mt-[-2px]">👁️</div>
                        <div>
                           <h5 className="font-bold text-blue-600 text-sm">Published</h5>
                           <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Visible to all enrolled students</p>
                        </div>
                     </div>
                     <div className="border border-slate-200 bg-white rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition">
                        <div className="text-lg shrink-0 mt-[-2px]">📝</div>
                        <div>
                           <h5 className="font-bold text-slate-600 text-sm">Draft</h5>
                           <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Only visible to you (not published)</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 pb-2 border-b border-slate-100">
               <h4 className="text-sm font-bold text-slate-700 mb-4">Schedule & Access</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 mb-2">Course Start Date</label>
                     <input type="text" defaultValue="Jan 27, 2025 ·" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 mb-2">Course End Date</label>
                     <input type="text" defaultValue="May 30, 2025 ·" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500" />
                  </div>
               </div>
            </div>

            <div className="p-6 pb-8">
               <h4 className="text-sm font-bold text-slate-700 mb-4">Completion Requirements</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between border border-slate-100 bg-slate-50 rounded-xl p-4">
                     <span className="text-sm font-medium text-slate-600">Minimum lesson watch %</span>
                     <div className="flex items-center gap-2">
                        <input type="text" defaultValue="80" className="w-16 text-center font-bold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                        <span className="text-xs text-slate-400">%</span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between border border-slate-100 bg-slate-50 rounded-xl p-4">
                     <span className="text-sm font-medium text-slate-600">Minimum quiz pass score</span>
                     <div className="flex items-center gap-2">
                        <input type="text" defaultValue="60" className="w-16 text-center font-bold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                        <span className="text-xs text-slate-400">%</span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between border border-slate-100 bg-slate-50 rounded-xl p-4">
                     <span className="text-sm font-medium text-slate-600">Assignments submitted</span>
                     <div className="flex items-center gap-2">
                        <input type="text" defaultValue="All" className="w-16 text-center font-bold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                     </div>
                  </div>
               </div>
            </div>

         </div>
     </div>
  );

  const renderStep4 = () => (
     <div className="flex flex-col lg:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-2">
        {/* Points System Column */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
           <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">⭐ Points System</h3>
           </div>
           
           <div className="p-5 space-y-4">
              {[
                 { icon: '📖', title: 'Complete Lesson', subtitle: 'Finish a video lesson', val: '10' },
                 { icon: '📝', title: 'Pass Quiz', subtitle: 'Score at or above pass threshold', val: '50' },
                 { icon: '📎', title: 'Submit Assignment', subtitle: 'On-time submission', val: '80' },
                 { icon: '💬', title: 'Forum Contribution', subtitle: 'Post or reply in forum', val: '5' },
                 { icon: '🎯', title: 'Perfect Quiz Score', subtitle: 'Score 100% on any quiz', val: '25' },
                 { icon: '🎓', title: 'Course Completion', subtitle: 'Finish all required activities', val: '200' },
              ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors bg-white">
                    <div className="flex gap-4 items-center">
                       <span className="text-xl">{item.icon}</span>
                       <div>
                          <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{item.subtitle}</p>
                       </div>
                    </div>
                    <div>
                       <input type="text" defaultValue={item.val} className="w-16 text-center font-bold text-blue-600 px-3 py-2 bg-white border border-blue-400 rounded-lg" />
                    </div>
                 </div>
              ))}
              
              <button className="w-full py-4 mt-2 bg-slate-50 text-slate-700 font-bold rounded-xl text-sm border border-slate-100 hover:bg-slate-100 transition">
                 Reset to Defaults
              </button>
           </div>
        </div>

        {/* Badge Criteria Column */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
           <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">🏅 Badge Criteria</h3>
           </div>
           
           <div className="p-5 space-y-4">
              {[
                 { bg: 'bg-yellow-50', cbg: 'bg-yellow-500', icon: '🏆', title: 'Quiz Champion', subtitle: 'Pass 5 quizzes ≥ 80%', on: true },
                 { bg: 'bg-red-50', cbg: 'bg-red-500', icon: '🔥', title: 'Hot Streak', subtitle: 'Login 5 consecutive days', on: false },
                 { bg: 'bg-emerald-50', cbg: 'bg-emerald-500', icon: '📚', title: 'Bookworm', subtitle: 'Complete all course lessons', on: true },
                 { bg: 'bg-blue-50', cbg: 'bg-blue-600', icon: '⚡', title: 'Speed Learner', subtitle: '5 lessons in a single day', on: true },
                 { bg: 'bg-purple-50', cbg: 'bg-purple-500', icon: '💬', title: 'Collaborator', subtitle: 'Make 10 forum contributions', on: true },
                 { bg: 'bg-teal-50', cbg: 'bg-teal-500', icon: '🎯', title: 'On Target', subtitle: '5 on-time assignment submissions', on: true },
              ].map((b, idx) => (
                 <div key={idx} className={`flex items-center justify-between border border-slate-100 rounded-xl p-4 ${b.bg}`}>
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 ${b.cbg} rounded-full flex items-center justify-center text-white shadow-sm`}>
                          {b.icon}
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-slate-800">{b.title}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{b.subtitle}</p>
                       </div>
                    </div>
                    {/* Toggle Switch UI */}
                    <div className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${b.on ? b.cbg : 'bg-slate-300'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-transform ${b.on ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
     </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 mt-2">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-semibold text-slate-800">Create New Course</h2>
      </div>

      {renderProgressBar()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      <div className="flex justify-between pt-6 mt-6 border-t border-slate-200">
         {currentStep > 1 ? (
            <button 
               onClick={() => setCurrentStep(prev => prev - 1)}
               className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition border border-slate-200 flex items-center gap-2"
            >
               ← Back
            </button>
         ) : <div></div>}
         
         <div className="flex gap-4">
            <button onClick={() => router.back()} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">
               {currentStep === 4 ? 'Back to Settings' : 'Cancel'}
            </button>
            {currentStep < 4 ? (
               <button 
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-10 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center text-sm"
               >
                  Next →
               </button>
            ) : (
               <button 
                  onClick={handlePublish}
                  disabled={loading}
                  className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-sm disabled:opacity-50 text-sm"
               >
                  {loading ? 'Publishing...' : '🚀 Publish Course'}
               </button>
            )}
         </div>
      </div>
    </div>
  );
}
