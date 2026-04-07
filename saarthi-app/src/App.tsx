import { useState } from 'react'

import { ChatWorkspace } from '@/components/chat/ChatWorkspace'
import { AppShell } from '@/components/layout/AppShell'
import { challengeData } from '@/data/mockData'
import { SaarthiStateProvider, useSaarthiState } from '@/hooks/useSaarthiState'
import type { FlowKey } from '@/types/saarthi'

export default function App() {
  return (
    <SaarthiStateProvider>
      <SaarthiPrototype />
    </SaarthiStateProvider>
  )
}

function SaarthiPrototype() {
  const [activeFlow, setActiveFlow] = useState<FlowKey>('capture')
  const { selectedChallenge } = useSaarthiState()

  return (
    <AppShell
      activeFlow={activeFlow}
      onFlowChange={setActiveFlow}
      selectedChallenge={selectedChallenge}
      selectedChallengeLabel={challengeData[selectedChallenge].label}
    >
      <ChatWorkspace activeFlow={activeFlow} />
    </AppShell>
  )
}
