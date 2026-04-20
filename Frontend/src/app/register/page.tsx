"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, Lock, Building2 } from 'lucide-react';
import { RoleSelector, Role } from '@/components/ui/RoleSelector';
import { AuthInput } from '@/components/ui/AuthInput';

export default function Register() {
  const [role, setRole] = useState<Role>('Student');
  const [department, setDepartment] = useState('');
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${role.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen register-bg flex items-center justify-center p-4 ">
      <div className="w-full max-w-[480px] bg-white rounded-3xl overflow-hidden shadow-2xl my-8">

        {/* Header Block */}
        <div className="bg-[#3B82F6] text-center pt-8 pb-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800/10 rounded-2xl flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shadow-inner">
              <GraduationCap className="text-blue-100 w-8 h-8" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-white text-3xl font-medium tracking-tight mb-1">Create Account</h1>
          <p className="text-blue-100/90 text-xs font-medium">Join the EduQuest community</p>
        </div>

        {/* Content Block */}
        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-5">

            <div className="flex gap-4">
              <AuthInput
                id="firstName"
                label="First name"
                placeholder="Kavitha"
                className="flex-1"
                required
              />
              <AuthInput
                id="lastName"
                label="Last name"
                placeholder="Perera"
                className="flex-1"
                required
              />
            </div>

            <AuthInput
              id="email"
              type="email"
              label="Email address"
              icon={Mail}
              placeholder="you@university.lk"
              required
            />

            <AuthInput
              id="institution"
              label="University / Institution"
              icon={Building2}
              placeholder="NSBM Green University"
              required
            />

            <AuthInput
              id="studentId"
              label="Index Number / Student ID"
              placeholder="CSC/21/001"
              required
            />

            <div>
              <label htmlFor="department" className="block text-xs font-medium text-slate-500 mb-1">Department</label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm text-slate-800 appearance-none"
                required
              >
                <option value="" disabled>Select department</option>
                <option value="computing">Faculty of Computing — Computing</option>
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
              required
            />

            <AuthInput
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              icon={Lock}
              placeholder="••••••••"
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
            Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-700">Sign in →</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
