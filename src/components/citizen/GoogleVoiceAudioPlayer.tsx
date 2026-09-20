import React, { useState } from "react";
import { Volume2, Play, Square, Sparkles } from "lucide-react";
import { speakGoogleVoiceConfirmation } from "@/lib/ai/google-speech";

interface Props {
  trackingId: string;
  locationName: string;
  language: string;
  messageText: string;
}

export const GoogleVoiceAudioPlayer: React.FC<Props> = ({
  trackingId,
  locationName,
  language,
  messageText,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVoice = () => {
    setIsPlaying(true);
    speakGoogleVoiceConfirmation(trackingId, locationName, language);
    setTimeout(() => {
      setIsPlaying(false);
    }, 6000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-4 rounded-lg shadow-md space-y-3 border border-blue-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Google AI Voice Confirmation Response
            </h4>
            <span className="text-[10px] text-blue-300 font-mono">
              Google Text-to-Speech Engine • {language.toUpperCase()}
            </span>
          </div>
        </div>

        <button
          onClick={handlePlayVoice}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow ${
            isPlaying
              ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Speaking...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Replay Voice Reply</span>
            </>
          )}
        </button>
      </div>

      {/* Animated Voice Equalizer Waveform */}
      <div className="flex items-center space-x-1 py-1 px-3 bg-blue-950/60 rounded border border-blue-800/80">
        <Volume2 className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
        <div className="flex items-center space-x-1 w-full h-4">
          {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 35, 75, 55, 85, 40].map((h, idx) => (
            <div
              key={idx}
              className={`flex-1 rounded-full transition-all duration-300 ${
                isPlaying ? "bg-amber-400 animate-pulse" : "bg-blue-600/50"
              }`}
              style={{ height: isPlaying ? `${Math.max(20, Math.round(h * Math.random()))}%` : "30%" }}
            />
          ))}
        </div>
      </div>

      {/* Voice Message Text */}
      <p className="text-xs italic text-blue-100 font-serif leading-relaxed bg-blue-950/40 p-2.5 rounded border border-blue-800/40">
        &quot;{messageText}&quot;
      </p>
    </div>
  );
};
