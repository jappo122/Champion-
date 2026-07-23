import { useState } from "react";
import { CarIcon, SalespersonIcon, CustomerIcon, HandshakeIcon, ClipboardIcon, TrophyIcon, QuestionIcon, KeyIcon, MoneyIcon, DealershipIcon, ChartIcon, getIllustrationForLesson } from "./quiz-illustrations";

interface QuizQuestionData {
  questionNumber: string;
  questionText: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

interface QuizQuestionProps {
  /** The raw markdown content of the quiz section */
  content: string;
  /** Optional lesson ID to pick the right illustration */
  lessonId?: string;
}

/** Parse a Quick Quiz markdown section into structured data */
function parseQuizContent(content: string): QuizQuestionData[] {
  const lines = content.split("\n").map((l) => l.trim()).filter((l) => l);
  const questions: QuizQuestionData[] = [];
  let currentQuestion: Partial<QuizQuestionData> | null = null;
  const options: { label: string; text: string }[] = [];
  let inAnswersBlock = false;
  // Map: question number → { correctAnswer, explanation }
  const answerMap: Record<string, { correct: string; explanation: string }> = {};

  for (const line of lines) {
    // Match **Q1:**, **Q2:** etc.
    const qMatch = line.match(/^\*\*Q(\d+):\*\*(.*)/);
    if (qMatch) {
      // Save previous question if exists
      if (currentQuestion && currentQuestion.questionText) {
        // If answer map has this question, apply it
        if (answerMap[currentQuestion.questionNumber!]) {
          currentQuestion.correctAnswer = answerMap[currentQuestion.questionNumber!].correct;
          currentQuestion.explanation = answerMap[currentQuestion.questionNumber!].explanation;
        }
        currentQuestion.options = [...options];
        questions.push(currentQuestion as QuizQuestionData);
      }
      options.length = 0;
      inAnswersBlock = false;
      currentQuestion = {
        questionNumber: qMatch[1],
        questionText: qMatch[2].trim(),
      };
      continue;
    }

    // Detect "Answers:" block header
    const answersHeaderMatch = line.match(/^Answers:?\s*$/i);
    if (answersHeaderMatch) {
      inAnswersBlock = true;
      continue;
    }

    // Parse answers in Answers: block format: "N. X — explanation" or "N) X — explanation"
    if (inAnswersBlock) {
      const ansBlockMatch = line.match(/^(\d+)[.\)]\s*([A-D])\s*[—–-]\s*(.*)/);
      if (ansBlockMatch) {
        answerMap[ansBlockMatch[1]] = {
          correct: ansBlockMatch[2],
          explanation: ansBlockMatch[3].trim(),
        };
        continue;
      }
      // Also try "N. X" without explanation
      const ansBlockSimple = line.match(/^(\d+)[.\)]\s*([A-D])\s*$/);
      if (ansBlockSimple) {
        answerMap[ansBlockSimple[1]] = {
          correct: ansBlockSimple[2],
          explanation: "",
        };
        continue;
      }
    }

    // Match A) text, B) text, etc.
    const optMatch = line.match(/^([A-D])\)\s*(.*)/);
    if (optMatch && currentQuestion) {
      options.push({ label: optMatch[1], text: optMatch[2].trim() });
      continue;
    }

    // Match *Answer: X — explanation*
    const ansMatch = line.match(/^\*Answer:\s*([A-D])\s*[—–-]\s*(.*)\*$/);
    if (ansMatch && currentQuestion) {
      currentQuestion.correctAnswer = ansMatch[1];
      currentQuestion.explanation = ansMatch[2].trim();
      continue;
    }

    // Match **(Correct: X)** format
    const boldCorrectMatch = line.match(/^\*\*\(Correct:\s*([A-D])\)\*\*\s*(.*)/);
    if (boldCorrectMatch && currentQuestion) {
      currentQuestion.correctAnswer = boldCorrectMatch[1];
      currentQuestion.explanation = boldCorrectMatch[2]?.trim() || "";
      continue;
    }

    // Match just **(Correct: X)** alone
    const boldCorrectOnly = line.match(/^\*\*\(Correct:\s*([A-D])\)\*\*$/);
    if (boldCorrectOnly && currentQuestion) {
      currentQuestion.correctAnswer = boldCorrectOnly[1];
      currentQuestion.explanation = "";
      continue;
    }
  }

  // Save the last question
  if (currentQuestion && currentQuestion.questionText) {
    if (answerMap[currentQuestion.questionNumber!]) {
      currentQuestion.correctAnswer = answerMap[currentQuestion.questionNumber!].correct;
      currentQuestion.explanation = answerMap[currentQuestion.questionNumber!].explanation;
    }
    currentQuestion.options = [...options];
    questions.push(currentQuestion as QuizQuestionData);
  }

  // Post-process: apply answerMap to any questions that were finalized
  // before the Answers: block was parsed (it comes after all questions)
  for (const q of questions) {
    if (!q.correctAnswer && answerMap[q.questionNumber]) {
      q.correctAnswer = answerMap[q.questionNumber].correct;
      q.explanation = answerMap[q.questionNumber].explanation;
    }
  }

  return questions;
}

export function QuizQuestion({ content, lessonId }: QuizQuestionProps) {
  const questions = parseQuizContent(content);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  if (questions.length === 0) {
    return null;
  }

  const Illustration = lessonId ? getIllustrationForLesson(lessonId) : QuestionIcon;

  const handleSelect = (qIdx: number, label: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: label }));
  };

  const handleCheck = (qIdx: number) => {
    setShowResults((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleReset = (qIdx: number) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[qIdx];
      return next;
    });
    setShowResults((prev) => {
      const next = { ...prev };
      delete next[qIdx];
      return next;
    });
  };

  const allAnswered = questions.every((_, idx) => selectedAnswers[idx]);
  const allChecked = questions.every((_, idx) => showResults[idx]);
  const correctCount = questions.filter((q, idx) => selectedAnswers[idx] === q.correctAnswer).length;

  return (
    <div className="mt-8 rounded-xl border border-[#1a2d4a] bg-[#0a1628] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-[#1a2d4a] bg-[#0d1f35] p-4 sm:p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1a2d4a]">
          <Illustration />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Quick Quiz</h3>
          <p className="text-xs text-gray-500">Test your knowledge with this scenario question</p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6 p-4 sm:p-5">
        {questions.map((q, qIdx) => {
          const isSelected = (label: string) => selectedAnswers[qIdx] === label;
          const isCorrect = selectedAnswers[qIdx] === q.correctAnswer;
          const showResult = showResults[qIdx];

          return (
            <div key={qIdx} className="rounded-lg border border-[#1a2d4a] bg-[#0d1f35] p-4">
              {/* Question text */}
              <p className="text-sm font-medium text-white">
                <span className="text-[#e63946]">Q{q.questionNumber}:</span> {q.questionText}
              </p>

              {/* Options */}
              <div className="mt-3 space-y-2">
                {q.options.map((opt) => {
                  const isAns = showResult && opt.label === q.correctAnswer;
                  const isWrong = showResult && isSelected(opt.label) && opt.label !== q.correctAnswer;

                  return (
                    <button
                      key={opt.label}
                      onClick={() => !showResult && handleSelect(qIdx, opt.label)}
                      disabled={showResult}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                        showResult
                          ? isAns
                            ? "border-green-500/50 bg-green-500/10 text-green-400"
                            : isWrong
                              ? "border-red-500/50 bg-red-500/10 text-red-400"
                              : "border-[#1a2d4a] text-gray-500 opacity-50"
                          : isSelected(opt.label)
                            ? "border-[#e63946] bg-[#e63946]/10 text-white"
                            : "border-[#1a2d4a] text-gray-400 hover:border-[#e63946]/50 hover:bg-[#e63946]/5"
                      }`}
                    >
                      {/* Radio circle */}
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          showResult && isAns
                            ? "border-green-500 bg-green-500"
                            : showResult && isWrong
                              ? "border-red-500 bg-red-500"
                              : isSelected(opt.label)
                                ? "border-[#e63946] bg-[#e63946]"
                                : "border-gray-600"
                        }`}
                      >
                        {showResult && isAns && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {showResult && isWrong && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        {!showResult && isSelected(opt.label) && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>
                      <span className="flex-1">
                        <span className="font-semibold">{opt.label})</span> {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="mt-3 flex items-center gap-3">
                {!showResult && selectedAnswers[qIdx] && (
                  <button
                    onClick={() => handleCheck(qIdx)}
                    className="rounded-lg bg-[#e63946] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#c1121f]"
                  >
                    Check Answer
                  </button>
                )}
                {showResult && (
                  <button
                    onClick={() => handleReset(qIdx)}
                    className="rounded-lg border border-[#1a2d4a] px-4 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-gray-500 hover:text-white"
                  >
                    Retry
                  </button>
                )}
              </div>

              {/* Result feedback */}
              {showResult && (
                <div
                  className={`mt-3 rounded-lg p-3 text-xs leading-relaxed ${
                    isCorrect
                      ? "border border-green-500/30 bg-green-500/5 text-green-400"
                      : "border border-red-500/30 bg-red-500/5 text-red-400"
                  }`}
                >
                  <span className="font-semibold">
                    {isCorrect ? "✓ Correct!" : "✗ Not quite."}
                  </span>{" "}
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall score footer */}
      {allChecked && (
        <div className="border-t border-[#1a2d4a] bg-[#0d1f35] px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {correctCount === questions.length ? (
                <>
                  <span className="text-green-500 font-bold">🎉 Perfect Score!</span>
                  <span className="text-gray-500">You got all {questions.length} right!</span>
                </>
              ) : correctCount >= questions.length / 2 ? (
                <>
                  <span className="text-yellow-500 font-bold">Good Job!</span>
                  <span className="text-gray-500">
                    {correctCount}/{questions.length} correct
                  </span>
                </>
              ) : (
                <>
                  <span className="text-gray-400 font-bold">Keep Practicing</span>
                  <span className="text-gray-500">
                    {correctCount}/{questions.length} correct
                  </span>
                </>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedAnswers({});
                setShowResults({});
              }}
              className="rounded-lg border border-[#1a2d4a] px-3 py-1 text-xs text-gray-400 transition-colors hover:border-gray-500 hover:text-white"
            >
              Reset All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}