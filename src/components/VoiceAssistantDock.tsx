import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  Send,
} from 'lucide-react';
import type { VoiceIntent } from '../types/dermatology.ts';

interface VoiceAssistantDockProps {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  lastResponse: string;
  errorMessage: string | null;
  onToggleListening: () => void;
  onStopSpeaking: () => void;
  onDispatchIntent: (intent: VoiceIntent) => void;
  onAskQuestion: (query: string) => void;
}

export const VoiceAssistantDock: React.FC<VoiceAssistantDockProps> = ({
  isListening,
  isSpeaking,
  transcript,
  lastResponse,
  errorMessage,
  onToggleListening,
  onStopSpeaking,
  onDispatchIntent,
  onAskQuestion,
}) => {
  const [typedQuestion, setTypedQuestion] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedQuestion.trim()) return;
    onAskQuestion(typedQuestion.trim());
    setTypedQuestion('');
  };

  return (
    <aside
      aria-label="Voice Navigation and Clinical Assistant"
      className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 border-t border-slate-800 backdrop-blur-lg shadow-2xl px-4 py-3"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Mic toggle & Voice status */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onToggleListening}
            className={`relative p-3 rounded-full transition-all shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse'
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/30'
            }`}
            aria-label={isListening ? 'Mute microphone' : 'Activate voice listening'}
          >
            {isListening ? (
              <Mic className="w-5 h-5 text-white animate-bounce" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Voice Assistant
              </span>
              {isListening && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                  Listening for commands...
                </span>
              )}
              {isSpeaking && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-spin" />
                  Speaking...
                </span>
              )}
            </div>

            {/* Live Transcript / Feedback */}
            <div className="text-xs text-slate-300 truncate max-w-md mt-0.5">
              {transcript ? (
                <span className="text-teal-200 italic font-mono">
                  &ldquo;{transcript}&rdquo;
                </span>
              ) : lastResponse ? (
                <span className="text-slate-300 line-clamp-1">{lastResponse}</span>
              ) : (
                <span className="text-slate-500">
                  Try saying &ldquo;Analyze image&rdquo;, &ldquo;Read report&rdquo;, or &ldquo;Load sample 1&rdquo;
                </span>
              )}
            </div>
          </div>

          {/* Stop audio button if speaking */}
          {isSpeaking && (
            <button
              onClick={onStopSpeaking}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 text-xs font-medium flex items-center gap-1 shrink-0"
              aria-label="Silence audio speech"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Voice</span>
            </button>
          )}
        </div>

        {/* Center: Quick Voice Action Buttons */}
        <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto max-w-full pb-1 md:pb-0">
          <button
            onClick={() => onDispatchIntent({ type: 'ANALYZE_IMAGE' })}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center gap-1 shrink-0 transition-colors"
          >
            <Play className="w-3 h-3 text-teal-400" />
            <span>&ldquo;Analyze&rdquo;</span>
          </button>
          <button
            onClick={() => onDispatchIntent({ type: 'READ_REPORT' })}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center gap-1 shrink-0 transition-colors"
          >
            <Volume2 className="w-3 h-3 text-cyan-400" />
            <span>&ldquo;Read Report&rdquo;</span>
          </button>
          <button
            onClick={() => onDispatchIntent({ type: 'LOAD_SAMPLE', sampleId: 'case-melanoma' })}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 shrink-0 transition-colors hidden sm:block"
          >
            &ldquo;Sample 1&rdquo;
          </button>
          <button
            onClick={() => onDispatchIntent({ type: 'OPEN_CAMERA' })}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 shrink-0 transition-colors hidden sm:block"
          >
            &ldquo;Camera&rdquo;
          </button>
          <button
            onClick={() => onDispatchIntent({ type: 'CLEAR_IMAGE' })}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-400 shrink-0 transition-colors"
            title="Clear current image"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDispatchIntent({ type: 'SHOW_HELP' })}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-teal-400 shrink-0 transition-colors"
            title="Voice Commands Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Question input for hands-free or text interaction */}
        <form onSubmit={handleSubmit} className="hidden md:flex w-full md:w-72 items-center gap-1.5">
          <input
            type="text"
            value={typedQuestion}
            onChange={(e) => setTypedQuestion(e.target.value)}
            placeholder="Ask voice assistant a question..."
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={!typedQuestion.trim()}
            className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white shrink-0 transition-opacity"
            aria-label="Submit question to assistant"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {errorMessage && (
        <div className="max-w-7xl mx-auto mt-2 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-900/60 px-3 py-1 rounded-md">
          {errorMessage}
        </div>
      )}
    </aside>
  );
};
