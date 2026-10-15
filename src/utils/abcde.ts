import type { RiskLevel, AbcdeCriteria } from '../types/dermatology.ts';

/**
 * Calculates total ABCDE score points and assigns risk level
 * Points:
 * Asymmetry: 0 (Symmetric), 1 (Mild), 2 (Marked)
 * Border: 0 (Regular), 1 (Mildly Irregular), 2 (Markedly Irregular/Notched)
 * Color: 0 (Uniform), 1 (2-3 Colors), 2 (Marked Variegation 4+)
 * Diameter: 0 (<=6mm), 1 (>6mm)
 * Evolution: 0 (Stable), 1 (Moderate), 2 (Rapid Changes)
 * Total: 0 - 9 points
 */
export function calculateAbcdePoints(criteria: {
  asymmetryScore: 'Symmetric' | 'Mild Asymmetry' | 'Marked Asymmetry';
  borderScore: 'Regular' | 'Mildly Irregular' | 'Markedly Irregular / Notched';
  colorScore: 'Uniform Single Shade' | '2-3 Colors / Variegated' | 'Marked Variegation (4+ Colors)';
  isOver6mm: boolean;
  evolutionLevel: 'Reported Stable' | 'Moderate Evolution' | 'Rapid Recent Changes';
}): {
  asymmetryPoints: number;
  borderPoints: number;
  colorPoints: number;
  diameterPoints: number;
  evolutionPoints: number;
  totalPoints: number;
} {
  const asymmetryPoints = criteria.asymmetryScore === 'Marked Asymmetry' ? 2 : criteria.asymmetryScore === 'Mild Asymmetry' ? 1 : 0;
  const borderPoints = criteria.borderScore === 'Markedly Irregular / Notched' ? 2 : criteria.borderScore === 'Mildly Irregular' ? 1 : 0;
  const colorPoints = criteria.colorScore === 'Marked Variegation (4+ Colors)' ? 2 : criteria.colorScore === '2-3 Colors / Variegated' ? 1 : 0;
  const diameterPoints = criteria.isOver6mm ? 1 : 0;
  const evolutionPoints = criteria.evolutionLevel === 'Rapid Recent Changes' ? 2 : criteria.evolutionLevel === 'Moderate Evolution' ? 1 : 0;

  const totalPoints = asymmetryPoints + borderPoints + colorPoints + diameterPoints + evolutionPoints;

  return {
    asymmetryPoints,
    borderPoints,
    colorPoints,
    diameterPoints,
    evolutionPoints,
    totalPoints,
  };
}

export function evaluateAbcdeRisk(totalPoints: number): {
  riskLevel: RiskLevel;
  assessment: string;
} {
  if (totalPoints >= 6) {
    return {
      riskLevel: 'urgent',
      assessment: 'High suspicion for melanoma or aggressive malignant neoplasm. Total ABCDE score >= 6 indicates urgent dermato-oncology evaluation.',
    };
  }
  if (totalPoints >= 4) {
    return {
      riskLevel: 'high',
      assessment: 'Atypical melanocytic lesion features observed. Excisional or dermatoscopic biopsy recommended.',
    };
  }
  if (totalPoints >= 2) {
    return {
      riskLevel: 'moderate',
      assessment: 'Mild atypia or borderline clinical presentation. Serial digital dermatoscopy tracking recommended.',
    };
  }
  return {
    riskLevel: 'low',
    assessment: 'Symmetric, uniform morphological features consistent with benign lesion presentation.',
  };
}

export function getRiskBadgeColor(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  label: string;
} {
  switch (level) {
    case 'urgent':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-300 dark:border-rose-800',
        dot: 'bg-rose-500',
        label: 'Urgent Clinical Evaluation',
      };
    case 'high':
      return {
        bg: 'bg-orange-500/10 dark:bg-orange-950/40',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-300 dark:border-orange-800',
        dot: 'bg-orange-500',
        label: 'High Clinical Concern',
      };
    case 'moderate':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500',
        label: 'Moderate / Follow-up Advised',
      };
    case 'low':
    default:
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        label: 'Low Risk / Benign Profile',
      };
  }
}
