import { useState } from 'react';
import { scoreAssessment, type GeminiResult } from './api/gemini';
import LoadingScreen from './components/LoadingScreen';
import QuestionFlow from './components/QuestionFlow';
import ResultsScreen from './components/ResultsScreen';
import SelfScanFlow from './components/SelfScanFlow';
import WelcomeScreen from './components/WelcomeScreen';
import { questions } from './data/questions';
import { selfScanItems } from './data/selfScan';

type Stage = 'welcome' | 'assessment' | 'selfscan' | 'loading' | 'results';

export type QuestionFeedback = {
  id: number;
  title: string;
  score: number; // 0-1 scale for radar
  feedback: string;
};

type ResultSummary = {
  totalScore: number;
  recommendation: 'webinar' | 'advanced';
  mode: 'assessment' | 'selfscan';
};

const App = () => {
  const [stage, setStage] = useState<Stage>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selfScanScores, setSelfScanScores] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<QuestionFeedback[]>([]);
  const [resultSummary, setResultSummary] = useState<ResultSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartAssessment = () => {
    setStage('assessment');
    setCurrentIndex(0);
    setAnswers({});
    setFeedback([]);
    setResultSummary(null);
    setError(null);
  };

  const handleStartSelfScan = () => {
    setStage('selfscan');
    setCurrentIndex(0);
    setSelfScanScores({});
    setFeedback([]);
    setResultSummary(null);
    setError(null);
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSelfScanAnswer = (id: number, value: number) => {
    setSelfScanScores((prev) => ({ ...prev, [id]: value }));
  };

  const computeMcScores = () => {
    const scores: Record<number, number> = {};
    questions.forEach((q) => {
      if (q.type === 'mc' && q.correctAnswer) {
        const answer = answers[q.id];
        scores[q.id] = answer === q.correctAnswer ? 1 : 0;
      }
    });
    return scores;
  };

  const computeMcLabels = () => {
    const labels: Record<number, string> = {};
    questions.forEach((q) => {
      if (q.type === 'mc' && answers[q.id]) {
        const option = q.options?.find((o) => o.id === answers[q.id]);
        labels[q.id] = option?.label ?? answers[q.id];
      }
    });
    return labels;
  };

  const buildFeedback = (geminiResult: GeminiResult, mcScores: Record<number, number>): QuestionFeedback[] => {
    const mcFeedback = (id: number): QuestionFeedback => {
      const question = questions.find((q) => q.id === id);
      const correctLabel = question?.options?.find((o) => o.id === question?.correctAnswer)?.label ?? 'N.v.t.';
      const score = mcScores[id] ?? 0;
      return {
        id,
        title: `Vraag ${id} - ${question?.theme ?? ''}`,
        score,
        feedback: score === 1 ? 'Goed beantwoord' : `Juiste antwoord: ${correctLabel}`,
      };
    };

    return [
      mcFeedback(1),
      { id: 2, title: 'Vraag 2 - Prompting', score: geminiResult.q2_score, feedback: geminiResult.q2_feedback },
      { id: 3, title: 'Vraag 3 - Custom chatbots', score: geminiResult.q3_score, feedback: geminiResult.q3_feedback },
      { id: 4, title: 'Vraag 4 - Frontend/DB/chatbot', score: geminiResult.q4_score, feedback: geminiResult.q4_feedback },
      mcFeedback(5),
      { id: 6, title: 'Vraag 6 - AI-ready toets', score: geminiResult.q6_score, feedback: geminiResult.q6_feedback },
      { id: 7, title: 'Vraag 7 - Beperkingen', score: geminiResult.q7_score, feedback: geminiResult.q7_feedback },
    ];
  };

  const submitAssessment = async () => {
    const allAnswered = questions.every((q) => Boolean(answers[q.id]?.trim()));
    if (!allAnswered) {
      setError('Beantwoord alle vragen voordat je afrondt.');
      setStage('assessment');
      return;
    }

    setStage('loading');
    setError(null);
    const mcScores = computeMcScores();
    const mcAnswerLabels = computeMcLabels();

    try {
      const geminiResult = await scoreAssessment({ answers, mcScores, mcAnswerLabels });
      setFeedback(buildFeedback(geminiResult, mcScores));
      const recommendation = geminiResult.total_score >= 4 ? 'advanced' : 'webinar';
      setResultSummary({
        totalScore: geminiResult.total_score,
        recommendation,
        mode: 'assessment',
      });
      setStage('results');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Er ging iets mis met de analyse. Probeer het opnieuw.';
      setError(message);
      setStage('assessment');
    }
  };

  const submitSelfScan = () => {
    const allAnswered = selfScanItems.every((item) => typeof selfScanScores[item.id] === 'number');
    if (!allAnswered) {
      setError('Beantwoord alle stellingen om af te ronden.');
      setStage('selfscan');
      return;
    }
    setError(null);
    const goodCount = selfScanItems.reduce((sum, item) => sum + (selfScanScores[item.id] === 3 ? 1 : 0), 0);
    const recommendation = goodCount >= 4 ? 'advanced' : 'webinar';
    const fb: QuestionFeedback[] = selfScanItems.map((item) => {
      const rating = selfScanScores[item.id];
      const normalized = Math.max(0, Math.min(1, rating / 3));
      const label = rating === 3 ? 'Sterk' : rating === 2 ? 'Redelijk' : 'Beginner';
      return {
        id: item.id,
        title: `Thema ${item.id} - ${item.theme}`,
        score: normalized,
        feedback: `${label} (gekozen: ${rating}/3)`,
      };
    });
    setFeedback(fb);
    setResultSummary({ totalScore: goodCount, recommendation, mode: 'selfscan' });
    setStage('results');
  };

  const handleProceedAssessment = async () => {
    if (stage !== 'assessment') return;
    const current = questions[currentIndex];
    if (!answers[current.id] || !answers[current.id].trim()) {
      setError('Beantwoord deze vraag om verder te gaan.');
      return;
    }
    setError(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
    await submitAssessment();
  };

  const handleProceedSelfScan = () => {
    if (stage !== 'selfscan') return;
    const current = selfScanItems[currentIndex];
    if (typeof selfScanScores[current.id] !== 'number') {
      setError('Kies een score om verder te gaan.');
      return;
    }
    setError(null);
    if (currentIndex < selfScanItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
    submitSelfScan();
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
    setError(null);
  };

  const handleRestart = () => {
    setAnswers({});
    setSelfScanScores({});
    setFeedback([]);
    setResultSummary(null);
    setCurrentIndex(0);
    setError(null);
    setStage('welcome');
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-darkPurple">AI voor Docenten</p>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">AI-geletterdheid check</h1>
          <p className="text-sm text-grayText">Kies AI-analyse of zelfscan. 7 thema’s. Direct een advies.</p>
        </div>
        <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-primaryPurple shadow-sm">
          Super dat je deze stap zet!
        </div>
      </div>

      {stage === 'welcome' && (
        <WelcomeScreen onStartAssessment={handleStartAssessment} onStartSelfScan={handleStartSelfScan} />
      )}

      {stage === 'assessment' && (
        <QuestionFlow
          questions={questions}
          currentIndex={currentIndex}
          answers={answers}
          onAnswer={handleAnswer}
          onBack={handleBack}
          onProceed={handleProceedAssessment}
          isLast={currentIndex === questions.length - 1}
          error={error}
        />
      )}

      {stage === 'selfscan' && (
        <SelfScanFlow
          currentIndex={currentIndex}
          scores={selfScanScores}
          onSelect={handleSelfScanAnswer}
          onBack={handleBack}
          onProceed={handleProceedSelfScan}
          isLast={currentIndex === selfScanItems.length - 1}
          error={error}
        />
      )}

      {stage === 'loading' && <LoadingScreen />}

      {stage === 'results' && resultSummary && (
        <ResultsScreen
          totalScore={resultSummary.totalScore}
          recommendation={resultSummary.recommendation}
          feedback={feedback}
          mode={resultSummary.mode}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
};

export default App;
