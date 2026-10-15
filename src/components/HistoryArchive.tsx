import React, { useState } from 'react';
import type { DiagnosticReport } from '../types/dermatology.ts';
import { getRiskBadgeColor } from '../utils/abcde.ts';
import {
  Clock,
  Trash2,
  Eye,
  Columns,
  Search,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
} from 'lucide-react';

interface HistoryArchiveProps {
  history: DiagnosticReport[];
  onSelectReport: (report: DiagnosticReport) => void;
  onDeleteReport: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({
  history,
  onSelectReport,
  onDeleteReport,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.primaryDiagnosis.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'all' || item.riskLevel === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const compareReport1 = history.find((h) => h.id === compareIds[0]);
  const compareReport2 = history.find((h) => h.id === compareIds[1]);

  return (
    <div className="space-y-6">
      {/* Archive Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">
                Historical Patient Scans
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Lesion Tracking &amp; Diagnostic Archive
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Track morphological changes and compare scans across clinical visits
            </p>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={onClearHistory}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Scans</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by condition or scan ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'urgent', 'high', 'moderate', 'low'].map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRiskFilter(risk)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  selectedRiskFilter === risk
                    ? 'bg-teal-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Box if 2 scans selected */}
      {compareReport1 && compareReport2 && (
        <div className="bg-slate-900 border-2 border-teal-500/60 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Columns className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">
                Side-by-Side Evolution Analysis (ABCDE &lsquo;E&rsquo; Tracking)
              </h3>
            </div>
            <button
              onClick={() => setCompareIds([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
            >
              Exit Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[compareReport1, compareReport2].map((rep, idx) => {
              const badge = getRiskBadgeColor(rep.riskLevel);
              return (
                <div key={rep.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-teal-400">
                      Scan {idx === 0 ? 'A' : 'B'}: {rep.id}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rep.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="h-36 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                    <img
                      src={rep.imageUrl}
                      alt={rep.primaryDiagnosis.disease}
                      className="max-h-32 object-contain"
                    />
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {rep.primaryDiagnosis.disease}
                  </h4>
                  <div
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border mb-3 ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    Risk: {rep.riskLevel.toUpperCase()}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div>
                      <strong>ABCDE Score:</strong> {rep.abcdeCriteria.totalPoints}/9 pts
                    </div>
                    <div>
                      <strong>Asymmetry:</strong> {rep.abcdeCriteria.asymmetry.score}
                    </div>
                    <div>
                      <strong>Border:</strong> {rep.abcdeCriteria.border.score}
                    </div>
                    <div>
                      <strong>Color Variegation:</strong> {rep.abcdeCriteria.color.score}
                    </div>
                    <div>
                      <strong>Estimated Diameter:</strong> {rep.abcdeCriteria.diameter.estimatedMm}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History Grid */}
      {filteredHistory.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No Scans Recorded</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Perform a diagnostic scan or load a sample case to start saving records to your patient archive.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((rep) => {
            const riskBadge = getRiskBadgeColor(rep.riskLevel);
            const isComparing = compareIds.includes(rep.id);
            return (
              <div
                key={rep.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative bg-slate-950 p-4 flex items-center justify-center border-b border-slate-800 h-44 overflow-hidden">
                    <img
                      src={rep.imageUrl}
                      alt={rep.primaryDiagnosis.disease}
                      className="max-h-36 object-contain"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300">
                      {rep.id}
                    </div>
                    <div
                      className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}
                    >
                      {rep.riskLevel.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(rep.timestamp).toLocaleString()}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">
                      {rep.primaryDiagnosis.disease}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                      {rep.clinicalSummary}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-mono text-teal-300 mb-2">
                      <Layers className="w-3.5 h-3.5" />
                      <span>ABCDE: {rep.abcdeCriteria.totalPoints}/9 points</span>
                    </div>
                  </div>
                </div>

                {/* Card actions */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectReport(rep)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => toggleCompare(rep.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isComparing
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                      title="Select for 2-scan comparison"
                    >
                      <Columns className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteReport(rep.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                    title="Delete Scan from Archive"
                    aria-label={`Delete scan ${rep.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
