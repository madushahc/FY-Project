"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  PenTool,
  MessageSquare,
  Trophy,
  BarChart2,
  GraduationCap,
  ChevronLeft,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function Sidebar({ role = "STUDENT" }: { role?: string }) {
  const pathname = usePathname();
  const isLecturer = role === "LECTURER";
  const isAdmin = role === "ADMIN";

  const { user, initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const mainLinks = isAdmin
    ? [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "User Management", href: "/admin/users", icon: Trophy },
        { name: "All Courses", href: "/admin/courses", icon: BookOpen },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
        { name: "Reports", href: "/admin/reports", icon: PenTool },
      ]
    : [
        {
          name: "Dashboard",
          href: isLecturer ? "/lecturer" : "/student",
          icon: LayoutDashboard,
        },
        {
          name: "My Courses",
          href: `/${role.toLowerCase()}/courses`,
          icon: BookOpen,
        },
        {
          name: isLecturer ? "Activities" : "Quizzes",
          href: `/${role.toLowerCase()}/${isLecturer ? "activities" : "quizzes"}`,
          icon: Clock,
        },
        {
          name: isLecturer ? "Students" : "Assignments",
          href: `/${role.toLowerCase()}/${isLecturer ? "students" : "assignments"}`,
          icon: PenTool,
        },
        ...(isLecturer
          ? [{ name: "Learning Analytics ⭐", href: "/lecturer/learning-analytics", icon: BarChart2 }]
          : []),
        ...(!isLecturer
          ? [{ name: "Forum", href: "/student/forum", icon: MessageSquare }]
          : []),
      ];

  const gamificationLinks = isAdmin
    ? []
    : [
        {
          name: isLecturer ? "Game Rules" : "Badges",
          href: `/${role.toLowerCase()}/${isLecturer ? "gamification" : "badges"}`,
          icon: Trophy,
        },
        ...(!isLecturer
          ? [
              {
                name: "Leaderboard",
                href: "/student/leaderboard",
                icon: Trophy,
              },
              {
                name: "My Progress",
                href: "/student/progress",
                icon: BarChart2,
              },
            ]
          : []),
      ];

  // Colors based on role mapping
  const roleColors = {
    STUDENT: "text-[#3B82F6] border-[#3B82F6] bg-[#3B82F6]/10",
    LECTURER: "text-[#7C3AED] border-[#7C3AED] bg-[#7C3AED]/10",
    ADMIN: "text-[#EF4444] border-[#EF4444] bg-[#EF4444]/10",
  };
  const roleColorClass =
    roleColors[role as keyof typeof roleColors] || roleColors.STUDENT;

  const roleEmoji = role === "ADMIN" ? "🛠️" : role === "LECTURER" ? "👨‍🏫" : "👨‍🎓";

  const avatarName = user?.name || (
    role === "ADMIN"
      ? "Admin Perera"
      : role === "LECTURER"
        ? "Dr. Rajapaksa"
        : "Kavitha Perera"
  );
  const avatarInitial = avatarName.charAt(0).toUpperCase();

  const dashboardHref = isAdmin ? "/admin" : isLecturer ? "/lecturer" : "/student";

  const isActiveLink = (href: string) => {
    // Keep dashboard active only on its exact page; others may be active for nested routes.
    if (href === dashboardHref) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="w-64 bg-[#161B2B] text-slate-300 h-screen fixed top-0 left-0 flex flex-col z-20 border-r border-[#1E293B]">
      <div className="p-6 pb-6 flex items-center gap-3 border-b border-[#1E293B]">
        <div className="bg-[#1E293B] p-2 rounded-xl">
          <GraduationCap className="text-[#3B82F6] w-6 h-6" />
        </div>
        <span className="text-xl font-medium text-white tracking-tight">
          Edu<span className="text-[#3B82F6]">Quest</span>
        </span>
      </div>

      <div className="px-4 py-4">
        <div
          className={`px-3 py-2 rounded-full border border-opacity-30 text-xs font-bold text-center flex items-center justify-center gap-2 uppercase tracking-wide ${roleColorClass}`}
        >
          <span>{roleEmoji}</span> {role}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-6 overflow-y-auto pb-4">
        <div>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
            Main
          </h3>
          <ul className="space-y-1">
            {mainLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActiveLink(link.href)
                      ? `bg-[#1E293B] text-white`
                      : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {gamificationLinks.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
              Gamification
            </h3>
            <ul className="space-y-1">
              {gamificationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActiveLink(link.href)
                        ? "bg-[#1E293B] text-white"
                        : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="p-4 bg-[#111623] border-t border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs overflow-hidden ${role === "ADMIN" ? "bg-[#EF4444]" : role === "LECTURER" ? "bg-[#7C3AED]" : "bg-[#3B82F6]"}`}
          >
            {user?.profilePhoto ? (
              <img
                src={
                  user.profilePhoto.startsWith("blob:")
                    ? user.profilePhoto
                    : `http://localhost:5000${user.profilePhoto}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              avatarInitial
            )}
          </div>
          <div>
            <p className="text-white text-xs font-medium truncate max-w-[120px]">{avatarName}</p>
            <p className="text-slate-500 text-[10px]">
              {role.charAt(0) + role.slice(1).toLowerCase()}
            </p>
          </div>
        </div>
        <button className="text-slate-500 hover:text-white transition">
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
