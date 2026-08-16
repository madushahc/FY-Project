"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Check,
  ArrowLeft,
  Plus,
  Trash2,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Clock,
  Layers,
  Save,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Award,
  Lock,
  Camera,
  GripVertical,
  PlayCircle,
  PenTool,
  FileSearch,
  Link as LinkIcon,
  Settings,
  X,
} from "lucide-react";
import Loading from "@/components/ui/Loading";
import { useCourseStore } from "@/store/useCourseStore";

const DEPARTMENTS = [
  "Computing",
  "Software Engineering",
  "Computer Science",
  "Data Science",
  "Information Technology",
  "Cyber Security",
  "Business",
  "Accounting & Finance",
  "Marketing",
  "Engineering",
  "Civil Engineering",
  "Electrical & Electronic Engineering",
  "Mechanical Engineering",
  "Science",
  "Design & Multimedia",
];

export default function EditCourseWizard() {
  const router = useRouter();
  const params = useParams();
  const { activeCourse, fetchCourseById, updateCourse, uploadFile, loading } =
    useCourseStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [descLength, setDescLength] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Content State
  const [modules, setModules] = useState<{ title: string; lessons: any[] }[]>([
    { title: "Module 1", lessons: [] },
  ]);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);

  // Settings State
  const [enrollmentType, setEnrollmentType] = useState<"Open" | "Restricted">(
    "Open",
  );
  const [status, setStatus] = useState<"Published" | "Draft">("Draft");
  const [minLessonWatchPercent, setMinLessonWatchPercent] = useState(75);
  const [minQuizPassScore, setMinQuizPassScore] = useState(60);

  // Gamification Defaults
  const [pointDefaults, setPointDefaults] = useState({
    lesson: 10,
    quiz: 50,
    assignment: 80,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "video" | "quiz" | "assignment" | "reading" | "link"
  >("video");
  const [modalTab, setModalTab] = useState<"info" | "questions" | "feedback">("info");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonFile, setLessonFile] = useState<File | null>(null);
  const [lessonUrl, setLessonUrl] = useState("");
  const [uploadingLesson, setUploadingLesson] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [canEditCourse, setCanEditCourse] = useState(false);

  const courseInstructorId =
    (activeCourse as any)?.instructor?._id || (activeCourse as any)?.instructor;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch {
          setCurrentUser(null);
        }
      }
    }

    if (params.id) {
      fetchCourseById(params.id as string);
    }
  }, [params.id, fetchCourseById]);

  useEffect(() => {
    if (activeCourse) {
      setTitle(activeCourse.title || "");
      setCode((activeCourse as any).code || "");
      setDepartment((activeCourse as any).department || "");
      setDescription(activeCourse.description || "");
      setDescLength(activeCourse.description?.length || 0);
      setModules(
        activeCourse.modules?.length
          ? activeCourse.modules
          : [{ title: "Module 1", lessons: [] }],
      );
      setEnrollmentType((activeCourse as any).enrollmentType || "Open");
      setStatus(activeCourse.status === "Published" ? "Published" : "Draft");
      if ((activeCourse as any).completionRules) {
        setMinLessonWatchPercent(
          (activeCourse as any).completionRules.minLessonWatchPercent || 80,
        );
        setMinQuizPassScore(
          (activeCourse as any).completionRules.minQuizPassScore || 60,
        );
      }
    }
  }, [activeCourse]);

  useEffect(() => {
    if (!activeCourse || !currentUser) return;

    const isAdmin = currentUser.role === "Admin";
    const isOwner =
      courseInstructorId?.toString() === currentUser._id?.toString();
    const allowed = isAdmin || isOwner;

    setCanEditCourse(allowed);

    if (!allowed) {
      alert("You are not authorized to edit this course.");
      router.replace("/lecturer/courses");
    }
  }, [activeCourse, currentUser, courseInstructorId, router]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleAddModule = () => {
    setModules([
      ...modules,
      { title: `Module ${modules.length + 1}`, lessons: [] },
    ]);
  };

  // Interactive markers state for video lessons
  const [lessonQuestionMarkers, setLessonQuestionMarkers] = useState<any[]>([]);

  // Editing lesson state
  const [editingLessonIdx, setEditingLessonIdx] = useState<number | null>(null);
  const [lessonDescription, setLessonDescription] = useState<string>("");

  // Temp form inputs for adding a single question marker
  const [newQTime, setNewQTime] = useState<number>(60);
  const [newQText, setNewQText] = useState<string>("");
  const [newQOptions, setNewQOptions] = useState<string[]>(["Option A", "Option B", "Option C", "Option D"]);
  const [newQCorrect, setNewQCorrect] = useState<number>(0);
  const [newQPoints, setNewQPoints] = useState<number>(20);
  const [newQTimer, setNewQTimer] = useState<number>(30);

  // Temp form inputs for feedback questions tab
  const [newFbTime, setNewFbTime] = useState<number>(60);
  const [newFbText, setNewFbText] = useState<string>("");
  const [newFbOptions, setNewFbOptions] = useState<string[]>([
    "Very Clear & Easy to Understand",
    "Somewhat Clear",
    "Confusing / Needs Review",
    "I Have Questions"
  ]);
  const [newFbPoints, setNewFbPoints] = useState<number>(10);
  const [newFbTimer, setNewFbTimer] = useState<number>(30);

  const handleAddQuestionMarker = () => {
    if (!newQText.trim()) return alert("Enter question text");
    setLessonQuestionMarkers([
      ...lessonQuestionMarkers,
      {
        timestamp: Number(newQTime),
        questionText: newQText,
        options: [...newQOptions],
        correctOption: Number(newQCorrect),
        points: Number(newQPoints),
        timerSeconds: Number(newQTimer) || 30
      }
    ]);
    setNewQText("");
  };

  const handleAddFeedbackMarker = () => {
    if (!newFbText.trim()) return alert("Enter feedback question text");
    setLessonQuestionMarkers([
      ...lessonQuestionMarkers,
      {
        timestamp: Number(newFbTime),
        questionText: newFbText,
        questionType: "feedback",
        options: [...newFbOptions],
        correctOption: 0,
        points: Number(newFbPoints),
        timerSeconds: Number(newFbTimer) || 30
      }
    ]);
    setNewFbText("");
  };

  const handleAddLesson = async () => {
    if (!lessonTitle) return alert("Please enter a lesson title");

    let finalUrl = lessonUrl;
    if (lessonFile) {
      setUploadingLesson(true);
      try {
        finalUrl = await uploadFile(lessonFile);
      } catch (err) {
        alert("Failed to upload file");
        setUploadingLesson(false);
        return;
      }
      setUploadingLesson(false);
    }

    const isInteractive = ["video", "reading"].includes(modalType);

    const lessonData = {
      title: lessonTitle,
      type: modalType,
      contentUrl: finalUrl,
      description: lessonDescription,
      points:
        modalType === "quiz"
          ? pointDefaults.quiz
          : modalType === "assignment"
            ? pointDefaults.assignment
            : pointDefaults.lesson,
      questionMarkers: isInteractive ? lessonQuestionMarkers : []
    };

    const updatedModules = [...modules];
    if (editingLessonIdx !== null) {
      updatedModules[activeModuleIdx].lessons[editingLessonIdx] = {
        ...updatedModules[activeModuleIdx].lessons[editingLessonIdx],
        ...lessonData
      };
    } else {
      updatedModules[activeModuleIdx].lessons.push(lessonData);
    }
    setModules(updatedModules);

    // Reset Modal
    setIsModalOpen(false);
    setEditingLessonIdx(null);
    setLessonTitle("");
    setLessonDescription("");
    setLessonFile(null);
    setLessonUrl("");
    setLessonQuestionMarkers([]);
  };

  const openModal = (
    type: "video" | "quiz" | "assignment" | "reading" | "link",
  ) => {
    setModalType(type);
    setModalTab("info");
    setEditingLessonIdx(null);
    setLessonTitle("");
    setLessonDescription("");
    setLessonUrl("");
    setLessonFile(null);
    setLessonQuestionMarkers([]);
    setIsModalOpen(true);
  };

  const openEditLessonModal = (modIdx: number, lesIdx: number) => {
    setActiveModuleIdx(modIdx);
    const lesson = modules[modIdx]?.lessons[lesIdx];
    if (!lesson) return;
    setModalType(lesson.type || "video");
    setModalTab("info");
    setEditingLessonIdx(lesIdx);
    setLessonTitle(lesson.title || "");
    setLessonDescription(lesson.description || "");
    setLessonUrl(lesson.contentUrl || "");
    setLessonFile(null);
    setLessonQuestionMarkers(lesson.questionMarkers || []);
    setIsModalOpen(true);
  };


  const handleUpdate = async (isPublish: boolean = false) => {
    if (!canEditCourse) {
      alert("You are not authorized to edit this course.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title || "Untitled Course");
      formData.append("code", code || "C" + Math.floor(Math.random() * 10000));
      formData.append("description", description || "No description provided.");
      formData.append("department", department);
      formData.append("status", isPublish ? "Published" : status);
      formData.append("enrollmentType", enrollmentType);
      formData.append(
        "completionRules",
        JSON.stringify({
          minLessonWatchPercent,
          minQuizPassScore,
          requireAllAssignments: true,
        }),
      );
      formData.append("modules", JSON.stringify(modules));

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      await updateCourse(params.id as string, formData);
      router.push("/lecturer/courses");
    } catch (e: any) {
      console.error("Failed to update course", e);
      const backendError = e.response?.data?.error;
      const errorMsg =
        backendError && typeof backendError === "object"
          ? JSON.stringify(backendError)
          : e.response?.data?.message || e.message;
      alert(`Failed to update course: ${errorMsg}`);
    }
  };

  if (loading && !activeCourse) {
    return <Loading />;
  }

  if (!canEditCourse) {
    return <Loading />;
  }

  const renderProgressBar = () => {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
        <div className="relative flex justify-between items-center max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -z-10 -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-emerald-500 -z-10 -translate-y-1/2 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>

          {[
            { num: 1, label: "Basic Info" },
            { num: 2, label: "Content" },
            { num: 3, label: "Settings" },
          ].map((step) => {
            const isCompleted = currentStep > step.num;
            const isActive = currentStep === step.num;
            return (
              <div
                key={step.num}
                className="flex flex-col items-center gap-2 bg-white px-2 cursor-pointer"
                onClick={() => setCurrentStep(step.num)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${isCompleted
                    ? "bg-emerald-500 text-white shadow-sm"
                    : isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-400"
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 ml-0.5" strokeWidth={3} />
                  ) : (
                    step.num
                  )}
                </div>
                <span
                  className={`text-xs font-bold ${isCompleted
                    ? "text-emerald-500"
                    : isActive
                      ? "text-blue-600"
                      : "text-slate-400"
                    }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Course Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Advanced Database Systems"
          className="w-full p-3 border-2 border-blue-500 rounded-xl bg-white focus:outline-none text-slate-800 font-bold"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Course Code *
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CS401"
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Department
          </label>
          <div className="relative">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-3 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 bg-white appearance-none cursor-pointer font-medium shadow-sm transition-colors"
            >
              <option value="" disabled>Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
              {department && !DEPARTMENTS.includes(department) && (
                <option value={department}>{department}</option>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Short Description *
        </label>
        <div className="relative">
          <textarea
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDescLength(e.target.value.length);
            }}
            placeholder="This course covers advanced database concepts including indexing, query optimization..."
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 resize-none pb-8"
          ></textarea>
          <div className="absolute right-3 bottom-3 text-xs text-slate-400 font-medium">
            {descLength}/500
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Course Thumbnail
        </label>
        <label className="relative w-48 h-32 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition cursor-pointer overflow-hidden">
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={handleThumbnailChange}
          />
          {thumbnailPreview || activeCourse?.thumbnailUrl ? (
            <img
              src={thumbnailPreview || activeCourse?.thumbnailUrl}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              <Camera className="w-6 h-6 mb-2 text-slate-400" />
              <span className="text-sm font-medium text-blue-500">
                Upload Image
              </span>
              <span className="text-[10px] mt-1">PNG, JPG - max 5MB</span>
            </>
          )}
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col lg:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-2">
      {/* Left Column: Course Structure */}
      <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-shrink-0">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Course Structure</h3>
          <p className="text-xs text-slate-400 font-medium">
            Drag modules & lessons to reorder
          </p>
        </div>

        <div className="p-5 space-y-3">
          {modules.map((m, idx) => (
            <div key={idx} className="space-y-2">
              <div
                className={`border ${activeModuleIdx === idx ? "border-blue-200" : "border-slate-200"} rounded-xl overflow-hidden hover:border-slate-300 transition-colors`}
                onClick={() => setActiveModuleIdx(idx)}
              >
                <div
                  className={`${activeModuleIdx === idx ? "bg-blue-50" : "bg-white"} px-4 py-3 flex items-center justify-between cursor-pointer`}
                >
                  <h4
                    className={`text-sm font-bold flex items-center gap-1 ${activeModuleIdx === idx ? "text-blue-700" : "text-slate-700"}`}
                  >
                    <GripVertical className="w-3 h-3 text-slate-300" />{" "}
                    {activeModuleIdx === idx ? "▾" : "▸"} {m.title}
                  </h4>
                </div>
              </div>

              {/* Render Lessons if Active Module */}
              {activeModuleIdx === idx && m.lessons.length > 0 && (
                <div className="ml-6 space-y-2 relative before:absolute before:left-[-12px] before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
                  {m.lessons.map((lesson, lIdx) => (
                    <div
                      key={lIdx}
                      className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between shadow-sm relative before:absolute before:left-[-12px] before:top-1/2 before:w-3 before:h-px before:bg-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        {lesson.type === "video" ? (
                          <PlayCircle className="w-4 h-4 text-blue-500" />
                        ) : lesson.type === "quiz" ? (
                          <PenTool className="w-4 h-4 text-orange-500" />
                        ) : lesson.type === "assignment" ? (
                          <FileText className="w-4 h-4 text-red-500" />
                        ) : lesson.type === "reading" ? (
                          <FileSearch className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <LinkIcon className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="text-xs font-semibold text-slate-700">
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditLessonModal(idx, lIdx);
                          }}
                          className="p-1 hover:bg-slate-100 rounded text-blue-600 hover:text-blue-800 transition"
                          title="Edit Lesson & Interactive Markers"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <Trash2
                          className="w-3 h-3 text-red-400 cursor-pointer hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = [...modules];
                            updated[idx].lessons.splice(lIdx, 1);
                            setModules(updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={handleAddModule}
            className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-100 transition mt-4"
          >
            + Add New Module
          </button>
        </div>
      </div>

      {/* Right Column: Editor */}
      <div className="flex-1 space-y-5">
        {/* Add Content Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-1">
            Add Content to {modules[activeModuleIdx]?.title}
          </h3>
          <p className="text-xs text-slate-400 font-medium mb-4">
            Select a content type to add:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group cursor-pointer"
              onClick={() => openModal("video")}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="text-2xl pt-1">🎬</div>
                  <div>
                    <h4 className="font-bold text-blue-800 text-sm mb-0.5">
                      Video Lesson
                    </h4>
                    <p className="text-[11px] text-slate-500">Upload MP4/MOV</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group cursor-pointer"
              onClick={() => router.push("/lecturer/quizzes/new")}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="text-2xl pt-1">📝</div>
                  <div>
                    <h4 className="font-bold text-orange-800 text-sm mb-0.5">
                      Quiz
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Go to Quiz Creator page
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group cursor-pointer"
              onClick={() => router.push("/lecturer/assignments/new")}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="text-2xl pt-1">📎</div>
                  <div>
                    <h4 className="font-bold text-red-700 text-sm mb-0.5">
                      Assignment
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Go to Assignment Creator page
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group cursor-pointer"
              onClick={() => openModal("reading")}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="text-2xl pt-1">📄</div>
                  <div>
                    <h4 className="font-bold text-emerald-800 text-sm mb-0.5">
                      Reading Material
                    </h4>
                    <p className="text-[11px] text-slate-500">Upload PDF</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group md:col-span-2 cursor-pointer"
              onClick={() => openModal("link")}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="text-2xl pt-1">🔗</div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm mb-0.5">
                      External Resource
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      YouTube video or website
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
      {/* Settings Section */}
      <div className="space-y-6">
        <div className="p-6 pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 bg-blue-600 text-white rounded-lg px-4 py-2 mt-[-24px] mx-[-24px]">
            Enrollment Settings
          </h3>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700">
              Enrollment Type
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border ${enrollmentType === "Open" ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-white hover:bg-slate-50"} rounded-xl p-4 flex items-start gap-3 cursor-pointer`}
                onClick={() => setEnrollmentType("Open")}
              >
                <div
                  className={`w-5 h-5 rounded-full ${enrollmentType === "Open" ? "border-[5px] border-blue-500 bg-white" : "border-2 border-slate-200 bg-white"} shrink-0 mt-0.5`}
                ></div>
                <div>
                  <h5
                    className={`font-bold ${enrollmentType === "Open" ? "text-blue-700" : "text-slate-700"} text-sm`}
                  >
                    Open Enrollment
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Any student can self-enroll
                  </p>
                </div>
              </div>
              <div
                className={`border ${enrollmentType === "Restricted" ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-white hover:bg-slate-50"} rounded-xl p-4 flex items-start gap-3 cursor-pointer transition`}
                onClick={() => setEnrollmentType("Restricted")}
              >
                <div
                  className={`w-5 h-5 rounded-full ${enrollmentType === "Restricted" ? "border-[5px] border-blue-500 bg-white" : "border-2 border-slate-200 bg-white"} shrink-0 mt-0.5`}
                ></div>
                <div>
                  <h5
                    className={`font-bold ${enrollmentType === "Restricted" ? "text-blue-700" : "text-slate-700"} text-sm`}
                  >
                    Restricted
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Lecturer approves each student
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pb-2 border-b border-slate-100">
          <div className="space-y-4 mb-4">
            <h4 className="text-sm font-bold text-slate-700">
              Course Visibility
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border ${status === "Published" ? "border-blue-400 bg-blue-50/20" : "border-slate-200 bg-white hover:bg-slate-50"} rounded-xl p-4 flex items-start gap-3 cursor-pointer`}
                onClick={() => setStatus("Published")}
              >
                <div className="text-lg shrink-0 mt-[-2px]">👁️</div>
                <div>
                  <h5
                    className={`font-bold ${status === "Published" ? "text-blue-600" : "text-slate-700"} text-sm`}
                  >
                    Published
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    Visible to all enrolled students
                  </p>
                </div>
              </div>
              <div
                className={`border ${status === "Draft" ? "border-blue-400 bg-blue-50/20" : "border-slate-200 bg-white hover:bg-slate-50"} rounded-xl p-4 flex items-start gap-3 cursor-pointer`}
                onClick={() => setStatus("Draft")}
              >
                <div className="text-lg shrink-0 mt-[-2px]">📝</div>
                <div>
                  <h5
                    className={`font-bold ${status === "Draft" ? "text-blue-600" : "text-slate-700"} text-sm`}
                  >
                    Draft
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    Only visible to you (not published)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 mt-2 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Edit Course</h2>
      </div>

      {renderProgressBar()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <div className="flex justify-between pt-6 mt-6 border-t border-slate-200">
        {currentStep > 1 ? (
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition border border-slate-200 flex items-center gap-2"
          >
            ← Back
          </button>
        ) : (
          <div></div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-10 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center text-sm"
            >
              Next →
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdate(false)}
                disabled={loading}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition shadow-sm disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => handleUpdate(true)}
                disabled={loading}
                className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-sm disabled:opacity-50 text-sm"
              >
                {loading ? "Updating..." : "🚀 Update & Publish"}
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Inline Modal for Adding Content */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h3 className="font-bold text-slate-800 capitalize flex items-center gap-2">
                {editingLessonIdx !== null ? "✏️ Edit" : "➕ Add"} {modalType} Lesson
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation — only show interactive tabs for video/reading */}
            {(modalType === "video" || modalType === "reading") && (
              <div className="flex gap-0 border-b border-slate-200 bg-white sticky top-[64px] z-10">
                {([
                  { id: "info", label: "📋 Lesson Info", count: null },
                  { id: "questions", label: "❓ Checkpoints", count: lessonQuestionMarkers.filter(q => q.questionType !== "feedback").length },
                  { id: "feedback", label: "💬 Feedback & Q&A", count: lessonQuestionMarkers.filter(q => q.questionType === "feedback").length },
                ] as { id: "info" | "questions" | "feedback"; label: string; count: number | null }[]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id)}
                    className={`flex-1 px-4 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 ${modalTab === tab.id
                      ? "border-blue-600 text-blue-700 bg-blue-50/50"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    {tab.label}
                    {tab.count !== null && tab.count > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${modalTab === tab.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                        }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="p-6 space-y-5 flex-1">

              {/* ── TAB 1: LESSON INFO ── */}
              {(modalTab === "info" || modalType === "quiz" || modalType === "assignment" || modalType === "link") && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="E.g. Introduction & Key Concepts"
                    />
                  </div>

                  {["video", "reading"].includes(modalType) && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        {modalType === "video" ? "Upload Video" : "Upload Reading Material (PDF)"}
                      </label>
                      <input
                        type="file"
                        accept={modalType === "video" ? "video/*" : "application/pdf,.pdf"}
                        onChange={(e) => setLessonFile(e.target.files?.[0] || null)}
                        className="w-full p-2 border border-slate-200 rounded-xl text-sm text-slate-600"
                      />
                      <div className="mt-2 text-xs text-slate-400">Or provide direct URL:</div>
                      <input
                        type="text"
                        value={lessonUrl}
                        onChange={(e) => setLessonUrl(e.target.value)}
                        placeholder={modalType === "video" ? "https://example.com/video.mp4" : "https://example.com/doc.pdf"}
                        className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
                      />
                    </div>
                  )}

                  {modalType === "link" && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        URL
                      </label>
                      <input
                        type="text"
                        value={lessonUrl}
                        onChange={(e) => setLessonUrl(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="https://"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Lesson Description / Text Material
                    </label>
                    <textarea
                      rows={3}
                      value={lessonDescription}
                      onChange={(e) => setLessonDescription(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Enter reading text content or lesson notes..."
                    />
                  </div>

                  {/* Summary of interactive markers on info tab */}
                  {(modalType === "video" || modalType === "reading") && lessonQuestionMarkers.length > 0 && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setModalTab("questions")}
                        className="w-full flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 hover:bg-blue-100 transition"
                      >
                        <HelpCircle className="w-4 h-4" />
                        {lessonQuestionMarkers.length} Question{lessonQuestionMarkers.length !== 1 ? "s" : ""} configured
                        <span className="ml-auto text-blue-600">→</span>
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* ── TAB 3: QUESTIONS ── */}
              {modalTab === "questions" && (modalType === "video" || modalType === "reading") && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-1">
                      <HelpCircle className="w-4 h-4" /> Checkpoint Questions
                    </h4>
                    <p className="text-xs text-blue-700 font-medium">
                      {modalType === "video"
                        ? "MCQ questions that pause the video at a specific timestamp, requiring students to answer before continuing."
                        : "MCQ questions triggered when students reach a scroll position in the reading material."}
                    </p>
                  </div>

                  {/* Existing Questions */}
                  {lessonQuestionMarkers.length > 0 ? (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Configured Questions ({lessonQuestionMarkers.length})</h5>
                      {lessonQuestionMarkers.map((q, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                <HelpCircle className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-800 mb-1">{q.questionText}</div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    {modalType === "video" ? "⏰" : "📍"} {q.timestamp}{modalType === "video" ? "s" : "% scroll"}
                                  </span>
                                  <span className="text-[10px] font-bold text-blue-600">+{q.points} pts</span>
                                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                    <Clock className="w-2.5 h-2.5" /> {q.timerSeconds || 30}s timer
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  {q.options?.map((opt: string, oIdx: number) => (
                                    <div
                                      key={oIdx}
                                      className={`text-[10px] px-2 py-1 rounded-lg font-medium ${oIdx === q.correctOption
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold"
                                        : "bg-slate-50 text-slate-600 border border-slate-200"
                                        }`}
                                    >
                                      {String.fromCharCode(65 + oIdx)}. {opt}{oIdx === q.correctOption ? " ✓" : ""}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setLessonQuestionMarkers(lessonQuestionMarkers.filter((_, i) => i !== idx))}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition shrink-0"
                              title="Remove Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
                      No questions added yet. Add one below.
                    </div>
                  )}

                  {/* Add New Question Form */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Add New Question</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                          {modalType === "video" ? "Timestamp (seconds)" : "Scroll Position (%)"}
                        </label>
                        <input
                          type="number"
                          placeholder={modalType === "video" ? "e.g. 60" : "e.g. 75"}
                          value={newQTime}
                          onChange={(e) => setNewQTime(Number(e.target.value))}
                          min={0}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Points</label>
                        <input
                          type="number"
                          placeholder="e.g. 20"
                          value={newQPoints}
                          onChange={(e) => setNewQPoints(Number(e.target.value))}
                          min={1}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Question Text</label>
                      <input
                        type="text"
                        placeholder="Enter your question here..."
                        value={newQText}
                        onChange={(e) => setNewQText(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Answer Options (click border to set correct)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {newQOptions.map((opt, oIdx) => (
                          <div key={oIdx} className="relative">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const opts = [...newQOptions];
                                opts[oIdx] = e.target.value;
                                setNewQOptions(opts);
                              }}
                              className={`w-full p-2.5 border-2 rounded-lg text-xs font-medium bg-white focus:outline-none pr-8 ${newQCorrect === oIdx
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-slate-200 hover:border-slate-300"
                                }`}
                              placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                            />
                            <button
                              type="button"
                              onClick={() => setNewQCorrect(oIdx)}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 transition ${newQCorrect === oIdx
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-slate-300 bg-white hover:border-emerald-400"
                                }`}
                              title={`Set Option ${String.fromCharCode(65 + oIdx)} as correct`}
                            >
                              {newQCorrect === oIdx && <span className="text-white text-[8px] font-bold flex items-center justify-center h-full">✓</span>}
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">Click the circle ○ on the right to mark the correct answer (shown in green).</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Question Timer (seconds) — students must answer within this time
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="30"
                          value={newQTimer}
                          onChange={(e) => setNewQTimer(Number(e.target.value))}
                          min={10}
                          max={300}
                          className="w-32 p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        />
                        <span className="text-xs text-slate-400 font-medium">seconds (e.g. 30 = 30s to answer)</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddQuestionMarker}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition shadow-sm flex items-center justify-center gap-2"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Add Question at {newQTime}{modalType === "video" ? "s" : "%"}
                    </button>
                  </div>
                </div>
              )}

              {/* ── TAB 3: FEEDBACK & Q&A ── */}
              {modalTab === "feedback" && (modalType === "video" || modalType === "reading") && (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-purple-900 flex items-center gap-2 mb-1">
                      💬 Custom Student Engagement & Feedback Questions
                    </h4>
                    <p className="text-xs text-purple-700 font-medium">
                      Ask custom feedback, reflection, or opinion questions to students at specific timestamps/scroll positions and capture their responses in real-time.
                    </p>
                  </div>


                  {/* Configured Feedback Questions List */}
                  {lessonQuestionMarkers.filter(q => q.questionType === "feedback").length > 0 ? (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Configured Feedback Questions ({lessonQuestionMarkers.filter(q => q.questionType === "feedback").length})
                      </h5>
                      {lessonQuestionMarkers.map((q, idx) => {
                        if (q.questionType !== "feedback") return null;
                        return (
                          <div key={idx} className="bg-white border border-purple-200 rounded-xl p-3 shadow-sm">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-xs font-bold text-purple-950 mb-1">{q.questionText}</div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    {modalType === "video" ? "⏰" : "📍"} {q.timestamp}{modalType === "video" ? "s" : "% scroll"}
                                  </span>
                                  <span className="text-[10px] font-bold text-purple-600">+{q.points} pts</span>
                                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                    <Clock className="w-2.5 h-2.5" /> {q.timerSeconds || 30}s timer
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  {q.options?.map((opt: string, oIdx: number) => (
                                    <div key={oIdx} className="text-[10px] px-2 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg font-medium">
                                      {String.fromCharCode(65 + oIdx)}. {opt}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => setLessonQuestionMarkers(lessonQuestionMarkers.filter((_, i) => i !== idx))}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition shrink-0"
                                title="Remove Feedback Question"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-5 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
                      No feedback questions added yet. Configure one below.
                    </div>
                  )}

                  {/* Add New Feedback Question Form */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <h5 className="text-xs font-bold text-purple-900 uppercase tracking-wider">Configure Custom Feedback Question</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                          {modalType === "video" ? "Trigger Timestamp (seconds)" : "Trigger Scroll Position (%)"}
                        </label>
                        <input
                          type="number"
                          placeholder={modalType === "video" ? "e.g. 60" : "e.g. 75"}
                          value={newFbTime}
                          onChange={(e) => setNewFbTime(Number(e.target.value))}
                          min={0}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-purple-300 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Points Awarded</label>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          value={newFbPoints}
                          onChange={(e) => setNewFbPoints(Number(e.target.value))}
                          min={1}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-purple-300 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Feedback Question Prompt</label>
                      <input
                        type="text"
                        placeholder="Enter custom feedback question (e.g. What concept needs more explanation?)"
                        value={newFbText}
                        onChange={(e) => setNewFbText(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-purple-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Feedback Response Options</label>
                      <div className="grid grid-cols-2 gap-2">
                        {newFbOptions.map((opt, oIdx) => (
                          <input
                            key={oIdx}
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const opts = [...newFbOptions];
                              opts[oIdx] = e.target.value;
                              setNewFbOptions(opts);
                            }}
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-medium bg-white focus:outline-none focus:border-purple-400"
                            placeholder={`Choice ${String.fromCharCode(65 + oIdx)}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-600" /> Custom Time Period / Question Timer (seconds)
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="number"
                          placeholder="30"
                          value={newFbTimer}
                          onChange={(e) => setNewFbTimer(Number(e.target.value))}
                          min={5}
                          max={600}
                          className="w-28 p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-purple-300 focus:outline-none"
                        />
                        <span className="text-xs text-slate-400 font-medium mr-1">sec</span>
                        <div className="flex flex-wrap items-center gap-1">
                          {[15, 30, 45, 60, 90, 120].map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => setNewFbTimer(sec)}
                              className={`px-2.5 py-1.5 text-[11px] font-extrabold rounded-lg transition border cursor-pointer ${newFbTimer === sec
                                  ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                                }`}
                            >
                              ⏱️ {sec}s
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFeedbackMarker}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-lg transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      💬 Add Feedback Question at {newFbTime}{modalType === "video" ? "s" : "%"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLesson}
                disabled={uploadingLesson}
                className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm disabled:opacity-50"
              >
                {uploadingLesson ? "Uploading..." : "Add Content"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

