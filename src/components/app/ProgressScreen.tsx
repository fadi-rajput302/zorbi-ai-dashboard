import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Flame, GraduationCap, Timer, TrendingUp } from "lucide-react";
import { useState } from "react";

import { GlassPanel, IconTile, ScreenHeader } from "./common";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  { name: "Mathematics", value: 80, bar: "from-indigo-500 to-sky-400", text: "text-indigo-600" },
  { name: "Physics", value: 70, bar: "from-violet-500 to-purple-400", text: "text-violet-600" },
  { name: "Chemistry", value: 65, bar: "from-emerald-500 to-teal-400", text: "text-emerald-600" },
  { name: "English", value: 90, bar: "from-amber-500 to-orange-400", text: "text-orange-500" },
];

const WEEKLY = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2 },
  { day: "Wed", hours: 0.5 },
  { day: "Thu", hours: 2.5 },
  { day: "Fri", hours: 1 },
  { day: "Sat", hours: 3 },
  { day: "Sun", hours: 2 },
];

const MONTHLY = [
  { day: "Wk 1", hours: 8 },
  { day: "Wk 2", hours: 11 },
  { day: "Wk 3", hours: 9.5 },
  { day: "Wk 4", hours: 12.5 },
];

const STREAK_DAYS = [
  { day: "Mon", active: true },
  { day: "Tue", active: true },
  { day: "Wed", active: true },
  { day: "Thu", active: true },
  { day: "Fri", active: true },
  { day: "Sat", active: true },
  { day: "Sun", active: true },
];

export function ProgressScreen() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const data = period === "week" ? WEEKLY : MONTHLY;
  const maxHours = Math.max(...data.map((d) => d.hours));

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Progress"
        subtitle="See how far you've come — and what's next."
        action={
          <div className="flex gap-1.5 rounded-full bg-white/80 p-1 ring-1 ring-slate-200/80">
            {(["week", "month"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all",
                  period === p
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_8px_18px_-8px_rgba(99,102,241,0.6)]"
                    : "text-slate-500 hover:text-indigo-600",
                )}
              >
                {p}ly
              </button>
            ))}
          </div>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Overall progress", value: "75%", icon: TrendingUp, tint: "bg-indigo-50 text-indigo-600" },
          { label: "Study time", value: "12.5h", icon: Timer, tint: "bg-orange-50 text-orange-500" },
          { label: "Quiz accuracy", value: "82%", icon: GraduationCap, tint: "bg-violet-50 text-violet-600" },
          { label: "Assignments done", value: "6/8", icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-600" },
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subject performance */}
        <GlassPanel className="p-6">
          <h2 className="text-base font-bold text-slate-900">Subject performance</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Mastery across your subjects
          </p>
          <div className="mt-6 space-y-4">
            {SUBJECTS.map(({ name, value, bar, text }, i) => (
              <div key={name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-slate-600">{name}</span>
                  <span className={cn("text-xs font-bold", text)}>{value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/70">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("h-full rounded-full bg-gradient-to-r", bar)}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Study hours chart */}
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Study hours</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {period === "week" ? "This week" : "Last 4 weeks"}
              </p>
            </div>
            <CalendarDays className="size-4 text-slate-300" />
          </div>

          <div className="mt-6 flex h-44 items-end justify-between gap-3">
            {data.map((d, i) => (
              <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[11px] font-semibold text-slate-500">
                  {d.hours}h
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(d.hours / maxHours) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "w-full max-w-10 rounded-t-xl",
                    d.day === "Sat" || (period === "month" && i === 3)
                      ? "bg-gradient-to-t from-indigo-500 to-violet-400 shadow-[0_10px_20px_-10px_rgba(99,102,241,0.6)]"
                      : "bg-gradient-to-t from-indigo-200 to-indigo-100",
                  )}
                  style={{ height: 0 }}
                />
                <span className="text-[10px] text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quiz performance */}
        <GlassPanel className="p-6">
          <h2 className="text-base font-bold text-slate-900">Quiz performance</h2>
          <p className="mt-0.5 text-xs text-slate-400">Your last five quizzes</p>
          <div className="mt-5 space-y-3">
            {[
              { title: "Derivatives Essentials", score: 92, tint: "from-indigo-500 to-violet-400" },
              { title: "Thermodynamics Basics", score: 85, tint: "from-violet-500 to-purple-400" },
              { title: "Chemical Bonding", score: 78, tint: "from-emerald-500 to-teal-400" },
              { title: "Algebra Basics", score: 95, tint: "from-sky-500 to-cyan-400" },
              { title: "Grammar & Tenses", score: 88, tint: "from-amber-500 to-orange-400" },
            ].map((quiz, i) => (
              <div key={quiz.title} className="flex items-center gap-3">
                <span className="w-40 truncate text-[13px] font-medium text-slate-600">
                  {quiz.title}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200/70">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${quiz.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.06 }}
                    className={cn("h-full rounded-full bg-gradient-to-r", quiz.tint)}
                  />
                </div>
                <span className="w-9 text-right text-xs font-bold text-slate-700">
                  {quiz.score}%
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Streak */}
        <GlassPanel className="relative overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-14 -top-14 size-44 rounded-full bg-orange-100/80 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-400 text-white shadow-[0_10px_20px_-8px_rgba(251,146,60,0.7)]">
              <Flame className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Study streak</h2>
              <p className="mt-0.5 text-xs text-slate-400">7 days — keep it up! 🔥</p>
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-7 gap-2">
            {STREAK_DAYS.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl text-sm font-bold transition-all",
                    day.active
                      ? "bg-gradient-to-br from-orange-400 to-amber-400 text-white shadow-[0_8px_16px_-8px_rgba(251,146,60,0.8)]"
                      : "bg-slate-100 text-slate-300",
                  )}
                >
                  {day.active ? <Flame className="size-4" /> : "·"}
                </div>
                <span className="text-[10px] text-slate-400">{day.day.slice(0, 1)}</span>
              </div>
            ))}
          </div>

          <div className="relative mt-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-4 ring-1 ring-orange-100/80">
            <div className="text-sm font-bold text-slate-800">
              You're on your longest streak!
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Study one more day to reach 8 — your next reward unlocks at
              14 days. 🏆
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
