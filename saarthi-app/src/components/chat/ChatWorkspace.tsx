import { Bot, SendHorizontal, UserCircle2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { challengeData } from '@/data/mockData'
import { useSaarthiState } from '@/hooks/useSaarthiState'
import {
  getChatSuggestions,
  getComposerPlaceholder,
  getFlowLabel,
  resolveChatResponse,
} from '@/lib/chatEngine'
import { cn } from '@/lib/utils'
import type { ChatBlock, ChatMessage } from '@/types/chat'
import type { FlowKey } from '@/types/saarthi'

interface ChatWorkspaceProps {
  activeFlow: FlowKey
}

export function ChatWorkspace({ activeFlow }: ChatWorkspaceProps) {
  const idRef = useRef(0)
  const endRef = useRef<HTMLDivElement | null>(null)
  const [draft, setDraft] = useState('')

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

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-initial',
      role: 'assistant',
      flow: activeFlow,
      timestamp: new Date().toISOString(),
      text: `Namaste. I am SAARTHI. You are in ${getFlowLabel(activeFlow)} for ${dataset.label.toLowerCase()}. Ask a question or use a suggestion chip to continue.`,
    },
  ])

  const suggestions = useMemo(
    () => getChatSuggestions({ flow: activeFlow, dataset, selectedRecommendations }),
    [activeFlow, dataset, selectedRecommendations],
  )

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function nextId() {
    idRef.current += 1
    return `msg-${idRef.current}`
  }

  function sendPrompt(rawPrompt: string) {
    const input = rawPrompt.trim()
    if (!input) {
      return
    }

    const userMessage: ChatMessage = {
      id: nextId(),
      role: 'user',
      flow: activeFlow,
      timestamp: new Date().toISOString(),
      text: input,
    }

    const engineResult = resolveChatResponse({
      flow: activeFlow,
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
      flow: activeFlow,
      timestamp: new Date().toISOString(),
      text: engineResult.text,
      blocks: engineResult.blocks,
    }

    setMessages((previous) => [...previous, userMessage, assistantMessage])
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim()) {
      return
    }

    sendPrompt(draft)
    setDraft('')
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!draft.trim()) {
        return
      }

      sendPrompt(draft)
      setDraft('')
    }
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-border bg-card/75 shadow-sm">
      <div className="border-b border-border/80 bg-background/75 px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-primary/30 bg-primary/10 text-primary" variant="outline">
            Context: {getFlowLabel(activeFlow)}
          </Badge>
          <Badge variant="secondary">Challenge: {dataset.label}</Badge>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Sidebar switches context silently. This thread is shared across all menus.
        </p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 md:px-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 border-t border-border/80 bg-card/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/25 hover:bg-muted"
              key={suggestion.id}
              onClick={() => sendPrompt(suggestion.prompt)}
              type="button"
            >
              {suggestion.label}
            </button>
          ))}
        </div>

        <form className="flex items-end gap-2" onSubmit={onSubmit}>
          <Textarea
            className="max-h-40 min-h-[52px] resize-none rounded-2xl bg-background"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={getComposerPlaceholder(activeFlow)}
            value={draft}
          />
          <Button className="h-11 rounded-xl px-4" type="submit">
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
