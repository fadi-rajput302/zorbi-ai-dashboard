export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-40 -top-48 h-[520px] w-[520px] rounded-full bg-indigo-200/45 blur-3xl" />
      <div className="absolute -right-44 top-1/4 h-[540px] w-[540px] rounded-full bg-violet-200/40 blur-3xl" />
      <div className="absolute -bottom-48 left-1/4 h-[500px] w-[500px] rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute right-1/4 top-2/3 h-[380px] w-[380px] rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="zorbi-grid-bg absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]" />
    </div>
  );
}
