import React from 'react';
import { CLINICAL_SAMPLES } from '../utils/clinicalData.ts';
import type { ClinicalSampleCase } from '../types/dermatology.ts';
import { getRiskBadgeColor } from '../utils/abcde.ts';
import { Sparkles, ArrowRight, Mic } from 'lucide-react';

interface SampleLibraryProps {
  onSelectSample: (sample: ClinicalSampleCase) => void;
}

export const SampleLibrary: React.FC<SampleLibraryProps> = ({ onSelectSample }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">
              Clinical Case Repository
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Curated Benchmark Dermatological Cases
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Select any calibrated clinical case to inspect image features, test machine learning predictions, evaluate ABCDE risk calculations, and experience voice-guided diagnostic navigation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLINICAL_SAMPLES.map((sample, index) => {
          const riskBadge = getRiskBadgeColor(sample.groundTruth.riskLevel);
          return (
            <div
              key={sample.id}
              className="bg-slate-900 border border-slate-800 hover:border-teal-500/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-200 flex flex-col group"
            >
              {/* Image preview */}
              <div className="relative bg-slate-950 p-4 flex items-center justify-center border-b border-slate-800 h-52 overflow-hidden">
                <img
                  src={sample.imageDataUri}
                  alt={sample.name}
                  className="max-h-44 object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300">
                  Case #{index + 1}
                </div>
                <div
                  className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}
                >
                  {sample.groundTruth.riskLevel.toUpperCase()}
                </div>
              </div>

              {/* Card content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-teal-400 font-medium mb-1">
                    <span>{sample.category}</span>
                    <span>&bull;</span>
                    <span className="font-mono text-slate-400">ICD-11: {sample.groundTruth.icd11Code}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {sample.groundTruth.diagnosis}
                  </h3>

                  <p className="text-xs text-slate-300 mb-3 line-clamp-2">
                    {sample.description}
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mb-4">
                    <div>
                      Site: <span className="text-slate-300">{sample.location}</span>
                    </div>
                    <div>
                      Duration: <span className="text-slate-300">{sample.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <button
                    onClick={() => onSelectSample(sample)}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <span>Load Case into Scanner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="mt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
                    <Mic className="w-3 h-3 text-teal-400/80" />
                    <span>Voice: Say &ldquo;Sample {index + 1}&rdquo;</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
