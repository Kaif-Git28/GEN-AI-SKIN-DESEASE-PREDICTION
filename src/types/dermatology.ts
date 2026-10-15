export type RiskLevel = 'low' | 'moderate' | 'high' | 'urgent';

export interface DifferentialDiagnosis {
  disease: string;
  confidence: number; // 0 to 100
  category: string;
  description: string;
  distinguishingFeature: string;
}

export interface AbcdeCriteria {
  asymmetry: {
    score: 'Symmetric' | 'Mild Asymmetry' | 'Marked Asymmetry';
    observation: string;
    points: number; // 0 - 2
  };
  border: {
    score: 'Regular' | 'Mildly Irregular' | 'Markedly Irregular / Notched';
    observation: string;
    points: number; // 0 - 2
  };
  color: {
    score: 'Uniform Single Shade' | '2-3 Colors / Variegated' | 'Marked Variegation (4+ Colors)';
    colorsDetected: string[];
    observation: string;
    points: number; // 0 - 2
  };
  diameter: {
    estimatedMm: string;
    isOver6mm: boolean;
    observation: string;
    points: number; // 0 - 1
  };
  evolution: {
    level: 'Reported Stable' | 'Moderate Evolution' | 'Rapid Recent Changes';
    observation: string;
    points: number; // 0 - 2
  };
  totalPoints: number; // 0 to 9
  assessment: string;
}

export interface DiagnosticReport {
  id: string;
  timestamp: string;
  imageUrl: string;
  modelUsed: 'gemini-3.8-flash' | 'huggingface-isic' | 'local-edge-ml';
  patientMetadata?: {
    location?: string;
    duration?: string;
    symptoms?: string[];
    ageGroup?: string;
  };
  primaryDiagnosis: {
    disease: string;
    confidence: number; // 0 - 100
    category: 'Malignant Neoplasm' | 'Premalignant' | 'Benign Neoplasm' | 'Inflammatory Dermatosis' | 'Infectious / Fungal' | 'Pigmentary / Other';
    icd11Code: string;
    description: string;
  };
  riskLevel: RiskLevel;
  urgencyRationale: string;
  differentialDiagnoses: DifferentialDiagnosis[];
  abcdeCriteria: AbcdeCriteria;
  clinicalObservations: string[];
  recommendedActions: string[];
  selfCareAdvice: string[];
  questionsForDoctor: string[];
  whenToSeekImmediateCare: string[];
  clinicalSummary: string;
  disclaimer: string;
}

export type VoiceIntent =
  | { type: 'ANALYZE_IMAGE' }
  | { type: 'READ_REPORT' }
  | { type: 'STOP_SPEAKING' }
  | { type: 'LOAD_SAMPLE'; sampleId: string }
  | { type: 'CLEAR_IMAGE' }
  | { type: 'OPEN_CAMERA' }
  | { type: 'TOGGLE_DERMATOSCOPE_GRID' }
  | { type: 'EXPORT_REPORT' }
  | { type: 'SWITCH_TAB'; tab: 'diagnostic' | 'samples' | 'history' | 'guide' }
  | { type: 'SHOW_HELP' }
  | { type: 'ASK_QUESTION'; question: string }
  | { type: 'UNKNOWN'; query: string };

export interface ClinicalSampleCase {
  id: string;
  name: string;
  category: string;
  location: string;
  duration: string;
  symptoms: string[];
  description: string;
  imageDataUri: string;
  groundTruth: {
    diagnosis: string;
    riskLevel: RiskLevel;
    icd11Code: string;
  };
}
