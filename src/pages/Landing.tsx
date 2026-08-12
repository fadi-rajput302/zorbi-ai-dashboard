import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  Flame,
  MessageCircleHeart,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import { Link } from "react-router";

import { AmbientBackground } from "@/components/AmbientBackground";
import { ZorbiMascot } from "@/components/ZorbiMascot";

const FEATURES = [
  {
    icon: MessageCircleHeart,
    title: "AI Tutor, 24/7",
    body: "Ask Zorbi anything — instant explanations, step-by-step help and study tips, any hour of the day.",
    tint: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: WandSparkles,
    title: "Smart Materials",
    body: "Upload notes, slides and PDFs. Zorbi turns them into summaries, flashcards and practice questions.",
    tint: "bg-violet-50 text-violet-600",
  },
  {
    icon: BookOpenCheck,
    title: "Adaptive Quizzes",
    body: "Quizzes that adjust to your level and target exactly what you're about to forget.",
    tint: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Users,
    title: "Study Groups",
    body: "Learn together with friends — shared notes, group challenges and streaks that keep everyone going.",
    tint: "bg-orange-50 text-orange-500",
  },
];

const PARTICLES = [
  { left: "10%", top: "18%", size: 9, delay: 0, duration: 7, bg: "bg-indigo-300/60" },
  { left: "85%", top: "26%", size: 7, delay: 1.2, duration: 8, bg: "bg-violet-300/60" },
  { left: "78%", top: "64%", size: 6, delay: 2.1, duration: 7.5, bg: "bg-sky-300/60" },
  { left: "18%", top: "70%", size: 6, delay: 0.9, duration: 8.5, bg: "bg-amber-300/50" },
  { left: "64%", top: "12%", size: 5, delay: 2.8, duration: 9, bg: "bg-emerald-300/50" },
];

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      <AmbientBackground />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/55 backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <ZorbiMascot size={36} glow={false} />
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Zorbi <span className="text-brand-gradient">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <a href="#features" className="transition-colors hover:text-indigo-600">
              Features
            </a>
            <a href="#how" className="transition-colors hover:text-indigo-600">
              How it works
            </a>
            <a href="#pricing" className="transition-colors hover:text-indigo-600">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/auth"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white/80 hover:text-indigo-600"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(99,102,241,0.65)] transition-all hover:-translate-y-px hover:shadow-[0_14px_30px_-10px_rgba(99,102,241,0.75)]"
            >
              Get Started
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            >
              <Sparkles className="size-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-slate-600">
                Your AI-powered study companion
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[56px]"
            >
              Learn anything with{" "}
              <span className="text-brand-gradient">Zorbi</span>, your study
              buddy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg"
            >
              Upload your materials, chat with your AI tutor, and master every
              subject with adaptive quizzes — all in one calm, beautiful
              workspace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <Link
                to="/auth"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_-12px_rgba(99,102,241,0.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-12px_rgba(99,102,241,0.8)]"
              >
                Start learning free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/dashboard"
                className="glass-soft rounded-full px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:text-indigo-600"
              >
                Explore the dashboard
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
            >
              {[
                { icon: Flame, value: "7-day", label: "streaks & counting" },
                { icon: MessageCircleHeart, value: "24/7", label: "AI tutoring" },
                { icon: Users, value: "12K+", label: "students learning" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-white/80 text-indigo-500 shadow-sm ring-1 ring-white">
                    <Icon className="size-4" strokeWidth={2.1} />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-800">{value}</div>
                    <div className="text-xs text-slate-400">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto flex items-center justify-center"
            style={{ height: 420 }}
          >
            {PARTICLES.map((p, i) => (
              <span
                key={i}
                className={`animate-zorbi-rise absolute rounded-full ${p.bg}`}
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
            <div className="glass absolute inset-x-6 top-1/2 flex h-[320px] -translate-y-1/2 items-center justify-center rounded-[2.5rem] sm:inset-x-0">
              <div className="absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-100/70 blur-3xl" />
              <ZorbiMascot size={210} float className="relative z-10" />
            </div>
            {/* Floating chips */}
            <div className="glass-chip animate-zorbi-float absolute -left-2 top-14 rounded-2xl px-4 py-2.5 [animation-delay:0.6s] sm:left-4">
              <div className="text-xs font-bold text-slate-800">98% retention</div>
              <div className="mt-0.5 flex items-center gap-1 text-[11px] text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                vs. traditional study
              </div>
            </div>
            <div className="glass-chip animate-zorbi-float absolute -right-1 bottom-16 rounded-2xl px-4 py-2.5 [animation-delay:1.4s] sm:right-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-violet-500" />
                <span className="text-xs font-bold text-slate-800">
                  Quiz ready in 10s
                </span>
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400">
                from your notes
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-5 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to{" "}
            <span className="text-brand-gradient">study smarter</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            Zorbi brings your notes, quizzes and study groups together in one
            place — with an AI tutor that never sleeps.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body, tint }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="glass group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(28,40,92,0.04),0_28px_56px_-24px_rgba(79,108,240,0.35)]"
            >
              <div
                className={`flex size-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105 ${tint}`}
              >
                <Icon className="size-5" strokeWidth={2.1} />
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="glass relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-indigo-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-violet-100/60 blur-3xl" />
          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                From notes to mastery in{" "}
                <span className="text-brand-gradient">three steps</span>
              </h2>
              <ol className="mt-8 space-y-6">
                {[
                  {
                    step: "01",
                    title: "Upload anything",
                    body: "Drop in PDFs, slides, docs or screenshots — Zorbi instantly understands your material.",
                  },
                  {
                    step: "02",
                    title: "Ask your tutor",
                    body: "Chat with Zorbi about any concept, any time. Get clear answers with worked examples.",
                  },
                  {
                    step: "03",
                    title: "Practice & track",
                    body: "Adaptive quizzes and progress insights show you exactly where to focus next.",
                  },
                ].map(({ step, title, body }, i) => (
                  <motion.li
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex gap-4"
                  >
                    <span className="text-brand-gradient shrink-0 text-2xl font-extrabold tracking-tight">
                      {step}
                    </span>
                    <div>
                      <div className="text-base font-bold text-slate-900">
                        {title}
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-slate-500">
                        {body}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>

            <div className="relative mx-auto hidden w-full max-w-sm items-center justify-center lg:flex">
              <div className="glass-soft w-full rounded-[2rem] p-6">
                <div className="flex items-center gap-3">
                  <ZorbiMascot size={40} glow={false} />
                  <div className="text-sm font-bold text-slate-900">Zorbi</div>
                  <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                    AI Tutor
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-indigo-50 px-4 py-2.5 text-[13px] text-slate-700">
                    Explain the chain rule in simple terms?
                  </div>
                  <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-[13px] text-slate-700 shadow-sm ring-1 ring-slate-100">
                    Think of it as peeling an onion — differentiate the outer
                    layer, then multiply by the derivative of the inside 🧅
                  </div>
                  <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-indigo-50 px-4 py-2.5 text-[13px] text-slate-700">
                    Quiz me on it!
                  </div>
                  <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-[13px] text-slate-700 shadow-sm ring-1 ring-slate-100">
                    Ready! First question: what is d/dx [sin(x²)]? 🤓
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-full bg-white/85 p-1.5 pl-4 ring-1 ring-white shadow-sm">
                  <input
                    readOnly
                    placeholder="Type your question..."
                    className="h-8 flex-1 bg-transparent text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md">
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="mx-auto max-w-6xl px-5 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-indigo-400 to-violet-400 px-8 py-14 text-center shadow-[0_40px_80px_-32px_rgba(99,102,241,0.6)] sm:px-16"
        >
          <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full bg-violet-300/40 blur-3xl" />
          <div className="relative">
            <div className="mx-auto flex justify-center">
              <ZorbiMascot size={88} float />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to meet your study buddy?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-indigo-50/90 sm:text-base">
              Join Zorbi AI free, upload your first material, and let your AI
              tutor take it from there.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/auth"
                className="flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-indigo-600 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Get started free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/dashboard"
                className="rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Explore dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/60 bg-white/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <ZorbiMascot size={26} glow={false} />
            <span className="font-semibold text-slate-600">
              Zorbi <span className="text-brand-gradient">AI</span>
            </span>
          </div>
          <span>© 2026 Zorbi AI — Learn smarter, together.</span>
          <div className="flex items-center gap-5">
            <span className="cursor-pointer transition-colors hover:text-indigo-500">
              Privacy
            </span>
            <span className="cursor-pointer transition-colors hover:text-indigo-500">
              Terms
            </span>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
