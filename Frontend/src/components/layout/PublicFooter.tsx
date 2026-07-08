"use client";

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-inner">
               <GraduationCap className="text-white w-6 h-6" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">EduQuest</span>
          </div>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Empowering students across Sri Lanka to learn, earn points, level up, and succeed through gamified education.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="#" className="hover:text-blue-500 transition-colors" aria-label="Github">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors" aria-label="Website"><Globe className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6">Navigation</h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-white transition-colors">Browse Courses</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Platform Column */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6">Platform</h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <li>
              <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white transition-colors">Register Account</Link>
            </li>
            <li>
              <Link href="/forgot-password" className="hover:text-white transition-colors">Reset Password</Link>
            </li>
          </ul>
        </div>

        {/* Contact/Support Column */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6">Contact & Support</h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-slate-400">Colombo, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-500 shrink-0" />
              <a href="mailto:support@eduquest.lk" className="hover:text-white transition-colors">support@eduquest.lk</a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-500 shrink-0" />
              <span className="text-slate-400">+94 11 234 5678</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Row */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} EduQuest. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-slate-500 font-medium">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
