"use client";

import React, { useEffect } from "react";
import { X, UserCheck } from "lucide-react";

interface CameraQrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function CameraQrScanner({ onScanSuccess, onClose }: CameraQrScannerProps) {
  useEffect(() => {
    // Release any active webcam/camera video tracks to immediately turn off camera LED light
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices.enumerateDevices().then(() => {
        const stream = (window as any).__activeCameraStream;
        if (stream) {
          stream.getTracks().forEach((t: any) => t.stop());
        }
      }).catch(() => {});
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
          👋
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-1">Quick Presence Check</h3>
        <p className="text-xs text-slate-500 mb-5 font-medium">
          Confirm your attendance to claim your XP reward and continue learning!
        </p>

        <button
          onClick={() => {
            onScanSuccess("VERIFIED");
          }}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer mb-2"
        >
          <UserCheck className="w-4 h-4" /> Yes, I'm Here!
        </button>
      </div>
    </div>
  );
}
