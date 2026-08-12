import { useId } from "react";

import { cn } from "@/lib/utils";

interface ZorbiMascotProps {
  size?: number;
  className?: string;
  /** Show the soft blue/lavender glow beneath the sphere */
  glow?: boolean;
  /** Wrap the sphere in the gentle floating animation */
  float?: boolean;
}

/**
 * Zorbi — the Zorbi AI mascot.
 * A glossy white 3D sphere with a friendly smile, expressive eyes and a soft
 * blue/lavender glow beneath it. Pure CSS + inline SVG, scales with `size`.
 */
export function ZorbiMascot({
  size = 96,
  className,
  glow = true,
  float = false,
}: ZorbiMascotProps) {
  const uid = useId().replace(/:/g, "");
  const eyeGradient = `zorbi-eye-${uid}`;
  const cheekGradient = `zorbi-cheek-${uid}`;

  return (
    <div
      className={cn("relative select-none", float && "animate-zorbi-float", className)}
      style={{ width: size, height: size * 1.18 }}
      aria-hidden="true"
    >
      {/* Soft blue/lavender glow beneath the sphere */}
      {glow && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            width: size * 1.15,
            height: size * 1.05,
            background:
              "radial-gradient(circle, rgba(129,140,248,0.5) 0%, rgba(96,165,250,0.28) 42%, transparent 72%)",
          }}
        />
      )}

      {/* Glossy 3D sphere */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: size * 0.1,
          height: size,
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 33% 27%, #ffffff 0%, #f7f9ff 34%, #e9edfc 62%, #d8def8 84%, #c9d2f6 100%)",
            boxShadow: `
              inset 0 -12px 26px rgba(96, 116, 224, 0.28),
              inset 8px 12px 20px rgba(255,255,255,0.95),
              inset -10px -16px 26px rgba(112, 130, 232, 0.2),
              0 18px 34px -12px rgba(74, 92, 202, 0.38),
              0 32px 64px -24px rgba(74, 92, 202, 0.3)
            `,
          }}
        />

        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{
            left: "16%",
            top: "10%",
            width: "34%",
            height: "22%",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.35))",
            filter: "blur(3px)",
            transform: "rotate(-18deg)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            left: "10%",
            top: "30%",
            width: "10%",
            height: "14%",
            background: "rgba(255,255,255,0.95)",
            filter: "blur(5px)",
          }}
        />

        {/* Face — expressive eyes + friendly smile */}
        <svg
          viewBox="0 0 96 96"
          className="absolute inset-0 h-full w-full"
          style={{ top: 0 }}
        >
          <defs>
            <radialGradient id={eyeGradient} cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#3b4256" />
              <stop offset="55%" stopColor="#171c2e" />
              <stop offset="100%" stopColor="#0c1020" />
            </radialGradient>
            <linearGradient id={cheekGradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd7e6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffc7dd" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Eyes */}
          <ellipse
            cx="34"
            cy="49"
            rx="7.6"
            ry="9.6"
            fill={`url(#${eyeGradient})`}
            transform={`rotate(-6 34 49)`}
          />
          <ellipse
            cx="62"
            cy="49"
            rx="7.6"
            ry="9.6"
            fill={`url(#${eyeGradient})`}
            transform={`rotate(6 62 49)`}
          />
          {/* Eye glints */}
          <circle cx="36.6" cy="44.6" r="2.5" fill="#ffffff" />
          <circle cx="64.6" cy="44.6" r="2.5" fill="#ffffff" />
          <circle cx="32.4" cy="52.4" r="1.2" fill="#ffffff" opacity="0.7" />
          <circle cx="60.4" cy="52.4" r="1.2" fill="#ffffff" opacity="0.7" />

          {/* Smile */}
          <path
            d="M 39.5 61.5 Q 48 69 56.5 61.5"
            stroke="#171c2e"
            strokeWidth="4.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Subtle cheeks */}
          <ellipse
            cx="25"
            cy="59"
            rx="5.5"
            ry="3.4"
            fill={`url(#${cheekGradient})`}
            opacity="0.55"
          />
          <ellipse
            cx="71"
            cy="59"
            rx="5.5"
            ry="3.4"
            fill={`url(#${cheekGradient})`}
            opacity="0.55"
          />
        </svg>
      </div>

      {/* Under-sphere halo platform */}
      <div
        className="animate-zorbi-glow-pulse absolute left-1/2 rounded-full"
        style={{
          bottom: 0,
          width: size * 0.62,
          height: size * 0.12,
          background:
            "radial-gradient(ellipse at center, rgba(129,140,248,0.45) 0%, rgba(129,140,248,0.14) 55%, transparent 75%)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}
