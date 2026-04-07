import {
  BookOpen,
  ClipboardList,
  Compass,
  FilePlus2,
  Lightbulb,
  MessageSquarePlus,
  Sparkles,
} from 'lucide-react'
import type { ComponentType } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { FlowKey } from '@/types/saarthi'

interface NavItem {
  key: FlowKey
  label: string
  icon: ComponentType<{ className?: string }>
  subtitle: string
}

const navItems: NavItem[] = [
  {
    key: 'capture',
    label: 'Capture Challenge',
    icon: MessageSquarePlus,
    subtitle: 'Sense',
  },
  {
    key: 'insights',
    label: 'Insights',
    icon: Lightbulb,
    subtitle: 'Make Sense',
  },
  {
    key: 'recommendations',
    label: 'Recommendations',
    icon: Compass,
    subtitle: 'Learn',
  },
  {
    key: 'improvement',
    label: 'Improvement Plan',
    icon: ClipboardList,
    subtitle: 'Improve',
  },
  {
    key: 'story',
    label: 'Story Capture',
    icon: FilePlus2,
    subtitle: 'Mitra',
  },
  {
    key: 'companion',
    label: 'Companion',
    icon: Sparkles,
    subtitle: 'Saathi',
  },
  {
    key: 'program',
    label: 'Program/Design Companion',
    icon: BookOpen,
    subtitle: 'Program',
  },
]

interface SidebarNavProps {
  activeFlow: FlowKey
  onFlowChange: (flow: FlowKey) => void
  vertical?: boolean
}

export function SidebarNav({ activeFlow, onFlowChange, vertical = true }: SidebarNavProps) {
  return (
    <nav className={cn('gap-2', vertical ? 'flex flex-col' : 'grid grid-cols-1 sm:grid-cols-2')}>
      {navItems.map((item) => {
        const Icon = item.icon
        const active = item.key === activeFlow
        return (
          <Button
            key={item.key}
            className={cn(
              'h-auto justify-start gap-3 rounded-xl px-3 py-3 text-left font-medium',
              active
                ? 'border border-primary/30 bg-primary/15 text-primary hover:bg-primary/20'
                : 'border border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground',
            )}
            onClick={() => onFlowChange(item.key)}
            variant="ghost"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <div>
              <p className="text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
            </div>
          </Button>
        )
      })}
    </nav>
  )
}
