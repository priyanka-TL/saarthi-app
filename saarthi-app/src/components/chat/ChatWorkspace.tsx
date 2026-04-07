import { Bot, SendHorizontal, UserCircle2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { challengeData } from '@/data/mockData'
import { useSaarthiState } from '@/hooks/useSaarthiState'
import {
  getComposerPlaceholder,
  getFlowLabel,
  resolveChatResponse,
} from '@/lib/chatEngine'
import {
  getDemoScriptById,
  homeFlowConfig,
  homeSimulationEnabled,
  resolveRouteMatch,
} from '@/lib/homeFlow'
import { cn } from '@/lib/utils'
import type { DemoUserStep, RouteContext } from '@/types/homeFlow'
import type { ChatBlock, ChatMessage } from '@/types/chat'
import type { FlowKey } from '@/types/saarthi'

interface ChatWorkspaceProps {
  activeFlow: FlowKey
  onFlowChange: (flow: FlowKey) => void
}

const defaultTypingMsPerChar = 24
const defaultPostStepDelayMs = 700

export function ChatWorkspace({ activeFlow, onFlowChange }: ChatWorkspaceProps) {
  const idRef = useRef(0)
  const endRef = useRef<HTMLDivElement | null>(null)
  const simulationStateRef = useRef<'idle' | 'running' | 'awaiting-user' | 'completed'>('idle')
  const awaitingScriptedUserStepRef = useRef<DemoUserStep | null>(null)
  const resumeSimulationRef = useRef<(() => void) | null>(null)
  const [draft, setDraft] = useState('')
  const [isDraftAutoTyping, setIsDraftAutoTyping] = useState(false)
  const [isAssistantThinking, setIsAssistantThinking] = useState(false)
  const [assistantThinkingLabel, setAssistantThinkingLabel] = useState('Reviewing your input...')
  const [currentContext, setCurrentContext] = useState<RouteContext | null>(null)

  const {
    selectedChallenge,
    captureAnswers,
    insights,
    selectedRecommendations,
    improvementPlanDraft,
    storyDraft,
    programDesignDraft,
    setCaptureAnswer,
    generateCapturedSummary,
    toggleRecommendationSelection,
    setImprovementPlanField,
    setStoryField,
    askCompanion,
    setProgramDraftField,
  } = useSaarthiState()

  const dataset = challengeData[selectedChallenge]

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-initial',
        role: 'assistant',
        flow: 'home',
        timestamp: new Date().toISOString(),
        text: `Namaste Akash. I am SAARTHI. How can i help you today!!`,
      },
    ]
  })

  const currentContextRef = useRef(currentContext)
  const activeFlowRef = useRef(activeFlow)

  useEffect(() => {
    currentContextRef.current = currentContext
  }, [currentContext])

  useEffect(() => {
    activeFlowRef.current = activeFlow
  }, [activeFlow])

  const effectiveFlow = activeFlow === 'home' ? currentContext?.flow ?? 'home' : activeFlow

  const contextLabel = activeFlow === 'home' ? currentContext?.label : getFlowLabel(activeFlow)
  const subContextLabel = activeFlow === 'home' ? currentContext?.subLabel : undefined
  const isHomeContextUnset = activeFlow === 'home' && !currentContext

  const demoScript = useMemo(
    () => getDemoScriptById(homeFlowConfig.defaultScriptId, homeFlowConfig),
    [],
  )

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [isAssistantThinking, messages])

  const nextId = useCallback(() => {
    idRef.current += 1
    return `msg-${idRef.current}`
  }, [])

  const appendScriptedAssistantTurn = useCallback((text: string, blocks?: ChatBlock[]) => {
    const routedFlow = activeFlowRef.current === 'home' ? currentContextRef.current?.flow ?? 'home' : activeFlowRef.current

    const assistantMessage: ChatMessage = {
      id: nextId(),
      role: 'assistant',
      flow: routedFlow,
      timestamp: new Date().toISOString(),
      text,
      blocks,
    }

    setMessages((previous) => [...previous, assistantMessage])
  }, [nextId])

  const sendPrompt = useCallback(async (rawPrompt: string, options?: { skipEngineResponse?: boolean }) => {
    const input = rawPrompt.trim()
    if (!input) {
      return
    }

    const routeMatch = resolveRouteMatch(input, homeFlowConfig)

    let responseFlow: FlowKey = activeFlow === 'home' ? currentContext?.flow ?? 'home' : activeFlow
    let contextNoticeMessage: ChatMessage | null = null

    if (routeMatch) {
      responseFlow = routeMatch.context.flow

      if (routeMatch.context.id !== currentContext?.id) {
        setCurrentContext(routeMatch.context)
        contextNoticeMessage = {
          id: nextId(),
          role: 'system',
          flow: routeMatch.context.flow,
          timestamp: new Date().toISOString(),
          text: routeMatch.rule.notice,
        }
      }

      if (activeFlow !== 'home') {
        onFlowChange('home')
      }
    }

    const userMessage: ChatMessage = {
      id: nextId(),
      role: 'user',
      flow: responseFlow,
      timestamp: new Date().toISOString(),
      text: input,
    }

    if (options?.skipEngineResponse) {
      setMessages((previous) => [
        ...previous,
        userMessage,
        ...(contextNoticeMessage ? [contextNoticeMessage] : []),
      ])
      return
    }

    const engineResult = resolveChatResponse({
      flow: responseFlow,
      input,
      dataset,
      captureAnswers,
      insights,
      selectedRecommendations,
      improvementPlanDraft,
      storyDraft,
      programDesignDraft,
      actions: {
        setCaptureAnswer,
        generateCapturedSummary,
        toggleRecommendationSelection,
        setImprovementPlanField,
        setStoryField,
        askCompanion,
        setProgramDraftField,
      },
    })

    const assistantMessage: ChatMessage = {
      id: nextId(),
      role: 'assistant',
      flow: responseFlow,
      timestamp: new Date().toISOString(),
      text: engineResult.text,
      blocks: engineResult.blocks,
    }

    setMessages((previous) => [
      ...previous,
      userMessage,
      ...(contextNoticeMessage ? [contextNoticeMessage] : []),
    ])

    setAssistantThinkingLabel(pickThinkingLabel(responseFlow))
    setIsAssistantThinking(true)
    try {
      await wait(getAssistantResponseDelayMs(engineResult.text, Boolean(engineResult.blocks?.length)))
      setMessages((previous) => [...previous, assistantMessage])
    } finally {
      setIsAssistantThinking(false)
    }
  }, [
    activeFlow,
    askCompanion,
    captureAnswers,
    currentContext,
    dataset,
    generateCapturedSummary,
    improvementPlanDraft,
    insights,
    nextId,
    onFlowChange,
    programDesignDraft,
    selectedRecommendations,
    setCaptureAnswer,
    setImprovementPlanField,
    setProgramDraftField,
    setStoryField,
    storyDraft,
    toggleRecommendationSelection,
  ])
  const sendPromptRef = useRef(sendPrompt)

  useEffect(() => {
    sendPromptRef.current = sendPrompt
  }, [sendPrompt])

  useEffect(() => {
    if (!homeSimulationEnabled || activeFlow !== 'home' || !demoScript) {
      return
    }

    if (simulationStateRef.current !== 'idle') {
      return
    }

    const script = demoScript
    simulationStateRef.current = 'running'

    let cancelled = false

    async function runScript() {
      await wait(0)

      if (cancelled) {
        return
      }

      for (const step of script.steps) {
        if (cancelled) {
          return
        }

        if (step.type === 'assistant') {
          const scriptedFlow = activeFlowRef.current === 'home' ? currentContextRef.current?.flow ?? 'home' : activeFlowRef.current
          setAssistantThinkingLabel(pickThinkingLabel(scriptedFlow))
          setIsAssistantThinking(true)
          await wait(getScriptedAssistantDelayMs(step.text))
          if (cancelled) {
            setIsAssistantThinking(false)
            return
          }
          appendScriptedAssistantTurn(step.text, step.blocks)
          setIsAssistantThinking(false)
          await wait(step.postDelayMs ?? defaultPostStepDelayMs)
          continue
        }

        setIsDraftAutoTyping(true)
        for (let cursor = 1; cursor <= step.text.length; cursor += 1) {
          if (cancelled) {
            return
          }

          setDraft(step.text.slice(0, cursor))
          await wait(step.typingMsPerChar ?? defaultTypingMsPerChar)
        }

        if (cancelled) {
          return
        }

        setIsDraftAutoTyping(false)
        simulationStateRef.current = 'awaiting-user'
        awaitingScriptedUserStepRef.current = step

        await new Promise<void>((resolve) => {
          resumeSimulationRef.current = resolve
        })

        if (cancelled) {
          return
        }

        simulationStateRef.current = 'running'
        awaitingScriptedUserStepRef.current = null
        resumeSimulationRef.current = null
        await wait(step.postDelayMs ?? defaultPostStepDelayMs)
      }
    }

    void runScript()
      .then(() => {
        if (!cancelled) {
          simulationStateRef.current = 'completed'
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDraft('')
        }
        setIsAssistantThinking(false)
        setIsDraftAutoTyping(false)
      })

    return () => {
      cancelled = true
      awaitingScriptedUserStepRef.current = null
      if (resumeSimulationRef.current) {
        resumeSimulationRef.current()
        resumeSimulationRef.current = null
      }
      if (simulationStateRef.current === 'running' || simulationStateRef.current === 'awaiting-user') {
        simulationStateRef.current = 'idle'
      }
      setIsAssistantThinking(false)
      setIsDraftAutoTyping(false)
    }
  }, [activeFlow, appendScriptedAssistantTurn, demoScript])

  const submitDraft = useCallback((rawPrompt: string) => {
    if (isDraftAutoTyping || isAssistantThinking) {
      return
    }

    const input = rawPrompt.trim()
    if (!input) {
      return
    }

    const awaitingStep = awaitingScriptedUserStepRef.current
    if (awaitingStep && simulationStateRef.current === 'awaiting-user') {
      void sendPrompt(input, { skipEngineResponse: awaitingStep.skipEngineResponse })
      setDraft('')
      const resume = resumeSimulationRef.current
      resumeSimulationRef.current = null
      resume?.()
      return
    }

    void sendPrompt(input)
    setDraft('')
  }, [isAssistantThinking, isDraftAutoTyping, sendPrompt])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submitDraft(draft)
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submitDraft(draft)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card/75 shadow-sm">
      <div className="border-b border-border/80 bg-background/75 px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {isHomeContextUnset ? (
            <>
              <Badge className="border-dashed border-border text-muted-foreground" variant="outline">
                Context: Not selected yet
              </Badge>
              <Badge className="border-dashed border-border text-muted-foreground" variant="outline">
                Sub-context: Waiting for intent
              </Badge>
            </>
          ) : (
            <>
              <Badge className="border-primary/30 bg-primary/10 text-primary" variant="outline">
                Context: {contextLabel}
              </Badge>
              {subContextLabel ? <Badge variant="outline">Sub-context: {subContextLabel}</Badge> : null}
            </>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {isHomeContextUnset
            ? 'Share what you want to do, and SAARTHI will auto-select the right context.'
            : activeFlow === 'home'
            ? 'Home routing evaluates every user turn and keeps context sticky until a new match appears.'
            : 'Advanced mode is manual, but matching intents still route this shared thread automatically.'}
        </p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 md:px-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isAssistantThinking ? <AssistantThinkingBubble label={assistantThinkingLabel} /> : null}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 border-t border-border/80 bg-card/95 px-4 py-3 backdrop-blur md:px-6">
        <form className="flex items-end gap-2" onSubmit={onSubmit}>
          <Textarea
            className="max-h-40 min-h-[52px] resize-none rounded-2xl bg-background"
            disabled={isDraftAutoTyping || isAssistantThinking}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={getComposerPlaceholder(effectiveFlow)}
            value={draft}
          />
          <Button
            className="h-11 rounded-xl px-4"
            disabled={isDraftAutoTyping || isAssistantThinking || !draft.trim()}
            type="submit"
          >
            <SendHorizontal className="mr-1 h-4 w-4" />
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="max-w-[900px] rounded-full border border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-center">
          <p className="text-xs font-medium text-primary">{message.text}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser ? (
        <div className="mt-1 shrink-0 text-primary">
          <Bot className="h-5 w-5" />
        </div>
      ) : null}

      <div
        className={cn(
          'max-w-[900px] rounded-2xl border px-4 py-3',
          isUser
            ? 'border-primary/30 bg-primary text-primary-foreground'
            : 'border-border bg-background text-foreground',
        )}
      >
        <p className={cn('whitespace-pre-wrap text-sm leading-relaxed', isUser ? 'text-primary-foreground' : 'text-foreground')}>
          {message.text}
        </p>

        {message.blocks && message.blocks.length > 0 ? <AssistantBlocks blocks={message.blocks} /> : null}

        <p className={cn('mt-2 text-[11px]', isUser ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {getFlowLabel(message.flow)}
        </p>
      </div>

      {isUser ? (
        <div className="mt-1 shrink-0 text-primary">
          <UserCircle2 className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  )
}

function AssistantThinkingBubble({ label }: { label: string }) {
  return (
    <div className="flex justify-start gap-3">
      <div className="mt-1 shrink-0 text-primary">
        <Bot className="h-5 w-5" />
      </div>
      <div className="max-w-[900px] rounded-2xl border border-border bg-background px-4 py-3 text-foreground">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/70 [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/70 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/70 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

function AssistantBlocks({ blocks }: { blocks: ChatBlock[] }) {
  return (
    <div className="mt-3 space-y-2.5">
      {blocks.map((block, index) => {
        if (block.type === 'list') {
          return (
            <div className="rounded-xl border border-border bg-card/70 p-3" key={`${block.title}-${index}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{block.title}</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )
        }

        if (block.type === 'kv') {
          return (
            <div className="rounded-xl border border-border bg-card/70 p-3" key={`${block.title}-${index}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{block.title}</p>
              <div className="mt-2 grid gap-1.5">
                {block.rows.map((row) => (
                  <div className="grid grid-cols-[130px_1fr] gap-2 text-sm" key={row.label}>
                    <p className="text-muted-foreground">{row.label}</p>
                    <p className="text-foreground">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        if (block.type === 'tags') {
          return (
            <div className="rounded-xl border border-border bg-card/70 p-3" key={`${block.title ?? 'tags'}-${index}`}>
              {block.title ? (
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{block.title}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-2">
                {block.tags.map((tag) => (
                  <span
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )
        }

        return (
          <div className="rounded-xl border border-border bg-card/70 p-3" key={`${block.title ?? 'text'}-${index}`}>
            {block.title ? (
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{block.title}</p>
            ) : null}
            <p className="mt-1 text-sm text-foreground">{block.body}</p>
          </div>
        )
      })}
    </div>
  )
}

function pickThinkingLabel(flow: FlowKey) {
  const labels: Record<FlowKey, string[]> = {
    home: ['Understanding your intent...', 'Routing to the best context...', 'Preparing the next step...'],
    capture: ['Reviewing captured signals...', 'Structuring challenge details...', 'Assembling your summary...'],
    insights: ['Scanning patterns...', 'Comparing root causes...', 'Synthesizing insights...'],
    recommendations: ['Matching practical recommendations...', 'Evaluating options...', 'Building recommendation shortlist...'],
    improvement: ['Drafting a micro-improvement plan...', 'Aligning action and timeline...', 'Preparing implementation steps...'],
    story: ['Shaping your story arc...', 'Polishing impact narrative...', 'Preparing story card output...'],
    companion: ['Reviewing similar scenarios...', 'Thinking through support options...', 'Preparing contextual guidance...'],
    program: ['Aligning program design elements...', 'Checking objective-indicator fit...', 'Preparing program snapshot...'],
  }

  const flowLabels = labels[flow]
  return flowLabels[Math.floor(Math.random() * flowLabels.length)]
}

function getAssistantResponseDelayMs(text: string, hasBlocks: boolean) {
  const base = 450
  const textContribution = Math.min(900, text.length * 10)
  const blockContribution = hasBlocks ? 180 : 0
  const jitter = Math.floor(Math.random() * 220)
  return Math.min(2200, base + textContribution + blockContribution + jitter)
}

function getScriptedAssistantDelayMs(text: string) {
  const base = 380
  const textContribution = Math.min(780, text.length * 8)
  const jitter = Math.floor(Math.random() * 180)
  return Math.min(1700, base + textContribution + jitter)
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), ms)
  })
}
