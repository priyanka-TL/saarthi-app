import { MapPin, Users } from 'lucide-react'
import type { ComponentType } from 'react'

import { FlowHeader } from '@/components/common/FlowHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { challengeData, challengeOrder } from '@/data/mockData'
import { useSaarthiState } from '@/hooks/useSaarthiState'
import { cn } from '@/lib/utils'
import type { CaptureAnswers, ChallengeKey } from '@/types/saarthi'

const promptCopy: Record<keyof CaptureAnswers, { label: string; icon: ComponentType<{ className?: string }> }> = {
  where: { label: 'Where is this happening?', icon: MapPin },
  who: { label: 'Who is affected?', icon: Users },
  tried: { label: 'What have you tried?', icon: Users },
}

export function CaptureChallengeFlow() {
  const {
    selectedChallenge,
    setSelectedChallenge,
    captureAnswers,
    setCaptureAnswer,
    generateCapturedSummary,
    capturedSummary,
  } = useSaarthiState()

  const activeDataset = challengeData[selectedChallenge]

  return (
    <div className="space-y-6">
      <FlowHeader
        capability="Sense"
        description="Capture field realities through guided prompts so the ecosystem can convert context into actionable intelligence."
        title="What challenge are you facing?"
      />

      <Card>
        <CardHeader>
          <CardTitle>1. Select your challenge</CardTitle>
          <CardDescription>Choose one context to drive all downstream insights and actions.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {challengeOrder.map((challengeKey) => (
            <ChallengeOption
              challengeKey={challengeKey}
              isActive={challengeKey === selectedChallenge}
              key={challengeKey}
              onSelect={setSelectedChallenge}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Structured context prompts</CardTitle>
          <CardDescription>Mitra-style capture through guided selections, not open-ended conversation dumps.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3">
          {(Object.keys(promptCopy) as Array<keyof CaptureAnswers>).map((field) => {
            const prompt = promptCopy[field]
            const options = activeDataset.captureOptions[field]
            const Icon = prompt.icon
            return (
              <div className="space-y-2" key={field}>
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Icon className="h-4 w-4 text-primary" />
                  {prompt.label}
                </p>
                <Select onValueChange={(value) => setCaptureAnswer(field, value)} value={captureAnswers[field]}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select context" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={generateCapturedSummary}>Generate Captured Context Summary</Button>
        <Badge className={cn('border', activeDataset.accentClass)} variant="outline">
          Current challenge: {activeDataset.label}
        </Badge>
      </div>

      {capturedSummary ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Captured Context Summary</CardTitle>
            <CardDescription>
              This summary is generated from your selected challenge and structured responses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground">{capturedSummary.summary}</p>
            <div className="grid gap-3 md:grid-cols-3">
              <SummaryChip label="Where" value={capturedSummary.answers.where} />
              <SummaryChip label="Who" value={capturedSummary.answers.who} />
              <SummaryChip label="Tried" value={capturedSummary.answers.tried} />
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function ChallengeOption({
  challengeKey,
  isActive,
  onSelect,
}: {
  challengeKey: ChallengeKey
  isActive: boolean
  onSelect: (challenge: ChallengeKey) => void
}) {
  const dataset = challengeData[challengeKey]

  return (
    <button
      className={cn(
        'rounded-2xl border p-4 text-left transition-colors',
        isActive ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-primary/40',
      )}
      onClick={() => onSelect(challengeKey)}
      type="button"
    >
      <p className="text-sm font-semibold text-foreground">{dataset.label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{dataset.keyPatterns[0]}</p>
    </button>
  )
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  )
}
