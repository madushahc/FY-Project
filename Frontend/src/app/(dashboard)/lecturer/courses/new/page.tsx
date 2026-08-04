"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Camera,
  PenTool,
  FileText,
  Link as LinkIcon,
  PlayCircle,
  FileSearch,
  Trash2,
  GripVertical,
  Settings,
  X,
  ChevronDown,
  QrCode,
  Clock,
  HelpCircle,
  Plus,
} from "lucide-react";
import { useCourseStore } from "@/store/useCourseStore";
import api from "@/lib/api";

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

export default function NewCourseWizard() {
  const router = useRouter();
  const { createCourse, uploadFile, loading } = useCourseStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [department, setDepartment] = useState("Computing");
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
  const [enrollmentType, setEnrollmentType] = useState<"Open" | "Restricted">("Open");
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
  const [modalType, setModalType] = useState<"video" | "quiz" | "assignment" | "reading" | "link">("video");
  const [modalTab, setModalTab] = useState<"info" | "qr" | "questions" | "quiz-builder" | "assignment-builder">("info");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonFile, setLessonFile] = useState<File | null>(null);
  const [lessonUrl, setLessonUrl] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [uploadingLesson, setUploadingLesson] = useState(false);

  // Editing lesson state
  const [editingLessonIdx, setEditingLessonIdx] = useState<number | null>(null);

  // Interactive markers state
  const [lessonQrMarkers, setLessonQrMarkers] = useState<any[]>([]);
  const [lessonQuestionMarkers, setLessonQuestionMarkers] = useState<any[]>([]);

  // Temp form inputs for adding a single QR marker
  const [newQrTime, setNewQrTime] = useState<number>(30);
  const [newQrLabel, setNewQrLabel] = useState<string>("Check-in QR Code");
  const [newQrPoints, setNewQrPoints] = useState<number>(15);
  const [newQrTimer, setNewQrTimer] = useState<number>(30);

  // Temp form inputs for adding a single question marker
  const [newQTime, setNewQTime] = useState<number>(60);
  const [newQText, setNewQText] = useState<string>("");
  const [newQOptions, setNewQOptions] = useState<string[]>(["Option A", "Option B", "Option C", "Option D"]);
  const [newQCorrect, setNewQCorrect] = useState<number>(0);
  const [newQPoints, setNewQPoints] = useState<number>(20);
  const [newQTimer, setNewQTimer] = useState<number>(30);

  // ── Quiz Builder State ──
  const getCurrentDateTimeString = (offsetDays = 0) => {
    const date = new Date();
    if (offsetDays) date.setDate(date.getDate() + offsetDays);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };
  const [quizTotalPoints, setQuizTotalPoints] = useState("50");
  const [quizTimeLimit, setQuizTimeLimit] = useState("15");
  const [quizPassingScore, setQuizPassingScore] = useState("60");
  const [quizAttemptsAllowed, setQuizAttemptsAllowed] = useState("1");
  const [quizAvailableFrom, setQuizAvailableFrom] = useState(getCurrentDateTimeString());
  const [quizDueDate, setQuizDueDate] = useState(getCurrentDateTimeString(1));
  const [quizQuestions, setQuizQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctOptionIndex: 0 },
  ]);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // ── Assignment Builder State ──
  const [assignInstructions, setAssignInstructions] = useState("");
  const [assignPoints, setAssignPoints] = useState("100");
  const [assignDeadline, setAssignDeadline] = useState(getCurrentDateTimeString(1));
  const [assignPenalty, setAssignPenalty] = useState("0");
  const [assignRubric, setAssignRubric] = useState([
    { criteria: "Correct Implementation", points: "40" },
    { criteria: "Code Quality", points: "30" },
    { criteria: "Documentation", points: "20" },
    { criteria: "Submission Format", points: "10" },
  ]);
  const [assignRefMaterials, setAssignRefMaterials] = useState<{ name: string; url: string }[]>([]);
  const [uploadingAssignFiles, setUploadingAssignFiles] = useState(false);
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  const resetQuizState = () => {
    setQuizTotalPoints("50");
    setQuizTimeLimit("15");
    setQuizPassingScore("60");
    setQuizAttemptsAllowed("1");
    setQuizAvailableFrom(getCurrentDateTimeString());
    setQuizDueDate(getCurrentDateTimeString(1));
    setQuizQuestions([{ text: "", options: ["", "", "", ""], correctOptionIndex: 0 }]);
  };

  const resetAssignmentState = () => {
    setAssignInstructions("");
    setAssignPoints("100");
    setAssignDeadline(getCurrentDateTimeString(1));
    setAssignPenalty("0");
    setAssignRubric([
      { criteria: "Correct Implementation", points: "40" },
      { criteria: "Code Quality", points: "30" },
      { criteria: "Documentation", points: "20" },
      { criteria: "Submission Format", points: "10" },
    ]);
    setAssignRefMaterials([]);
  };

  const handleAssignRefFilesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    setUploadingAssignFiles(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => ({ name: file.name, url: await uploadFile(file) }))
      );
      setAssignRefMaterials((cur) => [...cur, ...uploaded]);
    } catch {
      alert("Failed to upload one or more reference files.");
    } finally {
      setUploadingAssignFiles(false);
      event.target.value = "";
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleAddModule = () => {
    setModules([...modules, { title: `Module ${modules.length + 1}`, lessons: [] }]);
  };

  const handleAddQrMarker = () => {
    const code = `QR-M${activeModuleIdx + 1}-L${modules[activeModuleIdx]?.lessons.length + 1}-${Math.floor(100 + Math.random() * 900)}`;
    setLessonQrMarkers([
      ...lessonQrMarkers,
      {
        timestamp: Number(newQrTime),
        label: newQrLabel,
        code,
        points: Number(newQrPoints),
        timerSeconds: Number(newQrTimer) || 30,
      },
    ]);
  };

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
        timerSeconds: Number(newQTimer) || 30,
      },
    ]);
    setNewQText("");
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

    // ── If quiz: submit to backend and attach the ID ──
    let quizId: string | undefined;
    if (modalType === "quiz") {
      const validQs = quizQuestions.filter((q) => q.text.trim());
      if (validQs.length === 0) return alert("Please add at least one question.");
      setSubmittingQuiz(true);
      try {
        const res = await api.post("/quizzes", {
          title: lessonTitle,
          description: lessonTitle,
          totalPoints: Number(quizTotalPoints),
          timeLimit: Number(quizTimeLimit),
          passingScore: Number(quizPassingScore),
          attemptsAllowed: quizAttemptsAllowed === "unlimited" ? 999 : Number(quizAttemptsAllowed),
          availableFrom: quizAvailableFrom ? new Date(quizAvailableFrom) : undefined,
          dueDate: quizDueDate ? new Date(quizDueDate) : undefined,
          questions: validQs.map((q) => ({
            text: q.text,
            type: "multiple-choice",
            options: q.options,
            correctAnswer: q.options[q.correctOptionIndex],
          })),
          isPublished: true,
        });
        quizId = (res.data as any)?._id || (res.data as any)?.quiz?._id;
      } catch (err) {
        alert("Failed to create quiz. Please try again.");
        setSubmittingQuiz(false);
        return;
      }
      setSubmittingQuiz(false);
    }

    // ── If assignment: submit to backend and attach the ID ──
    let assignmentId: string | undefined;
    if (modalType === "assignment") {
      if (!assignInstructions.trim()) return alert("Please enter assignment instructions.");
      const rubricData = assignRubric
        .map((r) => ({ criteria: r.criteria.trim(), points: Number(r.points) }))
        .filter((r) => r.criteria && !isNaN(r.points));
      if (rubricData.length === 0) return alert("Please add at least one valid rubric item.");
      setSubmittingAssignment(true);
      try {
        const res = await api.post("/assignments", {
          title: lessonTitle,
          instructions: assignInstructions,
          points: Number(assignPoints),
          deadline: new Date(assignDeadline),
          latePenaltyPercent: Number(assignPenalty),
          referenceMaterials: assignRefMaterials.map((f) => f.url),
          rubric: rubricData,
          isPublished: true,
        });
        assignmentId = (res.data as any)?._id || (res.data as any)?.assignment?._id;
      } catch (err) {
        alert("Failed to create assignment. Please try again.");
        setSubmittingAssignment(false);
        return;
      }
      setSubmittingAssignment(false);
    }

    const lessonData = {
      title: lessonTitle,
      type: modalType,
      contentUrl: finalUrl,
      description: lessonDescription,
      points:
        modalType === "quiz"
          ? Number(quizTotalPoints)
          : modalType === "assignment"
          ? Number(assignPoints)
          : pointDefaults.lesson,
      qrMarkers: isInteractive ? lessonQrMarkers : [],
      questionMarkers: isInteractive ? lessonQuestionMarkers : [],
      ...(quizId ? { quizId } : {}),
      ...(assignmentId ? { assignmentId } : {}),
    };

    const updatedModules = [...modules];
    if (editingLessonIdx !== null) {
      updatedModules[activeModuleIdx].lessons[editingLessonIdx] = {
        ...updatedModules[activeModuleIdx].lessons[editingLessonIdx],
        ...lessonData,
      };
    } else {
      updatedModules[activeModuleIdx].lessons.push(lessonData);
    }
    setModules(updatedModules);

    // Reset modal
    setIsModalOpen(false);
    setEditingLessonIdx(null);
    setLessonTitle("");
    setLessonDescription("");
    setLessonFile(null);
    setLessonUrl("");
    setLessonQrMarkers([]);
    setLessonQuestionMarkers([]);
    resetQuizState();
    resetAssignmentState();
  };

  const openModal = (type: "video" | "quiz" | "assignment" | "reading" | "link") => {
    setModalType(type);
    setModalTab(type === "quiz" ? "quiz-builder" : type === "assignment" ? "assignment-builder" : "info");
    setEditingLessonIdx(null);
    setLessonTitle("");
    setLessonDescription("");
    setLessonUrl("");
    setLessonFile(null);
    setLessonQrMarkers([]);
    setLessonQuestionMarkers([]);
    resetQuizState();
    resetAssignmentState();
    setIsModalOpen(true);
  };

  const openEditLessonModal = (modIdx: number, lesIdx: number) => {
    setActiveModuleIdx(modIdx);
    const lesson = modules[modIdx]?.lessons[lesIdx];
    if (!lesson) return;
    const type = lesson.type || "video";
    setModalType(type);
    setModalTab(type === "quiz" ? "quiz-builder" : type === "assignment" ? "assignment-builder" : "info");
    setEditingLessonIdx(lesIdx);
    setLessonTitle(lesson.title || "");
    setLessonDescription(lesson.description || "");
    setLessonUrl(lesson.contentUrl || "");
    setLessonFile(null);
    setLessonQrMarkers(lesson.qrMarkers || []);
    setLessonQuestionMarkers(lesson.questionMarkers || []);
    setIsModalOpen(true);
  };

  const handlePublish = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title || "Untitled Course");
      formData.append("code", code || "C" + Math.floor(Math.random() * 10000));
      formData.append("description", description || "No description provided.");
      formData.append("status", status);
      formData.append("department", department);
      formData.append("enrollmentType", enrollmentType);
      formData.append(
        "completionRules",
        JSON.stringify({
          minLessonWatchPercent,
          minQuizPassScore,
          requireAllAssignments: true,
        })
      );
      formData.append("modules", JSON.stringify(modules));

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      await createCourse(formData);
      router.push("/lecturer/courses");
    } catch (e: any) {
      console.error("Failed to create course", e);
      const backendError = e.response?.data?.error;
      const errorMsg =
        backendError && typeof backendError === "object"
          ? JSON.stringify(backendError)
          : e.response?.data?.message || e.message;
      alert(`Failed to publish course: ${errorMsg}`);
    }
  };

  const renderProgressBar = () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
      <div className="relative flex justify-between items-center max-w-3xl mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -z-10 -translate-y-1/2"></div>
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-emerald-500 -z-10 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        ></div>

        {[
          { num: 1, label: "Basic Info" },
          { num: 2, label: "Content" },
          { num: 3, label: "Settings" },
          { num: 4, label: "Gamification" },
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
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-sm"
                    : isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 ml-0.5" strokeWidth={3} /> : step.num}
              </div>
              <span
                className={`text-xs font-bold ${
                  isCompleted ? "text-emerald-500" : isActive ? "text-blue-600" : "text-slate-400"
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

  const renderStep1 = () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Course Title *</label>
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
          <label className="block text-sm font-bold text-slate-700 mb-2">Course Code *</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CS401"
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
          <div className="relative">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-3 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 bg-white appearance-none cursor-pointer font-medium shadow-sm transition-colors"
            >
              <option value="" disabled>Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Short Description *</label>
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
          <div className="absolute right-3 bottom-3 text-xs text-slate-400 font-medium">{descLength}/500</div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Course Thumbnail</label>
        <label className="relative w-48 h-32 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition cursor-pointer overflow-hidden">
          <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleThumbnailChange} />
          {thumbnailPreview ? (
            <img src={thumbnailPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <Camera className="w-6 h-6 mb-2 text-slate-400" />
              <span className="text-sm font-medium text-blue-500">Upload Image</span>
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
          <p className="text-xs text-slate-400 font-medium">Drag modules & lessons to reorder</p>
        </div>

        <div className="p-5 space-y-3">
          {modules.map((m, idx) => (
            <div key={idx} className="space-y-2">
              <div
                className={`border ${activeModuleIdx === idx ? "border-blue-200" : "border-slate-200"} rounded-xl overflow-hidden hover:border-slate-300 transition-colors`}
                onClick={() => setActiveModuleIdx(idx)}
              >
                <div className={`${activeModuleIdx === idx ? "bg-blue-50" : "bg-white"} px-4 py-3 flex items-center justify-between cursor-pointer`}>
                  <h4 className={`text-sm font-bold flex items-center gap-1 ${activeModuleIdx === idx ? "text-blue-700" : "text-slate-700"}`}>
                    <GripVertical className="w-3 h-3 text-slate-300" /> {activeModuleIdx === idx ? "▾" : "▸"} {m.title}
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
                        <span className="text-xs font-semibold text-slate-700">{lesson.title}</span>
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
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-1">Add Content to {modules[activeModuleIdx]?.title}</h3>
          <p className="text-xs text-slate-400 font-medium mb-4">Select a content type to add:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition group cursor-pointer"
              onClick={() => openModal("video")}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="text-2xl pt-1">🎬</div>
                  <div>
                    <h4 className="font-bold text-blue-800 text-sm mb-0.5">Video Lesson</h4>
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
                    <h4 className="font-bold text-orange-800 text-sm mb-0.5">Quiz</h4>
                    <p className="text-[11px] text-slate-500">Go to Quiz Creator page</p>
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
                    <h4 className="font-bold text-red-700 text-sm mb-0.5">Assignment</h4>
                    <p className="text-[11px] text-slate-500">Go to Assignment Creator page</p>
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
                    <h4 className="font-bold text-emerald-800 text-sm mb-0.5">Reading Material</h4>
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
                    <h4 className="font-bold text-slate-700 text-sm mb-0.5">External Resource</h4>
                    <p className="text-[11px] text-slate-500">YouTube video or website</p>
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
      <div className="space-y-6">
        <div className="p-6 pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 bg-blue-600 text-white rounded-lg px-4 py-2 mt-[-24px] mx-[-24px]">
            Enrollment Settings
          </h3>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700">Enrollment Type</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border ${enrollmentType === "Open" ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-white hover:bg-slate-50"} rounded-xl p-4 flex items-start gap-3 cursor-pointer`}
                onClick={() => setEnrollmentType("Open")}
              >
                <div className={`w-5 h-5 rounded-full ${enrollmentType === "Open" ? "border-[5px] border-blue-500 bg-white" : "border-2 border-slate-200 bg-white"} shrink-0 mt-0.5`}></div>
                <div>
                  <h5 className={`font-bold ${enrollmentType === "Open" ? "text-blue-700" : "text-slate-700"} text-sm`}>Open Enrollment</h5>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Any student can self-enroll</p>
                </div>
              </div>
              <div
                className={`border ${enrollmentType === "Restricted" ? "border-blue-500 bg-blue-50/30" : "border-slate-200 bg-white hover:bg-slate-50"} rounded-xl p-4 flex items-start gap-3 cursor-pointer transition`}
                onClick={() => setEnrollmentType("Restricted")}
              >
                <div className={`w-5 h-5 rounded-full ${enrollmentType === "Restricted" ? "border-[5px] border-blue-500 bg-white" : "border-2 border-slate-200 bg-white"} shrink-0 mt-0.5`}></div>
                <div>
                  <h5 className={`font-bold ${enrollmentType === "Restricted" ? "text-blue-700" : "text-slate-700"} text-sm`}>Restricted</h5>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Lecturer approves each student</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pb-2 border-b border-slate-100">
          <div className="space-y-4 mb-4">
            <h4 className="text-sm font-bold text-slate-700">Course Visibility</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border ${status === "Published" ? "border-blue-400 bg-blue-50/20" : "border-slate-200 bg-white hover:bg-slate-50"} rounded-xl p-4 flex items-start gap-3 cursor-pointer`}
                onClick={() => setStatus("Published")}
              >
                <div className="text-lg shrink-0 mt-[-2px]">👁️</div>
                <div>
                  <h5 className={`font-bold ${status === "Published" ? "text-blue-600" : "text-slate-700"} text-sm`}>Published</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Visible to all enrolled students</p>
                </div>
              </div>
              <div
                className={`border ${status === "Draft" ? "border-blue-400 bg-blue-50/20" : "border-slate-200 bg-white hover:bg-slate-50"} rounded-xl p-4 flex items-start gap-3 cursor-pointer`}
                onClick={() => setStatus("Draft")}
              >
                <div className="text-lg shrink-0 mt-[-2px]">📝</div>
                <div>
                  <h5 className={`font-bold ${status === "Draft" ? "text-blue-600" : "text-slate-700"} text-sm`}>Draft</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Only visible to you (not published)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pb-6 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-700 mb-4">Completion Requirements</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <span className="text-sm text-slate-700 font-medium">Minimum lesson watch %</span>
              <div className="bg-white border border-slate-200 rounded-md px-3 py-1 flex items-center gap-2">
                <input
                  type="number"
                  value={minLessonWatchPercent}
                  onChange={(e) => setMinLessonWatchPercent(Number(e.target.value))}
                  className="w-12 outline-none font-bold text-sm text-slate-800 bg-transparent text-right"
                />
                <span className="text-slate-400 text-xs">%</span>
              </div>
            </div>
            <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <span className="text-sm text-slate-700 font-medium">Minimum quiz pass score</span>
              <div className="bg-white border border-slate-200 rounded-md px-3 py-1 flex items-center gap-2">
                <input
                  type="number"
                  value={minQuizPassScore}
                  onChange={(e) => setMinQuizPassScore(Number(e.target.value))}
                  className="w-12 outline-none font-bold text-sm text-slate-800 bg-transparent text-right"
                />
                <span className="text-slate-400 text-xs">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="flex flex-col lg:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-2">
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">⭐ Points System</h3>
          <div className="p-5 space-y-4">
            {[
              { key: "lesson", icon: "📖", title: "Complete Lesson", subtitle: "Finish a video lesson" },
              { key: "quiz", icon: "📝", title: "Pass Quiz", subtitle: "Score at or above pass threshold" },
              { key: "assignment", icon: "📎", title: "Submit Assignment", subtitle: "On-time submission" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors bg-white">
                <div className="flex gap-4 items-center">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <div>
                  <input
                    type="number"
                    value={(pointDefaults as any)[item.key]}
                    onChange={(e) => setPointDefaults({ ...pointDefaults, [item.key]: Number(e.target.value) })}
                    className="w-20 text-center font-bold text-blue-600 px-3 py-2 bg-white border border-blue-400 rounded-lg outline-none"
                  />
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-400 font-medium pt-4">
              These default points will be applied when you add new lessons in the Content tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 mt-2 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Create New Course</h2>
      </div>

      {renderProgressBar()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

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
          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-10 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center text-sm"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={loading}
              className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-sm disabled:opacity-50 text-sm"
            >
              {loading ? "Publishing..." : "🚀 Publish Course"}
            </button>
          )}
        </div>
      </div>

      {/* ── Rich Lesson Modal (shared UI with edit page) ── */}
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

            {/* Tab Navigation — only for video/reading */}
            {(modalType === "video" || modalType === "reading") && (
              <div className="flex gap-0 border-b border-slate-200 bg-white sticky top-[64px] z-10">
                {(
                  [
                    { id: "info", label: "📋 Lesson Info", count: null },
                    { id: "qr", label: "⭐ Engagement Check-ins", count: lessonQrMarkers.length },
                    { id: "questions", label: "❓ Questions", count: lessonQuestionMarkers.length },
                  ] as { id: "info" | "qr" | "questions"; label: string; count: number | null }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)}
                    className={`flex-1 px-4 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 ${
                      modalTab === tab.id
                        ? "border-blue-600 text-blue-700 bg-blue-50/50"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                    {tab.count !== null && tab.count > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          modalTab === tab.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                        }`}
                      >
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
                    <label className="block text-sm font-bold text-slate-700 mb-2">Lesson Title *</label>
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
                      <label className="block text-sm font-bold text-slate-700 mb-2">URL</label>
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
                  {(modalType === "video" || modalType === "reading") &&
                    (lessonQrMarkers.length > 0 || lessonQuestionMarkers.length > 0) && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setModalTab("qr")}
                          className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
                        >
                          <span className="text-amber-600 text-sm">⭐</span>
                          {lessonQrMarkers.length} Engagement Check-in{lessonQrMarkers.length !== 1 ? "s" : ""} configured
                          <span className="ml-auto text-amber-600">→</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalTab("questions")}
                          className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 hover:bg-blue-100 transition"
                        >
                          <HelpCircle className="w-4 h-4" />
                          {lessonQuestionMarkers.length} Question{lessonQuestionMarkers.length !== 1 ? "s" : ""} configured
                          <span className="ml-auto text-blue-600">→</span>
                        </button>
                      </div>
                    )}
                </>
              )}

              {/* ── TAB 2: ENGAGEMENT CHECK-INS ── */}
              {modalTab === "qr" && (modalType === "video" || modalType === "reading") && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-1">
                      <span className="text-amber-600">⭐</span> Engagement & Rating Check-in Markers
                    </h4>
                    <p className="text-xs text-amber-700 font-medium">
                      {modalType === "video"
                        ? "Interactive feedback prompts pop up at specific video timestamps. Students rate or give quick feedback to earn points!"
                        : "Rating prompts appear when students reach specific scroll positions while reading."}
                    </p>
                  </div>

                  {lessonQrMarkers.length > 0 ? (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Configured Check-ins ({lessonQrMarkers.length})
                      </h5>
                      {lessonQrMarkers.map((qr, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 text-amber-600 font-bold">
                              ⭐
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800">{qr.label || "Interactive Check-in"}</div>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {modalType === "video" ? "⏰" : "📍"} {qr.timestamp}{modalType === "video" ? "s" : "% scroll"}
                                </span>
                                <span className="text-[10px] font-bold text-amber-600">+{qr.points} pts</span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" /> {qr.timerSeconds || 30}s timer
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setLessonQrMarkers(lessonQrMarkers.filter((_, i) => i !== idx))}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"
                            title="Remove Check-in Marker"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
                      No engagement check-in markers added yet. Add one below.
                    </div>
                  )}

                  {/* Add New Engagement Marker Form */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Add New Engagement Check-in</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                          {modalType === "video" ? "Timestamp (seconds)" : "Scroll Position (%)"}
                        </label>
                        <input
                          type="number"
                          placeholder={modalType === "video" ? "e.g. 30" : "e.g. 50"}
                          value={newQrTime}
                          onChange={(e) => setNewQrTime(Number(e.target.value))}
                          min={0}
                          max={modalType === "reading" ? 100 : undefined}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-amber-300 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Points Awarded</label>
                        <input
                          type="number"
                          placeholder="e.g. 15"
                          value={newQrPoints}
                          onChange={(e) => setNewQrPoints(Number(e.target.value))}
                          min={1}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-amber-300 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                        💬 Lecturer Question / Custom Prompt *
                      </label>
                      <input
                        type="text"
                        placeholder='e.g. "What did you think of this key concept?" or "Are you clear on this topic so far?"'
                        value={newQrLabel}
                        onChange={(e) => setNewQrLabel(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-amber-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Display Timer (seconds) — how long prompt stays visible
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="30"
                          value={newQrTimer}
                          onChange={(e) => setNewQrTimer(Number(e.target.value))}
                          min={10}
                          max={300}
                          className="w-32 p-2.5 border border-slate-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-amber-300 focus:outline-none"
                        />
                        <span className="text-xs text-slate-400 font-medium">seconds (auto-dismisses if un-answered)</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddQrMarker}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>⚡</span>
                      Add Engagement Check-in at {newQrTime}{modalType === "video" ? "s" : "%"}
                    </button>
                  </div>
                </div>
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

                  {lessonQuestionMarkers.length > 0 ? (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Configured Questions ({lessonQuestionMarkers.length})
                      </h5>
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
                                      className={`text-[10px] px-2 py-1 rounded-lg font-medium ${
                                        oIdx === q.correctOption
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
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                        Answer Options (click border to set correct)
                      </label>
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
                              className={`w-full p-2.5 border-2 rounded-lg text-xs font-medium bg-white focus:outline-none pr-8 ${
                                newQCorrect === oIdx
                                  ? "border-emerald-500 bg-emerald-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                              placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                            />
                            <button
                              type="button"
                              onClick={() => setNewQCorrect(oIdx)}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 transition ${
                                newQCorrect === oIdx
                                  ? "border-emerald-500 bg-emerald-500"
                                  : "border-slate-300 bg-white hover:border-emerald-400"
                              }`}
                              title={`Set Option ${String.fromCharCode(65 + oIdx)} as correct`}
                            >
                              {newQCorrect === oIdx && (
                                <span className="text-white text-[8px] font-bold flex items-center justify-center h-full">✓</span>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">
                        Click the circle ○ on the right to mark the correct answer (shown in green).
                      </p>
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
            </div>

            {/* Modal Footer */}
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
                {uploadingLesson ? "Uploading..." : editingLessonIdx !== null ? "Save Changes" : "Add Content"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
