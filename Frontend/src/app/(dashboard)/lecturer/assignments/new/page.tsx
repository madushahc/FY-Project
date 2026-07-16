"use client";

import React, { useState, useEffect } from "react";
import { Link as LinkIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCourseStore } from "@/store/useCourseStore";
import api from "@/lib/api";

const getCurrentDateTimeString = (offsetDays = 0) => {
  const date = new Date();
  if (offsetDays) {
    date.setDate(date.getDate() + offsetDays);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function AddAssignment() {
  const router = useRouter();
  const { myCourses, fetchMyCreatedCourses, uploadFile } = useCourseStore();

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [instructions, setInstructions] = useState("");
  const [points, setPoints] = useState("100");
  const [deadline, setDeadline] = useState(getCurrentDateTimeString(1));
  const [penalty, setPenalty] = useState("0");
  const [referenceMaterials, setReferenceMaterials] = useState<
    { name: string; url: string }[]
  >([]);
  const [rubricItems, setRubricItems] = useState([
    { criteria: "Correct Class Identification", points: "25" },
    { criteria: "Attributes & Methods", points: "20" },
    { criteria: "Relationships & Multiplicity", points: "25" },
    { criteria: "UML Notation & Formatting", points: "10" },
  ]);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    fetchMyCreatedCourses();
  }, [fetchMyCreatedCourses]);

  const handleReferenceFilesUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploadingFiles(true);
    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          url: await uploadFile(file),
        })),
      );

      setReferenceMaterials((current) => [...current, ...uploadedFiles]);
    } catch (error) {
      console.error("Failed to upload reference files", error);
      alert("Failed to upload one or more files.");
    } finally {
      setUploadingFiles(false);
      event.target.value = "";
    }
  };

  const handlePublish = async () => {
    if (!title || !course || !instructions || !deadline) {
      alert("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      const rubricData = rubricItems
        .map((item) => ({
          criteria: item.criteria.trim(),
          points: Number(item.points),
        }))
        .filter((item) => item.criteria && !Number.isNaN(item.points));

      if (rubricData.length === 0) {
        alert("Please add at least one valid rubric item.");
        setLoading(false);
        return;
      }

      await api.post("/assignments", {
        title,
        course,
        instructions,
        points: Number(points),
        deadline: new Date(deadline),
        latePenaltyPercent: Number(penalty),
        referenceMaterials: referenceMaterials.map((item) => item.url),
        rubric: rubricData,
        isPublished: true,
      });
      alert("Assignment published successfully!");
      router.push("/lecturer/activities");
    } catch (err) {
      console.error("Failed to publish assignment", err);
      alert("Failed to publish assignment.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-20 mt-2 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          Add Assignment
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
        <div>
          <label
            htmlFor="assignment-title"
            className="block text-sm font-bold text-slate-800 mb-2"
          >
            Assignment Title *
          </label>
          <input
            id="assignment-title"
            name="title"
            type="text"
            placeholder="Enter assignment title (e.g. UML Class Diagram)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-sm font-medium shadow-sm bg-white relative z-10"
          />
        </div>

        <div>
          <label
            htmlFor="assignment-course"
            className="block text-sm font-bold text-slate-800 mb-2"
          >
            Select Course *
          </label>
          <select
            id="assignment-course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-sm font-medium shadow-sm bg-white"
          >
            <option value="">Select a course...</option>
            {myCourses.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="space-y-8">
          {/* Instructions */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Assignment Instructions *
            </label>
            <textarea
              rows={5}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Design a comprehensive class diagram..."
              className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-sm font-medium resize-none shadow-sm"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Points Value *
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Submission Deadline *
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Late Submission Penalty (%)
              </label>
              <input
                type="number"
                value={penalty}
                onChange={(e) => setPenalty(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Submission Type
              </label>
              <input
                type="text"
                defaultValue="File Upload (PDF, DOCX, ZIP)"
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-slate-700 shadow-sm"
              />
            </div>
          </div>

          {/* Reference Materials */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Reference Materials (optional)
            </label>
            <div className="space-y-3">
              <label className="relative flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-4 text-sm text-slate-500 hover:border-blue-400 hover:bg-blue-50/40 transition">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                <span>
                  {uploadingFiles
                    ? "Uploading files..."
                    : "Upload reference PDFs, starter files, or rubric docs"}
                </span>
                <input
                  type="file"
                  multiple
                  onChange={handleReferenceFilesUpload}
                  className="sr-only"
                  accept=".pdf,.doc,.docx,.txt,.zip,.png,.jpg,.jpeg"
                  disabled={uploadingFiles}
                />
              </label>
              <input
                type="text"
                placeholder="Uploaded files will appear below"
                readOnly
                value={
                  referenceMaterials.length
                    ? `${referenceMaterials.length} file(s) uploaded`
                    : "No files uploaded yet"
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none text-sm text-slate-500 bg-slate-50/50 shadow-sm"
              />
              <div className="text-[10px] text-slate-400 mt-1 pl-1">
                Max file size: 50MB
              </div>
              {referenceMaterials.length > 0 && (
                <div className="space-y-2 pt-1">
                  {referenceMaterials.map((file, index) => (
                    <div
                      key={`${file.url}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {file.name}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {file.url}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setReferenceMaterials((current) =>
                            current.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          )
                        }
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grading Rubric */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-4">
              Grading Rubric
            </label>
            <div className="space-y-3">
              {rubricItems.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-3 items-center p-4 border border-slate-200 rounded-xl bg-slate-50/50 shadow-sm"
                >
                  <input
                    type="text"
                    value={r.criteria}
                    onChange={(e) =>
                      setRubricItems((current) =>
                        current.map((item, index) =>
                          index === i
                            ? { ...item, criteria: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500"
                    placeholder="Rubric criterion"
                  />
                  <input
                    type="number"
                    min="0"
                    value={r.points}
                    onChange={(e) =>
                      setRubricItems((current) =>
                        current.map((item, index) =>
                          index === i
                            ? { ...item, points: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500"
                    placeholder="Points"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setRubricItems((current) =>
                        current.filter((_, index) => index !== i),
                      )
                    }
                    className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-40"
                    disabled={rubricItems.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setRubricItems((current) => [
                  ...current,
                  { criteria: "", points: "0" },
                ])
              }
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              + Add rubric item
            </button>
          </div>

          <div className="flex justify-end gap-4   border-t border-slate-100">
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-sm disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Assignment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
