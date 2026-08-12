import {
  ArrowUpRight,
  Download,
  FileText,
  FileType,
  FolderOpen,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { FilterChips, GlassPanel, IconTile, ScreenHeader } from "./common";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Material {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  subject: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tint: string;
}

const SUBJECT_TINTS: Record<string, string> = {
  Mathematics: "bg-indigo-50 text-indigo-600",
  Physics: "bg-violet-50 text-violet-600",
  Chemistry: "bg-emerald-50 text-emerald-600",
  English: "bg-sky-50 text-sky-600",
  General: "bg-slate-100 text-slate-500",
};

const SUBJECT_BADGE: Record<string, string> = {
  Mathematics: "bg-indigo-50 text-indigo-600",
  Physics: "bg-violet-50 text-violet-600",
  Chemistry: "bg-emerald-50 text-emerald-600",
  English: "bg-sky-50 text-sky-600",
  General: "bg-slate-100 text-slate-500",
};

function fileMeta(name: string, size: number) {
  const ext = name.split(".").pop()?.toUpperCase() ?? "FILE";
  const icon =
    ext === "PDF"
      ? FileText
      : ext === "PPTX" || ext === "PPT"
        ? (props: { className?: string; strokeWidth?: number }) => (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={props.className} {...props}>
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M12 12v6" />
              <path d="M8.8 18 12 12l3.2 6" />
            </svg>
          )
        : FileType;
  const sizeLabel =
    size < 1024 * 1024
      ? `${Math.max(1, Math.round(size / 1024))} KB`
      : `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return { icon, type: ext, size: sizeLabel };
}

const SEED: Material[] = [
  { id: 1, name: "Calculus Notes.pdf", type: "PDF", size: "4.2 MB", date: "Aug 10, 2026", subject: "Mathematics", icon: FileText, tint: "bg-rose-50 text-rose-500" },
  { id: 2, name: "Physics Chapter 5.pptx", type: "PPTX", size: "12.8 MB", date: "Aug 9, 2026", subject: "Physics", icon: FileText, tint: "bg-orange-50 text-orange-500" },
  { id: 3, name: "Chemistry Formula Sheet.pdf", type: "PDF", size: "1.6 MB", date: "Aug 8, 2026", subject: "Chemistry", icon: FileText, tint: "bg-emerald-50 text-emerald-600" },
  { id: 4, name: "English Essay Guide.docx", type: "DOCX", size: "860 KB", date: "Aug 7, 2026", subject: "English", icon: FileType, tint: "bg-sky-50 text-sky-600" },
  { id: 5, name: "Algebra Cheat Sheet.pdf", type: "PDF", size: "980 KB", date: "Aug 5, 2026", subject: "Mathematics", icon: FileText, tint: "bg-indigo-50 text-indigo-600" },
  { id: 6, name: "Biology - Cell Structure.pptx", type: "PPTX", size: "9.4 MB", date: "Aug 3, 2026", subject: "General", icon: FileText, tint: "bg-violet-50 text-violet-600" },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "Mathematics", label: "Mathematics" },
  { id: "Physics", label: "Physics" },
  { id: "Chemistry", label: "Chemistry" },
  { id: "English", label: "English" },
];

let idCounter = 6;

export function Materials({
  onAskTutor,
}: {
  onAskTutor: (query: string) => void;
}) {
  const [materials, setMaterials] = useState<Material[]>(SEED);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const matchesQuery = m.name.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "all" || m.subject === filter;
      return matchesQuery && matchesFilter;
    });
  }, [materials, query, filter]);

  const handleUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const added: Material[] = Array.from(files).map((file) => {
      idCounter += 1;
      const { icon, type, size } = fileMeta(file.name, file.size);
      return {
        id: idCounter,
        name: file.name,
        type,
        size,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        subject: "General",
        icon,
        tint: SUBJECT_TINTS.General,
      };
    });
    setMaterials((prev) => [...added, ...prev]);
    toast("Uploaded", {
      description: `${added.length} material${added.length > 1 ? "s" : ""} added to your library.`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="My Materials"
        subtitle="Upload, organize and ask Zorbi about your study files."
        action={
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(99,102,241,0.7)] transition-all hover:-translate-y-px"
          >
            <Upload className="size-4" />
            Upload materials
          </button>
        }
      />

      <input
        ref={fileRef}
        type="file"
        multiple
        accept=".pdf,.pptx,.ppt,.doc,.docx,.txt,.md,.png,.jpg"
        className="hidden"
        onChange={(e) => {
          handleUpload(e.target.files);
          e.target.value = "";
        }}
      />

      <GlassPanel className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="glass-soft flex h-11 flex-1 items-center gap-2 rounded-full pl-4 pr-2">
          <Search className="size-4 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search materials…"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <span className="hidden rounded-md border border-slate-200/80 bg-white/80 px-2 py-1 text-[10px] font-semibold text-slate-400 sm:block">
            {filtered.length} files
          </span>
        </div>
        <FilterChips options={FILTERS} active={filter} onChange={setFilter} />
      </GlassPanel>

      {filtered.length === 0 ? (
        <GlassPanel className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <FolderOpen className="size-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No materials found</p>
          <p className="max-w-xs text-xs text-slate-400">
            Try a different search or subject, or upload something new.
          </p>
        </GlassPanel>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((material) => (
            <GlassPanel
              key={material.id}
              className="group flex flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(28,40,92,0.04),0_24px_48px_-20px_rgba(79,108,240,0.32)]"
            >
              <div className="flex items-start gap-3.5">
                <IconTile icon={material.icon} tint={material.tint} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold text-slate-800">
                    {material.name}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {material.type} · {material.size} · {material.date}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-white/80",
                    SUBJECT_BADGE[material.subject] ?? SUBJECT_BADGE.General,
                  )}
                >
                  {material.subject}
                </Badge>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    aria-label={`Download ${material.name}`}
                    onClick={() => toast("Download started", { description: material.name })}
                    className="flex size-8 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Download className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${material.name}`}
                    onClick={() => {
                      setMaterials((prev) =>
                        prev.filter((m) => m.id !== material.id),
                      );
                      toast("Material deleted", { description: material.name });
                    }}
                    className="flex size-8 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    toast("Opening material", { description: material.name })
                  }
                  className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/80 transition-all hover:text-indigo-600 hover:ring-indigo-200"
                >
                  Open
                  <ArrowUpRight className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onAskTutor(`Help me understand ${material.name}`)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                >
                  <Sparkles className="size-3.5" />
                  Ask Zorbi
                </button>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
