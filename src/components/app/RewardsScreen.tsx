import { motion } from "framer-motion";
import {
  Award,
  BookOpenCheck,
  Flame,
  Gift,
  Lock,
  Medal,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GlassPanel, ScreenHeader } from "./common";
import { cn } from "@/lib/utils";

const BADGES = [
  { title: "First Quiz Taken", icon: Star, earned: true, desc: "Complete your first quiz" },
  { title: "7-Day Streak", icon: Flame, earned: true, desc: "Study 7 days in a row" },
  { title: "Perfect Score", icon: Target, earned: true, desc: "Score 100% on a quiz" },
  { title: "Material Master", icon: BookOpenCheck, earned: true, desc: "Upload 20 materials" },
  { title: "Study Marathon", icon: Trophy, earned: false, desc: "Study 10 hours in a week" },
  { title: "Quiz Whiz", icon: Award, earned: false, desc: "Score 90%+ on 5 quizzes" },
  { title: "Group Leader", icon: Users, earned: false, desc: "Lead a study group" },
  { title: "Early Bird", icon: Sparkles, earned: false, desc: "5 sessions before 8 AM" },
];

const STREAK_REWARDS = [
  { days: 3, label: "3-day streak", reward: "+50 points", claimed: true },
  { days: 7, label: "7-day streak", reward: "Bonus badge", claimed: true },
  { days: 14, label: "14-day streak", reward: "+300 points", claimed: false, ready: true },
  { days: 30, label: "30-day streak", reward: "Premium week free", claimed: false, ready: false },
];

export function RewardsScreen() {
  const [rewards, setRewards] = useState(STREAK_REWARDS);

  const claim = (index: number) => {
    setRewards((prev) =>
      prev.map((r, i) => (i === index ? { ...r, claimed: true, ready: false } : r)),
    );
    toast("Reward claimed 🎁", {
      description: rewards[index].reward,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Rewards"
        subtitle="Every study session brings you closer to something fun."
      />

      {/* Points + level */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <GlassPanel className="relative overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-amber-100/80 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-[0_14px_28px_-12px_rgba(251,146,60,0.8)]">
              <Star className="size-6" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Zorbi Points
              </div>
              <div className="text-3xl font-bold tracking-tight text-slate-900">
                1,250
              </div>
            </div>
          </div>
          <div className="relative mt-6 rounded-2xl bg-white/80 p-4 ring-1 ring-white/90">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-800">Level 7</span>
              <span className="text-xs text-slate-400">
                1,250 / 1,500 pts
              </span>
            </div>
            <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-slate-200/70">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "83%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
              />
            </div>
            <p className="mt-2.5 text-xs text-slate-400">
              <span className="font-semibold text-orange-500">250 pts</span> to
              Level 8 — unlock the “Quiz Whiz” badge at Level 8.
            </p>
          </div>
        </GlassPanel>

        {/* Streak rewards */}
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Streak rewards
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Keep your streak alive to unlock bonuses
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-500">
              <Flame className="size-3.5" />
              7 days
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {rewards.map((reward, i) => (
              <div
                key={reward.days}
                className={cn(
                  "rounded-2xl p-4 ring-1 transition-all",
                  reward.claimed
                    ? "bg-emerald-50/70 ring-emerald-100/80"
                    : reward.ready
                      ? "bg-white/85 ring-amber-200 shadow-[0_10px_24px_-14px_rgba(251,146,60,0.5)]"
                      : "bg-white/60 ring-slate-200/80",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl",
                      reward.claimed
                        ? "bg-emerald-100 text-emerald-600"
                        : reward.ready
                          ? "bg-amber-100 text-amber-500"
                          : "bg-slate-100 text-slate-400",
                    )}
                  >
                    {reward.claimed ? (
                      <Medal className="size-5" />
                    ) : (
                      <Flame className="size-5" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-bold",
                      reward.claimed
                        ? "bg-emerald-100 text-emerald-600"
                        : reward.ready
                          ? "bg-amber-100 text-amber-600"
                          : "bg-slate-100 text-slate-400",
                    )}
                  >
                    {reward.days} days
                  </span>
                </div>
                <div className="mt-3 text-sm font-bold text-slate-800">
                  {reward.label}
                </div>
                <div className="mt-0.5 text-xs text-slate-400">
                  {reward.reward}
                </div>
                <button
                  type="button"
                  disabled={!reward.ready}
                  onClick={() => claim(i)}
                  className={cn(
                    "mt-3 w-full rounded-full py-2 text-xs font-semibold transition-all",
                    reward.claimed
                      ? "bg-emerald-100 text-emerald-600"
                      : reward.ready
                        ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-[0_10px_20px_-10px_rgba(251,146,60,0.7)] hover:-translate-y-px"
                        : "cursor-not-allowed bg-slate-100 text-slate-400",
                  )}
                >
                  {reward.claimed
                    ? "Claimed ✓"
                    : reward.ready
                      ? "Claim reward"
                      : "Locked"}
                </button>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Badges */}
      <div>
        <ScreenHeader
          title="Achievement badges"
          subtitle="Collect them all as you learn."
          className="mb-4"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn(
                "glass flex flex-col items-center gap-3 rounded-3xl p-5 text-center transition-all duration-300 hover:-translate-y-1",
                !badge.earned && "opacity-75",
              )}
            >
              <div
                className={cn(
                  "flex size-14 items-center justify-center rounded-2xl shadow-sm",
                  badge.earned
                    ? "bg-gradient-to-br from-indigo-500 to-violet-400 text-white shadow-[0_14px_28px_-12px_rgba(99,102,241,0.8)]"
                    : "bg-slate-100 text-slate-400",
                )}
              >
                {badge.earned ? (
                  <badge.icon className="size-6" />
                ) : (
                  <Lock className="size-5" />
                )}
              </div>
              <div>
                <div
                  className={cn(
                    "text-[13px] font-bold",
                    badge.earned ? "text-slate-800" : "text-slate-400",
                  )}
                >
                  {badge.title}
                </div>
                <div className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  {badge.desc}
                </div>
              </div>
              {badge.earned && (
                <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">
                  <Gift className="size-3" />
                  Earned
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
