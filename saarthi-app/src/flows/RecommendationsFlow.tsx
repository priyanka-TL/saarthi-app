import { useMemo, useState } from 'react'

import { FlowHeader } from '@/components/common/FlowHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { challengeData, recommendationSectionLabels } from '@/data/mockData'
import { useSaarthiState } from '@/hooks/useSaarthiState'
import type { RecommendationItem, RecommendationSection } from '@/types/saarthi'

const sectionOrder: RecommendationSection[] = ['whatOthersDid', 'tryThisNext', 'resources']

export function RecommendationsFlow() {
  const { selectedChallenge, insights, selectedRecommendations, toggleRecommendationSelection } = useSaarthiState()
  const [activeItem, setActiveItem] = useState<RecommendationItem | null>(null)

  const dataset = challengeData[selectedChallenge]

  const groupedRecommendations = useMemo(
    () =>
      sectionOrder.map((section) => ({
        section,
        label: recommendationSectionLabels[section],
        items: dataset.recommendations.filter((item) => item.section === section),
      })),
    [dataset.recommendations],
  )

  return (
    <div className="space-y-6">
      <FlowHeader
        capability="Learn"
        description="Translate insights into strategies, case examples, and practical resources for first-mile actors."
        title="Recommendations"
      />

      <div className="flex items-center gap-3">
        <Badge variant="secondary">Selected for plan: {selectedRecommendations.length}</Badge>
      </div>

      {groupedRecommendations.map(({ section, label, items }) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle>{label}</CardTitle>
            <CardDescription>{sectionDescription(section)}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {items.map((item) => {
              const isSelected = selectedRecommendations.includes(item.id)
              return (
                <div className="rounded-xl border border-border bg-background p-4" key={item.id}>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Sheet onOpenChange={(open) => !open && setActiveItem(null)}>
                      <SheetTrigger asChild>
                        <Button onClick={() => setActiveItem(item)} size="sm" variant="outline">
                          View details
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        {activeItem ? (
                          <RecommendationDetail
                            insightLookup={insights.map((insight) => ({ id: insight.id, title: insight.title }))}
                            item={activeItem}
                          />
                        ) : null}
                      </SheetContent>
                    </Sheet>

                    <Button
                      onClick={() => toggleRecommendationSelection(item.id)}
                      size="sm"
                      variant={isSelected ? 'default' : 'secondary'}
                    >
                      {isSelected ? 'Added' : 'Add to plan'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RecommendationDetail({
  item,
  insightLookup,
}: {
  item: RecommendationItem
  insightLookup: Array<{ id: string; title: string }>
}) {
  const linkedInsights = insightLookup.filter((insight) => item.linkedInsightIds.includes(insight.id))

  return (
    <>
      <SheetHeader>
        <SheetTitle>{item.title}</SheetTitle>
        <SheetDescription>{item.description}</SheetDescription>
      </SheetHeader>

      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-background p-4 text-sm text-foreground">{item.details}</div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Linked insights</p>
          <div className="flex flex-wrap gap-2">
            {linkedInsights.map((insight) => (
              <Badge key={insight.id} variant="outline">
                {insight.title}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function sectionDescription(section: RecommendationSection) {
  if (section === 'whatOthersDid') {
    return 'Field-proven examples from similar contexts.'
  }
  if (section === 'tryThisNext') {
    return 'Micro-improvements you can launch immediately.'
  }
  return 'Knowledge assets and templates for sustained practice.'
}
