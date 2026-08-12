import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Clock, Play, RotateCcw, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { FilterChips, GlassPanel, IconTile, ScreenHeader } from "./common";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
}

interface Quiz {
  id: number;
  title: string;
  subject: string;
  time: string;
  questions: QuizQuestion[];
  tint: string;
}

const QUIZZES: Quiz[] = [
  {
    id: 1,
    title: "Derivatives Essentials",
    subject: "Mathematics",
    time: "15 min",
    tint: "bg-indigo-50 text-indigo-600",
    questions: [
      { q: "What is the derivative of x³?", options: ["2x²", "3x²", "3x³", "x²"], answer: 1 },
      { q: "d/dx [sin(x)] =", options: ["cos(x)", "−cos(x)", "−sin(x)", "tan(x)"], answer: 0 },
      { q: "The chain rule applies when…", options: ["a function is multiplied by a constant", "a function contains a sum", "a function is composed of nested functions", "a function is divided by x"], answer: 2 },
    ],
  },
  {
    id: 2,
    title: "Thermodynamics Basics",
    subject: "Physics",
    time: "20 min",
    tint: "bg-violet-50 text-violet-600",
    questions: [
      { q: "The first law of thermodynamics states…", options: ["ΔU = Q − W", "PV = nRT", "F = ma", "E = mc²"], answer: 0 },
      { q: "Heat spontaneously flows…", options: ["from cold to hot", "from hotter to colder bodies", "only in gases", "only in vacuums"], answer: 1 },
      { q: "Which process has Q = 0?", options: ["Isothermal", "Isobaric", "Isochoric", "Adiabatic"], answer: 3 },
    ],
  },
  {
    id: 3,
    title: "Chemical Bonding",
    subject: "Chemistry",
    time: "25 min",
    tint: "bg-emerald-50 text-emerald-600",
    questions: [
      { q: "A bond formed by sharing electrons is…", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], answer: 1 },
      { q: "Which molecule is nonpolar?", options: ["H₂O", "NH₃", "CO₂", "HCl"], answer: 2 },
      { q: "Electronegativity generally increases…", options: ["down a group", "across a period to the right", "with atomic radius", "in metals only"], answer: 1 },
    ],
  },
];

const COMPLETED = [
  { title: "Algebra Basics", subject: "Mathematics", score: "92%", date: "Aug 9" },
  { title: "Cells & Organelles", subject: "Biology", score: "85%", date: "Aug 7" },
  { title: "Grammar & Tenses", subject: "English", score: "78%", date: "Aug 5" },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "Mathematics", label: "Mathematics" },
  { id: "Physics", label: "Physics" },
  { id: "Chemistry", label: "Chemistry" },
];

const SUBJECT_BADGE: Record<string, string> = {
  Mathematics: "bg-indigo-50 text-indigo-600",
  Physics: "bg-violet-50 text-violet-600",
  Chemistry: "bg-emerald-50 text-emerald-600",
  English: "bg-sky-50 text-sky-600",
};

function QuizPlayer({ quiz, onExit }: { quiz: Quiz; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[index];
  const total = quiz.questions.length;

  const next = () => {
    if (selected === null) return;
    if (selected === question.answer) setScore((s) => s + 1);
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const retake = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const percent = Math.round((score / total) * 100);
    return (
      <GlassPanel className="flex flex-col items-center gap-4 py-14 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-[0_16px_32px_-12px_rgba(251,146,60,0.7)]"
        >
          <Trophy className="size-7" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900">
          {percent >= 80 ? "Excellent, Fahad! 🎉" : percent >= 50 ? "Good effort! 💪" : "Keep practicing! 🌱"}
        </h2>
        <p className="text-sm text-slate-500">
          You scored{" "}
          <span className="text-lg font-bold text-indigo-600">
            {score}/{total}
          </span>{" "}
          on {quiz.title}
        </p>
        <div className="flex h-2.5 w-full max-w-sm overflow-hidden rounded-full bg-slate-200/70">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
          />
        </div>
        <div className="mt-2 flex items-center gap-2.5">
          <button
            type="button"
            onClick={retake}
            className="flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/80 transition-all hover:text-indigo-600"
          >
            <RotateCcw className="size-3.5" />
            Retake
          </button>
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_22px_-10px_rgba(99,102,241,0.7)]"
          >
            Back to quizzes
          </button>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-white/80 hover:text-indigo-600"
        >
          <ArrowLeft className="size-3.5" />
          Exit quiz
        </button>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-medium",
            SUBJECT_BADGE[quiz.subject] ?? "bg-slate-100 text-slate-500",
          )}
        >
          {quiz.subject}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Question {index + 1} of {total}
          </span>
          <span className="font-semibold text-indigo-500">
            Score: {score}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/70">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <h2 className="mt-6 text-lg font-bold leading-snug text-slate-900">
        {question.q}
      </h2>

      <div className="mt-5 flex flex-col gap-2.5">
        {question.options.map((option, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition-all",
              selected === i
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_12px_26px_-12px_rgba(99,102,241,0.7)]"
                : "bg-white/85 text-slate-700 ring-1 ring-slate-200/80 hover:ring-indigo-300 hover:shadow-[0_8px_20px_-12px_rgba(79,108,240,0.4)]",
            )}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                selected === i
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              {String.fromCharCode(65 + i)}
            </span>
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={next}
          disabled={selected === null}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(99,102,241,0.7)] transition-all hover:-translate-y-px disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {index + 1 >= total ? "Finish quiz" : "Next question"}
          <Play className="size-3.5" />
        </button>
      </div>
    </GlassPanel>
  );
}

export function Quizzes() {
  const [filter, setFilter] = useState("all");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const available = QUIZZES.filter(
    (quiz) => filter === "all" || quiz.subject === filter,
  );

  if (activeQuiz) {
    return (
      <div className="flex flex-col gap-6">
        <ScreenHeader title={activeQuiz.title} subtitle="Take your time — Zorbi believes in you." />
        <QuizPlayer quiz={activeQuiz} onExit={() => setActiveQuiz(null)} />
      </div>
    );
  }

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    toast("Quiz started 🧠", { description: quiz.title });
  };

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Quizzes"
        subtitle="Test yourself and watch your mastery grow."
        action={
          <FilterChips options={FILTERS} active={filter} onChange={setFilter} />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {available.map((quiz) => (
          <GlassPanel
            key={quiz.id}
            className="group flex flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(28,40,92,0.04),0_24px_48px_-20px_rgba(79,108,240,0.32)]"
          >
            <div className="flex items-center justify-between">
              <IconTile icon={Trophy} tint={quiz.tint} />
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium",
                  SUBJECT_BADGE[quiz.subject] ?? "bg-slate-100 text-slate-500",
                )}
              >
                {quiz.subject}
              </span>
            </div>
            <h3 className="mt-4 text-[15px] font-bold text-slate-900">
              {quiz.title}
            </h3>
            <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
              <span>{quiz.questions.length} questions</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {quiz.time}
              </span>
            </div>
            <button
              type="button"
              onClick={() => startQuiz(quiz)}
              className="mt-5 flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_-10px_rgba(99,102,241,0.7)] transition-all hover:-translate-y-px"
            >
              <Play className="size-3.5" />
              Start Quiz
            </button>
          </GlassPanel>
        ))}
      </div>

      <div>
        <ScreenHeader
          title="Completed"
          subtitle="Your recent quiz results."
          className="mb-4"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {COMPLETED.map((quiz) => (
            <GlassPanel key={quiz.title} className="flex items-center gap-3.5 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-semibold text-slate-800">
                  {quiz.title}
                </div>
                <div className="mt-0.5 text-xs text-slate-400">
                  {quiz.subject} · {quiz.date}
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                {quiz.score}
              </span>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  );
}
