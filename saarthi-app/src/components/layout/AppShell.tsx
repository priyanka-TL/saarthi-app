import { Menu } from 'lucide-react'
import { type PropsWithChildren } from 'react'

import { SidebarNav } from '@/components/layout/SidebarNav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { ChallengeKey, FlowKey } from '@/types/saarthi'

interface AppShellProps extends PropsWithChildren {
  activeFlow: FlowKey
  onFlowChange: (flow: FlowKey) => void
  selectedChallengeLabel: string
  selectedChallenge: ChallengeKey
}

export function AppShell({
  activeFlow,
  onFlowChange,
  children,
  selectedChallengeLabel,
  selectedChallenge,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4eb] via-[#fefdfa] to-[#f7fafc] text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col lg:flex-row">
        <aside className="hidden w-[320px] border-r border-border/70 bg-card/70 px-5 py-6 backdrop-blur lg:block">
          <BrandBlock selectedChallenge={selectedChallenge} selectedChallengeLabel={selectedChallengeLabel} />
          <SidebarNav activeFlow={activeFlow} onFlowChange={onFlowChange} />
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-card/80 px-4 py-3 backdrop-blur md:px-6 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">SAARTHI Prototype</p>
                <p className="text-xs text-muted-foreground">ShikshaLokam-inspired capability walkthrough</p>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="max-w-[320px]">
                  <SheetHeader>
                    <SheetTitle>Navigate Flows</SheetTitle>
                  </SheetHeader>
                  <div className="mt-5">
                    <BrandBlock selectedChallenge={selectedChallenge} selectedChallengeLabel={selectedChallengeLabel} />
                    <SidebarNav activeFlow={activeFlow} onFlowChange={onFlowChange} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          <section className="p-4 md:p-6 lg:p-8">{children}</section>
        </main>
      </div>
    </div>
  )
}

function BrandBlock({
  selectedChallenge,
  selectedChallengeLabel,
}: {
  selectedChallenge: ChallengeKey
  selectedChallengeLabel: string
}) {
  return (
    <div className="mb-6 space-y-3 rounded-2xl border border-border/70 bg-background/80 p-4">
      <p className="text-lg font-semibold leading-tight text-foreground">SAARTHI</p>
      <p className="text-xs text-muted-foreground">Digital nervous system for education leadership</p>
      <Badge className="w-fit border border-primary/25 bg-primary/10 text-primary" variant="outline">
        Active challenge: {selectedChallengeLabel}
      </Badge>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Context key: {selectedChallenge}</p>
    </div>
  )
}
