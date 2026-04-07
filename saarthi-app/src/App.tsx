import { useState } from 'react'

import { AppShell } from '@/components/layout/AppShell'
import { challengeData } from '@/data/mockData'
import { SaarthiStateProvider, useSaarthiState } from '@/hooks/useSaarthiState'
import { CaptureChallengeFlow } from '@/flows/CaptureChallengeFlow'
import { CompanionFlow } from '@/flows/CompanionFlow'
import { ImprovementPlanFlow } from '@/flows/ImprovementPlanFlow'
import { InsightsFlow } from '@/flows/InsightsFlow'
import { ProgramDesignFlow } from '@/flows/ProgramDesignFlow'
import { RecommendationsFlow } from '@/flows/RecommendationsFlow'
import { StoryCaptureFlow } from '@/flows/StoryCaptureFlow'
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
      {renderFlow(activeFlow)}
    </AppShell>
  )
}

function renderFlow(activeFlow: FlowKey) {
  if (activeFlow === 'capture') {
    return <CaptureChallengeFlow />
  }
  if (activeFlow === 'insights') {
    return <InsightsFlow />
  }
  if (activeFlow === 'recommendations') {
    return <RecommendationsFlow />
  }
  if (activeFlow === 'improvement') {
    return <ImprovementPlanFlow />
  }
  if (activeFlow === 'story') {
    return <StoryCaptureFlow />
  }
  if (activeFlow === 'companion') {
    return <CompanionFlow />
  }
  return <ProgramDesignFlow />
}
