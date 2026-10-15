import type { ClinicalSampleCase } from '../types/dermatology.ts';

// Helper to generate SVG data URIs representing dermatological lesion patterns
function makeSvgDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

export const CLINICAL_SAMPLES: ClinicalSampleCase[] = [
  {
    id: 'case-melanoma',
    name: 'Atypical Pigmented Lesion (Superficial Spreading Melanoma)',
    category: 'Malignant Neoplasm',
    location: 'Upper Back / Scapular Region',
    duration: '4 months (noted recent darkening and border expansion)',
    symptoms: ['Mild pruritus (itching)', 'Recent border irregularity', 'Size enlargement'],
    description: 'Asymmetric macule with notched borders, multi-chromatic pigmentation including dark brown, slate-grey, and black areas, diameter approximately 8.5mm.',
    groundTruth: {
      diagnosis: 'Malignant Melanoma (Superficial Spreading Subtype)',
      riskLevel: 'urgent',
      icd11Code: '2C30',
    },
    imageDataUri: makeSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <radialGradient id="skin" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f6dfcf"/>
            <stop offset="100%" stop-color="#e9c8b3"/>
          </radialGradient>
          <filter id="noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <!-- Skin background with natural texture -->
        <rect width="400" height="400" fill="url(#skin)"/>
        <!-- Fine skin pore grid & vascularity -->
        <circle cx="120" cy="80" r="1.5" fill="#d8a892" opacity="0.4"/>
        <circle cx="280" cy="90" r="1.5" fill="#d8a892" opacity="0.4"/>
        <circle cx="90" cy="310" r="1.5" fill="#d8a892" opacity="0.4"/>
        <circle cx="310" cy="320" r="1.5" fill="#d8a892" opacity="0.4"/>
        <!-- Primary Atypical Melanocytic Lesion -->
        <g filter="url(#noise)">
          <!-- Outer notched border -->
          <path d="M 170 130 C 230 110, 270 140, 290 190 C 310 240, 270 290, 220 300 C 160 310, 130 260, 120 210 C 110 160, 140 140, 170 130 Z" fill="#4a2e1d" opacity="0.85"/>
          <!-- Internal dark pigment clumping & slate grey hue -->
          <path d="M 185 155 C 235 140, 255 170, 260 210 C 265 245, 230 270, 195 265 C 155 260, 145 220, 150 185 C 155 160, 170 160, 185 155 Z" fill="#20110b"/>
          <!-- Atypical black focus (high risk marker) -->
          <ellipse cx="230" cy="195" rx="35" ry="25" fill="#0d0806" transform="rotate(25 230 195)"/>
          <!-- Slate blue/grey regression area -->
          <ellipse cx="170" cy="225" rx="28" ry="18" fill="#58525b" opacity="0.75"/>
          <!-- Erythematous periphery -->
          <path d="M 155 125 C 215 100, 280 135, 305 185 C 320 230, 285 305, 220 315 C 150 325, 115 270, 105 210 C 95 150, 130 130, 155 125 Z" fill="none" stroke="#ba4848" stroke-width="6" opacity="0.4"/>
        </g>
        <!-- Dermatological calibration scale marker -->
        <line x1="30" y1="370" x2="130" y2="370" stroke="#334155" stroke-width="2"/>
        <line x1="30" y1="365" x2="30" y2="375" stroke="#334155" stroke-width="2"/>
        <line x1="130" y1="365" x2="130" y2="375" stroke="#334155" stroke-width="2"/>
        <text x="55" y="362" font-family="sans-serif" font-size="11" fill="#334155" font-weight="600">10 mm</text>
      </svg>
    `),
  },
  {
    id: 'case-bcc',
    name: 'Nodular Lesion with Telangiectasia (Basal Cell Carcinoma)',
    category: 'Malignant Neoplasm',
    location: 'Right Malar Cheek (Facial)',
    duration: '9 months (slowly growing pearly papule with intermittent bleeding)',
    symptoms: ['Bleeding upon light towel drying', 'Pearly translucent border', 'Non-healing central crust'],
    description: 'Translucent pink-pearly papule with arborizing telangiectatic vessels and rolled border.',
    groundTruth: {
      diagnosis: 'Nodular Basal Cell Carcinoma',
      riskLevel: 'high',
      icd11Code: '2C31',
    },
    imageDataUri: makeSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <radialGradient id="cheekSkin" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fae7db"/>
            <stop offset="100%" stop-color="#eed1c0"/>
          </radialGradient>
          <radialGradient id="pearly" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#fff5f0"/>
            <stop offset="50%" stop-color="#f8c3b9"/>
            <stop offset="85%" stop-color="#e29b93"/>
            <stop offset="100%" stop-color="#c9736b"/>
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill="url(#cheekSkin)"/>
        <!-- Pearly nodule -->
        <circle cx="200" cy="200" r="85" fill="url(#pearly)" stroke="#dfa39b" stroke-width="4"/>
        <!-- Central slight depression / crust -->
        <ellipse cx="205" cy="205" rx="32" ry="25" fill="#8f463c" opacity="0.6"/>
        <ellipse cx="207" cy="207" rx="18" ry="12" fill="#52231c" opacity="0.75"/>
        <!-- Arborizing telangiectatic vessels (fine branching blood vessels) -->
        <path d="M 140 180 Q 170 190 200 200 T 250 195" fill="none" stroke="#ba1a1a" stroke-width="2.5" opacity="0.85"/>
        <path d="M 170 190 Q 180 165 195 155" fill="none" stroke="#ba1a1a" stroke-width="1.8" opacity="0.8"/>
        <path d="M 210 200 Q 235 230 260 235" fill="none" stroke="#ba1a1a" stroke-width="2" opacity="0.8"/>
        <path d="M 230 220 Q 240 250 245 260" fill="none" stroke="#ba1a1a" stroke-width="1.5" opacity="0.75"/>
        <line x1="30" y1="370" x2="130" y2="370" stroke="#334155" stroke-width="2"/>
        <line x1="30" y1="365" x2="30" y2="375" stroke="#334155" stroke-width="2"/>
        <line x1="130" y1="365" x2="130" y2="375" stroke="#334155" stroke-width="2"/>
        <text x="55" y="362" font-family="sans-serif" font-size="11" fill="#334155" font-weight="600">10 mm</text>
      </svg>
    `),
  },
  {
    id: 'case-psoriasis',
    name: 'Erythematous Plaque with Silvery Scale (Psoriasis Vulgaris)',
    category: 'Inflammatory Dermatosis',
    location: 'Extensor Surface of Left Elbow',
    duration: '2 years (chronic relapsing plaques)',
    symptoms: ['Thick silvery scales', 'Mild soreness', 'Auspitz sign upon scraping'],
    description: 'Well-demarcated salmon-pink erythematous plaques surmounted by micaceous silvery-white scales.',
    groundTruth: {
      diagnosis: 'Psoriasis Vulgaris (Plaque Psoriasis)',
      riskLevel: 'moderate',
      icd11Code: 'EA90',
    },
    imageDataUri: makeSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <radialGradient id="plaqueGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#d64045"/>
            <stop offset="70%" stop-color="#c1292e"/>
            <stop offset="100%" stop-color="#8f1d22"/>
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill="#f0d5c4"/>
        <!-- Erythematous salmon plaque -->
        <path d="M 130 140 C 210 110, 290 130, 310 190 C 330 260, 270 310, 190 310 C 120 310, 90 240, 100 180 C 110 150, 120 145, 130 140 Z" fill="url(#plaqueGrad)" opacity="0.88"/>
        <!-- Micaceous silvery-white scales -->
        <path d="M 150 170 Q 200 160 250 180 Q 270 220 230 250 Q 180 260 150 230 Z" fill="#ffffff" opacity="0.75"/>
        <path d="M 170 190 Q 220 185 240 210 Q 220 235 180 225 Z" fill="#f8fafc" opacity="0.9"/>
        <line x1="30" y1="370" x2="130" y2="370" stroke="#334155" stroke-width="2"/>
        <line x1="30" y1="365" x2="30" y2="375" stroke="#334155" stroke-width="2"/>
        <line x1="130" y1="365" x2="130" y2="375" stroke="#334155" stroke-width="2"/>
        <text x="55" y="362" font-family="sans-serif" font-size="11" fill="#334155" font-weight="600">10 mm</text>
      </svg>
    `),
  },
  {
    id: 'case-eczema',
    name: 'Flexural Lichenified Dermatitis (Atopic Eczema)',
    category: 'Inflammatory Dermatosis',
    location: 'Antecubital Fossa (Inner Elbow)',
    duration: '3 weeks (exacerbated during winter weather)',
    symptoms: ['Intense pruritus (night itching)', 'Excoriations', 'Xerosis / dry skin'],
    description: 'Ill-defined erythematous patches with superficial excoriations and accentuated skin markings (lichenification).',
    groundTruth: {
      diagnosis: 'Atopic Dermatitis (Eczema)',
      riskLevel: 'moderate',
      icd11Code: 'EA80',
    },
    imageDataUri: makeSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="#edd0be"/>
        <!-- Diffuse erythema -->
        <circle cx="200" cy="200" r="110" fill="#e57373" opacity="0.45"/>
        <circle cx="210" cy="190" r="75" fill="#d32f2f" opacity="0.4"/>
        <!-- Scratch excoriations / linear marks -->
        <path d="M 150 170 Q 210 180 260 175" stroke="#b71c1c" stroke-width="2.5" fill="none" opacity="0.8"/>
        <path d="M 160 210 Q 220 205 270 220" stroke="#b71c1c" stroke-width="2" fill="none" opacity="0.75"/>
        <path d="M 175 235 Q 215 245 250 235" stroke="#b71c1c" stroke-width="2" fill="none" opacity="0.7"/>
        <line x1="30" y1="370" x2="130" y2="370" stroke="#334155" stroke-width="2"/>
        <line x1="30" y1="365" x2="30" y2="375" stroke="#334155" stroke-width="2"/>
        <line x1="130" y1="365" x2="130" y2="375" stroke="#334155" stroke-width="2"/>
        <text x="55" y="362" font-family="sans-serif" font-size="11" fill="#334155" font-weight="600">10 mm</text>
      </svg>
    `),
  },
  {
    id: 'case-seborrheic',
    name: 'Stuck-on Verrucous Plaque (Seborrheic Keratosis)',
    category: 'Benign Neoplasm',
    location: 'Mid-Thoracic Trunk',
    duration: '3 years (gradually expanded, asymptomatic)',
    symptoms: ['Slight rough texture', 'No pain or bleeding', 'Asymptomatic'],
    description: 'Well-circumscribed waxy brown plaque with keratin pseudocysts and classic stuck-on appearance.',
    groundTruth: {
      diagnosis: 'Seborrheic Keratosis (Benign)',
      riskLevel: 'low',
      icd11Code: '2F20',
    },
    imageDataUri: makeSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="#f5e1d3"/>
        <!-- Stuck-on waxy oval plaque -->
        <ellipse cx="200" cy="200" rx="90" ry="75" fill="#6d4c41" stroke="#4e342e" stroke-width="3"/>
        <!-- Horn pseudocysts / comedo-like openings -->
        <circle cx="170" cy="180" r="5" fill="#3e2723"/>
        <circle cx="210" cy="170" r="4.5" fill="#3e2723"/>
        <circle cx="230" cy="210" r="6" fill="#3e2723"/>
        <circle cx="180" cy="220" r="5" fill="#3e2723"/>
        <circle cx="195" cy="240" r="4" fill="#3e2723"/>
        <line x1="30" y1="370" x2="130" y2="370" stroke="#334155" stroke-width="2"/>
        <line x1="30" y1="365" x2="30" y2="375" stroke="#334155" stroke-width="2"/>
        <line x1="130" y1="365" x2="130" y2="375" stroke="#334155" stroke-width="2"/>
        <text x="55" y="362" font-family="sans-serif" font-size="11" fill="#334155" font-weight="600">10 mm</text>
      </svg>
    `),
  },
  {
    id: 'case-tinea',
    name: 'Annular Scaly Plaque with Central Clearing (Tinea Corporis)',
    category: 'Infectious / Fungal',
    location: 'Right Forearm',
    duration: '2 weeks (started as small spot, expanded outward)',
    symptoms: ['Ring-shaped border', 'Active scaly advancing margin', 'Mild itching'],
    description: 'Classic annular (ring-shaped) erythematous patch with elevated scaly leading edge and central healing.',
    groundTruth: {
      diagnosis: 'Tinea Corporis (Dermatophytosis / Ringworm)',
      riskLevel: 'low',
      icd11Code: '1F28',
    },
    imageDataUri: makeSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="#f8e5d8"/>
        <!-- Active outer ring with elevated scaly edge -->
        <circle cx="200" cy="200" r="95" fill="none" stroke="#e57373" stroke-width="24" opacity="0.85"/>
        <circle cx="200" cy="200" r="95" fill="none" stroke="#c62828" stroke-dasharray="8,6" stroke-width="12" opacity="0.7"/>
        <!-- Central clearing with residual faint pink -->
        <circle cx="200" cy="200" r="70" fill="#f3dcd0" opacity="0.6"/>
        <line x1="30" y1="370" x2="130" y2="370" stroke="#334155" stroke-width="2"/>
        <line x1="30" y1="365" x2="30" y2="375" stroke="#334155" stroke-width="2"/>
        <line x1="130" y1="365" x2="130" y2="375" stroke="#334155" stroke-width="2"/>
        <text x="55" y="362" font-family="sans-serif" font-size="11" fill="#334155" font-weight="600">10 mm</text>
      </svg>
    `),
  },
];
