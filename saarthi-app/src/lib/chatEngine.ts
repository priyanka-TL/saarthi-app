import { recommendationSectionLabels } from '@/data/mockData'
import type { ChatBlock, ChatSuggestion } from '@/types/chat'
import type {
  CaptureAnswers,
  ChallengeDataset,
  CompanionReply,
  FlowKey,
  ImprovementPlan,
  InsightItem,
  ProgramDesignDraft,
  RecommendationItem,
  StoryCard,
} from '@/types/saarthi'

interface ChatEngineActions {
  setCaptureAnswer: (key: keyof CaptureAnswers, value: string) => void
  generateCapturedSummary: () => void
  toggleRecommendationSelection: (id: string) => void
  setImprovementPlanField: (key: keyof ImprovementPlan, value: string) => void
  setStoryField: (key: keyof Omit<StoryCard, 'challenge'>, value: string) => void
  askCompanion: (question: string) => CompanionReply
  setProgramDraftField: (key: keyof ProgramDesignDraft, value: string) => void
}

interface ChatEngineInput {
  flow: FlowKey
  input: string
  dataset: ChallengeDataset
  captureAnswers: CaptureAnswers
  insights: InsightItem[]
  selectedRecommendations: string[]
  improvementPlanDraft: ImprovementPlan
  storyDraft: StoryCard
  programDesignDraft: ProgramDesignDraft
  actions: ChatEngineActions
}

export interface ChatEngineResult {
  text: string
  blocks?: ChatBlock[]
}

const timelineOptions = ['1 week', '2 weeks', '3 weeks', '1 month', '6 weeks']

const flowLabels: Record<FlowKey, string> = {
  home: 'Home',
  feedback: 'Capture Feedback',
  commons: 'SG Commons Portal',
  capture: 'Capture Challenge',
  insights: 'Insights Engine',
  recommendations: 'Recommendations',
  improvement: 'Micro-Improvement Planner',
  story: 'Story Capture',
  companion: 'Saathi Companion',
  program: 'Program/Design Companion',
}

export function getFlowLabel(flow: FlowKey) {
  return flowLabels[flow]
}

export function getComposerPlaceholder(flow: FlowKey) {
  if (flow === 'home') {
    return 'Ask anything. Agentic routing will auto-select the most relevant context.'
  }
  if (flow === 'feedback') {
    return 'Capture feedback details step-by-step, then share what changed.'
  }
  if (flow === 'commons') {
    return 'Ask for resources, toolkits, or assets available on SG Commons.'
  }
  if (flow === 'capture') {
    return 'Try: show summary, set where: ..., set who: ..., set tried: ...'
  }
  if (flow === 'insights') {
    return 'Ask for key patterns, root causes, or insight clusters'
  }
  if (flow === 'recommendations') {
    return 'Try: show resources, add: eng-r3, remove: eng-r3, show selected'
  }
  if (flow === 'improvement') {
    return 'Try: set action: ..., set timeline: 2 weeks, show plan snapshot'
  }
  if (flow === 'story') {
    return 'Try: set problem: ..., set action: ..., generate story card'
  }
  if (flow === 'companion') {
    return 'Ask contextual questions (example: What worked in similar schools?)'
  }
  return 'Try: set objective: ..., set indicators: ..., show program snapshot'
}

export function getChatSuggestions({
  flow,
  dataset,
  selectedRecommendations,
}: {
  flow: FlowKey
  dataset: ChallengeDataset
  selectedRecommendations: string[]
}): ChatSuggestion[] {
  if (flow === 'home') {
    return [
      { id: 'home-1', flow, label: 'Record a story', prompt: 'I need to record a story' },
      { id: 'home-2', flow, label: 'Raise an issue', prompt: 'I am facing an issue with low student engagement' },
      { id: 'home-3', flow, label: 'Show story card', prompt: 'generate story card' },
    ]
  }

  if (flow === 'capture') {
    return [
      { id: 'cap-1', flow, label: 'Show summary', prompt: 'show summary' },
      { id: 'cap-2', flow, label: 'Set where', prompt: `set where: ${dataset.captureOptions.where[1] ?? dataset.captureOptions.where[0]}` },
      { id: 'cap-3', flow, label: 'Set who', prompt: `set who: ${dataset.captureOptions.who[1] ?? dataset.captureOptions.who[0]}` },
    ]
  }

  if (flow === 'feedback') {
    return [
      { id: 'fb-1', flow, label: 'Submit feedback', prompt: 'I want to submit a feedback' },
      { id: 'fb-2', flow, label: 'What changed', prompt: 'We built a toilet facility in the school' },
      { id: 'fb-3', flow, label: 'Share outcome', prompt: 'Attendance of girl students improved.' },
    ]
  }

  if (flow === 'commons') {
    return [
      { id: 'com-1', flow, label: 'Find FLN resources', prompt: 'I want to know more about FLN & TLM use' },
      { id: 'com-2', flow, label: 'Show useful assets', prompt: 'show resources' },
      { id: 'com-3', flow, label: 'What others used', prompt: 'show what others did' },
    ]
  }

  if (flow === 'insights') {
    return [
      { id: 'ins-1', flow, label: 'Show key patterns', prompt: 'show key patterns' },
      { id: 'ins-2', flow, label: 'Show root causes', prompt: 'show root causes' },
      { id: 'ins-3', flow, label: 'Show clusters', prompt: 'show clustered insights' },
    ]
  }

  if (flow === 'recommendations') {
    const first = dataset.recommendations[0]
    const second = dataset.recommendations[1]
    const removable = selectedRecommendations[0]

    return [
      { id: 'rec-1', flow, label: 'What others did', prompt: 'show what others did' },
      { id: 'rec-2', flow, label: 'Try this next', prompt: 'show try this next' },
      { id: 'rec-3', flow, label: 'Resources', prompt: 'show resources' },
      { id: 'rec-4', flow, label: `Add ${first.id}`, prompt: `add: ${first.id}` },
      {
        id: 'rec-5',
        flow,
        label: removable ? `Remove ${removable}` : `Add ${second.id}`,
        prompt: removable ? `remove: ${removable}` : `add: ${second.id}`,
      },
    ]
  }

  if (flow === 'improvement') {
    return [
      { id: 'imp-1', flow, label: 'Show plan snapshot', prompt: 'show plan snapshot' },
      { id: 'imp-2', flow, label: 'Set timeline 2 weeks', prompt: 'set timeline: 2 weeks' },
      { id: 'imp-3', flow, label: 'Set action', prompt: 'set action: pilot one micro-improvement in one class this week' },
    ]
  }

  if (flow === 'story') {
    return [
      { id: 'sto-1', flow, label: 'Set problem', prompt: 'set problem: students were present but not participating' },
      { id: 'sto-2', flow, label: 'Set action', prompt: 'set action: introduced peer discussion routine twice a week' },
      { id: 'sto-3', flow, label: 'Generate story card', prompt: 'generate story card' },
    ]
  }

  if (flow === 'companion') {
    return dataset.suggestedQuestions.slice(0, 3).map((question, index) => ({
      id: `comp-${index}`,
      flow,
      label: question,
      prompt: question,
    }))
  }

  return [
    { id: 'pro-1', flow, label: 'Show program snapshot', prompt: 'show program snapshot' },
    { id: 'pro-2', flow, label: 'Set objective', prompt: 'set objective: improve classroom participation through active learning routines' },
    { id: 'pro-3', flow, label: 'Set indicators', prompt: 'set indicators: participation ratio, weekly attendance, student confidence pulse' },
  ]
}

export function resolveChatResponse(params: ChatEngineInput): ChatEngineResult {
  if (params.flow === 'home') {
    return {
      text: 'Home mode routes your input to the right context before generating a response.',
    }
  }

  if (params.flow === 'feedback') {
    return resolveCaptureResponse(params)
  }

  if (params.flow === 'commons') {
    return resolveRecommendationsResponse(params)
  }

  if (params.flow === 'capture') {
    return resolveCaptureResponse(params)
  }
  if (params.flow === 'insights') {
    return resolveInsightsResponse(params)
  }
  if (params.flow === 'recommendations') {
    return resolveRecommendationsResponse(params)
  }
  if (params.flow === 'improvement') {
    return resolveImprovementResponse(params)
  }
  if (params.flow === 'story') {
    return resolveStoryResponse(params)
  }
  if (params.flow === 'companion') {
    return resolveCompanionResponse(params)
  }
  return resolveProgramResponse(params)
}

function resolveCaptureResponse({ dataset, input, captureAnswers, actions }: ChatEngineInput): ChatEngineResult {
  const whereValue = extractCommandValue(input, ['set where:', 'where:'])
  if (whereValue) {
    const selected = resolveOption(dataset.captureOptions.where, whereValue)
    actions.setCaptureAnswer('where', selected)
    return {
      text: 'Updated capture context for "Where".',
      blocks: [
        {
          type: 'kv',
          title: 'Current capture values',
          rows: captureRows({ ...captureAnswers, where: selected }),
        },
      ],
    }
  }

  const whoValue = extractCommandValue(input, ['set who:', 'who:'])
  if (whoValue) {
    const selected = resolveOption(dataset.captureOptions.who, whoValue)
    actions.setCaptureAnswer('who', selected)
    return {
      text: 'Updated capture context for "Who".',
      blocks: [
        {
          type: 'kv',
          title: 'Current capture values',
          rows: captureRows({ ...captureAnswers, who: selected }),
        },
      ],
    }
  }

  const triedValue = extractCommandValue(input, ['set tried:', 'tried:'])
  if (triedValue) {
    const selected = resolveOption(dataset.captureOptions.tried, triedValue)
    actions.setCaptureAnswer('tried', selected)
    return {
      text: 'Updated capture context for "What have you tried".',
      blocks: [
        {
          type: 'kv',
          title: 'Current capture values',
          rows: captureRows({ ...captureAnswers, tried: selected }),
        },
      ],
    }
  }

  if (containsAny(input, ['show summary', 'generate summary', 'capture summary', 'summary'])) {
    actions.generateCapturedSummary()
    return {
      text: 'Captured context summary generated from current structured inputs.',
      blocks: [
        {
          type: 'text',
          title: 'Captured Context Summary',
          body: dataset.summaryTemplate(captureAnswers),
        },
        {
          type: 'kv',
          title: 'Input snapshot',
          rows: captureRows(captureAnswers),
        },
      ],
    }
  }

  return {
    text: 'I can update capture fields or generate your context summary in this mode.',
    blocks: [
      {
        type: 'list',
        title: 'Supported commands',
        items: [
          'set where: ...',
          'set who: ...',
          'set tried: ...',
          'show summary',
        ],
      },
      {
        type: 'list',
        title: 'Available "Where" options',
        items: dataset.captureOptions.where,
      },
    ],
  }
}

function resolveInsightsResponse({ dataset, insights, input }: ChatEngineInput): ChatEngineResult {
  if (containsAny(input, ['root cause', 'root causes'])) {
    return {
      text: 'Here are the primary root causes for the selected challenge.',
      blocks: [
        {
          type: 'list',
          title: 'Root causes',
          items: dataset.rootCauses.map((cause) => `${cause.title}: ${cause.description}`),
        },
      ],
    }
  }

  if (containsAny(input, ['cluster', 'clustered', 'insight cluster'])) {
    const grouped = groupInsightsByCluster(insights)
    return {
      text: 'Clustered insight view generated.',
      blocks: grouped.map((group) => ({
        type: 'list',
        title: group.cluster,
        items: group.items,
      })),
    }
  }

  if (containsAny(input, ['key pattern', 'patterns'])) {
    return {
      text: 'Key patterns from the current challenge context.',
      blocks: [{ type: 'list', title: 'Key patterns', items: dataset.keyPatterns }],
    }
  }

  return {
    text: 'Here is a consolidated insights snapshot (patterns, root causes, and clusters).',
    blocks: [
      { type: 'list', title: 'Key patterns', items: dataset.keyPatterns },
      {
        type: 'list',
        title: 'Root causes',
        items: dataset.rootCauses.map((cause) => `${cause.title}: ${cause.description}`),
      },
      ...groupInsightsByCluster(insights).map((group) => ({
        type: 'list' as const,
        title: `Cluster: ${group.cluster}`,
        items: group.items,
      })),
    ],
  }
}

function resolveRecommendationsResponse({
  dataset,
  input,
  selectedRecommendations,
  actions,
}: ChatEngineInput): ChatEngineResult {
  const addQuery = extractCommandValue(input, ['add:', 'add '])
  if (addQuery) {
    const recommendation = findRecommendation(dataset.recommendations, addQuery)
    if (!recommendation) {
      return {
        text: 'I could not find that recommendation. Try an ID (e.g., eng-r3) or part of the title.',
      }
    }

    if (!selectedRecommendations.includes(recommendation.id)) {
      actions.toggleRecommendationSelection(recommendation.id)
    }

    return {
      text: `Added recommendation: ${recommendation.title}`,
      blocks: [recommendationDetailBlock(recommendation)],
    }
  }

  const removeQuery = extractCommandValue(input, ['remove:', 'remove '])
  if (removeQuery) {
    const recommendation = findRecommendation(dataset.recommendations, removeQuery)
    if (!recommendation) {
      return {
        text: 'I could not find that recommendation to remove.',
      }
    }

    if (selectedRecommendations.includes(recommendation.id)) {
      actions.toggleRecommendationSelection(recommendation.id)
      return {
        text: `Removed recommendation: ${recommendation.title}`,
      }
    }

    return {
      text: `${recommendation.title} is not currently selected.`,
    }
  }

  if (containsAny(input, ['show selected', 'selected recommendations'])) {
    const selected = dataset.recommendations.filter((item) => selectedRecommendations.includes(item.id))

    if (selected.length === 0) {
      return {
        text: 'No recommendations are selected yet. Add one using `add: <id>`.',
      }
    }

    return {
      text: 'Currently selected recommendations for your improvement plan.',
      blocks: [
        {
          type: 'list',
          title: 'Selected recommendations',
          items: selected.map((item) => `${item.id} - ${item.title}`),
        },
      ],
    }
  }

  const requestedSection = resolveRecommendationSection(input)
  if (requestedSection) {
    const sectionItems = dataset.recommendations.filter((item) => item.section === requestedSection)
    return {
      text: `${recommendationSectionLabels[requestedSection]} for the selected challenge.`,
      blocks: [
        {
          type: 'list',
          title: recommendationSectionLabels[requestedSection],
          items: sectionItems.map((item) => `${item.id} - ${item.title}: ${item.description}`),
        },
      ],
    }
  }

  return {
    text: 'I can show recommendations by section or add/remove them from your selected list.',
    blocks: [
      {
        type: 'list',
        title: 'Supported commands',
        items: [
          'show what others did',
          'show try this next',
          'show resources',
          'add: <recommendation id or title>',
          'remove: <recommendation id or title>',
          'show selected',
        ],
      },
    ],
  }
}

function resolveImprovementResponse({
  input,
  improvementPlanDraft,
  selectedRecommendations,
  actions,
}: ChatEngineInput): ChatEngineResult {
  const actionValue = extractCommandValue(input, ['set action:', 'action:'])
  if (actionValue) {
    actions.setImprovementPlanField('smallAction', actionValue)
    return { text: 'Updated plan field: small action.' }
  }

  const outcomeValue = extractCommandValue(input, ['set outcome:', 'outcome:'])
  if (outcomeValue) {
    actions.setImprovementPlanField('expectedOutcome', outcomeValue)
    return { text: 'Updated plan field: expected outcome.' }
  }

  const timelineValue = extractCommandValue(input, ['set timeline:', 'timeline:'])
  if (timelineValue) {
    const resolvedTimeline = resolveOption(timelineOptions, timelineValue)
    actions.setImprovementPlanField('timeline', resolvedTimeline)
    return { text: `Updated timeline to ${resolvedTimeline}.` }
  }

  const signalValue = extractCommandValue(input, ['set signal:', 'signal:'])
  if (signalValue) {
    actions.setImprovementPlanField('successSignal', signalValue)
    return { text: 'Updated plan field: success signal.' }
  }

  const supportValue = extractCommandValue(input, ['set support:', 'support:'])
  if (supportValue) {
    actions.setImprovementPlanField('supportNeeded', supportValue)
    return { text: 'Updated plan field: support needed.' }
  }

  if (containsAny(input, ['show plan snapshot', 'generate plan', 'plan snapshot'])) {
    return {
      text: 'Your current improvement plan snapshot is ready.',
      blocks: [
        {
          type: 'kv',
          title: 'Improvement Plan',
          rows: [
            { label: 'Small action', value: improvementPlanDraft.smallAction },
            { label: 'Expected outcome', value: improvementPlanDraft.expectedOutcome },
            { label: 'Timeline', value: improvementPlanDraft.timeline },
            { label: 'Success signal', value: improvementPlanDraft.successSignal },
            { label: 'Support needed', value: improvementPlanDraft.supportNeeded },
            { label: 'Linked recommendations', value: String(selectedRecommendations.length) },
          ],
        },
      ],
    }
  }

  return {
    text: 'I can update improvement plan fields or generate the latest plan snapshot.',
    blocks: [
      {
        type: 'list',
        title: 'Supported commands',
        items: [
          'set action: ...',
          'set outcome: ...',
          'set timeline: ...',
          'set signal: ...',
          'set support: ...',
          'show plan snapshot',
        ],
      },
    ],
  }
}

function resolveStoryResponse({ input, storyDraft, actions }: ChatEngineInput): ChatEngineResult {
  const problemValue = extractCommandValue(input, ['set problem:', 'problem:'])
  if (problemValue) {
    actions.setStoryField('problem', problemValue)
    return { text: 'Updated story field: problem.' }
  }

  const actionValue = extractCommandValue(input, ['set action:', 'action:'])
  if (actionValue) {
    actions.setStoryField('actionTaken', actionValue)
    return { text: 'Updated story field: action taken.' }
  }

  const outcomeValue = extractCommandValue(input, ['set outcome:', 'outcome:'])
  if (outcomeValue) {
    actions.setStoryField('outcome', outcomeValue)
    return { text: 'Updated story field: outcome.' }
  }

  const reflectionValue = extractCommandValue(input, ['set reflection:', 'reflection:'])
  if (reflectionValue) {
    actions.setStoryField('reflection', reflectionValue)
    return { text: 'Updated story field: reflection.' }
  }

  if (containsAny(input, ['generate story card', 'show story card', 'story card'])) {
    return {
      text: 'Improvement story card generated from your current draft.',
      blocks: [
        {
          type: 'kv',
          title: 'Improvement Story Card',
          rows: [
            { label: 'Problem', value: storyDraft.problem || 'Not captured yet' },
            { label: 'Action taken', value: storyDraft.actionTaken || 'Not captured yet' },
            { label: 'Outcome', value: storyDraft.outcome || 'Not captured yet' },
            { label: 'Reflection', value: storyDraft.reflection || 'Not captured yet' },
          ],
        },
      ],
    }
  }

  return {
    text: 'I can update story fields and generate a structured story card.',
    blocks: [
      {
        type: 'list',
        title: 'Supported commands',
        items: [
          'set problem: ...',
          'set action: ...',
          'set outcome: ...',
          'set reflection: ...',
          'generate story card',
        ],
      },
    ],
  }
}

function resolveCompanionResponse({ input, dataset, actions }: ChatEngineInput): ChatEngineResult {
  const companionReply = actions.askCompanion(input)

  const linkedInsights = dataset.insights
    .filter((insight) => companionReply.linkedInsightIds.includes(insight.id))
    .map((insight) => insight.title)

  const linkedRecommendations = dataset.recommendations
    .filter((item) => companionReply.linkedRecommendationIds.includes(item.id))
    .map((item) => item.title)

  const blocks: ChatBlock[] = [
    { type: 'list', title: 'Structured response', items: companionReply.steps },
  ]

  if (linkedInsights.length > 0) {
    blocks.push({ type: 'tags', title: 'Linked insights', tags: linkedInsights })
  }

  if (linkedRecommendations.length > 0) {
    blocks.push({ type: 'tags', title: 'Linked recommendations', tags: linkedRecommendations })
  }

  return {
    text: companionReply.summary,
    blocks,
  }
}

function resolveProgramResponse({ input, programDesignDraft, actions }: ChatEngineInput): ChatEngineResult {
  const challengeValue = extractCommandValue(input, ['set challenge:', 'challenge:'])
  if (challengeValue) {
    actions.setProgramDraftField('challengeStatement', challengeValue)
    return { text: 'Updated program field: challenge statement.' }
  }

  const objectiveValue = extractCommandValue(input, ['set objective:', 'objective:'])
  if (objectiveValue) {
    actions.setProgramDraftField('objective', objectiveValue)
    return { text: 'Updated program field: objective.' }
  }

  const targetValue = extractCommandValue(input, ['set target:', 'set target group:', 'target:'])
  if (targetValue) {
    actions.setProgramDraftField('targetGroup', targetValue)
    return { text: 'Updated program field: target group.' }
  }

  const activitiesValue = extractCommandValue(input, ['set activities:', 'activities:'])
  if (activitiesValue) {
    actions.setProgramDraftField('keyActivities', activitiesValue)
    return { text: 'Updated program field: key activities.' }
  }

  const indicatorsValue = extractCommandValue(input, ['set indicators:', 'indicators:'])
  if (indicatorsValue) {
    actions.setProgramDraftField('indicators', indicatorsValue)
    return { text: 'Updated program field: indicators.' }
  }

  if (containsAny(input, ['show program snapshot', 'generate program snapshot', 'program snapshot'])) {
    return {
      text: 'Program/Design snapshot generated from current draft.',
      blocks: [
        {
          type: 'kv',
          title: 'Program Snapshot',
          rows: [
            { label: 'Challenge statement', value: programDesignDraft.challengeStatement },
            { label: 'Objective', value: programDesignDraft.objective },
            { label: 'Target group', value: programDesignDraft.targetGroup },
            { label: 'Key activities', value: programDesignDraft.keyActivities },
            { label: 'Indicators', value: programDesignDraft.indicators },
          ],
        },
      ],
    }
  }

  return {
    text: 'I can update challenge/design/measurement fields and generate a program snapshot.',
    blocks: [
      {
        type: 'list',
        title: 'Supported commands',
        items: [
          'set challenge: ...',
          'set objective: ...',
          'set target: ...',
          'set activities: ...',
          'set indicators: ...',
          'show program snapshot',
        ],
      },
    ],
  }
}

function recommendationDetailBlock(recommendation: RecommendationItem): ChatBlock {
  return {
    type: 'text',
    title: recommendation.title,
    body: recommendation.details,
  }
}

function resolveRecommendationSection(input: string): RecommendationItem['section'] | null {
  if (containsAny(input, ['what others did', 'what others'])) {
    return 'whatOthersDid'
  }
  if (containsAny(input, ['try this next', 'next action'])) {
    return 'tryThisNext'
  }
  if (containsAny(input, ['resources', 'resource'])) {
    return 'resources'
  }
  return null
}

function findRecommendation(
  recommendations: RecommendationItem[],
  query: string,
): RecommendationItem | undefined {
  const normalizedQuery = normalize(query)

  return recommendations.find((item) => normalize(item.id) === normalizedQuery)
    ?? recommendations.find((item) => normalize(item.title).includes(normalizedQuery))
}

function groupInsightsByCluster(insights: InsightItem[]) {
  const grouped = insights.reduce<Record<string, string[]>>((acc, insight) => {
    const titleWithTags = `${insight.title} (${insight.tags.join(', ')})`
    acc[insight.cluster] = [...(acc[insight.cluster] ?? []), titleWithTags]
    return acc
  }, {})

  return Object.entries(grouped).map(([cluster, items]) => ({ cluster, items }))
}

function extractCommandValue(input: string, prefixes: string[]) {
  for (const prefix of prefixes) {
    const expression = new RegExp(`^${escapeForRegex(prefix)}\\s*(.+)$`, 'i')
    const match = input.trim().match(expression)
    if (match?.[1]) {
      return match[1].trim()
    }
  }
  return null
}

function resolveOption(options: string[], rawValue: string) {
  const normalized = normalize(rawValue)
  const directMatch = options.find((option) => normalize(option) === normalized)
  if (directMatch) {
    return directMatch
  }

  const partialMatch = options.find(
    (option) => normalize(option).includes(normalized) || normalized.includes(normalize(option)),
  )
  return partialMatch ?? rawValue
}

function captureRows(captureAnswers: CaptureAnswers) {
  return [
    { label: 'Where', value: captureAnswers.where },
    { label: 'Who', value: captureAnswers.who },
    { label: 'What tried', value: captureAnswers.tried },
  ]
}

function containsAny(input: string, tokens: string[]) {
  const normalized = normalize(input)
  return tokens.some((token) => normalized.includes(normalize(token)))
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')
}
