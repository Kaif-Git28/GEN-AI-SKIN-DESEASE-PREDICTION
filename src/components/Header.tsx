import React from 'react';
import {
  Activity,
  Mic,
  MicOff,
  Volume2,
  Sliders,
  HelpCircle,
  Clock,
  LayoutGrid,
  ShieldAlert,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'diagnostic' | 'samples' | 'history' | 'guide';
  onSelectTab: (tab: 'diagnostic' | 'samples' | 'history' | 'guide') => void;
  isVoiceListening: boolean;
  isVoiceSpeaking: boolean;
  onToggleVoice: () => void;
  historyCount: number;
  modelType: 'gemini-3.8-flash' | 'local-edge-ml';
  onToggleModel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isVoiceListening,
  isVoiceSpeaking,
  onToggleVoice,
  historyCount,
  modelType,
  onToggleModel,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 backdrop-blur-md">
      {/* Emergency advisory bar */}
      <div className="bg-rose-950/80 border-b border-rose-900/60 px-4 py-1 text-xs text-rose-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>
            <strong>Clinical Screening Notice:</strong> This AI system is an investigational screening tool. For severe pain, bleeding, or acute signs, consult a licensed dermatologist.
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[11px] text-rose-300/80">ICD-11 &amp; ISIC Standard</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('diagnostic')}
            className="flex items-center gap-2.5 text-left group"
            aria-label="DermAI Vision Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">DermAI</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  VISION ML
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Multimodal Lesion Classifier &amp; Voice Assistance
              </p>
            </div>
          </button>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-0.5 sm:gap-1 bg-slate-800/80 p-0.5 sm:p-1 rounded-xl border border-slate-700/60 text-xs sm:text-sm">
          <button
            onClick={() => onSelectTab('diagnostic')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'diagnostic'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span className="sm:hidden">Scan</span>
            <span className="hidden sm:inline">Scan &amp; Report</span>
          </button>
          <button
            onClick={() => onSelectTab('samples')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-1.5 ${
              activeTab === 'samples'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="sm:hidden">Cases</span>
            <span className="hidden sm:inline">Sample Cases</span>
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-1.5 ${
              activeTab === 'history'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="sm:hidden">History</span>
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="text-[10px] sm:text-xs bg-slate-700 text-teal-300 px-1 rounded-full font-mono">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className={`p-1 sm:px-2.5 sm:py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'guide'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            aria-label="Voice & User Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </nav>

        {/* Right controls: Model toggle & Voice Assistant toggle */}
        <div className="flex items-center gap-2">
          {/* ML engine switch */}
          <button
            onClick={onToggleModel}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
            title="Toggle between Gemini Cloud ML and Edge On-Device Classifier"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-400" />
            <span>Model:</span>
            <span className="font-semibold text-teal-300">
              {modelType === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Edge Local ML'}
            </span>
          </button>

          {/* Voice Assistant Master Control */}
          <button
            onClick={onToggleVoice}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isVoiceListening
                ? 'bg-teal-500/20 border-teal-500 text-teal-200 ring-2 ring-teal-500/40 animate-pulse'
                : isVoiceSpeaking
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 ring-2 ring-cyan-500/40'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
            }`}
            aria-label={isVoiceListening ? 'Stop voice listening' : 'Start voice navigation'}
          >
            {isVoiceListening ? (
              <>
                <Mic className="w-4 h-4 text-teal-400 animate-bounce" />
                <span className="hidden sm:inline">Voice Active</span>
              </>
            ) : isVoiceSpeaking ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">Speaking</span>
              </>
            ) : (
              <>
                <MicOff className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Voice Assistant</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
