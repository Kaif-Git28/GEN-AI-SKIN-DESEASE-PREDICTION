import type { DiagnosticReport } from '../types/dermatology.ts';

export function formatReportForSpeech(report: DiagnosticReport): string {
  const primary = report.primaryDiagnosis;
  const risk = report.riskLevel.toUpperCase();
  const abcde = report.abcdeCriteria;

  let speech = `Diagnostic report ready. Primary finding is ${primary.disease}, classified as ${primary.category}, with an estimated confidence of ${Math.round(primary.confidence)} percent. `;
  speech += `The overall risk level is ${risk}. `;

  if (report.urgencyRationale) {
    speech += `${report.urgencyRationale} `;
  }

  speech += `ABCDE melanoma assessment indicates a score of ${abcde.totalPoints} out of 9. `;

  if (report.recommendedActions && report.recommendedActions.length > 0) {
    speech += `Recommended primary action: ${report.recommendedActions[0]} `;
  }

  speech += `Please note: This is an artificial intelligence screening tool and does not replace in-person dermatoscopic biopsy by a physician.`;

  return speech;
}

export function formatReportForAccessibleText(report: DiagnosticReport): string {
  const primary = report.primaryDiagnosis;
  return [
    `DIAGNOSTIC REPORT #${report.id}`,
    `Primary Finding: ${primary.disease} (${Math.round(primary.confidence)}% confidence)`,
    `Category: ${primary.category}`,
    `ICD-11 Code: ${primary.icd11Code}`,
    `Clinical Risk Level: ${report.riskLevel.toUpperCase()}`,
    `ABCDE Score: ${report.abcdeCriteria.totalPoints}/9 (${report.abcdeCriteria.assessment})`,
    `Recommendations: ${report.recommendedActions.join('; ')}`,
    `Self-Care: ${report.selfCareAdvice.join('; ')}`,
    `Disclaimer: ${report.disclaimer}`,
  ].join('\n');
}
