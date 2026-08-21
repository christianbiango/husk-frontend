// "Distillation en cours" — deux arcs contrarotatifs, grain pulsé.
// Anime husk-spin / husk-spin-rev / husk-pulse (voir src/index.css).

export function ProcessingIllustration({
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
      aria-label="Traitement en cours"
    >
      <g
        style={{
          transformOrigin: "75px 60px",
          animation: "7s linear 0s infinite normal none running husk-spin",
        }}
      >
        <path
          d="M75 12 A 48 48 0 0 1 75 108"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={6}
          strokeLinecap="round"
        />
      </g>
      <g
        style={{
          transformOrigin: "75px 60px",
          animation:
            "4.5s linear 0s infinite normal none running husk-spin-rev",
        }}
      >
        <path
          d="M75 28 A 32 32 0 0 1 75 92"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth={6}
          strokeLinecap="round"
        />
      </g>
      <circle
        cx={75}
        cy={60}
        r={9}
        fill="var(--primary)"
        style={{
          transformOrigin: "75px 60px",
          animation: "2.2s ease-in-out 0s infinite normal none running husk-pulse",
        }}
      />
    </svg>
  );
}
