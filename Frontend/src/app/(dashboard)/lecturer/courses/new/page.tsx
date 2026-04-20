"use client";

import React, { useState } from 'react';
import { Check, Camera, Plus, Video, PenTool, FileText, Link as LinkIcon, Settings2, PlayCircle, FileSearch } from 'lucide-react';

export default function NewCourseWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [descLength, setDescLength] = useState(120);

  const renderProgressBar = () => {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
         <div className="relative flex justify-between items-center max-w-3xl mx-auto">
            {/* Connecting Lines */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -z-10 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-[2px] bg-emerald-500 -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
            
            {/* Steps */}
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
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
         <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Course Title *</label>
            <input type="text" defaultValue="Advanced Database Systems" className="w-full p-3 border-2 border-blue-500 rounded-xl focus:outline-none text-slate-800 font-medium"  />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Course Code *</label>
               <input type="text" defaultValue="CS401" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
               <input type="text" defaultValue="Faculty of Computing" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
         </div>
         <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Short Description *</label>
            <div className="relative">
               <textarea rows={4} defaultValue="This course covers advanced database concepts including indexing, query optimization..." className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 resize-none pb-8" onChange={(e) => setDescLength(e.target.value.length)}></textarea>
               <div className="absolute right-3 bottom-3 text-xs text-slate-400 font-medium">{descLength}/500</div>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Credit Hours</label>
               <input type="text" defaultValue="3" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Academic Year</label>
               <input type="text" defaultValue="2024/2025" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
               <input type="text" defaultValue="Jan 27, 2025" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">End Date</label>
               <input type="text" defaultValue="May 15, 2025" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Max Enrollment</label>
               <input type="text" defaultValue="60" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty Level</label>
               <input type="text" defaultValue="Intermediate" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" />
            </div>
         </div>
         <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Course Thumbnail</label>
            <div className="w-48 h-32 border-2 border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition cursor-pointer">
               <Camera className="w-6 h-6 mb-2 text-slate-500" />
               <span className="text-sm font-medium text-blue-600">Upload Image</span>
               <span className="text-[10px] mt-1">PNG, JPG - max 5MB</span>
            </div>
         </div>
      </div>
  );

  const renderStep2 = () => (
     <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Col - Modules List */}
        <div className="w-full lg:w-1/3 space-y-4">
           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 text-slate-800 font-semibold text-sm">
                 Course Structure
              </div>
              <p className="px-4 py-3 text-xs text-slate-400 border-b border-slate-100 bg-white">Drag modules & lessons to reorder</p>
              
              <div className="p-3 bg-blue-50 border-b border-blue-100 flex justify-between items-center cursor-pointer">
                 <span className="text-sm font-bold text-blue-700 flex items-center gap-2">▾ Module 1: Introduction to Arrays</span>
                 <span className="text-xs font-bold text-blue-600">+ Add</span>
              </div>
              <div className="bg-white border-b border-slate-100 pl-8 pr-4 py-3 text-sm text-slate-600 flex justify-between items-center hover:bg-slate-50 border-l-2 border-transparent cursor-pointer">
                 <span className="flex items-center gap-2"><PenTool className="w-3.5 h-3.5 text-orange-400" /> Quiz 1: Arrays Basics</span>
                 <span className="text-slate-300">⋮</span>
              </div>
              <div className="bg-white border-b-0 pl-8 pr-4 py-3 text-sm text-slate-600 flex justify-between items-center hover:bg-slate-50 border-l-2 border-blue-500 cursor-pointer">
                 <span className="flex items-center gap-2"><PlayCircle className="w-3.5 h-3.5 text-slate-400" /> Lesson 2: Array Operations</span>
                 <span className="text-slate-300">⋮</span>
              </div>
              
              <div className="p-3 bg-white border-y border-slate-100 flex justify-between items-center hover:bg-slate-50 cursor-pointer">
                 <span className="text-sm font-medium text-slate-700 flex items-center gap-2">▸ Module 2: Linked Lists</span>
                 <span className="text-xs font-bold text-blue-600">+ Add</span>
              </div>
              <div className="p-3 bg-white border-b border-slate-100 flex justify-between items-center hover:bg-slate-50 cursor-pointer">
                 <span className="text-sm font-medium text-slate-700 flex items-center gap-2">▸ Module 3: Sorting Algorithms</span>
                 <span className="text-xs font-bold text-blue-600">+ Add</span>
              </div>
           </div>
           <button className="w-full border-2 border-blue-100 bg-blue-50 text-blue-600 rounded-xl py-2.5 text-sm font-bold hover:bg-blue-100 transition shadow-sm">
              + Add New Module
           </button>
        </div>

        {/* Right Col - Editor */}
        <div className="w-full lg:w-2/3 space-y-6">
           <div>
              <h3 className="font-bold text-slate-800 mb-1">Add Content to Module 1</h3>
              <p className="text-xs text-slate-400 mb-4">Select a content type to add:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition cursor-pointer flex flex-col justify-between h-28 relative">
                    <div className="flex items-start gap-2">
                       <Video className="w-5 h-5 text-slate-700" />
                       <div>
                          <h4 className="text-sm font-bold text-blue-900">Video Lesson</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">Upload MP4/MOV, add notes & attachments</p>
                       </div>
                    </div>
                    <span className="absolute bottom-3 right-3 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">+ Add</span>
                 </div>

                 <div className="p-4 rounded-xl border border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50 transition cursor-pointer flex flex-col justify-between h-28 relative">
                    <div className="flex items-start gap-2">
                       <Check className="w-5 h-5 text-orange-500" />
                       <div>
                          <h4 className="text-sm font-bold text-yellow-900">Quiz</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">Multiple choice, true/false, short answer</p>
                       </div>
                    </div>
                    <span className="absolute bottom-3 right-3 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">+ Add</span>
                 </div>

                 <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 transition cursor-pointer flex flex-col justify-between h-28 relative">
                    <div className="flex items-start gap-2">
                       <FileText className="w-5 h-5 text-red-500" />
                       <div>
                          <h4 className="text-sm font-bold text-red-900">Assignment</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">File submission with rubric & deadline</p>
                       </div>
                    </div>
                    <span className="absolute bottom-3 right-3 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">+ Add</span>
                 </div>

                 <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition cursor-pointer flex flex-col justify-between h-28 relative">
                    <div className="flex items-start gap-2">
                       <FileSearch className="w-5 h-5 text-emerald-600" />
                       <div>
                          <h4 className="text-sm font-bold text-emerald-900">Reading Material</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">PDF, slides, or external link</p>
                       </div>
                    </div>
                    <span className="absolute bottom-3 right-3 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">+ Add</span>
                 </div>

                 <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer flex flex-col justify-between h-28 relative sm:col-span-2">
                    <div className="flex items-start gap-2">
                       <LinkIcon className="w-5 h-5 text-slate-600" />
                       <div>
                          <h4 className="text-sm font-bold text-slate-800">External Resource</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">YouTube video, website, or tool</p>
                       </div>
                    </div>
                    <span className="absolute bottom-3 right-3 text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md">+ Add</span>
                 </div>
              </div>
           </div>

           {/* Active Editor Panel */}
           <div className="border border-blue-500 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="bg-blue-600 text-white px-4 py-3 text-sm font-bold">
                 Currently editing: Lesson 1 — What is an Array?
              </div>
              <div className="p-5 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Lesson Title</label>
                    <input type="text" defaultValue="What is an Array? Introduction & Applications" className="w-full text-sm p-2.5 border border-blue-400 rounded-lg focus:outline-none" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Video</label>
                    <div className="w-full bg-[#161B2B] text-slate-300 text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                       intro_arrays.mp4 · 12:30 · Uploaded <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-700 -mb-1">Points: 10</label>
                 </div>
              </div>
           </div>
        </div>
     </div>
  );

  const renderStep3 = () => (
     <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-blue-600 text-white p-4 font-bold text-sm tracking-wide">
           Enrollment Settings
        </div>
        
        <div className="p-8 space-y-8">
           {/* Section 1 */}
           <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">Enrollment Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="border border-blue-400 bg-blue-50/30 rounded-xl p-4 flex gap-3 cursor-pointer">
                    <div className="mt-0.5 w-4 h-4 rounded-full border-4 border-blue-600 outline outline-1 outline-blue-600 bg-white shadow-sm flex-shrink-0"></div>
                    <div>
                       <h4 className="text-sm font-bold text-blue-800">Open Enrollment</h4>
                       <p className="text-[11px] text-slate-400 mt-0.5">Any student can self-enroll</p>
                    </div>
                 </div>
                 <div className="border border-slate-200 bg-white rounded-xl p-4 flex gap-3 cursor-pointer hover:bg-slate-50 transition">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-slate-200 flex-shrink-0"></div>
                    <div>
                       <h4 className="text-sm font-bold text-slate-700">Restricted</h4>
                       <p className="text-[11px] text-slate-400 mt-0.5">Lecturer approves each student</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 2 */}
           <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">Course Visibility</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="border border-blue-400 bg-blue-50/30 rounded-xl p-4 flex gap-3 cursor-pointer">
                    <div className="mt-0.5 text-lg">👁️</div>
                    <div>
                       <h4 className="text-sm font-bold text-blue-800">Published</h4>
                       <p className="text-[11px] text-slate-400 mt-0.5">Visible to all enrolled students</p>
                    </div>
                 </div>
                 <div className="border border-slate-200 bg-white rounded-xl p-4 flex gap-3 cursor-pointer hover:bg-slate-50 transition">
                    <div className="mt-0.5 text-lg">📝</div>
                    <div>
                       <h4 className="text-sm font-bold text-slate-700">Draft</h4>
                       <p className="text-[11px] text-slate-400 mt-0.5">Only visible to you (not published)</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 3 */}
           <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">Schedule & Access</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Course Start Date</label>
                    <input type="text" defaultValue="Jan 27, 2025" className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Course End Date</label>
                    <input type="text" defaultValue="May 30, 2025" className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                 </div>
              </div>
           </div>

           {/* Section 4 */}
           <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">Completion Requirements</h3>
              <div className="space-y-3">
                 <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    <span className="text-sm text-slate-700 font-medium">Minimum lesson watch %</span>
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-1 flex items-center gap-2">
                       <span className="font-bold text-sm text-slate-800">80</span>
                       <span className="text-slate-400 text-xs">%</span>
                    </div>
                 </div>
                 <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    <span className="text-sm text-slate-700 font-medium">Minimum quiz pass score</span>
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-1 flex items-center gap-2">
                       <span className="font-bold text-sm text-slate-800">60</span>
                       <span className="text-slate-400 text-xs">%</span>
                    </div>
                 </div>
                 <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    <span className="text-sm text-slate-700 font-medium">Assignments submitted</span>
                    <div className="bg-white border border-slate-200 rounded-md px-4 py-1 flex items-center gap-2">
                       <span className="font-bold text-sm text-slate-800">All</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     </div>
  );

  const renderStep4 = () => (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points System */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col">
           <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
              ⭐ Points System
           </h3>
           <div className="space-y-4">
              {[
                 { title: 'Complete Lesson', desc: 'Finish a video lesson', icon: '📖', pts: 10 },
                 { title: 'Pass Quiz', desc: 'Score at or above pass threshold', icon: '📝', pts: 50 },
                 { title: 'Submit Assignment', desc: 'On-time submission', icon: '📎', pts: 80 },
                 { title: 'Forum Contribution', desc: 'Post or reply in forum', icon: '💬', pts: 5 },
                 { title: 'Perfect Quiz Score', desc: 'Score 100% on any quiz', icon: '🎯', pts: 25 },
                 { title: 'Course Completion', desc: 'Finish all required activities', icon: '🎓', pts: 200 },
              ].map(item => (
                 <div key={item.title} className="flex justify-between items-center border border-slate-100 rounded-xl p-3 bg-white hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex gap-3 items-center">
                       <div className="text-lg bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center grayscale opacity-70">{item.icon}</div>
                       <div>
                          <p className="text-sm font-bold text-slate-800">{item.title}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.desc}</p>
                       </div>
                    </div>
                    <div className="px-5 py-1.5 border border-blue-400 rounded-lg text-blue-600 font-bold text-sm">
                       {item.pts}
                    </div>
                 </div>
              ))}
           </div>
           <button className="w-full mt-6 bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-xl py-2.5 hover:bg-slate-100 transition shadow-sm">
              Reset to Defaults
           </button>
        </div>

        {/* Badge Criteria */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
           <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
              🏅 Badge Criteria
           </h3>
           <div className="space-y-3">
              {[
                 { title: 'Quiz Champion', desc: 'Pass 5 quizzes ≥ 80%', icon: '🏆', color: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', active: true },
                 { title: 'Hot Streak', desc: 'Login 5 consecutive days', icon: '🔥', color: 'bg-red-500', bg: 'bg-red-50/50', border: 'border-red-100', active: true },
                 { title: 'Bookworm', desc: 'Complete all course lessons', icon: '📚', color: 'bg-emerald-500', bg: 'bg-emerald-50/50', border: 'border-emerald-100', active: true },
                 { title: 'Speed Learner', desc: '5 lessons in a single day', icon: '⚡', color: 'bg-blue-600', bg: 'bg-white', border: 'border-slate-100', active: true },
                 { title: 'Collaborator', desc: 'Make 10 forum contributions', icon: '💬', color: 'bg-purple-500', bg: 'bg-white', border: 'border-slate-100', active: true },
                 { title: 'On Target', desc: '5 on-time assignment submissions', icon: '🎯', color: 'bg-emerald-600', bg: 'bg-emerald-50/30', border: 'border-emerald-100', active: true },
              ].map(badge => (
                 <div key={badge.title} className={`${badge.bg} ${badge.border} border rounded-xl p-3 flex justify-between items-center transition cursor-pointer`}>
                    <div className="flex gap-4 items-center pl-1">
                       <div className={`${badge.color} text-white w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-sm`}>{badge.icon}</div>
                       <div>
                          <p className="text-sm font-bold text-slate-800">{badge.title}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{badge.desc}</p>
                       </div>
                    </div>
                    <div className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${badge.active ? 'bg-orange-400' : 'bg-slate-300'}`}>
                       <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${badge.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
     </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 mt-2">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-semibold text-slate-800">Create New Course</h2>
      </div>

      {renderProgressBar()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      {/* Footer Navigation */}
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
            <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">
               Cancel
            </button>
            {currentStep < 4 ? (
               <button 
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-10 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center"
               >
                  Next →
               </button>
            ) : (
               <button 
                  className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
               >
                  🚀 Publish Course
               </button>
            )}
         </div>
      </div>
    </div>
  );
}
