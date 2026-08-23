"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCourseStore } from "@/store/useCourseStore";
import Loading from "@/components/ui/Loading";
import api from "@/lib/api";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LecturerCourseManagement() {
  const {
    myCourses,
    fetchMyCreatedCourses,
    loading,
    updateCourse,
    deleteCourse,
  } = useCourseStore();
  const router = useRouter();
  const [courseStats, setCourseStats] = useState<
    Record<
      string,
      {
        quizzesCount: number;
        assignmentsCount: number;
        discussionsCount: number;
        completionRate: number;
      }
    >
  >({});
  const [statsLoading, setStatsLoading] = useState(true);

  const handlePublish = async (courseId: string) => {
    try {
      await updateCourse(courseId, { status: "Published" });
    } catch (error) {
      console.error("Failed to publish course", error);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(courseId);
      } catch (error) {
        console.error("Failed to delete course", error);
      }
    }
  };

  useEffect(() => {
    fetchMyCreatedCourses();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (myCourses.length === 0) {
        setStatsLoading(false);
        return;
      }
      setStatsLoading(true);
      try {
        // 1. Fetch lecturer students (enrollments)
        const studentsRes = await api.get("/courses/lecturer/students");
        const enrollments = studentsRes.data || [];

        // 2. Fetch quizzes, assignments, and discussions for each course
        const statsMap: Record<
          string,
          {
            quizzesCount: number;
            assignmentsCount: number;
            discussionsCount: number;
            completionRate: number;
          }
        > = {};

        for (const course of myCourses) {
          // Calculate average completion rate for this course
          const courseEnrollments = enrollments.filter((e: any) => {
            const cId = e.course?._id || e.course;
            return cId?.toString() === course._id.toString();
          });
          const avgComp =
            courseEnrollments.length > 0
              ? Math.round(
                courseEnrollments.reduce(
                  (sum: number, e: any) => sum + (e.progress || 0),
                  0,
                ) / courseEnrollments.length,
              )
              : 0;

          // Fetch quizzes count
          let quizCount = 0;
          try {
            const quizRes = await api.get(`/quizzes/course/${course._id}`);
            quizCount = quizRes.data?.length || 0;
          } catch (e) { }

          // Fetch assignments count
          let assignCount = 0;
          try {
            const assignRes = await api.get(
              `/assignments/course/${course._id}`,
            );
            assignCount = assignRes.data?.length || 0;
          } catch (e) { }

          // Fetch discussions count
          let postCount = 0;
          try {
            const forumRes = await api.get(`/forums/course/${course._id}`);
            postCount = forumRes.data?.length || 0;
          } catch (e) { }

          statsMap[course._id] = {
            quizzesCount: quizCount,
            assignmentsCount: assignCount,
            discussionsCount: postCount,
            completionRate: avgComp,
          };
        }

        setCourseStats(statsMap);
      } catch (err) {
        console.error("Failed to load course statistics:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [myCourses]);

  const publishedCount = myCourses.filter(
    (c) => c.status === "Published",
  ).length;
  const totalStudents = myCourses.reduce(
    (acc, course) => acc + (course.enrollmentCount || 0),
    0,
  );

  // Overall average completion rate of all courses
  const avgCompletion =
    Object.values(courseStats).length > 0
      ? Math.round(
        Object.values(courseStats).reduce(
          (acc, curr) => acc + curr.completionRate,
          0,
        ) / Object.values(courseStats).length,
      )
      : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <span>📚</span> Course Management
        </h2>
        <Link
          href="/lecturer/courses/new"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
        >
          + Create Course
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Total Courses
          </p>
          <h3 className="text-3xl font-light text-blue-600 mb-2">
            {myCourses.length}
          </h3>
          <p className="text-emerald-500 text-xs font-medium">
            {publishedCount} published
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Total Students
          </p>
          <h3 className="text-3xl font-light text-purple-600 mb-2">
            {totalStudents}
          </h3>
          <p className="text-emerald-500 text-xs font-medium">
            Across all courses
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            Avg Completion
          </p>
          <h3 className="text-3xl font-light text-emerald-500 mb-2">
            {statsLoading ? "..." : `${avgCompletion}%`}
          </h3>
          <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">▲</span> +6% this month
          </p>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        {loading ? (
          <Loading />
        ) : (
          myCourses.map((course) => {
            const completion = courseStats[course._id]?.completionRate || 0;
            const students = course.enrollmentCount || 0;
            const imageUrl = course.thumbnailUrl
              ? course.thumbnailUrl.startsWith("http")
                ? course.thumbnailUrl
                : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${course.thumbnailUrl}`
              : null;

            const allLessonsCount = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;
            const quizLessonsCount = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.filter((l: any) => l.type === 'quiz').length || 0), 0) || 0;
            const checkpointQuestionsCount = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.reduce((qSum: number, l: any) => qSum + (l.questionMarkers?.length || 0), 0) || 0), 0) || 0;
            const totalQuizzes = (courseStats[course._id]?.quizzesCount || 0) + quizLessonsCount + checkpointQuestionsCount;

            const assignmentLessonsCount = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.filter((l: any) => l.type === 'assignment').length || 0), 0) || 0;
            const totalAssignments = (courseStats[course._id]?.assignmentsCount || 0) + assignmentLessonsCount;

            return (
              <div
                key={course._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  {/* Top Header of Card with Thumbnail */}
                  <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
                    {imageUrl ? (
                      <div className="w-full md:w-40 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm">
                        <img
                          src={imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full md:w-40 h-28 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-4xl shrink-0">
                        📚
                      </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-slate-500 mb-3">
                          {course.modules?.length || 0} modules • {allLessonsCount} lessons
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${course.status === "Published"
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
                        <Link
                          href={`/lecturer/courses/${course._id}/edit`}
                          className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                        >
                          Edit Course
                        </Link>
                        {course.status !== "Published" && (
                          <button
                            onClick={() => handlePublish(course._id)}
                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Course"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>



                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-base text-slate-400">📝</span>{" "}
                      {statsLoading ? "..." : totalQuizzes} Quizzes
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base text-slate-400">📎</span>{" "}
                      {statsLoading ? "..." : totalAssignments} Assignments
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base text-slate-400">💬</span>{" "}
                      {statsLoading
                        ? "..."
                        : courseStats[course._id]?.discussionsCount || 0}{" "}
                      Discussions
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base text-slate-400">👥</span>{" "}
                      {students} Students
                    </div>
                  </div>
                </div>

                {/* Footer Links */}
                <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex gap-6">
                  <Link
                    href={`/lecturer/courses/${course._id}/edit`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
                  >
                    + Add Lesson
                  </Link>
                  <button
                    onClick={() => router.push("/lecturer/quizzes/new")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
                  >
                    + Add Quiz
                  </button>
                  <button
                    onClick={() => router.push("/lecturer/assignments/new")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
                  >
                    + Assignment
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
