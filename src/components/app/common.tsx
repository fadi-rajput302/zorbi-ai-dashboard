import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ScreenHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function GlassPanel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("glass rounded-3xl p-6", className)}>{children}</div>;
}

export function FilterChips({
  options,
  active,
  onChange,
}: {
  options: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
            active === option.id
              ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_8px_18px_-8px_rgba(99,102,241,0.6)]"
              : "bg-white/80 text-slate-500 ring-1 ring-slate-200/80 hover:text-indigo-600 hover:ring-indigo-200",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function IconTile({
  icon: Icon,
  tint,
  className,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tint: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-2xl",
        tint,
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={2.1} />
    </div>
  );
}
