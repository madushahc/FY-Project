"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export default function PublicNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return "/login";
    const role = user.role?.toUpperCase();
    if (role === 'LECTURER') return "/lecturer";
    if (role === 'ADMIN') return "/admin";
    return "/student";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" }
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="bg-white px-6 md:px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="text-white w-6 h-6" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">EduQuest</span>
        </Link>

        {/* Nav Links - Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`${isActive(link.href)
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
                } transition-colors duration-200`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Auth Buttons - Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <Link
            href={getDashboardLink()}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition transform hover:-translate-y-0.5"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-semibold text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

      {/* Hamburger Menu - Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg flex flex-col p-6 gap-6 md:hidden animate-in slide-in-from-top duration-200 z-40">
          <nav className="flex flex-col gap-4 text-base font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`${isActive(link.href)
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-blue-600'
                  } transition-colors duration-200`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
            {user ? (
              <Link
                href={getDashboardLink()}
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-5 py-3 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
