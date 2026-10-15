import React from 'react';
import {
  X,
  Mic,
  Volume2,
  Play,
  RotateCcw,
  Camera,
  Grid,
  Printer,
  HelpCircle,
  Keyboard,
  ShieldCheck,
} from 'lucide-react';

interface VoiceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceGuideModal: React.FC<VoiceGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-guide-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h2 id="voice-guide-title" className="text-base font-bold text-white">
                Voice Assistant &amp; Navigation Guide
              </h2>
              <p className="text-xs text-slate-400">
                Hands-free voice accessibility for dermatological inspection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Voice Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-slate-300">
          {/* Section 1: Core Voice Commands */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Mic className="w-4 h-4 text-teal-400" />
              Voice Commands
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-1.5 text-teal-300 font-mono font-semibold mb-1">
                  <Play className="w-3.5 h-3.5" />
                  <span>&ldquo;Analyze image&rdquo;</span>
                </div>
                <p className="text-slate-400">
                  Triggers the multimodal machine learning lesion classification on the current photo.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-semibold mb-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>&ldquo;Read report&rdquo;</span>
                </div>
                <p className="text-slate-400">
                  Speaks the primary finding, ABCDE score, and clinical recommendations aloud.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-1.5 text-rose-300 font-mono font-semibold mb-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>&ldquo;Stop speaking&rdquo; / &ldquo;Silence&rdquo;</span>
                </div>
                <p className="text-slate-400">
                  Immediately halts active speech synthesis readout.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-1.5 text-purple-300 font-mono font-semibold mb-1">
                  <Camera className="w-3.5 h-3.5" />
                  <span>&ldquo;Open camera&rdquo;</span>
                </div>
                <p className="text-slate-400">
                  Activates your device camera for real-time lesion viewfinder photography.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-300 font-mono font-semibold mb-1">
                  <Grid className="w-3.5 h-3.5" />
                  <span>&ldquo;Toggle grid&rdquo;</span>
                </div>
                <p className="text-slate-400">
                  Toggles the calibrated millimeter dermatoscope inspection overlay grid.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-1.5 text-blue-300 font-mono font-semibold mb-1">
                  <Printer className="w-3.5 h-3.5" />
                  <span>&ldquo;Print report&rdquo;</span>
                </div>
                <p className="text-slate-400">
                  Opens the printable clinical diagnostic report summary for clinical consultation.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Loading Sample Cases by Voice */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Loading Benchmark Cases by Voice
            </h3>
            <p className="text-slate-400 mb-2">
              You can instantly load pre-curated clinical cases by saying:
            </p>
            <ul className="space-y-1 list-disc list-inside text-slate-300">
              <li>&ldquo;Load sample 1&rdquo; or &ldquo;Sample Melanoma&rdquo;</li>
              <li>&ldquo;Load sample 2&rdquo; or &ldquo;Sample Basal Cell&rdquo;</li>
              <li>&ldquo;Load sample 3&rdquo; or &ldquo;Sample Psoriasis&rdquo;</li>
              <li>&ldquo;Load sample 4&rdquo; or &ldquo;Sample Eczema&rdquo;</li>
            </ul>
          </div>

          {/* Section 3: Keyboard Shortcuts */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-teal-400" />
              Accessibility Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400">Toggle Mic</span>
                <span className="text-teal-300 font-bold">Alt + V</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400">Analyze Image</span>
                <span className="text-teal-300 font-bold">Alt + A</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400">Read Aloud</span>
                <span className="text-teal-300 font-bold">Alt + R</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400">Print / PDF</span>
                <span className="text-teal-300 font-bold">Alt + P</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
