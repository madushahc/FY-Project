"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Camera, Plus, Video, PenTool, FileText, Link as LinkIcon, PlayCircle, FileSearch, Trash2, GripVertical, Settings, X } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';

export default function NewCourseWizard() {
  const router = useRouter();
  const { createCourse, uploadFile, loading } = useCourseStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [department, setDepartment] = useState('Computing');
  const [description, setDescription] = useState('');
  const [descLength, setDescLength] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Content State
  const [modules, setModules] = useState<{title: string, lessons: any[]}[]>([
    { title: 'Module 1', lessons: [] }
  ]);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);

  // Settings State
  const [enrollmentType, setEnrollmentType] = useState<'Open' | 'Restricted'>('Open');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Draft');
  const [minLessonWatchPercent, setMinLessonWatchPercent] = useState(80);
  const [minQuizPassScore, setMinQuizPassScore] = useState(60);

  // Gamification Defaults
  const [pointDefaults, setPointDefaults] = useState({
    lesson: 10,
    quiz: 50,
    assignment: 80,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'video' | 'quiz' | 'assignment' | 'reading' | 'link'>('video');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonFile, setLessonFile] = useState<File | null>(null);
  const [lessonUrl, setLessonUrl] = useState('');
  const [uploadingLesson, setUploadingLesson] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleAddModule = () => {
    setModules([...modules, { title: `Module ${modules.length + 1}`, lessons: [] }]);
  };

  const handleAddLesson = async () => {
    if (!lessonTitle) return alert("Please enter a lesson title");

    let finalUrl = lessonUrl;
    if (lessonFile) {
      setUploadingLesson(true);
      try {
        finalUrl = await uploadFile(lessonFile);
      } catch (err) {
        alert("Failed to upload file");
        setUploadingLesson(false);
        return;
      }
      setUploadingLesson(false);
    }

    const newLesson = {
      title: lessonTitle,
      type: modalType,
      contentUrl: finalUrl,
      points: modalType === 'quiz' ? pointDefaults.quiz : modalType === 'assignment' ? pointDefaults.assignment : pointDefaults.lesson
    };

    const updatedModules = [...modules];
    updatedModules[activeModuleIdx].lessons.push(newLesson);
    setModules(updatedModules);

    // Reset Modal
    setIsModalOpen(false);
    setLessonTitle('');
    setLessonFile(null);
    setLessonUrl('');
  };

  const openModal = (type: 'video' | 'quiz' | 'assignment' | 'reading' | 'link') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handlePublish = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title || 'Untitled Course');
      formData.append('code', code || 'C' + Math.floor(Math.random() * 10000));
      formData.append('description', description || 'No description provided.');
      formData.append('status', status);
      formData.append('department', department);
      formData.append('enrollmentType', enrollmentType);
      formData.append('completionRules', JSON.stringify({
        minLessonWatchPercent,
        minQuizPassScore,
        requireAllAssignments: true
      }));
      formData.append('modules', JSON.stringify(modules));
      
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      await createCourse(formData);
      router.push('/lecturer/courses');
    } catch (e: any) {
      console.error('Failed to create course', e);
      const backendError = e.response?.data?.error;
      const errorMsg = backendError && typeof backendError === 'object' 
        ? JSON.stringify(backendError) 
        : (e.response?.data?.message || e.message);
      alert(`Failed to publish course: ${errorMsg}`);
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
               <input 
                  type="text" 
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="CS401" 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" 
               />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
               <input 
                  type="text" 
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="Faculty of Computing" 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800" 
                />
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
         <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Course Thumbnail</label>
            <label className="relative w-48 h-32 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition cursor-pointer overflow-hidden">
               <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleThumbnailChange} />
               {thumbnailPreview ? (
                 <img src={thumbnailPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
               ) : (
                 <>
                   <Camera className="w-6 h-6 mb-2 text-slate-400" />
                   <span className="text-sm font-medium text-blue-500">Upload Image</span>
                   <span className="text-[10px] mt-1">PNG, JPG - max 5MB</span>
                 </>
               )}
            </label>
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
              {modules.map((m, idx) => (
                 <div key={idx} className="space-y-2">
                   <div 
                     className={`border ${activeModuleIdx === idx ? 'border-blue-200' : 'border-slate-200'} rounded-xl overflow-hidden hover:border-slate-300 transition-colors`}
                     onClick={() => setActiveModuleIdx(idx)}
                   >
                      <div className={`${activeModuleIdx === idx ? 'bg-blue-50' : 'bg-white'} px-4 py-3 flex items-center justify-between cursor-pointer`}>
                         <h4 className={`text-sm font-bold flex items-center gap-1 ${activeModuleIdx === idx ? 'text-blue-700' : 'text-slate-700'}`}>
                           <GripVertical className="w-3 h-3 text-slate-300"/> {activeModuleIdx === idx ? '▾' : '▸'} {m.title}
                         </h4>
                      </div>
                   </div>

                   {/* Render Lessons if Active Module */}
                   {activeModuleIdx === idx && m.lessons.length > 0 && (
                     <div className="ml-6 space-y-2 relative before:absolute before:left-[-12px] before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
                        {m.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between shadow-sm relative before:absolute before:left-[-12px] before:top-1/2 before:w-3 before:h-px before:bg-slate-200">
                             <div className="flex items-center gap-2">
                                {lesson.type === 'video' ? <PlayCircle className="w-4 h-4 text-blue-500" /> : 
                                 lesson.type === 'quiz' ? <PenTool className="w-4 h-4 text-orange-500" /> :
                                 lesson.type === 'assignment' ? <FileText className="w-4 h-4 text-red-500" /> :
                                 lesson.type === 'reading' ? <FileSearch className="w-4 h-4 text-emerald-500" /> :
                                 <LinkIcon className="w-4 h-4 text-slate-500" />}
                                <span className="text-xs font-semibold text-slate-700">{lesson.title}</span>
                             </div>
                             <Trash2 className="w-3 h-3 text-red-400 cursor-pointer hover:text-red-600" onClick={() => {
                               const updated = [...modules];
                               updated[idx].lessons.splice(lIdx, 1);
                               setModules(updated);
                             }} />
                          </div>
                        ))}
                     </div>
                   )}
                 </div>
              ))}

              <button 
                onClick={handleAddModule}
                className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-100 transition mt-4"
              >
                 + Add New Module
              </button>
           </div>
        </div>

        {/* Right Column: Editor */}
        <div className="flex-1 space-y-5">
           
           {/* Add Content Panel */}
           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-1">Add Content to {modules[activeModuleIdx]?.title}</h3>
              <p className="text-xs text-slate-400 font-medium mb-4">Select a content type to add:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group cursor-pointer" onClick={() => openModal('video')}>
                    <div className="flex items-start justify-between">
                       <div className="flex gap-3">
                          <div className="text-2xl pt-1">🎬</div>
                          <div>
                             <h4 className="font-bold text-blue-800 text-sm mb-0.5">Video Lesson</h4>
                             <p className="text-[11px] text-slate-500">Upload MP4/MOV</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group cursor-pointer" onClick={() => openModal('quiz')}>
                    <div className="flex items-start justify-between">
                       <div className="flex gap-3">
                          <div className="text-2xl pt-1">📝</div>
                          <div>
                             <h4 className="font-bold text-orange-800 text-sm mb-0.5">Quiz</h4>
                             <p className="text-[11px] text-slate-500">Link to existing quiz</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group cursor-pointer" onClick={() => openModal('assignment')}>
                    <div className="flex items-start justify-between">
                       <div className="flex gap-3">
                          <div className="text-2xl pt-1">📎</div>
                          <div>
                             <h4 className="font-bold text-red-700 text-sm mb-0.5">Assignment</h4>
                             <p className="text-[11px] text-slate-500">File submission</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group cursor-pointer" onClick={() => openModal('reading')}>
                    <div className="flex items-start justify-between">
                       <div className="flex gap-3">
                          <div className="text-2xl pt-1">📄</div>
                          <div>
                             <h4 className="font-bold text-emerald-800 text-sm mb-0.5">Reading Material</h4>
                             <p className="text-[11px] text-slate-500">Upload PDF</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group md:col-span-2 cursor-pointer" onClick={() => openModal('link')}>
                    <div className="flex items-start justify-between">
                       <div className="flex gap-3">
                          <div className="text-2xl pt-1">🔗</div>
                          <div>
                             <h4 className="font-bold text-slate-700 text-sm mb-0.5">External Resource</h4>
                             <p className="text-[11px] text-slate-500">YouTube video or website</p>
                          </div>
                       </div>
                    </div>
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
                     <div 
                        className={`border ${enrollmentType === 'Open' ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 bg-white hover:bg-slate-50'} rounded-xl p-4 flex items-start gap-3 cursor-pointer`}
                        onClick={() => setEnrollmentType('Open')}
                     >
                        <div className={`w-5 h-5 rounded-full ${enrollmentType === 'Open' ? 'border-[5px] border-blue-500 bg-white' : 'border-2 border-slate-200 bg-white'} shrink-0 mt-0.5`}></div>
                        <div>
                           <h5 className={`font-bold ${enrollmentType === 'Open' ? 'text-blue-700' : 'text-slate-700'} text-sm`}>Open Enrollment</h5>
                           <p className="text-xs text-slate-400 mt-1 font-medium">Any student can self-enroll</p>
                        </div>
                     </div>
                     <div 
                        className={`border ${enrollmentType === 'Restricted' ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 bg-white hover:bg-slate-50'} rounded-xl p-4 flex items-start gap-3 cursor-pointer transition`}
                        onClick={() => setEnrollmentType('Restricted')}
                     >
                        <div className={`w-5 h-5 rounded-full ${enrollmentType === 'Restricted' ? 'border-[5px] border-blue-500 bg-white' : 'border-2 border-slate-200 bg-white'} shrink-0 mt-0.5`}></div>
                        <div>
                           <h5 className={`font-bold ${enrollmentType === 'Restricted' ? 'text-blue-700' : 'text-slate-700'} text-sm`}>Restricted</h5>
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
                     <div 
                        className={`border ${status === 'Published' ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200 bg-white hover:bg-slate-50'} rounded-xl p-4 flex items-start gap-3 cursor-pointer`}
                        onClick={() => setStatus('Published')}
                     >
                        <div className="text-lg shrink-0 mt-[-2px]">👁️</div>
                        <div>
                           <h5 className={`font-bold ${status === 'Published' ? 'text-blue-600' : 'text-slate-700'} text-sm`}>Published</h5>
                           <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Visible to all enrolled students</p>
                        </div>
                     </div>
                     <div 
                        className={`border ${status === 'Draft' ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200 bg-white hover:bg-slate-50'} rounded-xl p-4 flex items-start gap-3 cursor-pointer`}
                        onClick={() => setStatus('Draft')}
                     >
                        <div className="text-lg shrink-0 mt-[-2px]">📝</div>
                        <div>
                           <h5 className={`font-bold ${status === 'Draft' ? 'text-blue-600' : 'text-slate-700'} text-sm`}>Draft</h5>
                           <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Only visible to you (not published)</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 pb-6 border-b border-slate-100">
               <h4 className="text-sm font-bold text-slate-700 mb-4">Completion Requirements</h4>
               <div className="space-y-3">
                  <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                     <span className="text-sm text-slate-700 font-medium">Minimum lesson watch %</span>
                     <div className="bg-white border border-slate-200 rounded-md px-3 py-1 flex items-center gap-2">
                        <input type="number" value={minLessonWatchPercent} onChange={e => setMinLessonWatchPercent(Number(e.target.value))} className="w-12 outline-none font-bold text-sm text-slate-800 bg-transparent text-right" />
                        <span className="text-slate-400 text-xs">%</span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                     <span className="text-sm text-slate-700 font-medium">Minimum quiz pass score</span>
                     <div className="bg-white border border-slate-200 rounded-md px-3 py-1 flex items-center gap-2">
                        <input type="number" value={minQuizPassScore} onChange={e => setMinQuizPassScore(Number(e.target.value))} className="w-12 outline-none font-bold text-sm text-slate-800 bg-transparent text-right" />
                        <span className="text-slate-400 text-xs">%</span>
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
              <div className="p-5 space-y-4">
               {[
                  { key: 'lesson', icon: '📖', title: 'Complete Lesson', subtitle: 'Finish a video lesson' },
                  { key: 'quiz', icon: '📝', title: 'Pass Quiz', subtitle: 'Score at or above pass threshold' },
                  { key: 'assignment', icon: '📎', title: 'Submit Assignment', subtitle: 'On-time submission' },
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
                        <input 
                           type="number" 
                           value={(pointDefaults as any)[item.key]} 
                           onChange={e => setPointDefaults({...pointDefaults, [item.key]: Number(e.target.value)})} 
                           className="w-20 text-center font-bold text-blue-600 px-3 py-2 bg-white border border-blue-400 rounded-lg outline-none" 
                        />
                     </div>
                  </div>
               ))}
               <p className="text-xs text-slate-400 font-medium pt-4">These default points will be applied when you add new lessons in the Content tab.</p>
            </div>
           </div>
        </div>
     </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 mt-2 relative">
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
               Cancel
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

      {/* Inline Modal for Adding Content */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 capitalize">Add {modalType}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
             </div>
             <div className="p-6 space-y-5">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                   <input type="text" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="E.g. Introduction" />
                </div>
                
                {['video', 'reading'].includes(modalType) && (
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Upload File</label>
                     <input type="file" onChange={e => setLessonFile(e.target.files?.[0] || null)} className="w-full p-2 border border-slate-200 rounded-xl text-sm text-slate-600" />
                  </div>
                )}
                
                {modalType === 'link' && (
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">URL</label>
                     <input type="text" value={lessonUrl} onChange={e => setLessonUrl(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="https://" />
                  </div>
                )}
             </div>
             <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition">Cancel</button>
                <button onClick={handleAddLesson} disabled={uploadingLesson} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm disabled:opacity-50">
                  {uploadingLesson ? 'Uploading...' : 'Add Content'}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
