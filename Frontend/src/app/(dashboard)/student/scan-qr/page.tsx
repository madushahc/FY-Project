"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QrCode, CheckCircle2, AlertCircle, Award, ArrowLeft, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";

function ScanQrContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const courseId = searchParams.get("courseId");
  const lessonId = searchParams.get("lessonId");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function processQrScan() {
      if (!code || !courseId || !lessonId) {
        setErrorMsg("Missing or invalid QR check-in parameters.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        const { data } = await api.post(`/courses/${courseId}/lessons/${lessonId}/qr-scan`, { code });

        setSuccess(true);
        setPointsAwarded(data.pointsAwarded || 15);

        // Refresh student gamification profile and points in store
        try {
          const { fetchUserProfile, fetchGamification } = useUserStore.getState();
          fetchUserProfile();
          fetchGamification();
        } catch (e) {}

      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || "Invalid or expired QR check-in code.");
      } finally {
        setLoading(false);
      }
    }

    processQrScan();
  }, [code, courseId, lessonId]);

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <QrCode className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">QR Code Check-In</h1>
          <p className="text-xs text-slate-500 font-medium">Verification via Smartphone Camera</p>
        </div>

        {loading ? (
          <div className="py-8 space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">Verifying check-in code...</p>
          </div>
        ) : success ? (
          <div className="py-6 space-y-4 animate-in fade-in">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50 shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800">Check-In Successful! 🎉</h2>
              <p className="text-sm text-emerald-600 font-bold">
                +{pointsAwarded} XP Points Awarded!
              </p>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Your attendance and interactive check-in have been verified and recorded in your course progress.
            </p>

            <button
              onClick={() => router.push(`/student/courses/${courseId}`)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Lesson
            </button>
          </div>
        ) : (
          <div className="py-6 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border-4 border-red-50">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-800">Verification Failed</h2>
              <p className="text-xs text-red-600 font-bold">{errorMsg}</p>
            </div>

            <button
              onClick={() => router.push(`/student/courses/${courseId || ""}`)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScanQrPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-slate-500">Loading scanner...</div>}>
      <ScanQrContent />
    </Suspense>
  );
}
