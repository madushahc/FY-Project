"use client";

import { useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { GraduationCap, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Reset token is missing from the URL.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          token,
          password,
        }
      );

      setSuccess(response.data.message || "Your password has been successfully reset.");

      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Failed to reset password. The token may be invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-4">
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg text-center mb-6">
          Invalid request. No password reset token was provided.
        </div>
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      {success ? (
        <div className="text-center py-4">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" strokeWidth={1.5} />
          </div>
          <h2 className="text-slate-800 text-xl font-semibold mb-2">Password Reset Successful</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            {success} Redirecting to login in a few seconds...
          </p>
          <div className="mt-8">
            <Link
              href="/login"
              className="btn-primary inline-block text-center"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Please enter your new password below. Ensure it is secure.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg text-center">
                {error}
              </div>
            )}
            <AuthInput
              id="password"
              type="password"
              label="New Password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <AuthInput
              id="confirmPassword"
              type="password"
              label="Confirm New Password"
              icon={Lock}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen login-bg flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Header Block */}
        <div className="bg-[#3B82F6] text-center pt-8 pb-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800/10 rounded-2xl flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shadow-inner">
              <GraduationCap
                className="text-blue-100 w-8 h-8"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <h1 className="text-white text-3xl font-medium tracking-tight mb-1">
            EduQuest
          </h1>
          <p className="text-blue-100/90 text-xs font-medium">
            Setup New Password
          </p>
        </div>

        {/* Content Block */}
        <div className="p-8">
          <Suspense fallback={<div className="text-center py-8 text-slate-500 text-sm">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
