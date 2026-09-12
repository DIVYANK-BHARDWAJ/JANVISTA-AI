import React, { useState } from "react";
import { PolicyQueryResult } from "@/types";
import { DataClassificationBadge } from "../ui/DataClassificationBadge";
import { Sparkles, Send, FileText, BarChart3 } from "lucide-react";

/**
 * AskJanvistaView Component (Neutral Slate Theme - No Blue)
 * Natural-language policy intelligence interface grounded strictly in stored application facts and analytical outputs.
 */
export const AskJanvistaView: React.FC = () => {
  const [question, setQuestion] = useState("Why is Sitapur ranked first for healthcare?");
  const [result, setResult] = useState<PolicyQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    "Why is Sitapur ranked first for healthcare?",
    "Which districts have high demand but low infrastructure coverage?",
    "Show healthcare gap index for Sitapur versus Muzaffarpur.",
  ];

  const handleQuery = async (q: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/policy/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (e) {
      console.error("Ask JANVISTA query failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">ASK JANVISTA — POLICY INTELLIGENCE</h2>
          <p className="text-xs text-slate-600">Natural-language grounded RAG pipeline distinguishing facts, model outputs, and generative explanations</p>
        </div>
        <DataClassificationBadge classification="MODEL_OUTPUT" />
      </div>

      {/* Query Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a policy question (e.g. Why is Sitapur ranked first?)"
            className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 rounded p-3 text-xs focus:outline-none focus:border-slate-800"
          />
          <button
            onClick={() => handleQuery(question)}
            disabled={isLoading || !question.trim()}
            className="px-5 py-3 rounded text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
          >
            {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Ask JANVISTA</span>
          </button>
        </div>

        {/* Sample Question Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-bold text-[11px]">Suggested Queries:</span>
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(sq);
                handleQuery(sq);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded text-[11px] font-semibold border border-slate-300 transition"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Output Section */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2 text-slate-900">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Grounded Policy Synthesis</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">{new Date(result.timestamp).toLocaleTimeString()}</span>
          </div>

          {/* Generative Explanation Box */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
            <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">
              Generative Explanation (Grounded Gemini Response)
            </span>
            <p className="text-xs text-slate-900 leading-relaxed font-sans">{result.generativeExplanation}</p>
          </div>

          {/* Explicit Multi-Dimensional Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Fact Cards */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Observed Facts (Retrieved Records)</span>
              </span>

              <ul className="space-y-1.5 text-slate-800 text-[11px]">
                {result.retrievedFacts.map((f, i) => (
                  <li key={i} className="border-b border-slate-200 pb-1.5">
                    <strong className="text-slate-900 font-bold">{f.title}: </strong>{f.content}
                  </li>
                ))}
              </ul>
            </div>

            {/* Model Outputs */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2">
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Calculated Model Outputs (Priority Engine v1.0.0)</span>
              </span>

              <ul className="space-y-1.5 text-slate-800 text-[11px]">
                {result.modelOutputs.map((m, i) => (
                  <li key={i} className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-600 font-medium">{m.title}</span>
                    <strong className="text-slate-900 font-bold">{m.score}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
