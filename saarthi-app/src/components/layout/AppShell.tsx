import { Compass, Menu } from "lucide-react";
import { type PropsWithChildren } from "react";

import { SidebarNav } from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ChallengeKey, FlowKey } from "@/types/saarthi";

interface AppShellProps extends PropsWithChildren {
  activeFlow: FlowKey;
  onFlowChange: (flow: FlowKey) => void;
  selectedChallengeLabel: string;
  selectedChallenge: ChallengeKey;
}

export function AppShell({
  activeFlow,
  onFlowChange,
  children,
  selectedChallengeLabel,
  selectedChallenge,
}: AppShellProps) {
  return (
    <div className="h-dvh overflow-hidden bg-gradient-to-br from-background via-background to-secondary/45 text-foreground">
      <div className="flex h-full w-full flex-col lg:flex-row">
        <aside
          className="hidden h-full w-[320px] overflow-y-auto border-r border-border/70 bg-card/80 px-3 py-5 backdrop-blur motion-safe:animate-fade-up-sm lg:block"
          style={{ animationDelay: '30ms', animationFillMode: 'both' }}
        >
          <BrandBlock
            selectedChallenge={selectedChallenge}
            selectedChallengeLabel={selectedChallengeLabel}
          />
          <SidebarNav activeFlow={activeFlow} onFlowChange={onFlowChange} />
        </aside>

        <main
          className="flex h-full flex-1 min-h-0 flex-col overflow-hidden motion-safe:animate-fade-up-sm"
          style={{ animationDelay: '90ms', animationFillMode: 'both' }}
        >
          <header className="sticky top-0 z-20 border-b border-border/70 bg-card/80 px-4 py-3 backdrop-blur md:px-6 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  SAARTHI Prototype
                </p>
                <p className="text-xs text-muted-foreground">
                  ShikshaLokam-inspired capability walkthrough
                </p>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="max-w-[320px] border-border bg-card text-foreground">
                  <SheetHeader>
                    <SheetTitle className="text-foreground">
                      Navigate Flows
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-5">
                    <BrandBlock
                      selectedChallenge={selectedChallenge}
                      selectedChallengeLabel={selectedChallengeLabel}
                    />
                    <SidebarNav
                      activeFlow={activeFlow}
                      onFlowChange={onFlowChange}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          <section className="flex flex-1 min-h-0 overflow-hidden p-4 md:p-6 lg:p-8">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}

function BrandBlock({
  selectedChallenge: _selectedChallenge,
  selectedChallengeLabel: _selectedChallengeLabel,
}: {
  selectedChallenge: ChallengeKey;
  selectedChallengeLabel: string;
}) {
  return (
    <div className="mb-5 rounded-xl border border-border/80 bg-card/75 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight text-foreground">
              SAARTHI
            </p>
            <p className="text-xs text-muted-foreground">
              Education Intelligence Companion
            </p>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 motion-safe:animate-soft-highlight" />
          Online
        </div>
      </div>
    </div>
  );
}
