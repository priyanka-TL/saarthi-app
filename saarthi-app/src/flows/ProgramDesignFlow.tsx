import { useState } from 'react'

import { FlowHeader } from '@/components/common/FlowHeader'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useSaarthiState } from '@/hooks/useSaarthiState'

export function ProgramDesignFlow() {
  const [generated, setGenerated] = useState(false)
  const { programDesignDraft, setProgramDraftField } = useSaarthiState()

  return (
    <div className="space-y-6">
      <FlowHeader
        capability="Guide"
        description="Program/Design Companion for stepwise planning inspired by LFA-style design support."
        title="Program/Design Companion"
      />

      <Card>
        <CardHeader>
          <CardTitle>Stepwise design workspace</CardTitle>
          <CardDescription>Move from challenge framing to implementation-ready snapshot.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="challenge">
            <TabsList>
              <TabsTrigger value="challenge">Challenge</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="measurement">Measurement</TabsTrigger>
            </TabsList>

            <TabsContent value="challenge">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Challenge statement"
                  onChange={(value) => setProgramDraftField('challengeStatement', value)}
                  value={programDesignDraft.challengeStatement}
                />
                <Field
                  label="Objective"
                  onChange={(value) => setProgramDraftField('objective', value)}
                  value={programDesignDraft.objective}
                />
              </div>
            </TabsContent>

            <TabsContent value="design">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Target group"
                  onChange={(value) => setProgramDraftField('targetGroup', value)}
                  value={programDesignDraft.targetGroup}
                />
                <div className="space-y-2">
                  <Label>Key activities</Label>
                  <Textarea
                    onChange={(event) => setProgramDraftField('keyActivities', event.target.value)}
                    value={programDesignDraft.keyActivities}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="measurement">
              <div className="space-y-2">
                <Label>Indicators</Label>
                <Textarea
                  onChange={(event) => setProgramDraftField('indicators', event.target.value)}
                  value={programDesignDraft.indicators}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button className="mt-5" onClick={() => setGenerated(true)}>
            Generate Program Snapshot
          </Button>
        </CardContent>
      </Card>

      {generated ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Program Snapshot</CardTitle>
            <CardDescription>AI-assisted structured draft for implementation conversations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <SnapshotLine label="Challenge statement" value={programDesignDraft.challengeStatement} />
            <SnapshotLine label="Objective" value={programDesignDraft.objective} />
            <SnapshotLine label="Target group" value={programDesignDraft.targetGroup} />
            <SnapshotLine label="Key activities" value={programDesignDraft.keyActivities} />
            <SnapshotLine label="Indicators" value={programDesignDraft.indicators} />
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Suggested rollout rhythm</p>
              <p className="mt-2 text-sm text-foreground">
                30-60-90 day sequence: pilot in one cluster, review signals, then scale with adaptation.
              </p>
            </div>
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
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input onChange={(event) => onChange(event.target.value)} value={value} />
    </div>
  )
}

function SnapshotLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm text-foreground">{value}</p>
    </div>
  )
}
