export type ChallengeKey = 'engagement' | 'attendance' | 'burnout' | 'community'

export type FlowKey =
  | 'home'
  | 'feedback'
  | 'commons'
  | 'capture'
  | 'insights'
  | 'recommendations'
  | 'improvement'
  | 'story'
  | 'companion'
  | 'program'

export interface CaptureAnswers {
  where: string
  who: string
  tried: string
}

export interface CapturedContext {
  challenge: ChallengeKey
  challengeLabel: string
  answers: CaptureAnswers
  summary: string
}

export interface InsightItem {
  id: string
  title: string
  description: string
  tags: string[]
  cluster: string
}

export interface RootCause {
  title: string
  description: string
}

export type RecommendationSection = 'whatOthersDid' | 'tryThisNext' | 'resources'

export interface RecommendationItem {
  id: string
  section: RecommendationSection
  title: string
  description: string
  details: string
  tags: string[]
  linkedInsightIds: string[]
}

export interface ImprovementPlan {
  smallAction: string
  expectedOutcome: string
  timeline: string
  successSignal: string
  supportNeeded: string
}

export interface StoryCard {
  challenge: ChallengeKey
  problem: string
  actionTaken: string
  outcome: string
  reflection: string
}

export interface CompanionReply {
  id: string
  prompt: string
  triggerKeywords: string[]
  summary: string
  steps: string[]
  linkedInsightIds: string[]
  linkedRecommendationIds: string[]
}

export interface CompanionTurn {
  question: string
  reply: CompanionReply
  askedAt: string
}

export interface ProgramDesignDraft {
  challengeStatement: string
  objective: string
  targetGroup: string
  keyActivities: string
  indicators: string
}

export interface ChallengeDataset {
  label: string
  accentClass: string
  captureOptions: {
    where: string[]
    who: string[]
    tried: string[]
  }
  summaryTemplate: (answers: CaptureAnswers) => string
  keyPatterns: string[]
  rootCauses: RootCause[]
  insights: InsightItem[]
  recommendations: RecommendationItem[]
  defaultPlan: ImprovementPlan
  companionReplies: CompanionReply[]
  suggestedQuestions: string[]
  programDraft: ProgramDesignDraft
}
