import { useState, type FormEvent } from 'react'

import { FlowHeader } from '@/components/common/FlowHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { challengeData } from '@/data/mockData'
import { useSaarthiState } from '@/hooks/useSaarthiState'

export function CompanionFlow() {
  const [question, setQuestion] = useState('')

  const { selectedChallenge, companionHistory, askCompanion } = useSaarthiState()

  const dataset = challengeData[selectedChallenge]

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!question.trim()) {
      return
    }

    askCompanion(question.trim())
    setQuestion('')
  }

  return (
    <div className="space-y-6">
      <FlowHeader
        capability="Guide"
        description="Saathi companion mode for contextual questions with structured, linked responses."
        title="Companion Mode"
      />

      <Card>
        <CardHeader>
          <CardTitle>Ask contextual questions</CardTitle>
          <CardDescription>Input-based prompt with hardcoded, challenge-aware responses.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="flex flex-col gap-3 md:flex-row" onSubmit={submitQuestion}>
            <Input
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Type your question (e.g. How do I improve engagement?)"
              value={question}
            />
            <Button type="submit">Ask Saathi</Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {dataset.suggestedQuestions.map((suggestion) => (
              <Button key={suggestion} onClick={() => setQuestion(suggestion)} size="sm" variant="outline">
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {companionHistory.length === 0 ? (
        <Card>
          <CardContent className="pt-5 text-sm text-muted-foreground">
            Ask one question to view structured Saathi guidance linked to insights and recommendations.
          </CardContent>
        </Card>
      ) : null}

      {companionHistory.map((turn) => {
        const linkedInsights = dataset.insights.filter((insight) => turn.reply.linkedInsightIds.includes(insight.id))
        const linkedRecommendations = dataset.recommendations.filter((recommendation) =>
          turn.reply.linkedRecommendationIds.includes(recommendation.id),
        )

        return (
          <Card key={`${turn.askedAt}-${turn.question}`}>
            <CardHeader>
              <CardTitle className="text-base">Q: {turn.question}</CardTitle>
              <CardDescription>{turn.reply.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">Structured response</p>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                  {turn.reply.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap gap-2">
                {linkedInsights.map((insight) => (
                  <Badge key={insight.id} variant="outline">
                    Insight: {insight.title}
                  </Badge>
                ))}
                {linkedRecommendations.map((recommendation) => (
                  <Badge key={recommendation.id} variant="secondary">
                    Recommendation: {recommendation.title}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
