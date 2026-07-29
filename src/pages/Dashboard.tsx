import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { DashboardGrid, type Layout } from '../grid/DashboardGrid'
import { bottomY, moveItem } from '../grid/layout'
import { WidgetFrame } from '../widgets/WidgetFrame'
import { WidgetHost } from '../widgets/WidgetHost'
import { GRID_COLS, WIDGET_REGISTRY } from '../widgets/registry'
import { WIDGET_STATE } from '../widgets/state'
import { WIDGET_KINDS, type MoveDirection, type WidgetInstance, type WidgetKind } from '../widgets/types'
import { SCHEMA_VERSION, type DashboardDocument } from '../persistence/schema'
import { buildExportFilename, deserializeDocument, serializeDocument } from '../persistence/exportImport'
import { clearDocument, loadDocument, saveDocument } from '../persistence/db'

export function Dashboard() {
  const { t } = useTranslation()
  const counter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [widgets, setWidgets] = useState<WidgetInstance[]>([])
  const [layout, setLayout] = useState<Layout[]>([])
  const [states, setStates] = useState<Record<string, unknown>>({})
  const [hydrated, setHydrated] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'UnterrichtsDashboard'
  }, [])

  function buildDocument(): DashboardDocument {
    return {
      schemaVersion: SCHEMA_VERSION,
      widgets: widgets.map((w) => ({ id: w.id, kind: w.kind, state: states[w.id] })),
      layout: layout.map(({ i, x, y, w, h, minW, minH }) => ({ i, x, y, w, h, minW, minH })),
    }
  }

  function applyDocument(doc: DashboardDocument) {
    setWidgets(doc.widgets.map((w) => ({ id: w.id, kind: w.kind })))
    setStates(Object.fromEntries(doc.widgets.map((w) => [w.id, w.state])))
    setLayout(doc.layout.map((item) => ({ ...item })))
    const maxIndex = doc.widgets.reduce((max, w) => {
      const match = /^w-(\d+)$/.exec(w.id)
      return match ? Math.max(max, Number(match[1])) : max
    }, -1)
    counter.current = Math.max(counter.current, maxIndex + 1)
  }

  // Hydrate from IndexedDB once on mount.
  useEffect(() => {
    let cancelled = false
    loadDocument()
      .then((doc) => {
        if (cancelled) return
        if (doc) applyDocument(doc)
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setHydrated(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Autosave (debounced) after hydration so we never overwrite stored data with
  // the initial empty state before it loads.
  useEffect(() => {
    if (!hydrated) return
    const handle = setTimeout(() => {
      void saveDocument(buildDocument())
    }, 400)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgets, layout, states, hydrated])

  function addWidget(kind: WidgetKind) {
    const id = `w-${counter.current++}`
    const { w, h, minW, minH } = WIDGET_REGISTRY[kind].size
    setWidgets((current) => [...current, { id, kind }])
    setStates((current) => ({ ...current, [id]: structuredClone(WIDGET_STATE[kind].default) }))
    setLayout((current) => [...current, { i: id, x: 0, y: bottomY(current), w, h, minW, minH }])
  }

  function removeWidget(id: string) {
    setWidgets((current) => current.filter((widget) => widget.id !== id))
    setLayout((current) => current.filter((item) => item.i !== id))
    setStates((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  function move(id: string, direction: MoveDirection) {
    setLayout((current) => moveItem(current, id, direction, GRID_COLS))
  }

  function exportProject() {
    const blob = new Blob([serializeDocument(buildDocument())], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = buildExportFilename(new Date())
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function onImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-importing the same file
    if (!file) return
    void file.text().then((text) => {
      const result = deserializeDocument(text)
      if (!result.ok) {
        setImportError(t('project.importError', { reason: result.error }))
        return
      }
      if (widgets.length > 0 && !window.confirm(t('project.confirmReplace'))) {
        return
      }
      applyDocument(result.doc)
      setImportError(null)
    })
  }

  function resetProject() {
    if (widgets.length > 0 && !window.confirm(t('project.confirmReset'))) {
      return
    }
    setWidgets([])
    setLayout([])
    setStates({})
    setImportError(null)
    void clearDocument()
  }

  return (
    <section className="dashboard" aria-label={t('dashboard.regionLabel')}>
      <div className="dashboard__head">
        <h1 className="dashboard__title">{t('dashboard.title')}</h1>
        <div className="dashboard__project" role="group" aria-label={t('project.groupLabel')}>
          <button type="button" onClick={exportProject}>
            {t('project.export')}
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            {t('project.import')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            onChange={onImportFile}
          />
          <button type="button" className="dashboard__reset" onClick={resetProject}>
            {t('project.reset')}
          </button>
        </div>
      </div>

      {importError && (
        <p className="dashboard__error" role="alert">
          {importError}
        </p>
      )}

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

      {widgets.length === 0 ? (
        <div className="dashboard__empty">
          <p>{t('dashboard.emptyTitle')}</p>
          <p className="dashboard__empty-hint">{t('dashboard.emptyHint')}</p>
        </div>
      ) : (
        <DashboardGrid layout={layout} onLayoutChange={setLayout}>
          {widgets.map((widget) => (
            <div key={widget.id}>
              <WidgetFrame
                title={t(WIDGET_REGISTRY[widget.kind].labelKey)}
                onRemove={() => removeWidget(widget.id)}
                onMove={(direction) => move(widget.id, direction)}
              >
                <WidgetHost
                  kind={widget.kind}
                  state={states[widget.id]}
                  onChange={(next) => setStates((current) => ({ ...current, [widget.id]: next }))}
                />
              </WidgetFrame>
            </div>
          ))}
        </DashboardGrid>
      )}
    </section>
  )
}
