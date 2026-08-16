import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  Crown,
  FileText,
  FileType,
  Flame,
  FolderOpen,
  Gift,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  MoreHorizontal,
  NotebookPen,
  Presentation,
  Search,
  Send,
  Settings,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AmbientBackground } from "@/components/AmbientBackground";
import { ZorbiMascot } from "@/components/ZorbiMascot";
import { AiTutor } from "@/components/app/AiTutor";
import { Assignments } from "@/components/app/Assignments";
import { Materials } from "@/components/app/Materials";
import { Notes } from "@/components/app/Notes";
import { ProgressScreen } from "@/components/app/ProgressScreen";
import { Quizzes } from "@/components/app/Quizzes";
import { RewardsScreen } from "@/components/app/RewardsScreen";
import { SettingsScreen } from "@/components/app/SettingsScreen";
import { StudyGroups } from "@/components/app/StudyGroups";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type ScreenId =
  | "dashboard"
  | "tutor"
  | "materials"
  | "assignments"
  | "notes"
  | "quizzes"
  | "progress"
  | "rewards"
  | "groups"
  | "settings";

const NAV_ITEMS: {
  id: ScreenId;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tutor", label: "AI Tutor", icon: Bot },
  { id: "materials", label: "My Materials", icon: FolderOpen },
  { id: "assignments", label: "Assignments", icon: ClipboardList, badge: "3" },
  { id: "notes", label: "Notes", icon: NotebookPen },
  { id: "quizzes", label: "Quizzes", icon: ListChecks },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "groups", label: "Study Groups", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

/* ------------------------------------------------------------------ */
/*  Data (home widgets)                                              */
/* ------------------------------------------------------------------ */

const STATS = [
  { label: "Materials", value: "24", sub: "Uploaded by you", icon: BookOpen, tint: "bg-sky-50 text-sky-500" },
  { label: "Assignments", value: "8", sub: "Pending tasks", icon: ClipboardList, tint: "bg-violet-50 text-violet-500" },
  { label: "Quizzes", value: "15", sub: "Attempted", icon: BarChart3, tint: "bg-emerald-50 text-emerald-500" },
  { label: "Points", value: "1,250", sub: "Zorbi Points", icon: Trophy, tint: "bg-amber-50 text-amber-500" },
];

const MATERIALS = [
  { name: "Calculus Notes.pdf", type: "PDF", size: "12 MB", date: "Uploaded 2h ago", tag: "Mathematics", icon: FileText, tint: "bg-rose-50 text-rose-500" },
  { name: "Physics Chapter 5.pptx", type: "PPTX", size: "8.4 MB", date: "Uploaded 1d ago", tag: "Physics", icon: Presentation, tint: "bg-orange-50 text-orange-500" },
  { name: "Chemistry Formula Sheet.pdf", type: "PDF", size: "2.1 MB", date: "Uploaded 2d ago", tag: "Chemistry", icon: FileText, tint: "bg-rose-50 text-rose-500" },
  { name: "English Essay Guide.docx", type: "DOCX", size: "1.5 MB", date: "Uploaded 3d ago", tag: "English", icon: FileType, tint: "bg-sky-50 text-sky-600" },
];

interface PlanTask {
  id: number;
  time: string;
  title: string;
  subject: string;
  done: boolean;
}

const INITIAL_PLAN: PlanTask[] = [
  { id: 1, time: "10:00 AM", title: "Complete Calculus Assignment", subject: "Math", done: false },
  { id: 2, time: "01:00 PM", title: "Study Physics – Chapter 6", subject: "Physics", done: true },
  { id: 3, time: "04:00 PM", title: "Attempt Quiz – Chemistry", subject: "Chemistry", done: false },
  { id: 4, time: "07:00 PM", title: "Revise English Essay", subject: "English", done: false },
];

const SUBJECTS = [
  { name: "Mathematics", value: 80, bar: "from-indigo-500 to-sky-400", text: "text-indigo-600" },
  { name: "Physics", value: 70, bar: "from-violet-500 to-purple-400", text: "text-violet-600" },
  { name: "Chemistry", value: 65, bar: "from-emerald-500 to-teal-400", text: "text-emerald-600" },
  { name: "English", value: 90, bar: "from-amber-500 to-orange-400", text: "text-orange-500" },
];

const PARTICLES = [
  { left: "16%", top: "24%", size: 9, delay: 0, duration: 7, bg: "bg-indigo-300/70" },
  { left: "30%", top: "58%", size: 6, delay: 1.4, duration: 8, bg: "bg-sky-300/70" },
  { left: "70%", top: "20%", size: 7, delay: 0.8, duration: 6.5, bg: "bg-violet-300/70" },
  { left: "78%", top: "54%", size: 5, delay: 2.2, duration: 9, bg: "bg-emerald-300/60" },
  { left: "22%", top: "42%", size: 5, delay: 3, duration: 8.5, bg: "bg-amber-300/60" },
  { left: "64%", top: "36%", size: 6, delay: 1.9, duration: 7.5, bg: "bg-indigo-300/60" },
];

/* ------------------------------------------------------------------ */
/*  Sidebar                                                          */
/* ------------------------------------------------------------------ */

function SidebarNav({
  active,
  onSelect,
  onNavigate,
}: {
  active: ScreenId;
  onSelect: (id: ScreenId) => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2">
        <ZorbiMascot size={38} glow={false} />
        <div className="text-[17px] font-bold tracking-tight text-slate-900">
          Zorbi <span className="text-brand-gradient font-extrabold">AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              onSelect(id);
              onNavigate?.();
            }}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active === id
                ? "bg-indigo-50/90 text-indigo-600 shadow-[0_1px_2px_rgba(28,40,92,0.04),0_6px_16px_-10px_rgba(79,108,240,0.35)]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            <Icon
              className={cn(
                "size-[18px] shrink-0 transition-colors",
                active === id
                  ? "text-indigo-500"
                  : "text-slate-400 group-hover:text-indigo-500",
              )}
              strokeWidth={active === id ? 2.2 : 2}
            />
            <span className="flex-1 text-left">{label}</span>
            {badge && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  active === id
                    ? "bg-indigo-500 text-white"
                    : "bg-orange-100 text-orange-500",
                )}
              >
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Premium card */}
      <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100 p-4 ring-1 ring-amber-200/60 shadow-[0_14px_32px_-18px_rgba(217,119,6,0.4)]">
        <div className="absolute -right-3 -top-3 flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-[0_8px_16px_-6px_rgba(245,158,11,0.55)]">
          <Crown className="size-4" />
        </div>
        <div className="relative pr-1.5">
          <div className="text-sm font-bold text-slate-900">Go Premium</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Unlock unlimited uploads, AI tutor 24/7, and more.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelect("settings");
              onNavigate?.();
            }}
            className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_-8px_rgba(99,102,241,0.65)] transition-all hover:-translate-y-px hover:shadow-[0_14px_24px_-8px_rgba(99,102,241,0.75)]"
          >
            Upgrade Now
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  active,
  onSelect,
}: {
  active: ScreenId;
  onSelect: (id: ScreenId) => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-slate-200/70 bg-white/85 px-4 py-6 backdrop-blur-2xl lg:flex">
      <SidebarNav active={active} onSelect={onSelect} />
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Top bar                                                          */
/* ------------------------------------------------------------------ */

function SearchInput({ onAskTutor }: { onAskTutor: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const submit = () => {
    if (!query.trim()) return;
    onAskTutor(query);
    setQuery("");
  };

  return (
    <div className="glass-soft flex h-12 flex-1 items-center gap-2 rounded-full pl-5 pr-2 transition-shadow focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.14),0_12px_28px_-12px_rgba(79,108,240,0.28)]">
      <Search className="size-[18px] shrink-0 text-slate-400" strokeWidth={2.2} />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Ask Zorbi anything..."
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
      />
      <kbd className="hidden shrink-0 rounded-md border border-slate-200/80 bg-white/80 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-400 shadow-sm sm:block">
        Ctrl /
      </kbd>
      <button
        type="button"
        onClick={submit}
        aria-label="Send question to Zorbi"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_6px_16px_-6px_rgba(99,102,241,0.65)] transition-all hover:scale-105 hover:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.75)] active:scale-95"
      >
        <Send className="size-4" />
      </button>
    </div>
  );
}

function TopBar({
  onAskTutor,
}: {
  onAskTutor: (query: string) => void;
}) {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="flex items-center gap-5">
      <div className="mx-auto hidden w-full max-w-xl md:block">
        <SearchInput onAskTutor={onAskTutor} />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2.5">
        <button
          type="button"
          onClick={() =>
            toast("Upgrade to Pro", {
              description: "Checkout is coming soon — we'll wire up Stripe!",
            })
          }
          className="hidden items-center gap-1.5 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold text-violet-600 shadow-[0_6px_16px_-8px_rgba(124,58,237,0.35)] ring-1 ring-violet-200/80 transition-all hover:-translate-y-px hover:bg-white hover:shadow-[0_10px_22px_-8px_rgba(124,58,237,0.45)] sm:flex"
        >
          <Crown className="size-3.5" />
          Upgrade to Pro
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="glass-soft relative flex size-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-indigo-600"
        >
          <Bell className="size-[18px]" strokeWidth={2.1} />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-orange-400 ring-2 ring-white" />
        </button>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-white/80"
            >
              <Avatar className="size-10 ring-2 ring-white shadow-[0_6px_16px_-8px_rgba(79,108,240,0.5)]">
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-violet-400 text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "F"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-left leading-tight lg:block">
                <span className="block text-[13px] font-semibold text-slate-800">
                  {user?.name ?? "Fahad"}
                </span>
                <span className="block text-[11px] text-slate-400">Student</span>
              </span>
              <ChevronDown
                className={cn(
                  "hidden size-4 text-slate-400 transition-transform lg:block",
                  open && "rotate-180",
                )}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="glass w-52 rounded-2xl border-white/70 p-1.5 shadow-xl"
          >
            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-sm">
              Profile settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-sm">
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200/70" />
            <DropdownMenuItem
              onSelect={handleSignOut}
              className="cursor-pointer rounded-xl px-3 py-2 text-sm text-rose-500 focus:text-rose-600"
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Home widgets                                                     */
/* ------------------------------------------------------------------ */

function Hero({
  name,
  onStartLearning,
}: {
  name?: string;
  onStartLearning: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-b from-white/95 via-white/80 to-indigo-50/70 p-7 shadow-[0_1px_2px_rgba(28,40,92,0.05),0_24px_60px_-28px_rgba(79,108,240,0.35)] backdrop-blur-2xl sm:p-9">
      <div className="pointer-events-none absolute -left-24 -top-28 size-72 rounded-full bg-indigo-100/80 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 size-80 rounded-full bg-violet-100/70 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="relative">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-bold leading-tight tracking-tight text-slate-900">
              Hello, {name ?? "Fahad"}! 👋
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Ready to learn something amazing today?
            </p>
          </div>
        </div>

        <div className="relative mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="glass-chip relative max-w-xs rounded-3xl p-5 lg:justify-self-start"
        >
          <div className="flex items-center gap-3">
            <ZorbiMascot size={44} glow={false} />
            <div className="text-sm font-bold text-slate-900">I'm Zorbi!</div>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
            Your AI study buddy. Ask me anything, I'm here to help!
          </p>
          <div className="absolute -bottom-3 -right-3 flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-[0_8px_16px_-6px_rgba(124,58,237,0.65)]">
            <Check className="size-4" strokeWidth={3} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto flex items-end justify-center"
          style={{ height: 300 }}
        >
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className={cn("animate-zorbi-rise absolute rounded-full", p.bg)}
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
          <div className="pointer-events-none absolute bottom-8 left-1/2 h-40 w-[300px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
          <button
            type="button"
            onClick={onStartLearning}
            aria-label="Start learning with Zorbi"
            className="relative z-10 cursor-pointer rounded-full transition-transform duration-300 hover:scale-[1.04] active:scale-95"
          >
            <ZorbiMascot size={180} float />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="glass-chip max-w-xs rounded-3xl p-5 lg:justify-self-end"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-400 text-white shadow-[0_10px_20px_-8px_rgba(251,146,60,0.7)]">
              <Flame className="size-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Study Streak
              </div>
              <div className="text-xl font-bold text-slate-900">7 Days</div>
            </div>
          </div>

          <svg viewBox="0 0 120 40" className="mt-4 w-full" aria-hidden="true">
            <defs>
              <linearGradient id="streak-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="streak-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
            <path d="M 0 32 L 20 26 L 40 29 L 60 20 L 80 23 L 100 12 L 120 4 L 120 40 L 0 40 Z" fill="url(#streak-fill)" />
            <path d="M 0 32 L 20 26 L 40 29 L 60 20 L 80 23 L 100 12 L 120 4" fill="none" stroke="url(#streak-stroke)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="120" cy="4" r="4" fill="#34d399" />
          </svg>

          <div className="mt-3">
            <span className="text-[13px] font-semibold text-slate-700">
              Keep it up! 🔥
            </span>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map(({ label, value, sub, icon: Icon, tint }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
          className="glass group rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(28,40,92,0.04),0_24px_48px_-20px_rgba(79,108,240,0.32)]"
        >
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105",
                tint,
              )}
            >
              <Icon className="size-5" strokeWidth={2.1} />
            </div>
            <ArrowRight className="size-4 text-slate-300 transition-colors group-hover:text-indigo-400" />
          </div>
          <div className="mt-4 text-[13px] font-medium text-slate-500">{label}</div>
          <div className="mt-0.5 text-[28px] font-bold leading-none tracking-tight text-slate-900">
            {value}
          </div>
          <div className="mt-2 text-xs text-slate-400">{sub}</div>
        </motion.div>
      ))}
    </div>
  );
}

function RecentMaterials({ onViewAll }: { onViewAll: () => void }) {
  return (
    <section className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Recent Materials</h2>
          <p className="mt-0.5 text-xs text-slate-400">Your latest study files</p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          View all
          <ArrowUpRight className="size-3.5" />
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        {MATERIALS.map(({ name, type, size, date, tag, icon: Icon, tint }) => (
          <div
            key={name}
            className="group flex cursor-pointer items-center gap-3.5 rounded-2xl px-3 py-3 transition-all duration-200 hover:bg-white/90 hover:shadow-[0_8px_20px_-12px_rgba(79,108,240,0.35)]"
          >
            <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tint)}>
              <Icon className="size-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-semibold text-slate-800">{name}</div>
              <div className="mt-0.5 text-xs text-slate-400">
                {type} · {size} · {date}
              </div>
            </div>
            <Badge
              variant="secondary"
              className="hidden shrink-0 rounded-full bg-slate-100/80 px-2.5 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-white/80 sm:inline-flex"
            >
              {tag}
            </Badge>
            <button
              type="button"
              aria-label={`More options for ${name}`}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-300 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-500 group-hover:opacity-100"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function TodayPlan({ onViewAll }: { onViewAll: () => void }) {
  const [tasks, setTasks] = useState<PlanTask[]>(INITIAL_PLAN);

  const toggle = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <section className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Today's Plan</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          View all
          <ArrowUpRight className="size-3.5" />
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "group flex items-center gap-3.5 rounded-2xl px-3 py-3 transition-all duration-200",
              task.done
                ? "opacity-70"
                : "hover:bg-white/90 hover:shadow-[0_8px_20px_-12px_rgba(79,108,240,0.35)]",
            )}
          >
            <button
              type="button"
              onClick={() => toggle(task.id)}
              aria-label={task.done ? "Mark as not done" : "Mark as done"}
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                task.done
                  ? "border-violet-400 bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-[0_4px_10px_-4px_rgba(139,92,246,0.6)]"
                  : "border-slate-300 bg-white/80 hover:border-violet-400",
              )}
            >
              {task.done && <Check className="size-3.5" strokeWidth={3} />}
            </button>
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  "truncate text-[13.5px] font-semibold",
                  task.done ? "text-slate-400 line-through" : "text-slate-800",
                )}
              >
                {task.title}
              </div>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-white/80 sm:flex">
              <CalendarDays className="size-3.5" />
              {task.time}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProgressCard({ onDetails }: { onDetails: () => void }) {
  return (
    <section className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Your Progress</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Keep going — you're doing great!
          </p>
        </div>
        <button
          type="button"
          onClick={onDetails}
          className="flex items-center gap-1 rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200/80 transition-colors hover:text-indigo-600"
        >
          This Month
          <ChevronDown className="size-3.5" />
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <div className="relative size-36 shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <defs>
              <linearGradient id="progress-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e8ecf8" strokeWidth="10" />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#progress-ring)"
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 0.75 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[26px] font-bold leading-none text-slate-900">75%</span>
            <span className="mt-1 text-center text-[10px] font-medium leading-tight text-slate-400">
              Overall Progress
            </span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-4">
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
      </div>
    </section>
  );
}

function AskZorbiCard({ onAsk }: { onAsk: (question: string) => void }) {
  const [question, setQuestion] = useState("");

  const submit = () => {
    if (!question.trim()) return;
    onAsk(question);
    setQuestion("");
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-indigo-50/90 via-white/80 to-violet-50/90 p-6 shadow-[0_1px_2px_rgba(28,40,92,0.04),0_20px_48px_-24px_rgba(124,108,240,0.4)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-10 -top-14 size-44 rounded-full bg-violet-100/70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 size-44 rounded-full bg-sky-100/80 blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">Ask Zorbi</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
            What do you want to learn today? Get instant explanations, summaries
            and practice questions.
          </p>
        </div>
        <ZorbiMascot size={56} className="shrink-0" float />
      </div>

      <div className="relative mt-5 flex items-center gap-2 rounded-full bg-white/85 p-1.5 pl-5 shadow-[0_10px_28px_-14px_rgba(79,108,240,0.45)] ring-1 ring-white/90 transition-shadow focus-within:ring-2 focus-within:ring-indigo-300/60">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Type your question..."
          className="h-9 min-w-0 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          aria-label="Ask Zorbi"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_8px_18px_-8px_rgba(99,102,241,0.7)] transition-all hover:scale-105 active:scale-95"
        >
          <Send className="size-4" />
        </button>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium text-slate-400">Try asking:</span>
        {["Explain derivatives", "Summarize Chapter 5", "Quiz me on Chemistry"].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setQuestion(suggestion)}
            className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200/80 transition-all hover:-translate-y-px hover:text-indigo-600 hover:ring-indigo-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}

function DashboardHome({
  name,
  onOpenTutor,
  onOpenMaterials,
  onOpenProgress,
  onOpenAssignments,
  onAsk,
}: {
  name?: string;
  onOpenTutor: () => void;
  onOpenMaterials: () => void;
  onOpenProgress: () => void;
  onOpenAssignments: () => void;
  onAsk: (query: string) => void;
}) {
  return (
    <>
      <Hero name={name} onStartLearning={onOpenTutor} />
      <StatsGrid />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentMaterials onViewAll={onOpenMaterials} />
        <TodayPlan onViewAll={onOpenAssignments} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ProgressCard onDetails={onOpenProgress} />
        <AskZorbiCard onAsk={onAsk} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Shell                                                            */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState<ScreenId>("dashboard");
  const [tutorDraft, setTutorDraft] = useState({ query: "", version: 0 });
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [active]);

  const select = (id: ScreenId) => setActive(id);

  const askTutor = (query: string) => {
    setTutorDraft((d) => ({ query, version: d.version + 1 }));
    setActive("tutor");
  };

  return (
    <div className="min-h-screen text-slate-900">
      <AmbientBackground />
      <Sidebar active={active} onSelect={select} />

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/60 bg-white/60 px-4 py-3 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center gap-2">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation"
                className="glass-soft flex size-9 items-center justify-center rounded-full text-slate-600"
              >
                <Menu className="size-[18px]" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[290px] border-r border-white/60 bg-white/70 p-4 backdrop-blur-2xl"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <SidebarNav
                active={active}
                onSelect={select}
                onNavigate={() => setSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <ZorbiMascot size={30} glow={false} />
            <span className="text-base font-bold tracking-tight">
              Zorbi <span className="text-brand-gradient">AI</span>
            </span>
          </div>
        </div>
        <Avatar className="size-9 ring-2 ring-white">
          <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-violet-400 text-sm font-semibold text-white">
            F
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="lg:pl-[264px]">
        <div className="mx-auto max-w-[1200px] px-4 py-7 sm:px-8">
          <TopBar onAskTutor={askTutor} />

          <main className="mt-8 flex flex-col gap-6">
            {active === "dashboard" && (
              <DashboardHome
                name={user?.name ?? undefined}
                onOpenTutor={() => select("tutor")}
                onOpenMaterials={() => select("materials")}
                onOpenProgress={() => select("progress")}
                onOpenAssignments={() => select("assignments")}
                onAsk={askTutor}
              />
            )}
            {active === "tutor" && (
              <AiTutor draft={tutorDraft.query} draftVersion={tutorDraft.version} />
            )}
            {active === "materials" && <Materials onAskTutor={askTutor} />}
            {active === "assignments" && <Assignments />}
            {active === "notes" && <Notes />}
            {active === "quizzes" && <Quizzes />}
            {active === "progress" && <ProgressScreen />}
            {active === "rewards" && <RewardsScreen />}
            {active === "groups" && <StudyGroups />}
            {active === "settings" && <SettingsScreen />}

            <footer className="flex flex-col items-center justify-between gap-3 pb-4 pt-2 text-xs text-slate-400 sm:flex-row">
              <span>© 2026 Zorbi AI — Learn smarter, together.</span>
              <span className="flex items-center gap-4">
                <span className="cursor-pointer transition-colors hover:text-indigo-500">
                  Help center
                </span>
                <span className="cursor-pointer transition-colors hover:text-indigo-500">
                  Privacy
                </span>
                <span className="cursor-pointer transition-colors hover:text-indigo-500">
                  Terms
                </span>
              </span>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
