import { Dialog } from "@base-ui/react/dialog";
import { Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EmptySessionsIllustration } from "@/components/illustrations/EmptySessionsIllustration";
import { SessionListItem } from "@/components/SessionListItem";
import { useSessions } from "@/hooks/useSessions";

interface SessionsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Barre latérale (même comportement mobile et desktop, pas de rail
// permanent) : ouverte via le menu burger du header, voir
// AuthenticatedLayout. Base UI Dialog stylé en panneau plutôt qu'une
// modale centrée — donne focus trap / Échap / clic-dehors gratuitement.
export function SessionsSidebar({ open, onOpenChange }: SessionsSidebarProps) {
  const { data: sessions, isLoading, isError, error } = useSessions({
    enabled: open,
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-foreground/20 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="bg-background fixed inset-y-0 left-0 z-50 flex w-[80%] max-w-sm flex-col shadow-xl transition-transform duration-200 data-ending-style:-translate-x-full data-starting-style:-translate-x-full">
          <div className="border-border flex items-center justify-between border-b px-4 py-3">
            <Dialog.Title className="font-heading text-lg font-medium">
              Sessions
            </Dialog.Title>
            <Dialog.Close
              render={<Button variant="ghost" size="icon" aria-label="Fermer" />}
            >
              <X />
            </Dialog.Close>
          </div>
          <div className="border-border border-b p-3">
            <Button
              className="w-full justify-start gap-2"
              nativeButton={false}
              onClick={() => onOpenChange(false)}
              render={<Link to="/nouvelle-session" />}
            >
              <Plus />
              Nouvelle conversation
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {isLoading && (
              <p className="text-muted-foreground p-3 text-sm">
                Chargement...
              </p>
            )}
            {isError && (
              <p className="text-destructive p-3 text-sm">{error.message}</p>
            )}
            {sessions && sessions.length === 0 && (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <EmptySessionsIllustration className="h-20 w-auto" />
                <p className="text-muted-foreground text-caption">
                  Aucune session pour l'instant
                </p>
              </div>
            )}
            {sessions && sessions.length > 0 && (
              <div className="flex flex-col gap-2">
                {sessions.map((session) => (
                  <SessionListItem
                    key={session.id}
                    session={session}
                    onClick={() => onOpenChange(false)}
                  />
                ))}
              </div>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
