import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DashboardGrid, type Layout } from '../grid/DashboardGrid'
import { bottomY, moveItem } from '../grid/layout'
import { WidgetFrame } from '../widgets/WidgetFrame'
import { GRID_COLS, WIDGET_REGISTRY } from '../widgets/registry'
import { WIDGET_KINDS, type MoveDirection, type WidgetInstance, type WidgetKind } from '../widgets/types'

export function Dashboard() {
  const { t } = useTranslation()
  const counter = useRef(0)
  const [widgets, setWidgets] = useState<WidgetInstance[]>([])
  const [layout, setLayout] = useState<Layout[]>([])

  useEffect(() => {
    document.title = 'UnterrichtsDashboard'
  }, [])

  function addWidget(kind: WidgetKind) {
    const id = `w-${counter.current++}`
    const { w, h, minW, minH } = WIDGET_REGISTRY[kind].size
    setWidgets((current) => [...current, { id, kind }])
    setLayout((current) => [...current, { i: id, x: 0, y: bottomY(current), w, h, minW, minH }])
  }

  function removeWidget(id: string) {
    setWidgets((current) => current.filter((widget) => widget.id !== id))
    setLayout((current) => current.filter((item) => item.i !== id))
  }

  function move(id: string, direction: MoveDirection) {
    setLayout((current) => moveItem(current, id, direction, GRID_COLS))
  }

  return (
    <section className="dashboard" aria-label={t('dashboard.regionLabel')}>
      <div className="dashboard__head">
        <h1 className="dashboard__title">{t('dashboard.title')}</h1>
        <div className="dashboard__toolbar" role="group" aria-label={t('widgets.toolbarLabel')}>
          {WIDGET_KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              className="dashboard__add"
              aria-label={t('widgets.add', { name: t(WIDGET_REGISTRY[kind].labelKey) })}
              onClick={() => addWidget(kind)}
            >
              <span aria-hidden="true">＋ </span>
              {t(WIDGET_REGISTRY[kind].labelKey)}
            </button>
          ))}
        </div>
      </div>

      {widgets.length === 0 ? (
        <div className="dashboard__empty">
          <p>{t('dashboard.emptyTitle')}</p>
          <p className="dashboard__empty-hint">{t('dashboard.emptyHint')}</p>
        </div>
      ) : (
        <DashboardGrid layout={layout} onLayoutChange={setLayout}>
          {widgets.map((widget) => {
            const { Component, labelKey } = WIDGET_REGISTRY[widget.kind]
            return (
              <div key={widget.id}>
                <WidgetFrame
                  title={t(labelKey)}
                  onRemove={() => removeWidget(widget.id)}
                  onMove={(direction) => move(widget.id, direction)}
                >
                  <Component />
                </WidgetFrame>
              </div>
            )
          })}
        </DashboardGrid>
      )}
    </section>
  )
}
