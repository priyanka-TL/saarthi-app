import { useState } from 'react'

import { FlowHeader } from '@/components/common/FlowHeader'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { challengeData } from '@/data/mockData'
import { useSaarthiState } from '@/hooks/useSaarthiState'

export function StoryCaptureFlow() {
  const [generated, setGenerated] = useState(false)
  const { selectedChallenge, storyDraft, setStoryField } = useSaarthiState()

  const challengeLabel = challengeData[selectedChallenge].label

  return (
    <div className="space-y-6">
      <FlowHeader
        capability="Sense"
        description="Capture a problem-action-outcome narrative as reusable field intelligence in a Mitra-like format."
        title="Improvement Story Capture"
      />

      <Card>
        <CardHeader>
          <CardTitle>Capture story</CardTitle>
          <CardDescription>Document one micro-improvement in a structured narrative format.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Problem"
            onChange={(value) => setStoryField('problem', value)}
            placeholder="What challenge did you observe?"
            value={storyDraft.problem}
          />
          <Field
            label="Action taken"
            onChange={(value) => setStoryField('actionTaken', value)}
            placeholder="What specific action was implemented?"
            value={storyDraft.actionTaken}
          />
          <Field
            label="Outcome"
            onChange={(value) => setStoryField('outcome', value)}
            placeholder="What changed after the action?"
            value={storyDraft.outcome}
          />
          <Field
            label="Reflection"
            onChange={(value) => setStoryField('reflection', value)}
            placeholder="What should be adapted for next cycle?"
            value={storyDraft.reflection}
          />

          <Button onClick={() => setGenerated(true)}>Generate Improvement Story Card</Button>
        </CardContent>
      </Card>

      {generated ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Improvement Story Card</CardTitle>
            <CardDescription>{challengeLabel}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <StoryLine label="Problem" value={storyDraft.problem} />
            <StoryLine label="Action taken" value={storyDraft.actionTaken} />
            <StoryLine label="Outcome" value={storyDraft.outcome} />
            <StoryLine label="Reflection" value={storyDraft.reflection} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
    </div>
  )
}

function StoryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm text-foreground">{value || 'Not captured yet'}</p>
    </div>
  )
}
