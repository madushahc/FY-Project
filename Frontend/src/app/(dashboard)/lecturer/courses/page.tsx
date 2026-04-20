import React from "react";

export default function LecturerCourseManagement() {
  const courses = [
    {
      id: 1,
      title: "Data Structures & Algorithms",
      meta: "CS301 • 6 modules • 24 lessons",
      status: "Published",
      students: 52,
      completion: 72,
      progressColor: "bg-blue-600",
      quizzes: 6,
      assignments: 2,
      discussions: 3,
    },
    {
      id: 2,
      title: "Database Management Systems",
      meta: "CS302 • 5 modules • 18 lessons",
      status: "Published",
      students: 48,
      completion: 58,
      progressColor: "bg-emerald-500",
      quizzes: 4,
      assignments: 2,
      discussions: 3,
    },
    {
      id: 3,
      title: "Software Engineering",
      meta: "CS303 • 4 modules • 10 lessons",
      status: "Draft",
      students: 47,
      completion: 45,
      progressColor: "bg-orange-500",
      quizzes: 2,
      assignments: 2,
      discussions: 3,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <span>📚</span> Course Management
        </h2>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
          + Create Course
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Total Courses
          </p>
          <h3 className="text-3xl font-light text-blue-600 mb-2">3</h3>
          <p className="text-emerald-500 text-xs font-medium">2 published</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Total Students
          </p>
          <h3 className="text-3xl font-light text-purple-600 mb-2">147</h3>
          <p className="text-emerald-500 text-xs font-medium">
            Across all courses
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Avg Completion
          </p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">64%</h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> +6% this month
          </p>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6">
              {/* Top Header of Card */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-medium text-slate-800 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">{course.meta}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        course.status === "Published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {course.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                      {course.students} students
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition">
                    Edit Course
                  </button>
                  {course.status === "Draft" ? (
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
                  <span className="text-slate-500">{course.completion}%</span>
                </div>
                <div className="w-full bg-slate-100 outline outline-1 outline-slate-200/50 rounded-full h-2">
                  <div
                    className={`${course.progressColor} h-2 rounded-full`}
                    style={{ width: `${course.completion}%` }}
                  ></div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-base text-slate-400">📝</span>{" "}
                  {course.quizzes} Quizzes
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-slate-400">📎</span>{" "}
                  {course.assignments} Assignments
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-slate-400">💬</span>{" "}
                  {course.discussions} Discussions
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-slate-400">👥</span>{" "}
                  {course.students} Students
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
        ))}
      </div>
    </div>
  );
}
