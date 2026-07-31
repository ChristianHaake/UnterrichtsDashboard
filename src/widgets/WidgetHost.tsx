import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import type { WidgetKind } from './types'
import type { WidgetStateMap } from './state'

// Each widget is a separate lazily-loaded chunk. Heavy dependencies (e.g. the
// QR encoder) only reach the browser when that widget is actually used, keeping
// the initial download small — important on constrained school networks.
const TimerWidget = lazy(() => import('./timer/TimerWidget').then((m) => ({ default: m.TimerWidget })))
const SymbolsWidget = lazy(() =>
  import('./symbols/SymbolsWidget').then((m) => ({ default: m.SymbolsWidget })),
)
const PhasesWidget = lazy(() => import('./phases/PhasesWidget').then((m) => ({ default: m.PhasesWidget })))
const TextWidget = lazy(() => import('./text/TextWidget').then((m) => ({ default: m.TextWidget })))
const QrWidget = lazy(() => import('./qr/QrWidget').then((m) => ({ default: m.QrWidget })))
const RandomizerWidget = lazy(() =>
  import('./randomizer/RandomizerWidget').then((m) => ({ default: m.RandomizerWidget })),
)
const ScoreboardWidget = lazy(() =>
  import('./scoreboard/ScoreboardWidget').then((m) => ({ default: m.ScoreboardWidget })),
)
const HallPassWidget = lazy(() =>
  import('./hallpass/HallPassWidget').then((m) => ({ default: m.HallPassWidget })),
)
const SeatingWidget = lazy(() =>
  import('./seating/SeatingWidget').then((m) => ({ default: m.SeatingWidget })),
)
const MorningBoardWidget = lazy(() =>
  import('./morningboard/MorningBoardWidget').then((m) => ({ default: m.MorningBoardWidget })),
)
const StickyNotesWidget = lazy(() =>
  import('./stickynotes/StickyNotesWidget').then((m) => ({ default: m.StickyNotesWidget })),
)
const WhiteboardWidget = lazy(() =>
  import('./whiteboard/WhiteboardWidget').then((m) => ({ default: m.WhiteboardWidget })),
)
const MathToolsWidget = lazy(() =>
  import('./mathtools/MathToolsWidget').then((m) => ({ default: m.MathToolsWidget })),
)

interface WidgetHostProps {
  kind: WidgetKind
  state: unknown
  onChange: (next: unknown) => void
}

/** Type-safe boundary: narrows the persisted `unknown` state to each widget. */
function renderWidget({ kind, state, onChange }: WidgetHostProps) {
  switch (kind) {
    case 'timer':
      return <TimerWidget state={state as WidgetStateMap['timer']} onChange={onChange} />
    case 'symbols':
      return <SymbolsWidget state={state as WidgetStateMap['symbols']} onChange={onChange} />
    case 'phases':
      return <PhasesWidget state={state as WidgetStateMap['phases']} onChange={onChange} />
    case 'text':
      return <TextWidget state={state as WidgetStateMap['text']} onChange={onChange} />
    case 'qr':
      return <QrWidget state={state as WidgetStateMap['qr']} onChange={onChange} />
    case 'randomizer':
      return <RandomizerWidget state={state as WidgetStateMap['randomizer']} onChange={onChange} />
    case 'scoreboard':
      return <ScoreboardWidget state={state as WidgetStateMap['scoreboard']} onChange={onChange} />
    case 'hallpass':
      return <HallPassWidget state={state as WidgetStateMap['hallpass']} onChange={onChange} />
    case 'seating':
      return <SeatingWidget state={state as WidgetStateMap['seating']} onChange={onChange} />
    case 'morningboard':
      return <MorningBoardWidget state={state as WidgetStateMap['morningboard']} onChange={onChange} />
    case 'stickynotes':
      return <StickyNotesWidget state={state as WidgetStateMap['stickynotes']} onChange={onChange} />
    case 'whiteboard':
      return <WhiteboardWidget state={state as WidgetStateMap['whiteboard']} onChange={onChange} />
    case 'mathtools':
      return <MathToolsWidget state={state as WidgetStateMap['mathtools']} onChange={onChange} />
  }
}

export function WidgetHost(props: WidgetHostProps) {
  const { t } = useTranslation()
  return (
    <Suspense fallback={<p className="widget-loading">{t('widgets.loading')}</p>}>
      {renderWidget(props)}
    </Suspense>
  )
}
