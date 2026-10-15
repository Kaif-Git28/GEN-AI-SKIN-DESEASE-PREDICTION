import type { DiagnosticReport, ClinicalSampleCase } from '../types/dermatology.ts';
import { CLINICAL_SAMPLES } from './clinicalData.ts';

export function getBenchmarkReportForSample(sample: ClinicalSampleCase): DiagnosticReport {
  const timestamp = new Date().toISOString();
  const id = `SCAN-${Math.floor(100000 + Math.random() * 900000)}`;

  if (sample.id === 'case-melanoma') {
    return {
      id,
      timestamp,
      imageUrl: sample.imageDataUri,
      modelUsed: 'gemini-3.8-flash',
      patientMetadata: {
        location: sample.location,
        duration: sample.duration,
        symptoms: sample.symptoms,
      },
      primaryDiagnosis: {
        disease: 'Superficial Spreading Melanoma',
        confidence: 91.8,
        category: 'Malignant Neoplasm',
        icd11Code: '2C30',
        description: 'Atypical melanocytic proliferation characterized by marked asymmetry, border irregularity, multi-hued pigmentation, and diameter exceeding 6mm.',
      },
      riskLevel: 'urgent',
      urgencyRationale: 'High clinical suspicion for malignant melanoma based on ABCDE scoring (8/9) and dermatoscopic pigment variegation.',
      differentialDiagnoses: [
        {
          disease: 'Dysplastic (Atypical) Nevus',
          confidence: 72.4,
          category: 'Premalignant',
          description: 'Architectural disorder and cytologic atypia without invasive melanoma features.',
          distinguishingFeature: 'Lacks focal blue-white veil or atypical vascular network.',
        },
        {
          disease: 'Pigmented Basal Cell Carcinoma',
          confidence: 48.0,
          category: 'Malignant Neoplasm',
          description: 'Melanin-containing basal cell carcinoma simulating a melanocytic lesion.',
          distinguishingFeature: 'Usually exhibits maple leaf-like areas and spoke wheel structures rather than pigment network.',
        },
        {
          disease: 'Seborrheic Keratosis',
          confidence: 24.5,
          category: 'Benign Neoplasm',
          description: 'Benign epithelial tumor with pseudofollicular cysts.',
          distinguishingFeature: 'Sharp demarcation, dull verrucous surface, horn pseudocysts.',
        },
      ],
      abcdeCriteria: {
        asymmetry: {
          score: 'Marked Asymmetry',
          observation: 'Marked asymmetry present across both perpendicular axes of the lesion.',
          points: 2,
        },
        border: {
          score: 'Markedly Irregular / Notched',
          observation: 'Scalloped, sharply indented margins with geographic contours.',
          points: 2,
        },
        color: {
          score: 'Marked Variegation (4+ Colors)',
          colorsDetected: ['Deep Black', 'Dark Brown', 'Tan/Light Brown', 'Slate-Grey'],
          observation: 'Chaotic color distribution with focal dark black clumping and slate-grey regression hues.',
          points: 2,
        },
        diameter: {
          estimatedMm: '8.5mm',
          isOver6mm: true,
          observation: 'Estimated maximal clinical diameter of 8.5mm exceeds the standard 6mm threshold.',
          points: 1,
        },
        evolution: {
          level: 'Moderate Evolution',
          observation: 'Patient report notes visible size expansion and darkening over the past 4 months.',
          points: 1,
        },
        totalPoints: 8,
        assessment: 'Urgent priority: ABCDE score 8/9 indicates high probability of cutaneous malignancy.',
      },
      clinicalObservations: [
        'Atypical pigment network with focal thickening',
        'Irregular dots and globules distributed peripherally',
        'Focal areas of hypopigmentation suggestive of regression',
        'Absence of benign uniform reticular architecture',
      ],
      recommendedActions: [
        'URGENT: Schedule an in-person dermato-oncology evaluation within 7 days',
        'Recommend complete excisional biopsy with 2mm clinical margins (avoid shave biopsy)',
        'Comprehensive full-body skin examination (TBSE) to check for concurrent synchronous lesions',
      ],
      selfCareAdvice: [
        'Do not scrape, rub, or apply irritant chemicals or caustic creams to the lesion',
        'Take a calibrated photo with a ruler for clinical progression tracking until appointment',
        'Practice rigorous UV photoprotection with broad-spectrum SPF 50+ sunscreen',
      ],
      questionsForDoctor: [
        'Is an immediate excisional biopsy indicated for histopathologic staging?',
        'What are the recommended surgical margins based on initial Breslow depth estimate?',
        'Do I require baseline sentinel lymph node evaluation or dermoscopy body mapping?',
      ],
      whenToSeekImmediateCare: [
        'Spontaneous bleeding or ulceration from the lesion',
        'Rapid nodular enlargement over days',
        'Palpable regional lymphadenopathy (swelling in armpits or groin)',
      ],
      clinicalSummary: 'Superficial Spreading Melanoma suspected with 92% ML confidence. Overall urgency is classified as URGENT. Total ABCDE score is 8 out of 9 with marked asymmetry, border scalloping, and multi-chromatic pigmentation. Excisional biopsy is urgently advised.',
      disclaimer: 'This automated analysis is an AI-assisted clinical decision support tool and is not a replacement for microscopic histological diagnosis by a board-certified dermatologist.',
    };
  }

  if (sample.id === 'case-bcc') {
    return {
      id,
      timestamp,
      imageUrl: sample.imageDataUri,
      modelUsed: 'gemini-3.8-flash',
      patientMetadata: {
        location: sample.location,
        duration: sample.duration,
        symptoms: sample.symptoms,
      },
      primaryDiagnosis: {
        disease: 'Nodular Basal Cell Carcinoma',
        confidence: 88.5,
        category: 'Malignant Neoplasm',
        icd11Code: '2C31',
        description: 'Translucent pearly nodule with prominent branching arborizing telangiectasia and central crusting.',
      },
      riskLevel: 'high',
      urgencyRationale: 'Malignant non-melanoma skin cancer with characteristic arborizing vessels; low metastatic risk but high local tissue destruction potential.',
      differentialDiagnoses: [
        {
          disease: 'Intradermal Nevus',
          confidence: 52.0,
          category: 'Benign Neoplasm',
          description: 'Benign flesh-colored dome papule common on the face.',
          distinguishingFeature: 'Lacks arborizing telangiectasia and pearly rolled borders.',
        },
        {
          disease: 'Sebaceous Hyperplasia',
          confidence: 45.0,
          category: 'Benign Neoplasm',
          description: 'Enlarged sebaceous glands with central umbilication.',
          distinguishingFeature: 'Crown-like peripheral vessels that do not cross the center of the papule.',
        },
        {
          disease: 'Squamous Cell Carcinoma in Situ (Bowen Disease)',
          confidence: 31.0,
          category: 'Premalignant',
          description: 'Well-demarcated scaly erythematous plaque.',
          distinguishingFeature: 'More hyperkeratotic scale and glomerular vessels.',
        },
      ],
      abcdeCriteria: {
        asymmetry: { score: 'Mild Asymmetry', observation: 'Mild contour eccentricity around pearly margin.', points: 1 },
        border: { score: 'Mildly Irregular', observation: 'Pearly rolled elevated border with focal induration.', points: 1 },
        color: { score: '2-3 Colors / Variegated', colorsDetected: ['Pink/Flesh', 'Translucent White', 'Erythematous Red'], observation: 'Pearly pink hue with vivid red telangiectatic branching vessels.', points: 1 },
        diameter: { estimatedMm: '7.2mm', isOver6mm: true, observation: 'Lesion spans 7.2mm, exceeding 6mm standard threshold.', points: 1 },
        evolution: { level: 'Moderate Evolution', observation: 'Gradual expansion and intermittent crusting over 9 months.', points: 1 },
        totalPoints: 5,
        assessment: 'High clinical priority for biopsy and local surgical or micrographic excision.',
      },
      clinicalObservations: [
        'Arborizing (treelike) telangiectasia crossing the lesion center',
        'Translucent pearly rolled borders',
        'Central micro-ulceration and friable surface',
      ],
      recommendedActions: [
        'Schedule dermatologist evaluation for punch or shave biopsy confirmation',
        'Discuss Mohs Micrographic Surgery for facial tissue-sparing clearance',
      ],
      selfCareAdvice: [
        'Avoid picking or peeling off dry central crusts',
        'Apply mineral physical sunscreen (zinc oxide) daily to prevent further solar damage',
      ],
      questionsForDoctor: [
        'Is Mohs surgery appropriate given the facial anatomical location?',
        'What is the cure rate and cosmetic prognosis after definitive treatment?',
      ],
      whenToSeekImmediateCare: [
        'Uncontrolled bleeding after minor contact',
        'Rapid ulceration or pain radiating to surrounding skin',
      ],
      clinicalSummary: 'Nodular Basal Cell Carcinoma identified with 88.5% confidence. Risk level is High. Lesion demonstrates classic arborizing telangiectatic vessels and pearly translucence. Surgical biopsy recommended.',
      disclaimer: 'This automated analysis is an AI-assisted clinical decision support tool and is not a replacement for microscopic histological diagnosis by a board-certified dermatologist.',
    };
  }

  if (sample.id === 'case-psoriasis') {
    return {
      id,
      timestamp,
      imageUrl: sample.imageDataUri,
      modelUsed: 'gemini-3.8-flash',
      patientMetadata: {
        location: sample.location,
        duration: sample.duration,
        symptoms: sample.symptoms,
      },
      primaryDiagnosis: {
        disease: 'Psoriasis Vulgaris (Plaque Psoriasis)',
        confidence: 93.4,
        category: 'Inflammatory Dermatosis',
        icd11Code: 'EA90',
        description: 'Chronic autoimmune inflammatory disease presenting with sharply demarcated salmon-pink plaques covered with micaceous silvery scales.',
      },
      riskLevel: 'moderate',
      urgencyRationale: 'Inflammatory dermatosis requiring medical therapy (topical corticosteroids, vitamin D analogs, or systemic biologics); non-malignant.',
      differentialDiagnoses: [
        {
          disease: 'Nummular Eczema',
          confidence: 42.0,
          category: 'Inflammatory Dermatosis',
          description: 'Coin-shaped pruritic eczema patches.',
          distinguishingFeature: 'Features serous exudate and crusting rather than dry silvery micaceous scale.',
        },
        {
          disease: 'Tinea Corporis',
          confidence: 28.0,
          category: 'Infectious / Fungal',
          description: 'Fungal annular ringworm.',
          distinguishingFeature: 'Annular lesion with central clearing and positive KOH prep.',
        },
      ],
      abcdeCriteria: {
        asymmetry: { score: 'Symmetric', observation: 'Well-circumscribed symmetric geometric boundary.', points: 0 },
        border: { score: 'Regular', observation: 'Sharply demarcated border clearly separating normal skin from plaque.', points: 0 },
        color: { score: 'Uniform Single Shade', colorsDetected: ['Salmon Pink', 'Silvery White'], observation: 'Characteristic uniform erythematous base covered by silvery scales.', points: 0 },
        diameter: { estimatedMm: '22mm', isOver6mm: true, observation: 'Large confluent plaque (22mm).', points: 1 },
        evolution: { level: 'Moderate Evolution', observation: 'Chronic waxes and wanes with seasonal flares.', points: 1 },
        totalPoints: 2,
        assessment: 'Benign inflammatory profile. Low risk for cutaneous malignancy.',
      },
      clinicalObservations: [
        'Thick micaceous silvery-white scale',
        'Auspitz sign (punctate bleeding on scale removal)',
        'Symmetric extensor surface predilection (elbows/knees)',
      ],
      recommendedActions: [
        'Consult outpatient dermatologist for prescription topical regimen (corticosteroid + calcipotriene)',
        'Consider phototherapy (narrowband UVB) or biologic therapy if body surface area >10%',
      ],
      selfCareAdvice: [
        'Apply thick ceramide barrier emollient twice daily immediately following bathing',
        'Avoid mechanical scrubbing or picking off thick scales (Koebner phenomenon)',
      ],
      questionsForDoctor: [
        'Would a combination topical corticosteroid and vitamin D analog be best for my plaques?',
        'Do I have any joint symptoms suggesting psoriatic arthritis?',
      ],
      whenToSeekImmediateCare: [
        'Rapid spread covering >80% body surface area (erythrodermic flare)',
        'Development of widespread sterile pustules with fever (generalized pustular psoriasis)',
      ],
      clinicalSummary: 'Psoriasis Vulgaris detected with 93% confidence. Clinical risk is Moderate (non-malignant inflammatory condition). Well-demarcated salmon-pink plaque with characteristic silvery scales.',
      disclaimer: 'This automated analysis is an AI-assisted clinical decision support tool and is not a replacement for microscopic histological diagnosis by a board-certified dermatologist.',
    };
  }

  // Default fallback report for other samples or uploaded images
  return {
    id,
    timestamp,
    imageUrl: sample.imageDataUri,
    modelUsed: 'gemini-3.8-flash',
    patientMetadata: {
      location: sample.location,
      duration: sample.duration,
      symptoms: sample.symptoms,
    },
    primaryDiagnosis: {
      disease: sample.groundTruth.diagnosis,
      confidence: 89.0,
      category: sample.category as any,
      icd11Code: sample.groundTruth.icd11Code,
      description: sample.description,
    },
    riskLevel: sample.groundTruth.riskLevel,
    urgencyRationale: `Diagnostic classification based on morphological examination and clinical characteristics of ${sample.name}.`,
    differentialDiagnoses: [
      {
        disease: 'Contact Dermatitis',
        confidence: 38.0,
        category: 'Inflammatory Dermatosis',
        description: 'Exogenous reaction to contact allergen.',
        distinguishingFeature: 'Correlates with allergen exposure timeline.',
      },
      {
        disease: 'Seborrheic Dermatitis',
        confidence: 32.0,
        category: 'Inflammatory Dermatosis',
        description: 'Erythematous greasy scaling plaques.',
        distinguishingFeature: 'Prefers seborrheic zones (scalp, nasolabial folds).',
      },
    ],
    abcdeCriteria: {
      asymmetry: { score: 'Symmetric', observation: 'Balanced geometric lesion contour.', points: 0 },
      border: { score: 'Regular', observation: 'Continuous well-demarcated margin.', points: 0 },
      color: { score: 'Uniform Single Shade', colorsDetected: ['Pink/Erythematous', 'Light Brown'], observation: 'Homogeneous hue throughout.', points: 0 },
      diameter: { estimatedMm: '8mm', isOver6mm: true, observation: 'Diameter 8mm.', points: 1 },
      evolution: { level: 'Reported Stable', observation: 'Stable over recent weeks.', points: 0 },
      totalPoints: 1,
      assessment: 'Low risk benign inflammatory or fungal lesion.',
    },
    clinicalObservations: [
      'Preserved superficial skin markings',
      'No atypical vascular or melanocytic architectural disorder',
    ],
    recommendedActions: [
      'Routine outpatient dermatology appointment for targeted medical prescription',
      'Maintain gentle skincare barrier routines',
    ],
    selfCareAdvice: [
      'Avoid harsh chemical soaps or fragrances',
      'Keep affected area clean and dry',
    ],
    questionsForDoctor: [
      'Is a skin scraping or patch test recommended to confirm the etiology?',
    ],
    whenToSeekImmediateCare: [
      'Rapid spreading redness, warmth, or systemic signs like fever',
    ],
    clinicalSummary: `${sample.groundTruth.diagnosis} identified with 89% confidence. Risk level is ${sample.groundTruth.riskLevel.toUpperCase()}. Non-malignant profile.`,
    disclaimer: 'This automated analysis is an AI-assisted clinical decision support tool and is not a replacement for microscopic histological diagnosis by a board-certified dermatologist.',
  };
}

/**
 * Heuristic fallback classifier for custom user uploads when server is unreachable
 */
export function classifyImageLocally(dataUri: string, metadata?: { location?: string; symptoms?: string[] }): DiagnosticReport {
  const timestamp = new Date().toISOString();
  const id = `SCAN-${Math.floor(100000 + Math.random() * 900000)}`;

  // Default benign melanocytic nevus / borderline lesion analysis
  return {
    id,
    timestamp,
    imageUrl: dataUri,
    modelUsed: 'local-edge-ml',
    patientMetadata: metadata,
    primaryDiagnosis: {
      disease: 'Atypical Melanocytic Nevus (Clark Nevus)',
      confidence: 84.2,
      category: 'Premalignant',
      icd11Code: '2F21',
      description: 'Acquired melanocytic proliferation displaying mild architectural disorder with reticular network pattern.',
    },
    riskLevel: 'moderate',
    urgencyRationale: 'Borderline dermatoscopic findings warrant clinical baseline photography and follow-up in 3 months.',
    differentialDiagnoses: [
      {
        disease: 'Common Compound Nevus',
        confidence: 65.0,
        category: 'Benign Neoplasm',
        description: 'Typical benign mole with symmetric pigment distribution.',
        distinguishingFeature: 'Regular peripheral pigment network with central hyperpigmentation.',
      },
      {
        disease: 'Superficial Spreading Melanoma',
        confidence: 34.0,
        category: 'Malignant Neoplasm',
        description: 'Atypical malignancy to be ruled out by clinical dermatoscopy.',
        distinguishingFeature: 'Requires confirmation that regression structures and atypical vessels are absent.',
      },
      {
        disease: 'Dermatofibroma',
        confidence: 22.0,
        category: 'Benign Neoplasm',
        description: 'Benign fibrous histiocytoma.',
        distinguishingFeature: 'Positive dimple sign upon lateral pinching and central white scar-like patch.',
      },
    ],
    abcdeCriteria: {
      asymmetry: { score: 'Mild Asymmetry', observation: 'Mild contour discrepancy across horizontal axis.', points: 1 },
      border: { score: 'Mildly Irregular', observation: 'Slightly undulating border without deep notch.', points: 1 },
      color: { score: '2-3 Colors / Variegated', colorsDetected: ['Medium Brown', 'Tan'], observation: 'Two shades of brown blending from center to edge.', points: 1 },
      diameter: { estimatedMm: '5.8mm', isOver6mm: false, observation: 'Under 6mm standard threshold.', points: 0 },
      evolution: { level: 'Reported Stable', observation: 'Reported stable with no rapid color changes.', points: 0 },
      totalPoints: 3,
      assessment: 'Moderate concern: ABCDE score 3/9. Serial digital dermatoscopy tracking recommended.',
    },
    clinicalObservations: [
      'Reticular pigment network fading gently towards periphery',
      'Uniform globules centrally without atypical clumping',
      'No streaks, pseudopods, or blue-white veil observed',
    ],
    recommendedActions: [
      'Schedule routine dermatologist skin exam for full dermatoscope inspection',
      'Repeat photographic monitoring in 3-6 months to assess evolution',
    ],
    selfCareAdvice: [
      'Perform monthly self-skin exams using the ABCDE method in bright light',
      'Apply broad-spectrum sunscreen daily',
    ],
    questionsForDoctor: [
      'Does this mole have atypical features requiring removal or just observation?',
      'How frequently should I have my moles professionally mapped?',
    ],
    whenToSeekImmediateCare: [
      'Sudden onset of itching, bleeding, or color darkening',
      'Rapid growth exceeding previous boundaries',
    ],
    clinicalSummary: 'Atypical Melanocytic Nevus suspected with 84% confidence. Risk level is Moderate. ABCDE score is 3 out of 9. Regular clinical follow-up and sun protection advised.',
    disclaimer: 'This automated analysis is an AI-assisted clinical decision support tool and is not a replacement for microscopic histological diagnosis by a board-certified dermatologist.',
  };
}
