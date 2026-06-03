"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCourseStore } from "@/store/useCourseStore";

export default function LecturerCourseManagement() {
  const { myCourses, fetchMyCreatedCourses, loading } = useCourseStore();

  useEffect(() => {
    fetchMyCreatedCourses();
  }, [fetchMyCreatedCourses]);

  const publishedCount = myCourses.filter(c => c.status === "Published").length;
  const totalStudents = myCourses.reduce((acc, course) => acc + (course.enrollmentCount || 0), 0);
  const avgCompletion = myCourses.length > 0 ? 64 : 0; // fallback

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <span>📚</span> Course Management
        </h2>
        <Link href="/lecturer/courses/new" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
          + Create Course
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Total Courses
          </p>
          <h3 className="text-3xl font-light text-blue-600 mb-2">{myCourses.length}</h3>
          <p className="text-emerald-500 text-xs font-medium">{publishedCount} published</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Total Students
          </p>
          <h3 className="text-3xl font-light text-purple-600 mb-2">{totalStudents}</h3>
          <p className="text-emerald-500 text-xs font-medium">
            Across all courses
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Avg Completion
          </p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">{avgCompletion}%</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> +6% this month
          </p>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : myCourses.map((course) => {
          const completion = 0; 
          const students = course.enrollmentCount || 0;
          return (
          <div
            key={course._id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6">
              {/* Top Header of Card */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-medium text-slate-800 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">{course.modules?.length || 0} modules</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        course.status === "Published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {course.status || "Draft"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                      {students} students
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition">
                    Edit Course
                  </button>
                  {course.status !== "Published" ? (
                    <button className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">
                      Publish
                    </button>
                  ) : (
                    <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition">
                      Analytics
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 text-sm font-medium">
                  <span className="text-slate-500">Completion</span>
                  <span className="text-slate-500">{completion}%</span>
                </div>
                <div className="w-full bg-slate-100 outline outline-1 outline-slate-200/50 rounded-full h-2">
                  <div
                    className={`bg-blue-500 h-2 rounded-full`}
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-base text-slate-400">📝</span>{" "}
                  0 Quizzes
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-slate-400">📎</span>{" "}
                  0 Assignments
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-slate-400">💬</span>{" "}
                  0 Discussions
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-slate-400">👥</span>{" "}
                  {students} Students
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex gap-6">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1">
                + Add Lesson
              </button>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1">
                + Add Quiz
              </button>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1">
                + Assignment
              </button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
