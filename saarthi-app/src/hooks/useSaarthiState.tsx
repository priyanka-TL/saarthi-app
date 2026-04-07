/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type PropsWithChildren } from 'react'

import { challengeData } from '@/data/mockData'
import type {
  CaptureAnswers,
  CapturedContext,
  ChallengeKey,
  CompanionReply,
  CompanionTurn,
  ImprovementPlan,
  InsightItem,
  ProgramDesignDraft,
  StoryCard,
} from '@/types/saarthi'

const defaultChallenge: ChallengeKey = 'engagement'

function createCaptureDefaults(challenge: ChallengeKey): CaptureAnswers {
  const options = challengeData[challenge].captureOptions
  return {
    where: options.where[0],
    who: options.who[0],
    tried: options.tried[0],
  }
}

function createStoryDefaults(challenge: ChallengeKey): StoryCard {
  return {
    challenge,
    problem: '',
    actionTaken: '',
    outcome: '',
    reflection: '',
  }
}

interface SaarthiStateContextValue {
  selectedChallenge: ChallengeKey
  setSelectedChallenge: (challenge: ChallengeKey) => void
  captureAnswers: CaptureAnswers
  setCaptureAnswer: (key: keyof CaptureAnswers, value: string) => void
  capturedSummary: CapturedContext | null
  generateCapturedSummary: () => void
  insights: InsightItem[]
  selectedRecommendations: string[]
  toggleRecommendationSelection: (id: string) => void
  improvementPlanDraft: ImprovementPlan
  setImprovementPlanField: (key: keyof ImprovementPlan, value: string) => void
  storyDraft: StoryCard
  setStoryField: (key: keyof Omit<StoryCard, 'challenge'>, value: string) => void
  companionHistory: CompanionTurn[]
  askCompanion: (question: string) => CompanionReply
  programDesignDraft: ProgramDesignDraft
  setProgramDraftField: (key: keyof ProgramDesignDraft, value: string) => void
}

const SaarthiStateContext = createContext<SaarthiStateContextValue | undefined>(undefined)

export function SaarthiStateProvider({ children }: PropsWithChildren) {
  const [selectedChallenge, setSelectedChallengeState] = useState<ChallengeKey>(defaultChallenge)
  const [captureAnswers, setCaptureAnswers] = useState<CaptureAnswers>(createCaptureDefaults(defaultChallenge))
  const [capturedSummary, setCapturedSummary] = useState<CapturedContext | null>(null)
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([])
  const [improvementPlanDraft, setImprovementPlanDraft] = useState<ImprovementPlan>(
    challengeData[defaultChallenge].defaultPlan,
  )
  const [storyDraft, setStoryDraft] = useState<StoryCard>(createStoryDefaults(defaultChallenge))
  const [companionHistory, setCompanionHistory] = useState<CompanionTurn[]>([])
  const [programDesignDraft, setProgramDesignDraft] = useState<ProgramDesignDraft>(
    challengeData[defaultChallenge].programDraft,
  )

  const insights = challengeData[selectedChallenge].insights

  function setSelectedChallenge(challenge: ChallengeKey) {
    setSelectedChallengeState(challenge)
    setCaptureAnswers(createCaptureDefaults(challenge))
    setCapturedSummary(null)
    setSelectedRecommendations([])
    setImprovementPlanDraft(challengeData[challenge].defaultPlan)
    setStoryDraft(createStoryDefaults(challenge))
    setCompanionHistory([])
    setProgramDesignDraft(challengeData[challenge].programDraft)
  }

  function setCaptureAnswer(key: keyof CaptureAnswers, value: string) {
    setCaptureAnswers((prev) => ({ ...prev, [key]: value }))
  }

  function generateCapturedSummary() {
    const dataset = challengeData[selectedChallenge]
    setCapturedSummary({
      challenge: selectedChallenge,
      challengeLabel: dataset.label,
      answers: captureAnswers,
      summary: dataset.summaryTemplate(captureAnswers),
    })
  }

  function toggleRecommendationSelection(id: string) {
    setSelectedRecommendations((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id],
    )
  }

  function setImprovementPlanField(key: keyof ImprovementPlan, value: string) {
    setImprovementPlanDraft((prev) => ({ ...prev, [key]: value }))
  }

  function setStoryField(key: keyof Omit<StoryCard, 'challenge'>, value: string) {
    setStoryDraft((prev) => ({ ...prev, [key]: value }))
  }

  function fallbackCompanionReply(question: string): CompanionReply {
    const dataset = challengeData[selectedChallenge]
    return {
      id: `${selectedChallenge}-fallback`,
      prompt: question,
      triggerKeywords: [],
      summary: `I mapped your question to ${dataset.label.toLowerCase()}. Start with one micro-action and review in one week.`,
      steps: [
        'Capture one concrete signal from your context.',
        'Pick one recommendation from this challenge view.',
        'Track change weekly and refine the action.',
      ],
      linkedInsightIds: dataset.insights.slice(0, 2).map((insight) => insight.id),
      linkedRecommendationIds: dataset.recommendations.slice(0, 2).map((item) => item.id),
    }
  }

  function askCompanion(question: string): CompanionReply {
    const normalized = question.trim().toLowerCase()
    const dataset = challengeData[selectedChallenge]

    const matchedReply = dataset.companionReplies.find((reply) =>
      reply.triggerKeywords.some((keyword) => normalized.includes(keyword.toLowerCase())),
    )

    const reply = matchedReply ?? fallbackCompanionReply(question)

    setCompanionHistory((prev) => [
      {
        question,
        reply,
        askedAt: new Date().toISOString(),
      },
      ...prev,
    ])

    return reply
  }

  function setProgramDraftField(key: keyof ProgramDesignDraft, value: string) {
    setProgramDesignDraft((prev) => ({ ...prev, [key]: value }))
  }

  const value: SaarthiStateContextValue = {
    selectedChallenge,
    setSelectedChallenge,
    captureAnswers,
    setCaptureAnswer,
    capturedSummary,
    generateCapturedSummary,
    insights,
    selectedRecommendations,
    toggleRecommendationSelection,
    improvementPlanDraft,
    setImprovementPlanField,
    storyDraft,
    setStoryField,
    companionHistory,
    askCompanion,
    programDesignDraft,
    setProgramDraftField,
  }

  return <SaarthiStateContext.Provider value={value}>{children}</SaarthiStateContext.Provider>
}

export function useSaarthiState() {
  const context = useContext(SaarthiStateContext)
  if (!context) {
    throw new Error('useSaarthiState must be used within SaarthiStateProvider')
  }
  return context
}
