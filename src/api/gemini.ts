import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ScorePayload {
  answers: Record<number, string>;
  mcScores: Record<number, number>;
  mcAnswerLabels: Record<number, string>;
}

export interface GeminiResult {
  q2_score: number;
  q2_feedback: string;
  q3_score: number;
  q3_feedback: string;
  q4_score: number;
  q4_feedback: string;
  q6_score: number;
  q6_feedback: string;
  q7_score: number;
  q7_feedback: string;
  total_score: number;
  recommendation: 'webinar' | 'advanced';
}

const MODEL_NAME = 'gemini-3-pro-preview';

const buildPrompt = ({ answers, mcScores, mcAnswerLabels }: ScorePayload) => `
Je bent een expert in AI-geletterdheid voor docenten. Beoordeel de volgende 7 antwoorden op vragen over AI in het onderwijs.

Voor de multiple choice vragen (1 en 5) is het antwoord al gescoord (1 = goed, 0 = fout).

Voor de open vragen (2, 3, 4, 6, 7) moet je per vraag 1 punt geven als het antwoord voldoende inzicht toont, of 0 punten als het te oppervlakkig/incorrect is. Gebruik de criteria hieronder.

ANTWOORDEN:
Vraag 1 (MC - Hoe werkt gen AI): ${mcScores[1] ?? 0} punt (antwoord was: ${mcAnswerLabels[1] ?? 'geen'})
Vraag 2 (Open - Prompting): "${answers[2] ?? ''}"  Score: noemt 3+ elementen (rol/doel/context/instructie/voorbeeld)?
Vraag 3 (Open - Custom chatbots): "${answers[3] ?? ''}"  Score: noemt technische én onderwijskundige aspecten?
Vraag 4 (Open - Frontend/DB/chatbot): "${answers[4] ?? ''}"  Score: legt alle drie de termen kort uit én benoemt samenwerking?
Vraag 5 (MC - Privacy): ${mcScores[5] ?? 0} punt (antwoord was: ${mcAnswerLabels[5] ?? 'geen'})
Vraag 6 (Open - AI-ready verslag): "${answers[6] ?? ''}"  Score: zet AI in als hulpmiddel (vergelijking/reflectie/proces) en maakt verslag meer AI-proof?
Vraag 7 (Open - Beperkingen): "${answers[7] ?? ''}"  Score: noemt 2+ echte beperkingen (hallucineren, beperkt wereldmodel, bias, etc.)?

OPDRACHT:
1. Score vraag 2, 3, 4, 6 en 7 (elk 0 of 1 punt)
2. Tel alle punten op (max 7)
3. Geef output in dit exacte JSON format:

{
  "q2_score": 0 or 1,
  "q2_feedback": "kort oordeel, max 15 woorden",
  "q3_score": 0 or 1,
  "q3_feedback": "kort oordeel, max 15 woorden",
  "q4_score": 0 or 1,
  "q4_feedback": "kort oordeel, max 15 woorden",
  "q6_score": 0 or 1,
  "q6_feedback": "kort oordeel, max 15 woorden",
  "q7_score": 0 or 1,
  "q7_feedback": "kort oordeel, max 15 woorden",
  "total_score": X,
  "recommendation": "webinar" or "advanced"
}

AANBEVELING LOGIC:
- Score 4-7 punten -> "advanced"
- Score 0-3 punten -> "webinar"

Wees streng maar rechtvaardig.`;

const extractJson = (raw: string) => {
  const codeBlockMatch = raw.match(/```(?:json)?\\s*([\\s\\S]*?)```/);
  const jsonCandidate = codeBlockMatch?.[1] ?? raw.match(/\{[\s\S]*\}/)?.[0] ?? raw;
  return JSON.parse(jsonCandidate);
};

export const scoreAssessment = async (payload: ScorePayload): Promise<GeminiResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key ontbreekt. Plaats VITE_GEMINI_API_KEY in .env.local en herstart de dev server.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const prompt = buildPrompt(payload);

  const response = await model.generateContent(prompt);
  const text = response.response.text();

  try {
    const parsed = extractJson(text);
    return {
      q2_score: Number(parsed.q2_score) || 0,
      q2_feedback: parsed.q2_feedback ?? '',
      q3_score: Number(parsed.q3_score) || 0,
      q3_feedback: parsed.q3_feedback ?? '',
      q4_score: Number(parsed.q4_score) || 0,
      q4_feedback: parsed.q4_feedback ?? '',
      q6_score: Number(parsed.q6_score) || 0,
      q6_feedback: parsed.q6_feedback ?? '',
      q7_score: Number(parsed.q7_score) || 0,
      q7_feedback: parsed.q7_feedback ?? '',
      total_score: Number(parsed.total_score) || 0,
      recommendation: parsed.recommendation === 'advanced' ? 'advanced' : 'webinar',
    };
  } catch (error) {
    console.error('Gemini response parse error', error, text);
    throw new Error('Kon het antwoord van Gemini niet lezen. Probeer het opnieuw.');
  }
};
