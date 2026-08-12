import { motion } from "framer-motion";
import {
  FilePlus2,
  NotebookPen,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GlassPanel, ScreenHeader } from "./common";
import { cn } from "@/lib/utils";

interface Note {
  id: number;
  title: string;
  subject: string;
  updated: string;
  body: string;
}

const SEED_NOTES: Note[] = [
  {
    id: 1,
    title: "Chain Rule — Key Ideas",
    subject: "Mathematics",
    updated: "Aug 11, 2026",
    body: "The chain rule is used to differentiate composite functions.\n\nIf y = f(g(x)), then dy/dx = f'(g(x)) · g'(x).\n\nThink of peeling an onion: differentiate the outer layer, then multiply by the derivative of the inside.\n\nPractice: d/dx [sin(x²)] = 2x·cos(x²).",
  },
  {
    id: 2,
    title: "Thermodynamics — Chapter 6",
    subject: "Physics",
    updated: "Aug 10, 2026",
    body: "First law: ΔU = Q − W.\n\nKey processes:\n• Isothermal — constant temperature, ΔU = 0\n• Adiabatic — no heat exchange, Q = 0\n• Isobaric — constant pressure\n• Isochoric — constant volume, W = 0\n\nSecond law: heat flows spontaneously from hot to cold.",
  },
  {
    id: 3,
    title: "Periodic Trends",
    subject: "Chemistry",
    updated: "Aug 9, 2026",
    body: "Electronegativity increases across a period and decreases down a group.\n\nIonization energy follows the same trend.\n\nAtomic radius decreases across a period, increases down a group.\n\nMnemonic: “Up and right = more electronegative.”",
  },
  {
    id: 4,
    title: "Essay Outline — Climate",
    subject: "English",
    updated: "Aug 8, 2026",
    body: "Intro: hook + thesis.\n\nBody 1: causes (emissions, deforestation).\nBody 2: effects (weather, sea level).\nBody 3: solutions (policy, technology).\n\nConclusion: restate thesis + call to action.",
  },
];

let noteCounter = 4;

const SUBJECT_BADGE: Record<string, string> = {
  Mathematics: "bg-indigo-50 text-indigo-600",
  Physics: "bg-violet-50 text-violet-600",
  Chemistry: "bg-emerald-50 text-emerald-600",
  English: "bg-sky-50 text-sky-600",
};

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);
  const [selectedId, setSelectedId] = useState<number>(SEED_NOTES[0].id);
  const [savedAt, setSavedAt] = useState("Saved");

  const selected = notes.find((n) => n.id === selectedId) ?? notes[0];

  const updateNote = (patch: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selected.id
          ? {
              ...n,
              ...patch,
              updated: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            }
          : n,
      ),
    );
    setSavedAt("Saved just now");
    window.setTimeout(() => setSavedAt("Saved"), 1600);
  };

  const createNote = () => {
    noteCounter += 1;
    const note: Note = {
      id: noteCounter,
      title: "Untitled note",
      subject: "General",
      updated: "Just now",
      body: "Start writing… Zorbi can summarize or expand this for you.",
    };
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
    toast("Note created", { description: "A fresh page is ready." });
  };

  const deleteNote = () => {
    if (notes.length === 1) return;
    setNotes((prev) => prev.filter((n) => n.id !== selected.id));
    setSelectedId(notes.find((n) => n.id !== selected.id)!.id);
    toast("Note deleted", { description: selected.title });
  };

  const summarize = () => {
    updateNote({
      body: `${selected.body}\n\n—— ✨ Zorbi's summary ——\nCore idea: ${selected.subject === "Mathematics" ? "differentiate outside, then inside, then multiply" : selected.subject === "Physics" ? "energy is conserved; track Q and W" : selected.subject === "Chemistry" ? "periodic trends move up-right for electronegativity" : "structure: hook, evidence, counterpoint, conclusion"}. Key takeaway: remember the one rule that ties it together, then practice with one example.`,
    });
    toast("Summarized by Zorbi ✨", {
      description: "A summary was appended to your note.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Notes"
        subtitle="Capture ideas and let Zorbi help you expand them."
        action={
          <button
            type="button"
            onClick={createNote}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(99,102,241,0.7)] transition-all hover:-translate-y-px"
          >
            <FilePlus2 className="size-4" />
            New note
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Note list */}
        <GlassPanel className="flex flex-col gap-1.5 p-3">
          {notes.map((note, i) => (
            <motion.button
              key={note.id}
              type="button"
              onClick={() => setSelectedId(note.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={cn(
                "rounded-2xl px-3.5 py-3 text-left transition-all",
                note.id === selected.id
                  ? "bg-white shadow-[0_1px_2px_rgba(28,40,92,0.06),0_8px_20px_-12px_rgba(79,108,240,0.3)] ring-1 ring-white/80"
                  : "hover:bg-white/60",
              )}
            >
              <div className="flex items-center gap-2">
                <NotebookPen className="size-3.5 shrink-0 text-indigo-400" />
                <span className="truncate text-[13px] font-semibold text-slate-800">
                  {note.title}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-medium",
                    SUBJECT_BADGE[note.subject] ?? "bg-slate-100 text-slate-500",
                  )}
                >
                  {note.subject}
                </span>
                <span className="shrink-0">{note.updated}</span>
              </div>
            </motion.button>
          ))}
        </GlassPanel>

        {/* Editor */}
        <GlassPanel className="flex min-h-[480px] flex-col p-0">
          <div className="flex items-center gap-3 border-b border-white/70 bg-white/40 px-5 py-3.5">
            <input
              value={selected.title}
              onChange={(e) => updateNote({ title: e.target.value })}
              className="min-w-0 flex-1 bg-transparent text-base font-bold text-slate-900 focus:outline-none"
            />
            <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-medium text-slate-400 ring-1 ring-slate-200/80">
              <Save className="size-3" />
              {savedAt}
            </span>
            <button
              type="button"
              onClick={summarize}
              className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
            >
              <Sparkles className="size-3.5" />
              AI summarize
            </button>
            <button
              type="button"
              onClick={deleteNote}
              aria-label="Delete note"
              className="flex size-8 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          <textarea
            value={selected.body}
            onChange={(e) => updateNote({ body: e.target.value })}
            className="min-h-[400px] flex-1 resize-none bg-transparent px-5 py-4 text-sm leading-relaxed text-slate-700 focus:outline-none"
            placeholder="Start writing…"
          />
        </GlassPanel>
      </div>
    </div>
  );
}
