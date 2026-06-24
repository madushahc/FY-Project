"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import api from '@/lib/api';

const getCurrentDateTimeString = (offsetDays = 0) => {
   const date = new Date();
   if (offsetDays) {
      date.setDate(date.getDate() + offsetDays);
   }
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   const hours = String(date.getHours()).padStart(2, '0');
   const minutes = String(date.getMinutes()).padStart(2, '0');
   return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function AddQuiz() {
   const router = useRouter();
   const { myCourses, fetchMyCreatedCourses } = useCourseStore();

   const [title, setTitle] = useState('');
   const [course, setCourse] = useState('');
   const [points, setPoints] = useState('50');
   const [timeLimit, setTimeLimit] = useState('15');
   const [passingScore, setPassingScore] = useState('60');
   const [loading, setLoading] = useState(false);
   const [availableFrom, setAvailableFrom] = useState(getCurrentDateTimeString());
   const [dueDate, setDueDate] = useState(getCurrentDateTimeString(1));
   const [attemptsAllowed, setAttemptsAllowed] = useState('1');

   const [questions, setQuestions] = useState([
      { text: '', options: ['', '', '', ''], correctOptionIndex: 0 }
   ]);

   useEffect(() => {
      fetchMyCreatedCourses();
   }, [fetchMyCreatedCourses]);

   const handlePublish = async () => {

      if (!title || !course) {
         alert("Please fill out title and course.");
         return;
      }

      setLoading(true);
      try {
         await api.post('/quizzes', {
            title,
            course,
            description: title,
            totalPoints: Number(points),
            timeLimit: Number(timeLimit),
            passingScore: Number(passingScore),
            dueDate: dueDate ? new Date(dueDate) : undefined,
            questions: questions.map(q => ({
               text: q.text,
               type: 'multiple-choice',
               options: q.options,
               correctAnswer: q.options[q.correctOptionIndex]
            })),
            isPublished: true
         });
         alert("Quiz published successfully!");
         router.push('/lecturer/activities');
      } catch (err) {
         console.error("Failed to publish quiz", err);
         alert("Failed to publish quiz.");
      }
      setLoading(false);
   };

   return (
      <div className="space-y-6 pb-20 mt-2 max-w-6xl mx-auto">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-800">Add Quiz</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
            <div>
               <label htmlFor="quiz-title" className="block text-sm font-bold text-slate-800 mb-2">Quiz Title *</label>
               <input
                  id="quiz-title"
                  name="title"
                  type="text"
                  placeholder="Enter quiz title (e.g. Module 3 Quiz)..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-sm font-medium shadow-sm bg-white relative z-10"
               />
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-800 mb-2">Select Course *</label>
               <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-sm font-medium shadow-sm bg-white"
               >
                  <option value="">Select a course...</option>
                  {myCourses.map((c: any) => (
                     <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
               </select>
            </div>
         </div>

         <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Left Column - Questions */}
            <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

               {questions.map((q, qIndex) => (
                  <div key={qIndex} className="border border-slate-200 rounded-2xl p-6 bg-slate-50/30 mb-6">
                     <h3 className="text-sm font-bold text-blue-600 mb-4">Question {qIndex + 1}</h3>

                     <input
                        type="text"
                        placeholder="Enter question text..."
                        value={q.text}
                        onChange={(e) => {
                           const newQ = [...questions];
                           newQ[qIndex].text = e.target.value;
                           setQuestions(newQ);
                        }}
                        className="w-full p-4 border border-slate-200 rounded-xl mb-6 focus:outline-none focus:border-blue-500 text-sm font-medium text-slate-700 shadow-sm"
                     />

                     <h4 className="text-xs font-bold text-slate-700 mb-3">Answer Choices (Select correct one)</h4>
                     <div className="space-y-3 mb-6">
                        {q.options.map((opt, optIndex) => {
                           const isCorrect = q.correctOptionIndex === optIndex;
                           return (
                              <div key={optIndex} className={`flex items-center gap-3 w-full p-3 rounded-xl shadow-sm border ${isCorrect ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-200 bg-white'}`}>
                                 <button
                                    onClick={() => {
                                       const newQ = [...questions];
                                       newQ[qIndex].correctOptionIndex = optIndex;
                                       setQuestions(newQ);
                                    }}
                                    className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border ${isCorrect ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-100 border-slate-300'}`}
                                 >
                                    {isCorrect && <Check className="w-3 h-3 text-white stroke-[3]" />}
                                 </button>
                                 <input
                                    type="text"
                                    placeholder={`Option ${optIndex + 1}`}
                                    value={opt}
                                    onChange={(e) => {
                                       const newQ = [...questions];
                                       newQ[qIndex].options[optIndex] = e.target.value;
                                       setQuestions(newQ);
                                    }}
                                    className="flex-1 bg-transparent focus:outline-none text-sm font-medium text-slate-600"
                                 />
                              </div>
                           );
                        })}
                     </div>

                     <div className="flex justify-end">
                        <button onClick={() => {
                           if (questions.length > 1) {
                              setQuestions(questions.filter((_, i) => i !== qIndex));
                           }
                        }} className="px-5 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition text-sm">
                           Delete
                        </button>
                     </div>
                  </div>
               ))}

               <button
                  onClick={() => setQuestions([...questions, { text: '', options: ['', '', '', ''], correctOptionIndex: 0 }])}
                  className="w-full py-4 border border-blue-200 bg-blue-50/50 text-blue-600 font-bold rounded-xl text-sm shadow-sm hover:bg-blue-50 transition mb-10"
               >
                  + Add Another Question
               </button>

               <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                  <button onClick={() => router.back()} className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition text-sm">
                     Cancel
                  </button>
                  <button onClick={handlePublish} disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-sm disabled:opacity-50">
                     {loading ? 'Publishing...' : 'Save & Publish Quiz'}
                  </button>
               </div>
            </div>

            {/* Right Column - Settings */}
            <div className="w-full lg:w-1/3 space-y-6">

               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-5">Quiz Settings</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Total Points</label>
                        <input type="number" value={points} onChange={e => setPoints(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Time Limit (min)</label>
                        <input type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Passing Score (%)</label>
                        <input type="number" value={passingScore} onChange={e => setPassingScore(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Attempts Allowed</label>
                        <select 
                           value={attemptsAllowed} 
                           onChange={e => setAttemptsAllowed(e.target.value)} 
                           className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium bg-white"
                        >
                           <option value="1">1 attempt only</option>
                           <option value="2">2 attempts</option>
                           <option value="3">3 attempts</option>
                           <option value="4">4 attempts</option>
                           <option value="5">5 attempts</option>
                           <option value="unlimited">Unlimited attempts</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-5">Due Date & Availability</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Available From</label>
                        <input 
                           type="datetime-local" 
                           value={availableFrom} 
                           onChange={e => setAvailableFrom(e.target.value)} 
                           className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium bg-white" 
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Due Date</label>
                        <input 
                           type="datetime-local" 
                           value={dueDate} 
                           onChange={e => setDueDate(e.target.value)} 
                           className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 font-medium bg-white" 
                        />
                     </div>
                  </div>
               </div>

            </div>
         </div>

      </div>
   );
}
