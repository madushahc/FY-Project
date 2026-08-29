"use client";

import { useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/forgot-password",
        { email }
      );

      const token = response.data?.token;
      if (token) {
        setSuccess("Account verified. Redirecting to reset password page...");
        setTimeout(() => {
          router.push(`/reset-password?token=${token}`);
        }, 1500);
      } else {
        setSuccess(
          response.data.message ||
          "If an account exists with that email, we have sent a link to reset your password."
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
            Reset Your Password
          </p>
        </div>

        {/* Content Block */}
        <div className="p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-emerald-500" strokeWidth={1.5} />
              </div>
              <h2 className="text-slate-800 text-xl font-semibold mb-2">Checking Your Email</h2>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                {success}
              </p>
              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Enter the email address associated with your account, and redirecting for reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg text-center">
                    {error}
                  </div>
                )}
                <AuthInput
                  id="email"
                  type="email"
                  label="Email address"
                  icon={Mail}
                  placeholder="you@university.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting" : "Submit"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
