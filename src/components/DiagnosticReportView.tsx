import React, { useState } from 'react';
import {
  FileText,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle,
  Clock,
  Printer,
  Download,
  BookmarkPlus,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { DiagnosticReport } from '../types/dermatology.ts';
import { getRiskBadgeColor } from '../utils/abcde.ts';

interface DiagnosticReportViewProps {
  report: DiagnosticReport;
  isSpeaking: boolean;
  onReadReport: () => void;
  onStopSpeaking: () => void;
  onPrintReport: () => void;
  onSaveToHistory: (report: DiagnosticReport) => void;
  isSavedInHistory: boolean;
  onAskVoiceAboutReport: (question: string) => void;
}

export const DiagnosticReportView: React.FC<DiagnosticReportViewProps> = ({
  report,
  isSpeaking,
  onReadReport,
  onStopSpeaking,
  onPrintReport,
  onSaveToHistory,
  isSavedInHistory,
  onAskVoiceAboutReport,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'abcde' | 'differential' | 'plan'>('overview');

  const riskBadge = getRiskBadgeColor(report.riskLevel);
  const primary = report.primaryDiagnosis;
  const abcde = report.abcdeCriteria;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DermAI_Report_${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <article
      aria-label="Clinical Diagnostic Report"
      className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
    >
      {/* Top Banner: Clinical Case Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/80 border border-teal-800 px-2.5 py-0.5 rounded-md">
              {report.id}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(report.timestamp).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">
              Model: <strong className="text-slate-200">{report.modelUsed}</strong>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400 shrink-0" />
            Dermatological Diagnostic Evaluation
          </h1>

          {report.patientMetadata && (
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
              {report.patientMetadata.location && (
                <span>
                  Site: <strong className="text-slate-300">{report.patientMetadata.location}</strong>
                </span>
              )}
              {report.patientMetadata.duration && (
                <span>
                  Duration: <strong className="text-slate-300">{report.patientMetadata.duration}</strong>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Risk Badge & Read Aloud Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${riskBadge.dot} animate-pulse`} />
            <span>{riskBadge.label}</span>
          </div>

          {/* Voice Readout Toggle */}
          <button
            onClick={isSpeaking ? onStopSpeaking : onReadReport}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all ${
              isSpeaking
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-teal-600 hover:bg-teal-500 text-white'
            }`}
            aria-label={isSpeaking ? 'Stop voice readout' : 'Read diagnostic report aloud'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Pause Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Read Out Loud</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spoken audio readout live transcript visualizer */}
      {isSpeaking && (
        <div className="bg-teal-950/60 border-b border-teal-900/60 px-5 py-2.5 flex items-center justify-between text-xs text-teal-200">
          <div className="flex items-center gap-2 min-w-0">
            <Volume2 className="w-4 h-4 text-teal-400 shrink-0 animate-bounce" />
            <span className="font-medium truncate">
              Vocal Assistant is currently reading the report to you...
            </span>
          </div>
          <button
            onClick={onStopSpeaking}
            className="text-xs text-rose-300 hover:underline shrink-0 ml-2"
          >
            Silence
          </button>
        </div>
      )}

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 sm:px-6 overflow-x-auto">
        {[
          { key: 'overview', label: 'Primary Finding' },
          { key: 'abcde', label: `ABCDE Criteria (${abcde.totalPoints}/9 pts)` },
          { key: 'differential', label: `Differentials (${report.differentialDiagnoses.length})` },
          { key: 'plan', label: 'Clinical Action Plan' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Primary Finding Overview */}
      {activeTab === 'overview' && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary finding hero card */}
            <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-semibold">
                    Primary Morphological Prediction
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    {primary.disease}
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-black font-mono text-teal-300">
                    {Math.round(primary.confidence)}%
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Confidence
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700">
                  Category: <strong>{primary.category}</strong>
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700">
                  ICD-11: <strong>{primary.icd11Code}</strong>
                </span>
              </div>

              {/* Confidence progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-cyan-400 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(primary.confidence, 100)}%` }}
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {primary.description}
              </p>

              {/* Urgency Rationale */}
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-200 block mb-1">
                  Urgency Stratification Rationale:
                </span>
                <p className="text-slate-400">{report.urgencyRationale}</p>
              </div>
            </div>

            {/* Quick Summary & Key Observations */}
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Clinical Findings
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {report.clinicalObservations.slice(0, 4).map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Primary Action Required
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  {report.recommendedActions[0] || 'Schedule an in-person dermatology evaluation.'}
                </p>
                <button
                  onClick={() => setActiveTab('plan')}
                  className="mt-3 text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                >
                  <span>View Full Clinical Action Plan</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ABCDE Melanoma Breakdown */}
      {activeTab === 'abcde' && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                ABCDE Melanoma Risk Metric
              </h2>
              <p className="text-xs text-slate-400">
                Gold-standard clinical dermatoscopy criteria for evaluating melanocytic lesions
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-teal-500/40 text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Total ABCDE Points
              </span>
              <span className="text-2xl font-black font-mono text-teal-300">
                {abcde.totalPoints} <span className="text-xs font-normal text-slate-400">/ 9</span>
              </span>
            </div>
          </div>

          {/* 5 Criteria Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* A: Asymmetry */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-xs">
                  A
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-300">
                  {abcde.asymmetry.points} / 2 pts
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Asymmetry</h3>
              <div className="text-xs font-medium text-teal-400 mb-2">
                {abcde.asymmetry.score}
              </div>
              <p className="text-xs text-slate-400">{abcde.asymmetry.observation}</p>
            </div>

            {/* B: Border */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-xs">
                  B
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                  {abcde.border.points} / 2 pts
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Border Irregularity</h3>
              <div className="text-xs font-medium text-cyan-400 mb-2">
                {abcde.border.score}
              </div>
              <p className="text-xs text-slate-400">{abcde.border.observation}</p>
            </div>

            {/* C: Color */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-xs">
                  C
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-300">
                  {abcde.color.points} / 2 pts
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Color Variegation</h3>
              <div className="text-xs font-medium text-blue-400 mb-2">
                {abcde.color.score}
              </div>
              {abcde.color.colorsDetected && abcde.color.colorsDetected.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {abcde.color.colorsDetected.map((col, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-400">{abcde.color.observation}</p>
            </div>

            {/* D: Diameter */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs">
                  D
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">
                  {abcde.diameter.points} / 1 pt
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Diameter (&gt; 6mm Check)</h3>
              <div className="text-xs font-medium text-indigo-400 mb-2">
                Estimated: {abcde.diameter.estimatedMm} (
                {abcde.diameter.isOver6mm ? 'Exceeds 6mm threshold' : 'Under 6mm'}
                )
              </div>
              <p className="text-xs text-slate-400">{abcde.diameter.observation}</p>
            </div>

            {/* E: Evolution */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 md:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs">
                  E
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">
                  {abcde.evolution.points} / 2 pts
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Evolution &amp; Change Over Time</h3>
              <div className="text-xs font-medium text-purple-400 mb-2">
                {abcde.evolution.level}
              </div>
              <p className="text-xs text-slate-400">{abcde.evolution.observation}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <strong>Clinical Synthesis: </strong>
            <span>{abcde.assessment}</span>
          </div>
        </div>
      )}

      {/* Tab 3: Differential Diagnoses */}
      {activeTab === 'differential' && (
        <div className="p-5 sm:p-6 space-y-4">
          <div className="pb-2 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">
              Differential Diagnostic Considerations
            </h2>
            <p className="text-xs text-slate-400">
              Comparative probability rankings against established clinical dermatological patterns
            </p>
          </div>

          <div className="space-y-3">
            {report.differentialDiagnoses.map((diff, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                    <h3 className="text-sm font-semibold text-white">{diff.disease}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {diff.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-300">
                    {Math.round(diff.confidence)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className="bg-teal-500/70 h-1.5 rounded-full"
                    style={{ width: `${Math.min(diff.confidence, 100)}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 mb-2">{diff.description}</p>
                <div className="text-[11px] text-teal-400/90 font-medium bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <strong>Distinguishing Feature: </strong>
                  {diff.distinguishingFeature}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Clinical Action Plan */}
      {activeTab === 'plan' && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommended Medical Actions */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                Recommended Next Steps
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {report.recommendedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions to Ask Doctor */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                Key Questions for Your Dermatologist
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {report.questionsForDoctor.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>&ldquo;{q}&rdquo;</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Patient Self-Care & Monitoring */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Patient Self-Care &amp; Photoprotection
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.selfCareAdvice.map((advice, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flag Warning Box */}
            <div className="bg-rose-950/30 border border-rose-900/60 rounded-xl p-5">
              <h3 className="text-sm font-bold text-rose-300 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                When to Seek Immediate Care (Red Flags)
              </h3>
              <ul className="space-y-2 text-xs text-rose-200">
                {report.whenToSeekImmediateCare.map((warn, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Footer Toolbar */}
      <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onSaveToHistory(report)}
            disabled={isSavedInHistory}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSavedInHistory
                ? 'bg-slate-800 text-slate-400 cursor-default'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-teal-400" />
            <span>{isSavedInHistory ? 'Saved in Archive' : 'Save to History'}</span>
          </button>

          <button
            onClick={onPrintReport}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Report (PDF)</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export JSON</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 max-w-sm text-right">
          Screening report generated via multimodal clinical ML engine.
        </div>
      </div>
    </article>
  );
};
