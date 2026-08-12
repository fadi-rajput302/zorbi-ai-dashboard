import { motion } from "framer-motion";
import { CalendarDays, Check, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GlassPanel, IconTile, ScreenHeader } from "./common";
import { cn } from "@/lib/utils";

interface Assignment {
  id: number;
  title: string;
  subject: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  progress: number;
  done: boolean;
  result?: string;
}

const SEED: Assignment[] = [
  { id: 1, title: "Calculus Assignment — Integrals", subject: "Mathematics", due: "Aug 14, 2026", priority: "High", progress: 60, done: false },
  { id: 2, title: "Physics Lab Report — Chapter 6", subject: "Physics", due: "Aug 15, 2026", priority: "Medium", progress: 30, done: false },
  { id: 3, title: "Chemistry Quiz Prep Worksheet", subject: "Chemistry", due: "Aug 16, 2026", priority: "Low", progress: 10, done: false },
  { id: 4, title: "English Essay First Draft", subject: "English", due: "Aug 17, 2026", priority: "Medium", progress: 45, done: false },
  { id: 5, title: "Algebra Problem Set", subject: "Mathematics", due: "Aug 10, 2026", priority: "High", progress: 100, done: true, result: "A" },
  { id: 6, title: "Physics Chapter 5 Quiz", subject: "Physics", due: "Aug 9, 2026", priority: "Medium", progress: 100, done: true, result: "A–" },
  { id: 7, title: "Chemistry Lab Safety Module", subject: "Chemistry", due: "Aug 8, 2026", priority: "Low", progress: 100, done: true, result: "A+" },
];

const PRIORITY_STYLES: Record<Assignment["priority"], string> = {
  High: "bg-rose-50 text-rose-500",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

const SUBJECT_BADGE: Record<string, string> = {
  Mathematics: "bg-indigo-50 text-indigo-600",
  Physics: "bg-violet-50 text-violet-600",
  Chemistry: "bg-emerald-50 text-emerald-600",
  English: "bg-sky-50 text-sky-600",
};

const SUBJECT_TINT: Record<string, string> = {
  Mathematics: "bg-indigo-50 text-indigo-600",
  Physics: "bg-violet-50 text-violet-600",
  Chemistry: "bg-emerald-50 text-emerald-600",
  English: "bg-sky-50 text-sky-600",
};

export function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(SEED);
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");

  const upcoming = assignments.filter((a) => !a.done);
  const completed = assignments.filter((a) => a.done);
  const avgProgress = Math.round(
    upcoming.reduce((sum, a) => sum + a.progress, 0) / Math.max(1, upcoming.length),
  );

  const toggleDone = (id: number) => {
    const target = assignments.find((a) => a.id === id);
    if (!target) return;
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, done: !a.done, progress: a.done ? a.progress : 100 }
          : a,
      ),
    );
    toast("Assignment updated", {
      description: target.done
        ? "Moved back to upcoming."
        : "Great job — marked as completed! 🎉",
    });
  };

  const aiAssist = (title: string) =>
    toast("Zorbi is helping 🧠", {
      description: `Opening a step-by-step guide for “${title}”…`,
    });

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Assignments"
        subtitle="Stay on top of deadlines with Zorbi's help."
        action={
          <div className="flex gap-1.5 rounded-full bg-white/80 p-1 ring-1 ring-slate-200/80">
            {(["upcoming", "completed"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all",
                  tab === t
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_8px_18px_-8px_rgba(99,102,241,0.6)]"
                    : "text-slate-500 hover:text-indigo-600",
                )}
              >
                {t}
                <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                  {t === "upcoming" ? upcoming.length : completed.length}
                </span>
              </button>
            ))}
          </div>
        }
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Due this week", value: String(upcoming.length), icon: CalendarDays, tint: "bg-orange-50 text-orange-500" },
          { label: "Completed", value: String(completed.length), icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-600" },
          { label: "Avg. progress", value: `${avgProgress}%`, icon: Sparkles, tint: "bg-indigo-50 text-indigo-600" },
        ].map(({ label, value, icon, tint }) => (
          <GlassPanel key={label} className="flex items-center gap-3.5 p-4">
            <IconTile icon={icon} tint={tint} />
            <div>
              <div className="text-xl font-bold leading-none text-slate-900">{value}</div>
              <div className="mt-1 text-xs text-slate-400">{label}</div>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {(tab === "upcoming" ? upcoming : completed).map((assignment, i) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <GlassPanel className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={() => toggleDone(assignment.id)}
                aria-label={assignment.done ? "Mark as not completed" : "Mark as completed"}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  assignment.done
                    ? "border-emerald-400 bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-[0_4px_10px_-4px_rgba(16,185,129,0.6)]"
                    : "border-slate-300 bg-white/80 hover:border-indigo-400",
                )}
              >
                {assignment.done ? (
                  <Check className="size-3.5" strokeWidth={3} />
                ) : (
                  <Circle className="size-3.5 text-slate-300" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "truncate text-[14px] font-semibold",
                      assignment.done ? "text-slate-400 line-through" : "text-slate-800",
                    )}
                  >
                    {assignment.title}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      PRIORITY_STYLES[assignment.priority],
                    )}
                  >
                    {assignment.priority}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-medium",
                      SUBJECT_BADGE[assignment.subject],
                    )}
                  >
                    {assignment.subject}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-3" />
                    Due {assignment.due}
                  </span>
                  {assignment.done && assignment.result && (
                    <span className="font-semibold text-emerald-600">
                      Grade: {assignment.result}
                    </span>
                  )}
                </div>

                {!assignment.done && (
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200/70">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-500"
                      style={{ width: `${assignment.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {!assignment.done && (
                <button
                  type="button"
                  onClick={() => aiAssist(assignment.title)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                >
                  <Sparkles className="size-3.5" />
                  AI assist
                </button>
              )}
            </GlassPanel>
          </motion.div>
        ))}

        {tab === "upcoming" && upcoming.length === 0 && (
          <GlassPanel className="flex flex-col items-center gap-2 py-12 text-center">
            <CheckCircle2 className="size-8 text-emerald-400" />
            <p className="text-sm font-semibold text-slate-700">
              All caught up!
            </p>
            <p className="text-xs text-slate-400">
              No pending assignments. Enjoy the free time — or start a new one.
            </p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
