import { useTranslation } from 'react-i18next'
import { axisTicks, clampRange, MATH_INSTRUMENTS, type MathInstrument } from '../../domain/mathtools'
import type { MathToolsPersist } from '../state'

interface MathToolsWidgetProps {
  state: MathToolsPersist
  onChange: (next: MathToolsPersist) => void
}

function CoordinatePlane({ range }: { range: number }) {
  const size = 320
  const pad = 22
  const scale = (size - 2 * pad) / 2 / range
  const center = size / 2
  const toX = (x: number) => center + x * scale
  const toY = (y: number) => center - y * scale
  const ticks = axisTicks(range)
  const end = range * scale

  return (
    <>
      {ticks.map((t) => (
        <g key={`g${t}`} stroke="var(--border)" strokeWidth={t === 0 ? 0 : 1}>
          <line x1={toX(t)} y1={toY(-range)} x2={toX(t)} y2={toY(range)} />
          <line x1={toX(-range)} y1={toY(t)} x2={toX(range)} y2={toY(t)} />
        </g>
      ))}
      <g stroke="var(--text)" strokeWidth={1.5}>
        <line x1={center - end} y1={center} x2={center + end} y2={center} />
        <line x1={center} y1={center + end} x2={center} y2={center - end} />
      </g>
      {ticks
        .filter((t) => t !== 0)
        .map((t) => (
          <text key={`lx${t}`} x={toX(t)} y={center + 12} fontSize={8} textAnchor="middle" fill="var(--text-muted)">
            {t}
          </text>
        ))}
      {ticks
        .filter((t) => t !== 0)
        .map((t) => (
          <text key={`ly${t}`} x={center - 6} y={toY(t) + 3} fontSize={8} textAnchor="end" fill="var(--text-muted)">
            {t}
          </text>
        ))}
    </>
  )
}

function Protractor() {
  const cx = 160
  const cy = 160
  const r = 140
  const point = (deg: number, radius: number) => {
    const rad = (deg * Math.PI) / 180
    return [cx + radius * Math.cos(rad), cy - radius * Math.sin(rad)]
  }
  const ticks: number[] = []
  for (let d = 0; d <= 180; d += 10) ticks.push(d)
  return (
    <>
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="var(--primary-soft)"
        stroke="var(--text)"
        strokeWidth={1.5}
      />
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="var(--text)" strokeWidth={1.5} />
      {ticks.map((d) => {
        const major = d % 30 === 0
        const [x1, y1] = point(d, r)
        const [x2, y2] = point(d, r - (major ? 16 : 8))
        const [lx, ly] = point(d, r - 28)
        return (
          <g key={d}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text)" strokeWidth={major ? 1.5 : 0.8} />
            {major && (
              <text x={lx} y={ly + 3} fontSize={9} textAnchor="middle" fill="var(--text-muted)">
                {d}
              </text>
            )}
          </g>
        )
      })}
    </>
  )
}

function Ruler() {
  const left = 20
  const y = 48
  const perCm = 15
  const cms: number[] = []
  for (let c = 0; c <= 20; c++) cms.push(c)
  return (
    <>
      <rect x={left} y={y - 28} width={20 * perCm} height={28} fill="var(--surface-subtle)" stroke="var(--text)" />
      {cms.map((c) => {
        const x = left + c * perCm
        return (
          <g key={c}>
            <line x1={x} y1={y} x2={x} y2={y - 14} stroke="var(--text)" strokeWidth={1} />
            <text x={x} y={y - 17} fontSize={8} textAnchor="middle" fill="var(--text-muted)">
              {c}
            </text>
          </g>
        )
      })}
      {cms.slice(0, -1).map((c) =>
        [0.5].map((half) => {
          const x = left + (c + half) * perCm
          return <line key={`${c}-${half}`} x1={x} y1={y} x2={x} y2={y - 8} stroke="var(--text-muted)" strokeWidth={0.6} />
        }),
      )}
    </>
  )
}

export function MathToolsWidget({ state, onChange }: MathToolsWidgetProps) {
  const { t } = useTranslation()
  const { instrument, range } = state

  const viewBox =
    instrument === 'coordinate' ? '0 0 320 320' : instrument === 'protractor' ? '0 0 320 180' : '0 0 340 70'

  return (
    <div className="mathtools">
      <div className="mathtools__toolbar" role="group" aria-label={t('mathtools.instrumentLabel')}>
        {MATH_INSTRUMENTS.map((item: MathInstrument) => (
          <button
            key={item}
            type="button"
            className={`mathtools__tool${instrument === item ? ' mathtools__tool--active' : ''}`}
            aria-pressed={instrument === item}
            onClick={() => onChange({ ...state, instrument: item })}
          >
            {t(`mathtools.instruments.${item}`)}
          </button>
        ))}
        {instrument === 'coordinate' && (
          <label className="mathtools__range">
            {t('mathtools.range')}
            <input
              type="number"
              min={2}
              max={12}
              value={range}
              onChange={(e) => onChange({ ...state, range: clampRange(Number(e.target.value) || range) })}
            />
          </label>
        )}
      </div>
      <svg
        className="mathtools__svg"
        viewBox={viewBox}
        role="img"
        aria-label={t(`mathtools.instruments.${instrument}`)}
      >
        {instrument === 'coordinate' && <CoordinatePlane range={range} />}
        {instrument === 'protractor' && <Protractor />}
        {instrument === 'ruler' && <Ruler />}
      </svg>
    </div>
  )
}
