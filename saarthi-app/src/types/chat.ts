import type { FlowKey } from '@/types/saarthi'

export type ChatRole = 'user' | 'assistant' | 'system'

export type ChatBlock =
  | {
      type: 'list'
      title: string
      items: string[]
    }
  | {
      type: 'kv'
      title: string
      rows: Array<{ label: string; value: string }>
    }
  | {
      type: 'tags'
      title?: string
      tags: string[]
    }
  | {
      type: 'text'
      title?: string
      body: string
    }
  | {
      type: 'actions'
      title?: string
      actions: Array<{ label: string; url?: string }>
    }

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
  flow: FlowKey
  timestamp: string
  blocks?: ChatBlock[]
}

export interface ChatSuggestion {
  id: string
  flow: FlowKey
  label: string
  prompt: string
}
