// "Aucune session pour l'instant" — l'écale est ouverte, la place du
// grain est vide (contour ambre pointillé). Pas encore utilisée dans
// un écran (attend la Liste des sessions passées de SPEC.md).

export function EmptySessionsIllustration({
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
      aria-label="Aucune session"
    >
      <path
        d="M64 14 A 46 46 0 1 0 64 106"
        fill="none"
        stroke="var(--foreground)"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path
        d="M78 41 A 21 21 0 1 1 78 79"
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <circle
        cx={128}
        cy={60}
        r={11}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={3}
        strokeDasharray="4 5"
      />
    </svg>
  );
}
