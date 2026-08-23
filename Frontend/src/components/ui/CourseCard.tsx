import React from "react";
import Link from "next/link";
import { BookOpen, Users, Star, GraduationCap } from "lucide-react";

export interface CourseData {
  id: string;
  title: string;
  code: string;
  department: string;
  lecturer: string;
  lessons: number;
  students?: number;
  quizzes?: number;
  rating?: number;
  progress?: number;
  colorType?: "blue" | "emerald" | "purple" | "orange" | "yellow";
  tags?: string[];
  emoji?: string;
  thumbnailUrl?: string;
  status: "enrolled" | "available" | "completed";
}

const getImageUrl = (url?: string) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
  return `${backendUrl}${url}`;
};

export function CourseCard({ course }: { course: CourseData }) {
  // Mapping color types to styles
  const colorMap = {
    blue: { bg: "bg-blue-50", bar: "bg-blue-500", text: "text-blue-600" },
    emerald: {
      bg: "bg-emerald-50",
      bar: "bg-emerald-500",
      text: "text-emerald-600",
    },
    purple: {
      bg: "bg-purple-50",
      bar: "bg-purple-500",
      text: "text-purple-600",
    },
    orange: {
      bg: "bg-orange-50",
      bar: "bg-orange-500",
      text: "text-orange-600",
    },
    yellow: {
      bg: "bg-yellow-50",
      bar: "bg-yellow-500",
      text: "text-yellow-600",
    },
  };

  const scheme =
    (course.colorType && (colorMap as any)[course.colorType]) || colorMap.blue;
  const imageUrl = getImageUrl(course.thumbnailUrl);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Top Banner (Image Area) */}
      <div
        className={`h-40 ${scheme.bg} relative flex items-center justify-center text-5xl overflow-hidden`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          course.emoji || "📚"
        )}

        {/* Top Left Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.status === "enrolled" && (
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
              Enrolled
            </span>
          )}
          {course.status === "completed" && (
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
              Completed
            </span>
          )}
        </div>

        {/* Top Right Tags */}
        <div className="absolute top-3 right-3 flex gap-2">
          {course.tags?.includes("New") && (
            <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
              ✨ New
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        <h4 className="font-semibold text-slate-800 text-base leading-tight mb-1">
          {course.title}
        </h4>
        <p className="text-xs text-slate-500 mb-3">
          {course.code} · {course.department}
        </p>

        {course.lecturer && (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm">👨‍🏫</span>
            <span className="text-xs font-medium text-slate-600">
              {course.lecturer}
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{course.lessons} lessons</span>
          </div>
          {course.students !== undefined && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{course.students} students</span>
            </div>
          )}
          {course.quizzes !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📝</span>
              <span>{course.quizzes} quizzes</span>
            </div>
          )}
        </div>

        {/* Flex spacer to push footer to bottom */}
        <div className="flex-1"></div>

        {/* Dynamic Footer Row (Rating vs Type tag vs Progress) */}
        <div className="flex items-center justify-between mb-4">
          {course.progress !== undefined ? (
            <div className="w-full">
              {(() => {
                const safeProgress = Math.min(100, Math.max(0, course.progress));
                return (
                  <>
                    <div className="flex justify-between items-center mb-1 text-xs font-bold">
                      <span className="text-slate-500">Progress</span>
                      <span className={scheme.text}>{safeProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`${scheme.bar} h-2 rounded-full`}
                        style={{ width: `${safeProgress}%` }}
                      ></div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <>
              {course.rating ? (
                <div className="flex items-center gap-1 text-xs font-bold text-orange-500">
                  <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                  {course.rating}
                </div>
              ) : (
                <div></div>
              )}

              {course.tags
                ?.filter((t) => t !== "New")
                .map((tag) => (
                  <span
                    key={tag}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${tag === "Core"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-orange-50 text-orange-600"
                      }`}
                  >
                    {tag}
                  </span>
                ))}
            </>
          )}
        </div>

        {/* Call to Action Button */}
        {course.status === "enrolled" ? (
          <Link
            href={`/student/courses/${course.id}`}
            className="w-full py-2.5 text-center block text-sm font-medium text-blue-600 bg-blue-50 border border-transparent rounded-lg hover:bg-blue-100 transition-colors"
          >
            Continue Learning →
          </Link>
        ) : course.status === "completed" ? (
          <Link
            href={`/student/courses/${course.id}`}
            className="w-full py-2.5 text-center block text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Review Course
          </Link>
        ) : (
          <button className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Enroll Now →
          </button>
        )}
      </div>
    </div>
  );
}
