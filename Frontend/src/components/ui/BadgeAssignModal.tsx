import React from 'react';
import { X } from 'lucide-react';

interface BadgeAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BadgeAssignModal: React.FC<BadgeAssignModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const icons = ['🏆', '⚡', '🔥', '🧠', '🌟', '💎', '🎯', '🚀', '💪', '🎓', '👑', '⭐'];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[700px] h-[90vh] flex flex-col rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🏅</span> Create New Badge
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Badge Icon */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Badge Icon</label>
            <p className="text-xs text-slate-400 font-medium mb-3">Choose an emoji or upload a custom icon:</p>
            <div className="flex flex-wrap gap-2">
              {icons.map((icon, i) => (
                <button 
                  key={i}
                  className={`w-11 h-11 flex items-center justify-center text-xl rounded-xl border ${i === 0 ? 'border-blue-500 bg-blue-50 shadow-[0_0_0_2px_rgba(59,130,246,0.2)]' : 'border-slate-200 bg-white hover:bg-slate-50'} transition-all`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Badge Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Badge Name *</label>
            <input 
              type="text" 
              defaultValue="Quiz Champion"
              className="w-full px-4 py-3 bg-white border border-blue-500 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea 
              rows={3} 
              defaultValue="Awarded for passing 5 quizzes with a score of 80% or higher."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-shadow"
            ></textarea>
          </div>

          {/* Badge Category */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Badge Category</label>
            <div className="grid grid-cols-4 gap-3">
              {['Academic', 'Engagement', 'Streak', 'Achievement'].map((cat, i) => (
                <button 
                  key={i} 
                  className={`py-2 rounded-xl text-sm font-bold border transition-colors ${i === 0 ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Award Criteria Block */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Award Criteria</label>
            <div className="bg-[#F8FAFC] border border-blue-100 rounded-xl p-5">
              <div className="flex items-end gap-3 mb-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Trigger Event</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none">
                    <option>Quiz Passed</option>
                  </select>
                </div>
                <div className="flexitems-end gap-2 pb-[10px]">
                  <span className="text-slate-300">|</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Threshold Value</label>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="5" className="w-16 text-center font-bold px-3 py-2.5 bg-white border border-blue-500 rounded-lg text-sm text-blue-600 focus:outline-none" />
                    <span className="text-sm font-medium text-slate-600">quizzes at</span>
                    <input type="text" defaultValue="80" className="w-16 text-center font-bold px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none" />
                    <span className="text-sm font-medium text-slate-600">%+ score required</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs font-medium text-blue-500 mt-2">
                This badge auto-awards when conditions are met.
              </p>
            </div>
          </div>

          {/* Points Bonus */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Points Bonus</label>
            <div className="flex items-center gap-3">
              <input type="text" defaultValue="25" className="w-32 px-4 py-2.5 font-bold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
              <span className="text-sm font-medium text-slate-400">bonus XP awarded when badge is earned</span>
            </div>
          </div>

          {/* Badge Visibility */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Badge Visibility</label>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <label className="flex items-center gap-3 p-4 border border-blue-500 rounded-xl bg-blue-50/50 cursor-pointer">
                <input type="radio" name="visibility" className="w-4 h-4 text-blue-600" defaultChecked />
                <span className="text-sm font-bold text-blue-700">Visible to student</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition cursor-pointer">
                <input type="radio" name="visibility" className="w-4 h-4 text-slate-300" />
                <span className="text-sm font-bold text-slate-500">Hidden (surprise)</span>
              </label>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-600 text-center">
                Preview: Students will see this badge in their gallery with a gold glow effect when earned.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Fixed */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-between shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition">
            Cancel
          </button>
          <div className="flex gap-2">
            <button className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition">
              Save as Draft
            </button>
            <button className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition shadow-md shadow-blue-500/20 flex items-center gap-2">
              Create Badge <span className="text-lg leading-none">→</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
