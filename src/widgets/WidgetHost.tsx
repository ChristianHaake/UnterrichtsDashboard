import type { WidgetKind } from './types'
import type { WidgetStateMap } from './state'
import { TimerWidget } from './timer/TimerWidget'
import { SymbolsWidget } from './symbols/SymbolsWidget'
import { PhasesWidget } from './phases/PhasesWidget'
import { TextWidget } from './text/TextWidget'

interface WidgetHostProps {
  kind: WidgetKind
  state: unknown
  onChange: (next: unknown) => void
}

/** Type-safe boundary: narrows the persisted `unknown` state to each widget. */
export function WidgetHost({ kind, state, onChange }: WidgetHostProps) {
  switch (kind) {
    case 'timer':
      return <TimerWidget state={state as WidgetStateMap['timer']} onChange={onChange} />
    case 'symbols':
      return <SymbolsWidget state={state as WidgetStateMap['symbols']} onChange={onChange} />
    case 'phases':
      return <PhasesWidget state={state as WidgetStateMap['phases']} onChange={onChange} />
    case 'text':
      return <TextWidget state={state as WidgetStateMap['text']} onChange={onChange} />
  }
}
