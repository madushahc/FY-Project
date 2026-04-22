import React from 'react';
import { X } from 'lucide-react';

interface QuickForumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickForumModal: React.FC<QuickForumModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[600px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>💬</span> New Discussion Post
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          
          {/* Post Title */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Post Title *</label>
            <input 
              type="text" 
              defaultValue="How does merge sort handle duplicate values?"
              className="w-full px-4 py-3 bg-white border-2 border-blue-500 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-shadow transition-colors" 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
            <div className="relative">
              <textarea 
                rows={6} 
                defaultValue="I am confused about how duplicate values are handled during the merge step.&#13;&#10;When I trace through the algorithm manually, the order seems to change.&#13;&#10;Can someone clarify this with an example?"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-shadow"
              ></textarea>
              <div className="absolute bottom-3 right-4 text-[11px] font-medium text-slate-400">
                420/1000
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition">
              Cancel
            </button>
            <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition shadow-md shadow-blue-500/20 text-center">
              Post to Forum (+5 pts)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
