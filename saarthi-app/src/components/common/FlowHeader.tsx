import { BrainCircuit } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

interface FlowHeaderProps {
  title: string
  description: string
  capability: 'Sense' | 'Make Sense' | 'Learn' | 'Improve' | 'Guide'
}

export function FlowHeader({ title, description, capability }: FlowHeaderProps) {
  return (
    <div className="mb-6 space-y-3">
      <Badge className="w-fit bg-secondary text-secondary-foreground" variant="secondary">
        <BrainCircuit className="mr-1 h-3.5 w-3.5" />
        {capability}
      </Badge>
      <div>
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">{description}</p>
      </div>
    </div>
  )
}
