import { useMemo, useState } from 'react'

import { FlowHeader } from '@/components/common/FlowHeader'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { challengeData } from '@/data/mockData'
import { useSaarthiState } from '@/hooks/useSaarthiState'

const timelineOptions = ['1 week', '2 weeks', '3 weeks', '1 month', '6 weeks']

export function ImprovementPlanFlow() {
  const [submittedAt, setSubmittedAt] = useState<string | null>(null)

  const {
    selectedChallenge,
    improvementPlanDraft,
    setImprovementPlanField,
    selectedRecommendations,
  } = useSaarthiState()

  const dataset = challengeData[selectedChallenge]

  const selectedRecommendationTitles = useMemo(
    () =>
      dataset.recommendations
        .filter((item) => selectedRecommendations.includes(item.id))
        .map((item) => item.title),
    [dataset.recommendations, selectedRecommendations],
  )

  return (
    <div className="space-y-6">
      <FlowHeader
        capability="Improve"
        description="Convert recommendations into a concrete +1 action plan with expected outcomes and timelines."
        title="Micro-Improvement Planner"
      />

      <Card>
        <CardHeader>
          <CardTitle>Guided planner</CardTitle>
          <CardDescription>Define your small action, expected result, and short implementation rhythm.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="small-action">Define small action</Label>
            <Textarea
              id="small-action"
              onChange={(event) => setImprovementPlanField('smallAction', event.target.value)}
              value={improvementPlanDraft.smallAction}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected-outcome">Expected outcome</Label>
            <Input
              id="expected-outcome"
              onChange={(event) => setImprovementPlanField('expectedOutcome', event.target.value)}
              value={improvementPlanDraft.expectedOutcome}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Timeline</Label>
              <Select
                onValueChange={(value) => setImprovementPlanField('timeline', value)}
                value={improvementPlanDraft.timeline}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {timelineOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="success-signal">Success signal</Label>
              <Input
                id="success-signal"
                onChange={(event) => setImprovementPlanField('successSignal', event.target.value)}
                value={improvementPlanDraft.successSignal}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-needed">Support needed</Label>
            <Input
              id="support-needed"
              onChange={(event) => setImprovementPlanField('supportNeeded', event.target.value)}
              value={improvementPlanDraft.supportNeeded}
            />
          </div>

          <Button onClick={() => setSubmittedAt(new Date().toLocaleString())}>Generate Your Improvement Plan</Button>
        </CardContent>
      </Card>

      {submittedAt ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Your Improvement Plan</CardTitle>
            <CardDescription>Generated from selected challenge context and recommendations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PlanLine label="Small action" value={improvementPlanDraft.smallAction} />
            <PlanLine label="Expected outcome" value={improvementPlanDraft.expectedOutcome} />
            <PlanLine label="Timeline" value={improvementPlanDraft.timeline} />
            <PlanLine label="Success signal" value={improvementPlanDraft.successSignal} />
            <PlanLine label="Support needed" value={improvementPlanDraft.supportNeeded} />

            {selectedRecommendationTitles.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-foreground">Linked recommendations</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {selectedRecommendationTitles.map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="text-xs text-muted-foreground">Created at: {submittedAt}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function PlanLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  )
}
