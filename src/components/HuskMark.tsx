// Mark "1a — l'écale entrouverte" du design system Husk : deux arcs
// concentriques (ink + husk) et le grain (kernel) logé au creux.
// Sous 20px, l'arc husk disparaît et l'arc ink s'épaissit (cf. design
// system, règle de lisibilité aux petites tailles).

interface HuskMarkProps {
  size?: number;
  className?: string;
}

export function HuskMark({ size = 24, className }: HuskMarkProps) {
  if (size < 20) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="-6 -6 76 76"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M44 7 A 27 27 0 1 0 44 57"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <circle cx={44} cy={32} r={8} fill="var(--primary)" />
      </svg>
    );
  }

  const strokeWidth = size <= 24 ? 8 : size <= 32 ? 7 : 6;
  const kernelRadius = size <= 24 ? 6 : size <= 32 ? 5.5 : 5;

  return (
    <svg
      width={size}
      height={size}
      viewBox="-6 -6 76 76"
      className={className}
      aria-label="Husk"
    >
      <path
        d="M44 7 A 27 27 0 1 0 44 57"
        fill="none"
        stroke="var(--foreground)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M47 21 A 12.5 12.5 0 1 1 47 43"
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={43} cy={32} r={kernelRadius} fill="var(--primary)" />
    </svg>
  );
}
