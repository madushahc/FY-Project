"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, Building2 } from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [university, setUniversity] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          email,
          password,
          department,
          university,
        },
      );

      // Save token locally
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      router.push("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen register-bg flex items-center justify-center p-4  ">
      <div className="w-full max-w-[480px] bg-white rounded-3xl overflow-hidden shadow-2xl my-8 ">
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
            Create Account
          </h1>
          <p className="text-blue-100/90 text-xs font-medium">
            Join the EduQuest community
          </p>
        </div>

        {/* Content Block */}
        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-5 ">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg text-center">
                {error}
              </div>
            )}
            <div className="flex gap-4">
              <AuthInput
                id="firstName"
                label="First name"
                placeholder="Kavitha"
                className="flex-1"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <AuthInput
                id="lastName"
                label="Last name"
                placeholder="Perera"
                className="flex-1"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

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

            <AuthInput
              id="institution"
              label="University / Institution"
              icon={Building2}
              placeholder="NSBM Green University"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              required
            />

            <div>
              <label
                htmlFor="department"
                className="block text-xs font-medium text-slate-500 mb-1"
              >
                Department
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm text-slate-800 appearance-none"
                required
              >
                <option value="" disabled>
                  Select department
                </option>
                <option value="computing">
                  Faculty of Computing — Computing
                </option>
                <option value="business">Faculty of Business</option>
                <option value="engineering">Faculty of Engineering</option>
              </select>
            </div>

            <AuthInput
              id="password"
              type="password"
              label="Password"
              icon={Lock}
              placeholder="•••••••• (min. 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <AuthInput
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              icon={Lock}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="terms"
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-xs text-slate-500">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button type="submit" className="btn-primary mt-2">
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700">
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
