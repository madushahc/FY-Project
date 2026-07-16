"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, GraduationCap, Trophy, Award, Target, BookOpen, BarChart3, Users, HelpCircle, ArrowRight, Flame } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is EduQuest?",
    answer: "EduQuest is a gamified learning management system designed to make university education more engaging. By combining traditional course modules, quizzes, and assignments with modern gaming mechanics (XP points, leveling up, badges, and leaderboards), we motivate students to engage deeper with their study materials."
  },
  {
    question: "How do I earn XP points?",
    answer: "You earn XP (Experience Points) by actively participating in your courses. Read lecture materials, complete modules, solve quizzes, and submit assignments on time. Faster submissions and higher quiz scores grant bonus XP!"
  },
  {
    question: "What are badges and how do I unlock them?",
    answer: "Badges are digital rewards that celebrate your academic milestones and positive study habits. You can unlock them by achieving goals, such as getting a perfect score on a quiz ('Perfect Score'), completing a module ahead of time ('Sprint Learner'), or scoring high on multiple assignments in a row."
  },
  {
    question: "Can lecturers create quizzes and track student progress?",
    answer: "Yes! EduQuest provides a robust dashboard for lecturers where they can easily create course content, deploy interactive quizzes, grade assignments, and monitor real-time class performance analytics to see where students might need additional support."
  },
  {
    question: "Is EduQuest free to use?",
    answer: "EduQuest is fully free for university students and educators who are registered with their academic institutions. Your university integrates with EduQuest to provide structured learning spaces for your department."
  }
];

export default function AboutPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      <div>
        {/* Navbar */}
        <PublicNavbar />

        {/* Hero Section */}
        <section className="relative bg-[#1E40AF] px-6 py-16 md:py-24 text-white overflow-hidden">
          {/* Subtle Background Gradients/Shapes */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 40%)" }}></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Target className="w-4 h-4 text-blue-200" />
              <span className="text-xs font-semibold tracking-wide text-blue-50">About EduQuest</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Gamifying Higher Education
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
              EduQuest bridges the gap between academic lectures and student motivation. We make learning an active quest, helping you achieve peak potential.
            </p>
          </div>
        </section>

        {/* Mission & Story Section */}
        <section className="max-w-6xl mx-auto px-6 md:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Mission Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden space-y-6">
            <div className="absolute top-[-20%] right-[-20%] w-[200px] h-[200px] rounded-full bg-white/10 blur-2xl"></div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
              🎯
            </div>
            <h3 className="text-2xl font-bold">Our Mission</h3>
            <p className="text-blue-100 font-medium leading-relaxed">
              To transform university education into an engaging, interactive adventure. By leveraging cognitive game mechanics, we strive to build learning environments that inspire collaboration, healthy competition, and deep mastery of subjects.
            </p>
            <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs font-bold text-blue-200">
              <span>Sri Lanka's #1 Gamified LMS</span>
              <span>EduQuest Team</span>
            </div>
          </div>

          {/* Right Column: Story */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">The EduQuest Story</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              EduQuest was born out of a simple observation: students are highly engaged by modern games and interactive media, but traditional university learning management systems (LMS) remain dry, linear, and text-heavy.
            </p>
            <p className="text-slate-600 font-medium leading-relaxed">
              We asked: <em>What if we took standard academic criteria and made them feel like parts of a quest?</em> What if completing a homework assignment on time gained you XP? What if scoring high on a test unlocked a custom badge to show off on your profile?
            </p>
            <p className="text-slate-600 font-medium leading-relaxed">
              Today, EduQuest allows university departments to host courses, manage enrollment, create tasks, and track detailed engagement metrics—all while students enjoy a vibrant, competitive, and highly reward-driven experience.
            </p>
          </div>
        </section>

        {/* Platform Core Features Grid */}
        <section className="bg-slate-100 py-20 px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Core Features</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto">
                Discover the mechanics that drive high engagement and completion rates on our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition duration-300 space-y-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 border border-purple-100">
                  <Flame className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg">Gamified Loops</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Earn XP for reading slides, completing tasks, and solving quizzes. Build study streaks to boost your multiplier.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition duration-300 space-y-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100">
                  <Trophy className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg">Leaderboards</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Compete constructively with batchmates in real-time. Leaderboards foster student motivation and peer connection.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition duration-300 space-y-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg">Milestone Badges</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Earn unique cryptographic badges representing subject achievements. Show off your specialties directly on your profile.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition duration-300 space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg">Rich Analytics</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Monitor strengths and weak areas. Lecturers get visual grade averages and attendance curves to optimize content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Accordion FAQ Section */}
        <section className="max-w-3xl mx-auto px-6 md:px-8 py-20 space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 text-blue-600">
              <HelpCircle className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wide">FAQ Accordion</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 font-medium text-sm">
              Answers to some common questions about our platform and mechanics.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-800 hover:text-blue-600 transition"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>

                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-[300px] border-t border-slate-100' : 'max-h-0'
                    }`}
                  >
                    <div className="p-6 text-sm text-slate-500 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-blue-600 py-16 px-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-white/10 blur-2xl"></div>
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h3 className="text-3xl font-bold tracking-tight">Start Your Learning Quest Today</h3>
            <p className="text-blue-100 font-medium text-sm md:text-base">
              Create your EduQuest account now, complete modules, climb the leaderboard, and unlock your true learning capacity.
            </p>
            <div className="pt-2">
              <Link 
                href="/register" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition transform hover:-translate-y-0.5"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
