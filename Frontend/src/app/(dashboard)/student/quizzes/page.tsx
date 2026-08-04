"use client";

import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, ArrowRight, Check, Play, AlertCircle } from 'lucide-react';
import { useQuizStore } from '@/store/useQuizStore';
import { useCourseStore } from '@/store/useCourseStore';
import api from '@/lib/api';
import Loading from '@/components/ui/Loading';

export default function QuizzesPage() {
  const { fetchQuizById, submitQuizAttempt } = useQuizStore();
  const { myEnrollments, fetchMyEnrollments } = useCourseStore();

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  
  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // { questionId: selectedOption }
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any | null>(null);

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoadingList(true);
      try {
        let agg: any[] = [];
        for (const enrollment of myEnrollments) {
          if (!enrollment || !enrollment.course) continue;
          const courseId = enrollment.course._id || enrollment.course;
          if (!courseId) continue;
          const res = await api.get(`/quizzes/course/${courseId}`);
          const mapped = res.data.map((q: any) => ({
            ...q,
            courseName: enrollment.course?.title || 'Unknown Course'
          }));
          agg = [...agg, ...mapped];
        }
        setQuizzes(agg);
      } catch (err) {
        console.error("Failed to load quizzes", err);
      }
      setLoadingList(false);
    };

    if (myEnrollments.length > 0) {
      fetchQuizzes();
    } else {
      setLoadingList(false);
    }
  }, [myEnrollments]);

  const handleStartQuiz = async (quizSummary: any) => {
    try {
      // Fetch full quiz which has questions mapped inside
      const res = await api.get(`/quizzes/${quizSummary._id}`);
      setActiveQuiz({
         ...res.data,
         courseName: quizSummary.courseName
      });
      setCurrentQuestionIndex(0);
      setAnswers({});
      setQuizResult(null);
    } catch (e) {
      alert("Failed to load quiz details.");
    }
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({
       ...prev,
       [questionId]: option
    }));
  };

  const handleSubmitQuiz = async () => {
     if (!activeQuiz) return;
     setSubmitting(true);
     try {
       // Format answers payload
       const formattedAnswers = Object.keys(answers).map(qId => ({
          questionId: qId,
          studentAnswer: answers[qId]
       }));

       const res = await submitQuizAttempt(activeQuiz._id, formattedAnswers);
       setQuizResult(res); // Shows attempt results
     } catch (err) {
       console.error(err);
       alert("Failed to submit quiz.");
     }
     setSubmitting(false);
  };

  // --- VIEW 1: COMPLETE/RESULT VIEW ---
  if (quizResult && activeQuiz) {
     const { attempt } = quizResult;
     return (
       <div className="max-w-3xl mx-auto mt-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
             <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 ${attempt.passed ? 'bg-emerald-100 text-emerald-500' : 'bg-red-100 text-red-500'}`}>
                {attempt.passed ? '🎉' : '❌'}
             </div>
             <h2 className="text-3xl font-bold text-slate-800 mb-2">
                {attempt.passed ? 'Quiz Passed!' : 'Quiz Failed'}
             </h2>
             <p className="text-slate-500 mb-8">You scored {attempt.score}% ({attempt.earnedPoints} pts)</p>
             
             <div className="flex items-center justify-center gap-4">
                <button onClick={() => { setActiveQuiz(null); setQuizResult(null); }} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition">
                   Return to Quizzes
                </button>
             </div>
          </div>
       </div>
     );
  }

  // --- VIEW 2: ACTIVE QUIZ VIEW ---
  if (activeQuiz) {
     const q = activeQuiz.questions[currentQuestionIndex];
     const totalQ = activeQuiz.questions.length;
     const progress = ((currentQuestionIndex + 1) / totalQ) * 100;

     return (
        <div className="max-w-4xl mx-auto mt-4 pb-20 relative">
          <div className="flex justify-between items-start mb-6">
             <div>
                <div className="inline-block px-3 py-1 bg-yellow-100/80 text-yellow-800 text-[10px] font-bold rounded-full mb-3 shadow-sm border border-yellow-200/50">
                   📝 Quiz • {activeQuiz.courseName}
                </div>
                <h1 className="text-3xl font-semibold text-slate-800 mb-1">{activeQuiz.title}</h1>
                <p className="text-slate-500 text-sm">{totalQ} questions • {activeQuiz.passingScore}% to pass • {activeQuiz.timeLimit} min limit</p>
             </div>
             <div className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold flex items-center gap-2 shadow-sm">
                <Clock className="w-4 h-4" />
                {activeQuiz.timeLimit}:00
             </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
             <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
             </div>
             <span className="text-sm font-medium text-slate-500 shrink-0">{currentQuestionIndex + 1} of {totalQ}</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-8 md:p-10 min-h-[400px]">
                <p className="text-blue-600 font-bold text-xs tracking-wider mb-3 uppercase">Question {currentQuestionIndex + 1}</p>
                <h2 className="text-2xl font-medium text-slate-800 mb-8 max-w-2xl leading-snug">
                   {q?.text || q?.questionText || 'Loading question...'}
                </h2>

                <div className="space-y-4">
                   {q?.options?.map((opt: string, idx: number) => {
                     const letters = ['A', 'B', 'C', 'D', 'E'];
                     const letter = letters[idx];
                     const isSelected = answers[q._id] === opt;
                     
                     return (
                       <div 
                         key={idx}
                         onClick={() => handleOptionSelect(q._id, opt)}
                         className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                           isSelected 
                             ? 'border-emerald-500 bg-emerald-50' 
                             : 'border-slate-100 hover:border-slate-200'
                         }`}
                       >
                          <div className="flex items-center gap-4">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                               isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                             }`}>
                                {letter}
                             </div>
                             <span className="text-slate-800 font-medium">
                                {opt}
                             </span>
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-emerald-500" strokeWidth={3} />
                          )}
                       </div>
                     );
                   })}
                </div>
             </div>

             <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <button 
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-5 py-2.5 bg-slate-100 disabled:opacity-50 text-slate-600 font-medium rounded-xl flex items-center gap-2 hover:bg-slate-200 transition text-sm"
                >
                   <ArrowLeft className="w-4 h-4" /> Previous
                </button>

                {currentQuestionIndex === totalQ - 1 ? (
                  <button 
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                    className="px-6 py-2.5 bg-emerald-600 disabled:opacity-50 text-white font-medium rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm text-sm"
                  >
                     {submitting ? 'Submitting...' : 'Submit Quiz'} <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-sm text-sm"
                  >
                     Next <ArrowRight className="w-4 h-4" />
                  </button>
                )}
             </div>
          </div>
        </div>
     );
  }

  // --- VIEW 3: QUIZ LIST (DEFAULT) ---
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 relative">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Available Quizzes</h2>
      
      {loadingList ? (
         <Loading />
      ) : quizzes.length === 0 ? (
         <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl text-slate-500">No quizzes available for your courses!</div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map(quiz => (
               <div key={quiz._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                     <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                        <Check className="w-6 h-6" />
                     </div>
                     <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                        {quiz.timeLimit} mins
                     </span>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{quiz.title}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-4">{quiz.courseName}</p>
                  
                  <div className="flex bg-slate-50 p-3 rounded-xl mb-6">
                     <div className="flex-1 text-center border-r border-slate-200">
                        <div className="text-xs font-bold text-slate-400 mb-1">Pass Score</div>
                        <div className="font-bold text-slate-700">{quiz.passingScore}%</div>
                     </div>
                     <div className="flex-1 text-center">
                        <div className="text-xs font-bold text-slate-400 mb-1">Questions</div>
                        <div className="font-bold text-slate-700">{quiz.questions?.length || 0}</div>
                     </div>
                  </div>
                  
                  <button 
                     onClick={() => handleStartQuiz(quiz)}
                     className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm flex justify-center items-center gap-2 text-sm"
                  >
                     <Play className="w-4 h-4 fill-current" /> Start Quiz
                  </button>
               </div>
            ))}
         </div>
      )}
    </div>
  );
}
