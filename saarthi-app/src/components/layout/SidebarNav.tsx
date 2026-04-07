import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Ear,
  Globe,
  Home,
  Lightbulb,
  MessagesSquare,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import { useState, type ComponentType } from 'react'

import { cn } from '@/lib/utils'
import type { FlowKey } from '@/types/saarthi'

interface CapabilityItem {
  key: FlowKey
  label: string
  subtitle: string
  icon: ComponentType<{ className?: string }>
  subActions?: Array<{ key: FlowKey; label: string }>
}

const capabilityItems: CapabilityItem[] = [
  {
    key: 'capture',
    label: 'Listening at Scale',
    subtitle: 'Synthesize field insights into actionable knowledge',
    icon: Ear,
    subActions: [
      { key: 'capture', label: 'Capture Discussions' },
      { key: 'story', label: 'Record Stories' },
      { key: 'capture', label: 'Capture Feedback' },
    ],
  },
  {
    key: 'recommendations',
    label: 'Contextual Recommendations',
    subtitle: 'Delivering relevant, localized guidance',
    icon: WandSparkles,
    subActions: [{ key: 'recommendations', label: 'Recommendation Engine' }],
  },
  {
    key: 'insights',
    label: 'Insights Engine',
    subtitle: 'Evidence analysis and data insights',
    icon: Lightbulb,
  },
  {
    key: 'companion',
    label: 'Saathi - MI Companion',
    subtitle: 'Real-time assistance to first-mile actors',
    icon: Sparkles,
  },
  {
    key: 'program',
    label: 'Design Companion',
    subtitle: 'Support for program designers',
    icon: BookOpen,
  },
  {
    key: 'recommendations',
    label: 'SG Commons Portal',
    subtitle: 'AI search for ecosystem assets',
    icon: Globe,
  },
]

const quickActions: Array<{ key: FlowKey; label: string; icon: ComponentType<{ className?: string }> }> = [
  { key: 'capture', label: 'Classroom Challenge', icon: MessagesSquare },
  { key: 'insights', label: 'Get Insights', icon: Lightbulb },
  { key: 'recommendations', label: 'Find Resources', icon: Globe },
  { key: 'companion', label: 'Connect Peers', icon: Sparkles },
]

interface SidebarNavProps {
  activeFlow: FlowKey
  onFlowChange: (flow: FlowKey) => void
}

export function SidebarNav({ activeFlow, onFlowChange }: SidebarNavProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const isAdvancedOpen = activeFlow !== 'home' || advancedOpen

  return (
    <div className="space-y-4 text-foreground">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Primary</p>
        <button
          className={cn(
            'w-full rounded-2xl border px-3 py-3 text-left transition-colors',
            activeFlow === 'home'
              ? 'border-primary/35 bg-primary/10 text-foreground'
              : 'border-border bg-card/90 text-foreground hover:border-primary/25 hover:bg-muted',
          )}
          onClick={() => onFlowChange('home')}
          type="button"
        >
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Home className="h-4 w-4 text-primary" />
            Home
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Main chat workspace with automatic context routing</p>
        </button>
      </div>

      <div>
        <button
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card/80 px-3 py-2.5 text-left"
          onClick={() => setAdvancedOpen((prev) => !prev)}
          type="button"
        >
          <span>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Advanced</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">Manual capability controls</p>
          </span>
          {isAdvancedOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>

        {isAdvancedOpen ? (
          <div className="mt-3 space-y-5">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Capabilities</p>
              <div className="space-y-2.5">
                {capabilityItems.map((item) => {
                  const Icon = item.icon
                  const active = item.key === activeFlow
                  return (
                    <button
                      className={cn(
                        'w-full rounded-2xl border px-3 py-3 text-left transition-colors',
                        active
                          ? 'border-primary/35 bg-primary/10 text-foreground'
                          : 'border-border bg-card/90 text-foreground hover:border-primary/25 hover:bg-muted',
                      )}
                      key={item.label}
                      onClick={() => onFlowChange(item.key)}
                      type="button"
                    >
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <Icon className="h-4 w-4 text-primary" />
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>

                      {item.subActions ? (
                        <div className="mt-3 space-y-1.5">
                          {item.subActions.map((subAction) => (
                            <button
                              className={cn(
                                'block w-full rounded-lg border px-2.5 py-1.5 text-left text-xs font-medium transition-colors',
                                subAction.key === activeFlow
                                  ? 'border-primary/30 bg-primary/15 text-foreground'
                                  : 'border-border bg-background text-muted-foreground hover:bg-muted',
                              )}
                              key={`${item.label}-${subAction.label}`}
                              onClick={(event) => {
                                event.stopPropagation()
                                onFlowChange(subAction.key)
                              }}
                              type="button"
                            >
                              {subAction.label}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <button
                      className={cn(
                        'rounded-xl border px-2.5 py-2 text-left text-xs font-semibold transition-colors',
                        action.key === activeFlow
                          ? 'border-primary/30 bg-primary/10 text-foreground'
                          : 'border-border bg-card/85 text-foreground/85 hover:bg-muted',
                      )}
                      key={action.label}
                      onClick={() => onFlowChange(action.key)}
                      type="button"
                    >
                      <span className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        {action.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
