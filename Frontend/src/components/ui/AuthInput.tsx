import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  id: string;
}

export function AuthInput({ label, icon: Icon, id, className = '', ...props }: AuthInputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-medium text-slate-500 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <input
          id={id}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm text-slate-800 placeholder-slate-400`}
          {...props}
        />
      </div>
    </div>
  );
}
