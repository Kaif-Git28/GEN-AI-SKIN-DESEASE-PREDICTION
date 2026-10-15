import test from 'node:test';
import assert from 'node:assert/strict';
import { formatReportForSpeech, formatReportForAccessibleText } from './reportFormatter.ts';
import type { DiagnosticReport } from '../types/dermatology.ts';

const mockReport: DiagnosticReport = {
  id: 'SCAN-2026-TEST',
  timestamp: new Date().toISOString(),
  imageUrl: 'data:image/png;base64,sample',
  modelUsed: 'gemini-3.8-flash',
  primaryDiagnosis: {
    disease: 'Malignant Melanoma',
    confidence: 91.4,
    category: 'Malignant Neoplasm',
    icd11Code: '2C30',
    description: 'High atypia with marked pigment variegation.',
  },
  riskLevel: 'urgent',
  urgencyRationale: 'High suspicion of superficial spreading melanoma requiring immediate excision.',
  differentialDiagnoses: [
    {
      disease: 'Dysplastic Nevus',
      confidence: 62,
      category: 'Premalignant',
      description: 'Borderline architectural disorder.',
      distinguishingFeature: 'Lacks deep dermal pigment clumping.',
    },
  ],
  abcdeCriteria: {
    asymmetry: { score: 'Marked Asymmetry', observation: 'Asymmetric 2 axes', points: 2 },
    border: { score: 'Markedly Irregular / Notched', observation: 'Scalloped margins', points: 2 },
    color: { score: 'Marked Variegation (4+ Colors)', colorsDetected: ['black', 'dark brown', 'tan', 'slate gray'], observation: 'Multiple hues', points: 2 },
    diameter: { estimatedMm: '8.4mm', isOver6mm: true, observation: 'Exceeds 6mm threshold', points: 1 },
    evolution: { level: 'Rapid Recent Changes', observation: 'Patient noted darkening over 3 months', points: 2 },
    totalPoints: 9,
    assessment: 'Urgent biopsy recommended.',
  },
  clinicalObservations: ['Irregular pigment network', 'Atypical vascular patterns'],
  recommendedActions: ['Urgent dermato-oncology consultation for excisional biopsy within 7 days'],
  selfCareAdvice: ['Avoid direct trauma or friction to the lesion', 'Document any further changes with photographs'],
  questionsForDoctor: ['Is an excisional or punch biopsy recommended?', 'Should sentinel lymph node mapping be discussed?'],
  whenToSeekImmediateCare: ['Spontaneous bleeding', 'Rapid expansion or satellite lesions'],
  clinicalSummary: 'Highly atypical melanocytic lesion exhibiting marked ABCDE criteria suggestive of superficial spreading melanoma.',
  disclaimer: 'This is an experimental AI assistive tool, not medical advice.',
};

test('formatReportForSpeech generates natural verbal summary containing key data', () => {
  const speech = formatReportForSpeech(mockReport);
  assert.ok(speech.includes('Malignant Melanoma'));
  assert.ok(speech.includes('91 percent'));
  assert.ok(speech.includes('URGENT'));
  assert.ok(speech.includes('9 out of 9'));
  assert.ok(speech.includes('Urgent dermato-oncology consultation'));
  assert.ok(speech.includes('Please note: This is an artificial intelligence screening tool'));
});

test('formatReportForAccessibleText generates complete structured plain text', () => {
  const text = formatReportForAccessibleText(mockReport);
  assert.ok(text.includes('DIAGNOSTIC REPORT #SCAN-2026-TEST'));
  assert.ok(text.includes('Primary Finding: Malignant Melanoma'));
  assert.ok(text.includes('ICD-11 Code: 2C30'));
  assert.ok(text.includes('ABCDE Score: 9/9'));
});
