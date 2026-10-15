import React from 'react';
import type { DiagnosticReport } from '../types/dermatology.ts';
import { Printer, X, ShieldAlert } from 'lucide-react';

interface PrintReportModalProps {
  report: DiagnosticReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !report) return null;

  const handleTriggerPrint = () => {
    window.print();
  };

  const primary = report.primaryDiagnosis;
  const abcde = report.abcdeCriteria;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-report-modal-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl my-8">
        {/* Action bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-semibold text-white">
              Official Diagnostic Report Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPrint}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              aria-label="Close Print Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document */}
        <div className="p-8 sm:p-10 bg-white text-slate-900 max-h-[80vh] overflow-y-auto print:max-h-none print:p-0 print:overflow-visible">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-teal-700">DermAI VISION</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-700 border border-slate-300">
                  CLINICAL ML REPORT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Investigational Dermatological Decision Support &bull; ISIC / ICD-11 Aligned
              </p>
            </div>

            <div className="text-right text-xs font-mono">
              <div>
                <strong>Case ID:</strong> {report.id}
              </div>
              <div className="text-slate-600">
                <strong>Date:</strong> {new Date(report.timestamp).toLocaleDateString()}
              </div>
              <div className="text-slate-600">
                <strong>Model:</strong> {report.modelUsed}
              </div>
            </div>
          </div>

          {/* Clinical summary block */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="col-span-2 space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Primary Classification
                </span>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-lg font-bold text-slate-900">{primary.disease}</h2>
                  <span className="text-sm font-mono font-bold text-teal-700">
                    {Math.round(primary.confidence)}% Confidence
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Category: <strong>{primary.category}</strong> | ICD-11:{' '}
                  <strong>{primary.icd11Code}</strong>
                </div>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {primary.description}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 text-xs">
                <strong>Risk Stratification: </strong>
                <span className="uppercase font-bold text-slate-900">
                  {report.riskLevel} Clinical Priority
                </span>
                <p className="text-slate-600 mt-1">{report.urgencyRationale}</p>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="col-span-1 border border-slate-300 rounded-lg p-2 flex flex-col items-center justify-center bg-slate-50">
              <img
                src={report.imageUrl}
                alt="Dermatoscopic lesion"
                className="max-h-36 object-contain rounded"
              />
              <span className="text-[10px] text-slate-500 mt-2">Dermatoscopic Ingestion</span>
            </div>
          </div>

          {/* ABCDE Matrix */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
              ABCDE Melanoma Dermatoscopic Criteria (Total Score: {abcde.totalPoints} / 9)
            </h3>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 text-left">
                  <th className="p-2">Criterion</th>
                  <th className="p-2">Observation</th>
                  <th className="p-2 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-semibold">A - Asymmetry</td>
                  <td className="p-2 text-slate-600">{abcde.asymmetry.observation}</td>
                  <td className="p-2 text-right font-mono font-bold">{abcde.asymmetry.points}</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">B - Border Irregularity</td>
                  <td className="p-2 text-slate-600">{abcde.border.observation}</td>
                  <td className="p-2 text-right font-mono font-bold">{abcde.border.points}</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">C - Color Variegation</td>
                  <td className="p-2 text-slate-600">{abcde.color.observation}</td>
                  <td className="p-2 text-right font-mono font-bold">{abcde.color.points}</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">D - Diameter (&gt;6mm)</td>
                  <td className="p-2 text-slate-600">{abcde.diameter.observation}</td>
                  <td className="p-2 text-right font-mono font-bold">{abcde.diameter.points}</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">E - Evolution</td>
                  <td className="p-2 text-slate-600">{abcde.evolution.observation}</td>
                  <td className="p-2 text-right font-mono font-bold">{abcde.evolution.points}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Recommended Next Steps */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
              Actionable Recommendations
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
              {report.recommendedActions.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Disclaimer & Sign-off */}
          <div className="pt-4 border-t-2 border-slate-300 text-[11px] text-slate-500">
            <p className="mb-4">
              <strong>Medical Disclaimer:</strong> {report.disclaimer}
            </p>

            <div className="flex justify-between items-end pt-6">
              <div className="text-[10px] text-slate-400">
                Generated via DermAI Vision Clinical Assist System
              </div>
              <div className="text-right border-t border-slate-400 pt-1 w-48 text-[11px] text-slate-700">
                Examining Clinician Signature
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
