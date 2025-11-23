import { useState } from 'react';
import { scoreAssessment, type GeminiResult } from './api/gemini';
import LoadingScreen from './components/LoadingScreen';
import QuestionFlow from './components/QuestionFlow';
import ResultsScreen from './components/ResultsScreen';
import WelcomeScreen from './components/WelcomeScreen';
import { questions } from './data/questions';

type Stage = 'welcome' | 'questions' | 'loading' | 'results';

export type QuestionFeedback = {
  id: number;
  title: string;
  score: number;
  feedback: string;
};

const App = () => {
  const [stage, setStage] = useState<Stage>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<GeminiResult | null>(null);
  const [feedback, setFeedback] = useState<QuestionFeedback[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setStage('questions');
    setCurrentIndex(0);
    setResults(null);
    setFeedback([]);
    setError(null);
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
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
      setStage('questions');
      return;
    }

    setStage('loading');
    setError(null);
    const mcScores = computeMcScores();
    const mcAnswerLabels = computeMcLabels();

    try {
      const geminiResult = await scoreAssessment({ answers, mcScores, mcAnswerLabels });
      setResults(geminiResult);
      setFeedback(buildFeedback(geminiResult, mcScores));
      setStage('results');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Er ging iets mis met de analyse. Probeer het opnieuw.';
      setError(message);
      setStage('questions');
    }
  };

  const handleProceed = async () => {
    if (stage !== 'questions') return;
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

  const handleBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
    setError(null);
  };

  const handleRestart = () => {
    setAnswers({});
    setResults(null);
    setFeedback([]);
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
          <p className="text-sm text-grayText">7 vragen. 7 minuten. Direct een advies.</p>
        </div>
        <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-primaryPurple shadow-sm">
          Super dat je deze stap zet!
        </div>
      </div>

      {stage === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {stage === 'questions' && (
        <QuestionFlow
          questions={questions}
          currentIndex={currentIndex}
          answers={answers}
          onAnswer={handleAnswer}
          onBack={handleBack}
          onProceed={handleProceed}
          isLast={currentIndex === questions.length - 1}
          error={error}
        />
      )}
      {stage === 'loading' && <LoadingScreen />}
      {stage === 'results' && results && (
        <ResultsScreen results={results} feedback={feedback} onRestart={handleRestart} />
      )}
    </main>
  );
};

export default App;
