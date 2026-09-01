"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Sparkles, HelpCircle } from "lucide-react";

export interface IMatchingPair {
  term: string;
  definition: string;
}

interface Props {
  pairs: IMatchingPair[];
  onVerify: (matches: Record<string, string>, timeTakenSecs: number) => void;
  isSubmitting?: boolean;
  explanation?: string;
  feedback?: {
    isCorrect: boolean;
    explanation?: string;
    pointsAwarded?: number;
    attempts?: number;
  } | null;
  onRetry?: () => void;
}

export default function TermMatchingTask({
  pairs = [],
  onVerify,
  isSubmitting = false,
  explanation = "",
  feedback = null,
  onRetry
}: Props) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [userMatches, setUserMatches] = useState<Record<string, string>>({});
  const [shuffledDefs, setShuffledDefs] = useState<string[]>([]);
  const [startTime] = useState<number>(() => Date.now());

  // Shuffle definitions on load
  useEffect(() => {
    if (pairs && pairs.length > 0) {
      const defs = pairs.map(p => p.definition);
      // Fisher-Yates shuffle
      const shuffled = [...defs];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledDefs(shuffled);
    }
  }, [pairs]);

  const handleSelectTerm = (term: string) => {
    if (feedback?.isCorrect) return;
    setSelectedTerm(term);
  };

  const handleSelectDefinition = (def: string) => {
    if (!selectedTerm || feedback?.isCorrect) return;
    setUserMatches(prev => ({
      ...prev,
      [selectedTerm]: def
    }));
    setSelectedTerm(null);
  };

  const handleClearPair = (term: string) => {
    if (feedback?.isCorrect) return;
    setUserMatches(prev => {
      const copy = { ...prev };
      delete copy[term];
      return copy;
    });
  };

  const handleSubmit = () => {
    const elapsedSecs = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    onVerify(userMatches, elapsedSecs);
  };

  const isAllMatched = pairs.length > 0 && pairs.every(p => Boolean(userMatches[p.term]));

  return (
    <div className="space-y-4 text-left">
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Task: Click a term on the left, then click its matching definition on the right!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left: Terms */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Key Terms</span>
          {pairs.map((p, idx) => {
            const isSelected = selectedTerm === p.term;
            const matchedDef = userMatches[p.term];
            return (
              <div
                key={idx}
                onClick={() => handleSelectTerm(p.term)}
                className={`p-3 rounded-xl border transition cursor-pointer text-xs font-semibold ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300"
                    : matchedDef
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{p.term}</span>
                  {matchedDef && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearPair(p.term);
                      }}
                      className="text-[10px] text-emerald-600 hover:text-red-500 underline ml-2 font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {matchedDef && (
                  <div className="mt-1 text-[11px] font-normal text-emerald-700 bg-emerald-100/60 p-1.5 rounded">
                    ↳ {matchedDef}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Definitions */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Definitions</span>
          {shuffledDefs.map((def, idx) => {
            const assignedTerm = Object.keys(userMatches).find(t => userMatches[t] === def);
            return (
              <div
                key={idx}
                onClick={() => handleSelectDefinition(def)}
                className={`p-3 rounded-xl border transition text-xs font-medium ${
                  selectedTerm
                    ? "cursor-pointer hover:bg-blue-50 border-blue-300 bg-blue-50/30"
                    : assignedTerm
                    ? "bg-slate-100 text-slate-600 border-slate-200"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                <span>{def}</span>
                {assignedTerm && (
                  <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                    Matched with: {assignedTerm}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border flex items-start gap-3 ${
            feedback.isCorrect
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          {feedback.isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 flex-1">
            <p className="font-bold text-sm">
              {feedback.isCorrect ? "Perfect Match! All terms matched correctly." : "Incorrect matching! Please check your pairs and try again."}
            </p>
            {feedback.explanation && <p className="text-slate-600">{feedback.explanation}</p>}
            {feedback.attempts && (
              <p className="text-[11px] text-slate-500 font-bold">Attempts taken: {feedback.attempts}</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        {feedback && !feedback.isCorrect && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        )}
        {!feedback?.isCorrect && (
          <button
            type="button"
            disabled={!isAllMatched || isSubmitting}
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Verify Term Matches"}
          </button>
        )}
      </div>
    </div>
  );
}
