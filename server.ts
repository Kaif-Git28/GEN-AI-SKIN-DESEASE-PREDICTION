import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support large image payloads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Server-side Gemini AI client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Endpoint: /api/predict
 * Multimodal skin disease prediction with ABCDE melanoma risk grading
 */
app.post('/api/predict', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', patientMetadata } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 in request body' });
    }

    // Strip data URL header if included
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z+]+;base64,/, '');

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on server',
        fallbackAvailable: true,
      });
    }

    const clinicalContext = patientMetadata
      ? `Patient provided clinical context:
- Anatomical Location: ${patientMetadata.location || 'Unspecified'}
- Duration: ${patientMetadata.duration || 'Unspecified'}
- Associated Symptoms: ${(patientMetadata.symptoms || []).join(', ') || 'None reported'}`
      : 'No patient clinical history supplied.';

    const systemPrompt = `You are a Senior Dermatologist and Machine Learning Lesion Diagnostic Specialist.
Analyze the provided skin lesion image and clinical metadata.
Perform a rigorous differential diagnostic evaluation and ABCDE melanoma assessment.
Adhere to clinical dermatology nomenclature and ICD-11 coding.

Classification Categories to consider:
1. Malignant Neoplasm (e.g. Superficial Spreading Melanoma, Nodular Melanoma, Basal Cell Carcinoma, Squamous Cell Carcinoma)
2. Premalignant (e.g. Actinic Keratosis, Dysplastic Nevus)
3. Benign Neoplasm (e.g. Melanocytic Nevus, Seborrheic Keratosis, Dermatofibroma, Hemangioma)
4. Inflammatory Dermatosis (e.g. Plaque Psoriasis, Atopic Dermatitis/Eczema, Lichen Planus, Rosacea)
5. Infectious / Fungal (e.g. Tinea Corporis, Impetigo, Herpes Zoster, Scabies)
6. Pigmentary / Other (e.g. Vitiligo, Melasma, Post-inflammatory Hyperpigmentation)

Evaluate ABCDE criteria strictly:
- Asymmetry (Symmetric / Mild Asymmetry / Marked Asymmetry)
- Border (Regular / Mildly Irregular / Markedly Irregular or Notched)
- Color (Uniform Single Shade / 2-3 Colors or Variegated / Marked Variegation 4+ Colors)
- Diameter (Estimated in mm and whether > 6mm)
- Evolution (Reported Stable / Moderate Evolution / Rapid Recent Changes)
Total Points: 0 to 9.

Assign Risk Level:
- "low": Benign profile
- "moderate": Follow-up or non-malignant inflammatory condition
- "high": Suspicious or premalignant lesion
- "urgent": Suspected melanoma or invasive malignant neoplasm requiring immediate excision

Output strictly valid JSON matching the defined schema.`;

    const userPrompt = `Please diagnose this dermatological lesion. ${clinicalContext}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType.includes('png') ? 'image/png' : 'image/jpeg',
              data: cleanBase64,
            },
          },
          { text: userPrompt },
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryDiagnosis: {
              type: Type.OBJECT,
              properties: {
                disease: { type: Type.STRING },
                confidence: { type: Type.NUMBER, description: 'Percentage 0-100' },
                category: {
                  type: Type.STRING,
                  enum: [
                    'Malignant Neoplasm',
                    'Premalignant',
                    'Benign Neoplasm',
                    'Inflammatory Dermatosis',
                    'Infectious / Fungal',
                    'Pigmentary / Other',
                  ],
                },
                icd11Code: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ['disease', 'confidence', 'category', 'icd11Code', 'description'],
            },
            riskLevel: {
              type: Type.STRING,
              enum: ['low', 'moderate', 'high', 'urgent'],
            },
            urgencyRationale: { type: Type.STRING },
            differentialDiagnoses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  disease: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  distinguishingFeature: { type: Type.STRING },
                },
                required: ['disease', 'confidence', 'category', 'description', 'distinguishingFeature'],
              },
            },
            abcdeCriteria: {
              type: Type.OBJECT,
              properties: {
                asymmetry: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.STRING, enum: ['Symmetric', 'Mild Asymmetry', 'Marked Asymmetry'] },
                    observation: { type: Type.STRING },
                    points: { type: Type.INTEGER },
                  },
                  required: ['score', 'observation', 'points'],
                },
                border: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.STRING, enum: ['Regular', 'Mildly Irregular', 'Markedly Irregular / Notched'] },
                    observation: { type: Type.STRING },
                    points: { type: Type.INTEGER },
                  },
                  required: ['score', 'observation', 'points'],
                },
                color: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.STRING, enum: ['Uniform Single Shade', '2-3 Colors / Variegated', 'Marked Variegation (4+ Colors)'] },
                    colorsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
                    observation: { type: Type.STRING },
                    points: { type: Type.INTEGER },
                  },
                  required: ['score', 'colorsDetected', 'observation', 'points'],
                },
                diameter: {
                  type: Type.OBJECT,
                  properties: {
                    estimatedMm: { type: Type.STRING },
                    isOver6mm: { type: Type.BOOLEAN },
                    observation: { type: Type.STRING },
                    points: { type: Type.INTEGER },
                  },
                  required: ['estimatedMm', 'isOver6mm', 'observation', 'points'],
                },
                evolution: {
                  type: Type.OBJECT,
                  properties: {
                    level: { type: Type.STRING, enum: ['Reported Stable', 'Moderate Evolution', 'Rapid Recent Changes'] },
                    observation: { type: Type.STRING },
                    points: { type: Type.INTEGER },
                  },
                  required: ['level', 'observation', 'points'],
                },
                totalPoints: { type: Type.INTEGER },
                assessment: { type: Type.STRING },
              },
              required: ['asymmetry', 'border', 'color', 'diameter', 'evolution', 'totalPoints', 'assessment'],
            },
            clinicalObservations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            selfCareAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            questionsForDoctor: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            whenToSeekImmediateCare: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            clinicalSummary: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
          },
          required: [
            'primaryDiagnosis',
            'riskLevel',
            'urgencyRationale',
            'differentialDiagnoses',
            'abcdeCriteria',
            'clinicalObservations',
            'recommendedActions',
            'selfCareAdvice',
            'questionsForDoctor',
            'whenToSeekImmediateCare',
            'clinicalSummary',
            'disclaimer',
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');

    // Attach scan metadata
    const report = {
      ...parsedData,
      id: `SCAN-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      imageUrl: imageBase64,
      modelUsed: 'gemini-3.8-flash',
      patientMetadata,
    };

    return res.json(report);
  } catch (err: any) {
    console.error('Error in /api/predict:', err);
    return res.status(500).json({
      error: err.message || 'Failed to process diagnostic prediction',
      fallbackAvailable: true,
    });
  }
});

/**
 * Endpoint: /api/tts
 * Generates natural audio readout using Gemini 3.8 Flash Lite TTS
 */
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Missing text in request body' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ useBrowserSpeech: true });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500),
              speechMetadata: {
                style: 'Clear, empathetic, professional clinical assistant',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        audioBase64: base64Audio,
        format: 'audio/wav',
        useBrowserSpeech: false,
      });
    }

    return res.json({ useBrowserSpeech: true });
  } catch (err) {
    console.warn('TTS API error, falling back to browser speech:', err);
    return res.json({ useBrowserSpeech: true });
  }
});

/**
 * Endpoint: /api/voice-assistant
 * Conversational responses to user questions regarding skin conditions, ABCDE criteria, or next steps
 */
app.post('/api/voice-assistant', async (req: Request, res: Response) => {
  try {
    const { question, contextReport } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Missing question in request body' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        answer: 'I am here to assist with your skin health evaluation. For accurate diagnosis of any unusual skin lesions or moles, please consult a certified dermatologist.',
      });
    }

    const contextStr = contextReport
      ? `The current diagnostic report shows:
Primary: ${contextReport.primaryDiagnosis.disease} (${Math.round(contextReport.primaryDiagnosis.confidence)}% confidence)
Risk Level: ${contextReport.riskLevel}
ABCDE Points: ${contextReport.abcdeCriteria.totalPoints}/9`
      : 'No active scan report loaded.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are DermAI Vision, an accessible voice assistant for skin disease screening.
Current context: ${contextStr}

User question: "${question}"

Provide a concise, medically grounded, empathetic answer in 2-3 sentences max.
Always emphasize that only a physician can provide definitive medical advice or biopsy. Keep it conversational for speech readout.`,
    });

    return res.json({ answer: response.text?.trim() || 'Please consult your healthcare provider.' });
  } catch (err: any) {
    console.error('Error in /api/voice-assistant:', err);
    return res.json({
      answer: 'I am currently unable to process that medical inquiry. Please consult your physician for personalized medical advice.',
    });
  }
});

// Start Express server and mount Vite in development
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DermAI Vision server running on http://0.0.0.0:${PORT} [${isProduction ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
