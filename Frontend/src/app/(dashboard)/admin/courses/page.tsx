"use client";

import React, { useEffect, useState } from 'react';
import { useCourseStore } from '@/store/useCourseStore';
import api from '@/lib/api';
import {
   X, Plus, Edit2, Eye, Trash2, Check, Camera, Video,
   PenTool, FileText, Link as LinkIcon, PlayCircle,
   FileSearch, GripVertical, Settings, ArrowLeft, Loader2
} from 'lucide-react';

export default function AdminAllCourses() {
   const { availableCourses, fetchAvailableCourses, loading, uploadFile, deleteCourse } = useCourseStore();
   const [lecturers, setLecturers] = useState<any[]>([]);
   const [isWizardView, setIsWizardView] = useState(false);
   const [editingCourse, setEditingCourse] = useState<any | null>(null);
   const [deptFilter, setDeptFilter] = useState('All Departments');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState('');

   // Course Wizard states
   const [currentStep, setCurrentStep] = useState(1);
   const [title, setTitle] = useState('');
   const [code, setCode] = useState('');
   const [description, setDescription] = useState('');
   const [descLength, setDescLength] = useState(0);
   const [department, setDepartment] = useState('Computing');
   const [category, setCategory] = useState('General');
   const [instructor, setInstructor] = useState('');
   const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
   const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

   // Curriculum content state
   const [modules, setModules] = useState<any[]>([
      { title: 'Module 1', lessons: [] }
   ]);
   const [activeModuleIdx, setActiveModuleIdx] = useState(0);

   // Settings State
   const [enrollmentType, setEnrollmentType] = useState<'Open' | 'Restricted'>('Open');
   const [status, setStatus] = useState<'Published' | 'Draft'>('Draft');
   const [minLessonWatchPercent, setMinLessonWatchPercent] = useState(75);
   const [minQuizPassScore, setMinQuizPassScore] = useState(60);

   // Gamification point defaults
   const [pointDefaults, setPointDefaults] = useState({
      lesson: 10,
      quiz: 50,
      assignment: 80,
   });

   // Step 2 Add Lesson modal state
   const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
   const [lessonModalType, setLessonModalType] = useState<'video' | 'quiz' | 'assignment' | 'reading' | 'link'>('video');
   const [lessonTitle, setLessonTitle] = useState('');
   const [lessonFile, setLessonFile] = useState<File | null>(null);
   const [lessonUrl, setLessonUrl] = useState('');
   const [uploadingLesson, setUploadingLesson] = useState(false);

   useEffect(() => {
      fetchAvailableCourses();

      // Fetch lecturers
      const fetchLecturers = async () => {
         try {
            const res = await api.get('/users');
            const lecturerList = res.data.filter((u: any) => u.role === 'Lecturer');
            setLecturers(lecturerList);
         } catch (err) {
            console.error("Failed to load lecturers", err);
         }
      };
      fetchLecturers();
   }, []);

   const handleOpenAdd = () => {
      setEditingCourse(null);
      setTitle('');
      setCode('');
      setDescription('');
      setDescLength(0);
      setDepartment('Computing');
      setCategory('General');
      setInstructor(lecturers[0]?._id || '');
      setModules([{ title: 'Module 1', lessons: [] }]);
      setActiveModuleIdx(0);
      setEnrollmentType('Open');
      setStatus('Draft');
      setMinLessonWatchPercent(80);
      setMinQuizPassScore(60);
      setThumbnailPreview(null);
      setThumbnailFile(null);
      setPointDefaults({ lesson: 10, quiz: 50, assignment: 80 });
      setSubmitError('');
      setCurrentStep(1);
      setIsWizardView(true);
   };

   const handleOpenEdit = (course: any) => {
      setEditingCourse(course);
      setTitle(course.title || '');
      setCode(course.code || '');
      setDescription(course.description || '');
      setDescLength(course.description?.length || 0);
      setDepartment(course.department || 'Computing');
      setCategory(course.category || 'General');
      setInstructor(course.instructor?._id || course.instructor || '');
      setModules(course.modules?.length ? course.modules : [{ title: 'Module 1', lessons: [] }]);
      setActiveModuleIdx(0);
      setEnrollmentType(course.enrollmentType || 'Open');
      setStatus(course.status || 'Draft');
      if (course.completionRules) {
         setMinLessonWatchPercent(course.completionRules.minLessonWatchPercent || 80);
         setMinQuizPassScore(course.completionRules.minQuizPassScore || 60);
      } else {
         setMinLessonWatchPercent(80);
         setMinQuizPassScore(60);
      }
      setThumbnailPreview(course.thumbnailUrl || null);
      setThumbnailFile(null);
      setPointDefaults({ lesson: 10, quiz: 50, assignment: 80 });
      setSubmitError('');
      setCurrentStep(1);
      setIsWizardView(true);
   };

   const handleDeleteCourse = async (courseId: string) => {
      if (window.confirm('Are you sure you want to delete this course? This will remove the course and all related student enrollments, quizzes, and assignments.')) {
         try {
            await deleteCourse(courseId);
         } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete course');
         }
      }
   };

   const handleTogglePublish = async (course: any) => {
      try {
         const newStatus = course.status === 'Published' ? 'Draft' : 'Published';
         await api.put(`/courses/${course._id}`, { status: newStatus });
         await fetchAvailableCourses();
      } catch (err: any) {
         alert(err.response?.data?.message || 'Failed to toggle course visibility');
      }
   };

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
         type: lessonModalType,
         contentUrl: finalUrl,
         points: lessonModalType === 'quiz' ? pointDefaults.quiz : lessonModalType === 'assignment' ? pointDefaults.assignment : pointDefaults.lesson
      };

      const updatedModules = [...modules];
      updatedModules[activeModuleIdx].lessons.push(newLesson);
      setModules(updatedModules);

      // Reset Lesson Modal
      setIsLessonModalOpen(false);
      setLessonTitle('');
      setLessonFile(null);
      setLessonUrl('');
   };

   const openLessonModal = (type: 'video' | 'quiz' | 'assignment' | 'reading' | 'link') => {
      setLessonModalType(type);
      setIsLessonModalOpen(true);
   };

   const handlePublishCourse = async () => {
      setIsSubmitting(true);
      setSubmitError('');
      try {
         let finalThumbnailUrl = thumbnailPreview;
         if (thumbnailFile) {
            finalThumbnailUrl = await uploadFile(thumbnailFile);
         }

         const courseData = {
            title: title || 'Untitled Course',
            code: code || 'C' + Math.floor(Math.random() * 10000),
            description: description || 'No description provided.',
            department,
            category,
            instructor,
            status,
            enrollmentType,
            completionRules: {
               minLessonWatchPercent,
               minQuizPassScore,
               requireAllAssignments: true
            },
            modules,
            thumbnailUrl: finalThumbnailUrl || ''
         };

         if (editingCourse) {
            await api.put(`/courses/${editingCourse._id}`, courseData);
         } else {
            await api.post('/courses', courseData);
         }
         setIsWizardView(false);
         await fetchAvailableCourses();
      } catch (err: any) {
         console.error(err);
         setSubmitError(err.response?.data?.message || 'Failed to save course. Please check inputs.');
      } finally {
         setIsSubmitting(false);
      }
   };

   const uniqueDepartments = Array.from(
      new Set([
         'Computing',
         'Business',
         'Engineering',
         ...availableCourses
            .map(c => c.department)
            .filter((dept): dept is string => !!dept && typeof dept === 'string' && dept.trim() !== '')
      ])
   );

   const courses = availableCourses;
   const filteredCourses = availableCourses.filter(c => {
      if (deptFilter === 'All Departments') return true;
      return c.department?.toLowerCase().includes(deptFilter.toLowerCase());
   });

   const inDevelopment = courses.filter(c => c.status === 'Draft').length;
   const published = courses.filter(c => c.status === 'Published').length;
   const archived = courses.filter(c => c.status === 'Archived').length;

   return (
      <div className="space-y-6 max-w-7xl mx-auto">
         {isWizardView ? (
            // Course Wizard view
            <div className="max-w-5xl mx-auto space-y-6 pb-20 mt-2 relative">
               <div className="flex items-center gap-3">
                  <button
                     onClick={() => setIsWizardView(false)}
                     className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition cursor-pointer bg-transparent border-none"
                  >
                     <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-2xl font-bold text-slate-800">
                     {editingCourse ? `Edit Course: ${editingCourse.title}` : 'Create New Course'}
                  </h2>
               </div>

               {/* Wizard Progress Bar */}
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
                  <div className="relative flex justify-between items-center max-w-3xl mx-auto">
                     <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -z-10 -translate-y-1/2"></div>
                     <div
                        className="absolute top-1/2 left-0 h-[2px] bg-emerald-500 -z-10 -translate-y-1/2 transition-all duration-300"
                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                     ></div>

                     {[
                        { num: 1, label: 'Basic Info' },
                        { num: 2, label: 'Content' },
                        { num: 3, label: 'Settings' },
                        { num: 4, label: 'Gamification' },
                     ].map(step => {
                        const isCompleted = currentStep > step.num;
                        const isActive = currentStep === step.num;
                        return (
                           <div
                              key={step.num}
                              className="flex flex-col items-center gap-2 bg-white px-2 cursor-pointer"
                              onClick={() => setCurrentStep(step.num)}
                           >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${isCompleted ? 'bg-emerald-500 text-white shadow-sm' :
                                    isActive ? 'bg-blue-600 text-white shadow-sm' :
                                       'bg-slate-100 text-slate-400'
                                 }`}>
                                 {isCompleted ? <Check className="w-4 h-4 ml-0.5" strokeWidth={3} /> : step.num}
                              </div>
                              <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-500' :
                                    isActive ? 'text-blue-600' : 'text-slate-400'
                                 }`}>
                                 {step.label}
                              </span>
                           </div>
                        );
                     })}
                  </div>
               </div>

               {submitError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
                     {submitError}
                  </div>
               )}

               {/* Step 1: Basic Info */}
               {currentStep === 1 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 text-left">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Course Title *</label>
                        <input
                           type="text"
                           value={title}
                           onChange={e => { setTitle(e.target.value); }}
                           placeholder="Advanced Database Systems"
                           className="w-full p-3 border-2 border-blue-500 rounded-xl bg-white focus:outline-none text-slate-850 font-bold"
                        />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Course Code *</label>
                           <input
                              type="text"
                              value={code}
                              onChange={e => setCode(e.target.value)}
                              placeholder="CS401"
                              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-855"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                           <input
                              type="text"
                              value={department}
                              onChange={e => setDepartment(e.target.value)}
                              placeholder="Computing"
                              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-855"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                           <input
                              type="text"
                              value={category}
                              onChange={e => setCategory(e.target.value)}
                              placeholder="General"
                              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-855"
                           />
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Assign Instructor (Lecturer) *</label>
                        <select
                           value={instructor}
                           onChange={e => setInstructor(e.target.value)}
                           className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-500 text-slate-855 font-medium"
                        >
                           <option value="" disabled>Select Lecturer</option>
                           {lecturers.map(l => (
                              <option key={l._id} value={l._id}>{l.name}</option>
                           ))}
                        </select>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Short Description *</label>
                        <div className="relative">
                           <textarea
                              rows={4}
                              value={description}
                              onChange={(e) => { setDescription(e.target.value); setDescLength(e.target.value.length); }}
                              placeholder="This course covers advanced database concepts including indexing, query optimization..."
                              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-855 resize-none pb-8"
                              maxLength={500}
                           ></textarea>
                           <div className="absolute right-3 bottom-3 text-xs text-slate-400 font-medium">{descLength}/500</div>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Course Thumbnail</label>
                        <label className="relative w-48 h-32 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition cursor-pointer overflow-hidden">
                           <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleThumbnailChange} />
                           {thumbnailPreview ? (
                              <img src={thumbnailPreview.startsWith('blob:') || thumbnailPreview.startsWith('/uploads') ? thumbnailPreview : `http://localhost:5000${thumbnailPreview}`} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
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
               )}

               {/* Step 2: Content (Curriculum) */}
               {currentStep === 2 && (
                  <div className="flex flex-col lg:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-2 text-left">
                     {/* Left Column: Modules list */}
                     <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-shrink-0">
                        <div className="p-5 border-b border-slate-100">
                           <h3 className="font-bold text-slate-800">Course Structure</h3>
                           <p className="text-xs text-slate-400 font-medium">Select module and build structure</p>
                        </div>

                        <div className="p-5 space-y-3">
                           {modules.map((m, idx) => (
                              <div key={idx} className="space-y-2">
                                 <div
                                    className={`border ${activeModuleIdx === idx ? 'border-blue-200' : 'border-slate-200'} rounded-xl overflow-hidden hover:border-slate-300 transition-colors`}
                                    onClick={() => setActiveModuleIdx(idx)}
                                 >
                                    <div className={`${activeModuleIdx === idx ? 'bg-blue-50/50' : 'bg-white'} px-4 py-3 flex items-center justify-between cursor-pointer`}>
                                       <h4 className={`text-sm font-bold flex items-center gap-1 ${activeModuleIdx === idx ? 'text-blue-700' : 'text-slate-700'}`}>
                                          <GripVertical className="w-3 h-3 text-slate-350" /> {activeModuleIdx === idx ? '▾' : '▸'} {m.title}
                                       </h4>
                                    </div>
                                 </div>

                                 {activeModuleIdx === idx && m.lessons.length > 0 && (
                                    <div className="ml-6 space-y-2 relative before:absolute before:left-[-12px] before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
                                       {m.lessons.map((lesson: any, lIdx: number) => (
                                          <div key={lIdx} className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between shadow-sm relative before:absolute before:left-[-12px] before:top-1/2 before:w-3 before:h-px before:bg-slate-200">
                                             <div className="flex items-center gap-2">
                                                {lesson.type === 'video' ? <PlayCircle className="w-4 h-4 text-blue-500" /> :
                                                   lesson.type === 'quiz' ? <PenTool className="w-4 h-4 text-orange-500" /> :
                                                      lesson.type === 'assignment' ? <FileText className="w-4 h-4 text-red-500" /> :
                                                         lesson.type === 'reading' ? <FileSearch className="w-4 h-4 text-emerald-500" /> :
                                                            <LinkIcon className="w-4 h-4 text-slate-500" />}
                                                <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">{lesson.title}</span>
                                             </div>
                                             <Trash2 className="w-3.5 h-3.5 text-red-400 cursor-pointer hover:text-red-650 transition" onClick={() => {
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
                              className="w-full py-3 bg-slate-50 text-slate-650 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-100 transition mt-4 cursor-pointer"
                           >
                              + Add New Module
                           </button>
                        </div>
                     </div>

                     {/* Right Column: Content Builder Options */}
                     <div className="flex-1 space-y-5 w-full">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                           <h3 className="font-bold text-slate-800 mb-1">Add Content to {modules[activeModuleIdx]?.title}</h3>
                           <p className="text-xs text-slate-400 font-medium mb-4">Select curriculum type to add:</p>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-blue-50/50 border border-blue-100 hover:border-blue-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition cursor-pointer animate-in fade-in duration-200" onClick={() => openLessonModal('video')}>
                                 <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                       <div className="text-2xl pt-1">🎬</div>
                                       <div>
                                          <h4 className="font-bold text-blue-800 text-sm mb-0.5">Video Lesson</h4>
                                          <p className="text-[11px] text-slate-500 font-medium">MP4 video uploads</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-yellow-50/50 border border-yellow-100 hover:border-yellow-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition cursor-pointer" onClick={() => openLessonModal('quiz')}>
                                 <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                       <div className="text-2xl pt-1">📝</div>
                                       <div>
                                          <h4 className="font-bold text-orange-850 text-sm mb-0.5">Quiz</h4>
                                          <p className="text-[11px] text-slate-550 font-medium">Assessments & Quizzes</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-red-50/50 border border-red-100 hover:border-red-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition cursor-pointer" onClick={() => openLessonModal('assignment')}>
                                 <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                       <div className="text-2xl pt-1">📎</div>
                                       <div>
                                          <h4 className="font-bold text-red-800 text-sm mb-0.5">Assignment</h4>
                                          <p className="text-[11px] text-slate-500 font-medium">Upload assignment briefs</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition cursor-pointer" onClick={() => openLessonModal('reading')}>
                                 <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                       <div className="text-2xl pt-1">📄</div>
                                       <div>
                                          <h4 className="font-bold text-emerald-800 text-sm mb-0.5">Reading Material</h4>
                                          <p className="text-[11px] text-slate-500 font-medium">PDF slide documents</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-slate-50 border border-slate-200 hover:border-slate-355 rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition md:col-span-2 cursor-pointer" onClick={() => openLessonModal('link')}>
                                 <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                       <div className="text-2xl pt-1">🔗</div>
                                       <div>
                                          <h4 className="font-bold text-slate-700 text-sm mb-0.5">External Resource</h4>
                                          <p className="text-[11px] text-slate-500 font-medium">YouTube videos or references</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Step 3: Visibility Settings */}
               {currentStep === 3 && (
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 text-left">
                     <div className="p-6 pb-2 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Enrollment Settings</h3>

                        <div className="space-y-4">
                           <h4 className="text-sm font-bold text-slate-755">Enrollment Type</h4>
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
                                    <p className="text-xs text-slate-400 mt-1 font-medium">Admin / Lecturer approves each student</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-6 pb-2 border-b border-slate-100">
                        <div className="space-y-4 mb-4">
                           <h4 className="text-sm font-bold text-slate-755">Course Visibility</h4>
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
                                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Only visible to administrators & lecturer (not published)</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-6 pb-6 border-b border-slate-100">
                        <h4 className="text-sm font-bold text-slate-700 mb-4">Completion Requirements</h4>
                        <div className="space-y-3">
                           <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                              <span className="text-sm text-slate-700 font-medium">Minimum lesson watch percentage</span>
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
               )}

               {/* Step 4: Gamification Defaults */}
               {currentStep === 4 && (
                  <div className="flex flex-col lg:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-2 text-left">
                     <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-slate-100">
                           <h3 className="font-bold text-slate-850 flex items-center gap-2">⭐ Points Defaults System</h3>
                           <div className="space-y-4 pt-4">
                              {[
                                 { key: 'lesson', icon: '📖', title: 'Complete Lesson', subtitle: 'Finish a video/reading/link lesson' },
                                 { key: 'quiz', icon: '📝', title: 'Pass Quiz', subtitle: 'Score at or above pass score' },
                                 { key: 'assignment', icon: '📎', title: 'Submit Assignment', subtitle: 'Completed assignment submission' },
                              ].map((item, idx) => (
                                 <div key={idx} className="flex items-center justify-between border border-slate-200 rounded-xl p-4 hover:border-slate-250 transition bg-white">
                                    <div className="flex gap-4 items-center">
                                       <span className="text-xl">{item.icon}</span>
                                       <div>
                                          <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                                          <p className="text-[11px] font-medium text-slate-450 mt-0.5">{item.subtitle}</p>
                                       </div>
                                    </div>
                                    <div>
                                       <input
                                          type="number"
                                          value={(pointDefaults as any)[item.key]}
                                          onChange={e => setPointDefaults({ ...pointDefaults, [item.key]: Number(e.target.value) })}
                                          className="w-20 text-center font-bold text-blue-600 px-3 py-2 bg-white border border-blue-400 rounded-lg outline-none"
                                       />
                                    </div>
                                 </div>
                              ))}
                              <p className="text-xs text-slate-400 font-medium pt-4">Points will be applied automatically when adding curriculum items.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Bottom Action Row */}
               <div className="flex justify-between pt-6 mt-6 border-t border-slate-200">
                  {currentStep > 1 ? (
                     <button
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition border border-slate-200 flex items-center gap-2 cursor-pointer"
                     >
                        ← Back
                     </button>
                  ) : <div></div>}

                  <div className="flex gap-4">
                     <button onClick={() => setIsWizardView(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer">
                        Cancel
                     </button>
                     {currentStep < 4 ? (
                        <button
                           onClick={() => setCurrentStep(prev => prev + 1)}
                           className="px-10 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center text-sm cursor-pointer"
                        >
                           Next →
                        </button>
                     ) : (
                        <button
                           onClick={handlePublishCourse}
                           disabled={isSubmitting}
                           className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-sm disabled:opacity-50 text-sm cursor-pointer"
                        >
                           {isSubmitting ? 'Saving Course...' : editingCourse ? '💾 Save Changes' : '🚀 Publish Course'}
                        </button>
                     )}
                  </div>
               </div>

               {/* Add Content Modal */}
               {isLessonModalOpen && (
                  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                     <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                           <h3 className="font-bold text-slate-800 capitalize">Add {lessonModalType}</h3>
                           <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer bg-transparent border-none"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-5 text-left">
                           <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Title *</label>
                              <input
                                 type="text"
                                 required
                                 value={lessonTitle}
                                 onChange={e => setLessonTitle(e.target.value)}
                                 className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                 placeholder="E.g. Introduction"
                              />
                           </div>

                           {['video', 'reading'].includes(lessonModalType) && (
                              <div>
                                 <label className="block text-sm font-bold text-slate-700 mb-2">Upload File</label>
                                 <input type="file" onChange={e => setLessonFile(e.target.files?.[0] || null)} className="w-full p-2 border border-slate-200 rounded-xl text-sm text-slate-650" />
                              </div>
                           )}

                           {lessonModalType === 'link' && (
                              <div>
                                 <label className="block text-sm font-bold text-slate-700 mb-2">URL *</label>
                                 <input type="text" value={lessonUrl} onChange={e => setLessonUrl(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="https://" />
                              </div>
                           )}
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                           <button onClick={() => setIsLessonModalOpen(false)} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer">Cancel</button>
                           <button onClick={handleAddLesson} disabled={uploadingLesson} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm disabled:opacity-50 cursor-pointer">
                              {uploadingLesson ? 'Uploading...' : 'Add Content'}
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         ) : (
            // Courses directory table list
            <>
               <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-6">
                  <div className="flex flex-wrap gap-4 flex-1">
                     <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Courses</p>
                        <h3 className="text-3xl font-light text-blue-600 mb-2">{courses.length}</h3>
                        <p className="text-emerald-500 text-xs font-medium">{inDevelopment} in development</p>
                     </div>
                     <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Published</p>
                        <h3 className="text-3xl font-light text-emerald-500 mb-2">{published}</h3>
                        <p className="text-emerald-500 text-xs font-medium">actively running</p>
                     </div>
                     <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Draft</p>
                        <h3 className="text-3xl font-light text-orange-400 mb-2">{inDevelopment}</h3>
                        <p className="text-emerald-500 text-xs font-medium">awaiting publish</p>
                     </div>
                     <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 min-w-[140px] flex-1 xl:flex-none">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Archived</p>
                        <h3 className="text-3xl font-light text-slate-600 mb-2">{archived}</h3>
                        <p className="text-emerald-500 text-xs font-medium">completed courses</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                     <button
                        onClick={handleOpenAdd}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm whitespace-nowrap cursor-pointer"
                     >
                        + New Course
                     </button>
                     <select
                        value={deptFilter}
                        onChange={e => setDeptFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 focus:outline-none"
                     >
                        <option value="All Departments">All Departments</option>
                        {uniqueDepartments.map(dept => (
                           <option key={dept} value={dept}>{dept}</option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                     <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                           <th className="py-5 pl-6 pr-4">Course</th>
                           <th className="py-5 px-4 w-20">Code</th>
                           <th className="py-5 px-4">Lecturer</th>
                           <th className="py-5 px-4">Dept</th>
                           <th className="py-5 px-4 text-center">Students</th>
                           <th className="py-5 px-4 w-40">Completion</th>
                           <th className="py-5 px-4 text-center">Status</th>
                           <th className="py-5 pr-6 pl-4 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {loading ? (
                           <tr>
                              <td colSpan={8} className="py-12 text-center">
                                 <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                              </td>
                           </tr>
                        ) : filteredCourses.length === 0 ? (
                           <tr>
                              <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">No courses found.</td>
                           </tr>
                        ) : (
                           filteredCourses.map(course => {
                              const progress = 0; // Backend lacks progress per course for now
                              const studentsCount = course.enrollmentCount || 0;
                              return (
                                 <tr key={course._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 pl-6 pr-4 flex items-center gap-3">
                                       {course.thumbnailUrl ? (
                                          <img
                                             src={
                                                course.thumbnailUrl.startsWith("http")
                                                   ? course.thumbnailUrl
                                                   : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${course.thumbnailUrl}`
                                             }
                                             alt={course.title}
                                             className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                                          />
                                       ) : (
                                          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shrink-0">
                                             📚
                                          </div>
                                       )}
                                       <div>
                                          <p className="text-sm font-bold text-slate-800">{course.title}</p>
                                          <p className="text-[10px] text-slate-400 font-medium">{course.category || 'General'}</p>
                                       </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-500 font-medium">
                                       {course.code || 'N/A'}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-600 font-medium">
                                       {course.instructor?.name || 'Unknown'}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-500 font-medium">
                                       {course.department || 'Computing'}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-600 text-center font-medium">
                                       {studentsCount}
                                    </td>
                                    <td className="py-4 px-4">
                                       {progress > 0 ? (
                                          <div className="flex items-center gap-3">
                                             <div className="w-full bg-slate-100 rounded-full h-1.5 flex-1 max-w-[100px]">
                                                <div className={`bg-blue-500 h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                                             </div>
                                             <span className="text-xs font-bold text-slate-400 w-8">{progress}%</span>
                                          </div>
                                       ) : (
                                          <div className="w-8 border-b-2 border-slate-200 ml-2"></div>
                                       )}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                       <span className={`px-3 py-1.5 text-[10px] font-bold rounded-full ${course.status === 'Published' ? 'bg-emerald-100/50 text-emerald-600' :
                                             course.status === 'Draft' ? 'bg-orange-100/50 text-orange-600' :
                                                'bg-slate-100 text-slate-500'
                                          }`}>
                                          {course.status || 'Draft'}
                                       </span>
                                    </td>
                                    <td className="py-4 pr-6 pl-4 text-right">
                                       <div className="flex items-center justify-end gap-2">
                                          <button
                                             onClick={() => handleOpenEdit(course)}
                                             className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                          >
                                             Edit
                                          </button>
                                          <button
                                             onClick={() => handleTogglePublish(course)}
                                             className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition cursor-pointer ${course.status === 'Published'
                                                   ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                                   : 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700'
                                                }`}
                                          >
                                             {course.status === 'Published' ? 'Unpublish' : 'Publish'}
                                          </button>
                                          <button
                                             onClick={() => handleDeleteCourse(course._id)}
                                             className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition cursor-pointer"
                                          >
                                             Delete
                                          </button>
                                       </div>
                                    </td>
                                 </tr>
                              )
                           })
                        )}
                     </tbody>
                  </table>
               </div>
            </>
         )}
      </div>
   );
}
