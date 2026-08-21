import { Link } from "react-router-dom";

import { formatSessionDate, sourceTypeLabels } from "@/lib/sessionDisplay";
import type { Session } from "@/lib/api";

export function SessionListItem({
  session,
  onClick,
}: {
  session: Session;
  onClick?: () => void;
}) {
  return (
    <Link
      to={`/session/${session.id}`}
      onClick={onClick}
      className="border-border hover:bg-muted/50 flex flex-col gap-1 rounded-xl border p-3"
    >
      <span className="bg-accent text-accent-foreground text-caption w-fit rounded-full px-2.5 py-1 font-medium tracking-[0.02em]">
        {sourceTypeLabels[session.sourceType]}
      </span>
      <p className="text-body truncate font-medium">{session.title}</p>
      <p className="text-muted-foreground text-caption">
        {formatSessionDate(session.updated)}
      </p>
    </Link>
  );
}
