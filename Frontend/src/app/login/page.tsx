"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { RoleSelector, Role } from "@/components/ui/RoleSelector";
import { AuthInput } from "@/components/ui/AuthInput";

export default function Login() {
  const [role, setRole] = useState<Role>("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
          role,
        },
      );

      const actualRole = String(response.data.role || "").toLowerCase();
      const selectedRole = String(role).toLowerCase();

      if (actualRole !== selectedRole) {
        setError(
          `This account is registered as ${response.data.role}, not ${role}.`,
        );
        return;
      }

      // Save token (usually in secure cookie/localStorage)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      // Push to respective dashboard depending on returned role
      router.push(`/${String(response.data.role || "").toLowerCase()}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to sign in. Please check your credentials.",
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
            Gamified Learning Platform · Sri Lanka
          </p>
        </div>

        {/* Content Block */}
        <div className="p-8">
          <p className="text-slate-600 font-medium text-sm mb-4">Sign in as</p>

          <RoleSelector selectedRole={role} onChange={setRole} />

          <form onSubmit={handleLogin} className="space-y-5">
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

            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-500"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm text-slate-800 placeholder-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary mt-6">
              Sign in to EduQuest
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
