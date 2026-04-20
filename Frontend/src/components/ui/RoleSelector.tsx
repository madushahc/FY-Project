import React from 'react';

export type Role = 'Student' | 'Lecturer' | 'Admin';

interface RoleSelectorProps {
  selectedRole: Role;
  onChange: (role: Role) => void;
}

export function RoleSelector({ selectedRole, onChange }: RoleSelectorProps) {
  const roles: { id: Role; label: string; icon: string; activeColor: string; activeBg: string }[] = [
    { id: 'Student', label: 'Student', icon: '👨‍🎓', activeColor: 'text-blue-600', activeBg: 'border-blue-500 bg-blue-50/50' },
    { id: 'Lecturer', label: 'Lecturer', icon: '👨‍🏫', activeColor: 'text-blue-600', activeBg: 'border-blue-500 bg-blue-50/50' },
    { id: 'Admin', label: 'Admin', icon: '🛠️', activeColor: 'text-blue-600', activeBg: 'border-blue-500 bg-blue-50/50' },
  ];

  return (
    <div className="flex gap-4 mb-4">
      {roles.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => onChange(role.id)}
          className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center gap-1 border-2 transition-colors ${
            selectedRole === role.id ? role.activeBg : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-2xl">{role.icon}</span>
          <span className={`text-xs font-medium ${selectedRole === role.id ? role.activeColor : 'text-slate-500'}`}>
            {role.label}
          </span>
        </button>
      ))}
    </div>
  );
}
