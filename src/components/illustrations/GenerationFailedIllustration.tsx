// "La génération a échoué" — les deux moitiés se sont désalignées, le
// grain est tombé hors de l'axe.

export function GenerationFailedIllustration({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      width={150}
      height={120}
      viewBox="-6 -6 162 132"
      className={className}
      aria-label="Erreur de génération"
    >
      <path
        d="M58 16 A 44 44 0 0 0 58 104"
        fill="none"
        stroke="var(--foreground)"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path
        d="M84 26 A 44 44 0 0 1 84 94"
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth={6}
        strokeLinecap="round"
        transform="rotate(9 84 60)"
      />
      <circle cx={71} cy={103} r={8} fill="var(--primary)" />
      <path
        d="M52 60 L 92 60"
        stroke="var(--foreground)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="4 5"
      />
    </svg>
  );
}
