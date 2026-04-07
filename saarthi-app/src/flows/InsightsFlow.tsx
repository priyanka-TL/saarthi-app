import { BarChart3, Layers, Lightbulb } from 'lucide-react'

import { FlowHeader } from '@/components/common/FlowHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { challengeData } from '@/data/mockData'
import { useSaarthiState } from '@/hooks/useSaarthiState'

export function InsightsFlow() {
  const { selectedChallenge, insights } = useSaarthiState()

  const dataset = challengeData[selectedChallenge]
  const groupedInsights = insights.reduce<Record<string, typeof insights>>((acc, insight) => {
    acc[insight.cluster] = [...(acc[insight.cluster] ?? []), insight]
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <FlowHeader
        capability="Make Sense"
        description="Convert captured context into patterns, root causes, and clustered signals for decision-making."
        title="Insights Engine"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Key patterns
          </CardTitle>
          <CardDescription>Hardcoded pattern synthesis based on selected challenge context.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {dataset.keyPatterns.map((pattern) => (
            <div className="rounded-xl border border-border bg-background p-3 text-sm text-foreground" key={pattern}>
              {pattern}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            Root cause analysis
          </CardTitle>
          <CardDescription>Diagnostic view generated from field signal clustering.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {dataset.rootCauses.map((cause) => (
            <div className="rounded-xl border border-border bg-background p-4" key={cause.title}>
              <p className="text-sm font-semibold text-foreground">{cause.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{cause.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Clustered insights
          </CardTitle>
          <CardDescription>Card-based insight clusters with tags for quick interpretation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(groupedInsights).map(([clusterName, clusterInsights]) => (
            <div className="space-y-3" key={clusterName}>
              <p className="text-sm font-semibold text-foreground">{clusterName}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {clusterInsights.map((insight) => (
                  <div className="rounded-xl border border-border bg-background p-4" key={insight.id}>
                    <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{insight.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {insight.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
