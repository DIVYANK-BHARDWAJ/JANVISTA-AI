import React, { useState } from "react";
import { Send, FileText, Sparkles } from "lucide-react";

interface Props {
  onSubmitText: (text: string) => void;
  isLoading?: boolean;
}

/**
 * TextInput Component (Official Light Government Theme)
 * Allows citizens and district officers to express development needs in natural language text.
 */
export const TextInput: React.FC<Props> = ({ onSubmitText, isLoading = false }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmitText(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
      <div className="flex items-center space-x-2">
        <FileText className="w-5 h-5 text-[#003366]" />
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Natural Language Text Form</h3>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe the infrastructure requirement in your locality (e.g. Hospital distance in Sitapur Khairabad block, water shortage in Kadaladi...)"
        rows={3}
        className="w-full bg-slate-50 border border-slate-300 rounded p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#003366] transition resize-none font-sans"
      />

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-500">
          Gemini extracts category, location, urgency, and entities automatically.
        </span>

        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="flex items-center space-x-2 px-4 py-2 rounded text-xs font-bold text-white bg-[#003366] hover:bg-blue-900 disabled:opacity-50 transition shadow-sm"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Structuring Signal...</span>
            </>
          ) : (
            <>
              <span>Submit Signal</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
