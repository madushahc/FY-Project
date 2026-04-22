import React from 'react';
import { X, CloudUpload, FileText } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[600px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📎</span> Submit Assignment
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          
          {/* Metadata */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-0.5">Course:</p>
            <h3 className="text-slate-800 font-medium">Software Engineering Assignment 2 — UML Class Diagram</h3>
            <p className="text-sm text-slate-500 mt-0.5">Due: Today 11:59 PM • Points: +80</p>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50/50 transition cursor-pointer">
            <CloudUpload className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-slate-700 font-medium mb-1">Drag & drop your file here</p>
            <p className="text-blue-600 text-sm font-medium mb-2">or click to browse</p>
            <p className="text-xs text-slate-400 font-medium">PDF, DOCX, ZIP · Max 25MB</p>
          </div>

          {/* Attached File Row */}
          <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">UML_Class_Diagram_SE_Assignment2.pdf</p>
                <p className="text-xs text-slate-500">2.4 MB · PDF · Ready to upload</p>
              </div>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alert Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4">
            <p className="text-sm font-medium text-blue-800 mb-0.5">On-time submission bonus:</p>
            <p className="text-sm text-blue-600">+80 pts + 🎯 "On Target" badge progress (3/5)</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes to instructor (optional):</label>
            <textarea 
              rows={3} 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-shadow placeholder:text-slate-400"
              placeholder="Add any comments or notes about your submission..."
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition">
              Cancel
            </button>
            <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition shadow-md shadow-blue-500/20 text-center">
              Submit Assignment → +80 pts
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
