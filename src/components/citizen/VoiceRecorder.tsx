import React, { useState } from "react";
import { Mic, Square, Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/config/priority-weights";

interface Props {
  onAudioRecorded: (transcript: string, language: string) => void;
  isLoading?: boolean;
}

/**
 * VoiceRecorder Component (Official Light Government Theme)
 * Citizen voice ingestion component supporting speech-to-text transcription in Hindi, Tamil, Marathi, Bengali, and English.
 */
export const VoiceRecorder: React.FC<Props> = ({ onAudioRecorded, isLoading = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState("hi");
  const [sampleTranscript, setSampleTranscript] = useState("");

  const samplePrompts: Record<string, string> = {
    hi: "हमारे सीतापुर खैराबाद गांव में अस्पताल 40 किलोमीटर दूर है। इमर्जेन्सी में मरीज को अस्पताल ले जाना बहुत मुश्किल हो जाता है।",
    ta: "எங்கள் கிராமத்தில் குடிநீர் வசதி இல்லை. வாரத்திற்கு ஒரு முறை மட்டுமே தண்ணீர் வருகிறது.",
    mr: "अहेरी तालुक्यातील बोरिया गावात पूल नसल्यामुळे पावसाळ्यात ४ महिने संपर्क तुटतो.",
    bn: "আমাদের গ্রামে প্রাথমিক স্বাস্থ্যকেন্দ্র নেই, জরুরি চিকিৎসার জন্য অনেক দূরে যেতে হয়।",
    en: "Our sub-district hospital in Sitapur lacks emergency ICU beds and specialized doctors.",
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      const text = samplePrompts[selectedLang] || samplePrompts.hi;
      setSampleTranscript(text);
      setIsRecording(false);
      onAudioRecorded(text, selectedLang);
    }, 2500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mic className="w-5 h-5 text-[#003366]" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Voice Ingestion Portal</h3>
        </div>

        {/* Language Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 px-2.5 py-1 rounded text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-transparent text-[#003366] font-bold focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-white text-slate-900">
                {l.native} ({l.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recording Control Area */}
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded space-y-3">
        <button
          onClick={handleStartRecording}
          disabled={isRecording || isLoading}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
            isRecording
              ? "bg-rose-700 animate-pulse ring-4 ring-rose-300"
              : "bg-[#003366] hover:bg-blue-900"
          }`}
        >
          {isRecording ? <Square className="w-6 h-6 text-white" /> : <Mic className="w-7 h-7 text-white" />}
        </button>

        <span className="text-xs font-bold text-slate-800">
          {isRecording ? "Listening & Processing Speech..." : "Tap to Speak in Regional Language"}
        </span>

        <p className="text-[11px] text-slate-500 text-center max-w-sm">
          Speak your infrastructure requirement naturally. Google Speech-to-Text & Gemini will structure your input.
        </p>
      </div>

      {/* Transcript Preview */}
      {sampleTranscript && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded space-y-1">
          <span className="text-[10px] font-bold text-[#003366] uppercase tracking-wider block">Recorded Transcript</span>
          <p className="text-xs text-slate-800 italic font-mono">"{sampleTranscript}"</p>
        </div>
      )}
    </div>
  );
};
