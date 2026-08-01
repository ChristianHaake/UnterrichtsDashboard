import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { CanvasSurface, type ViewState } from '../canvas/CanvasSurface'
import { clampZoom, dragItem, findSlot, moveItem } from '../canvas/layout'
import { WidgetFrame } from '../widgets/WidgetFrame'
import { WidgetHost } from '../widgets/WidgetHost'
import { AppPalette } from '../widgets/AppPalette'
import { BoardTabs } from '../widgets/BoardTabs'
import { MANIFESTS } from '../widgets/manifest'
import { WIDGET_STATE } from '../widgets/state'
import type { MoveDirection, WidgetInstance, WidgetKind } from '../widgets/types'
import { SCHEMA_VERSION, type LayoutItem, type WorkspaceDocument } from '../persistence/schema'
import { buildExportFilename, deserializeDocument, serializeDocument } from '../persistence/exportImport'
import { clearDocument, loadDocument, saveDocument } from '../persistence/db'

const DEFAULT_VIEW: ViewState = { x: 0, y: 0, zoom: 1 }

interface BoardUI {
  id: string
  name: string
  widgets: WidgetInstance[]
  layout: LayoutItem[]
  states: Record<string, unknown>
  view: ViewState
}

export function Dashboard() {
  const { t } = useTranslation()
  const widgetCounter = useRef(0)
  const boardCounter = useRef(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [present, setPresent] = useState(false)

  const [boards, setBoards] = useState<BoardUI[]>(() => [
    { id: 'b-0', name: t('board.name', { number: 1 }), widgets: [], layout: [], states: {}, view: DEFAULT_VIEW },
  ])
  const [activeId, setActiveId] = useState('b-0')
  const [hydrated, setHydrated] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const active = boards.find((b) => b.id === activeId) ?? boards[0]

  useEffect(() => {
    document.title = 'UnterrichtsDashboard'
  }, [])

  function updateActive(fn: (board: BoardUI) => BoardUI) {
    setBoards((current) => current.map((b) => (b.id === activeId ? fn(b) : b)))
  }

  function buildWorkspace(): WorkspaceDocument {
    return {
      schemaVersion: SCHEMA_VERSION,
      boards: boards.map((b) => ({
        id: b.id,
        name: b.name,
        widgets: b.widgets.map((w) => ({ id: w.id, kind: w.kind, state: b.states[w.id] })),
        layout: b.layout.map(({ i, x, y, w, h }) => ({ i, x, y, w, h })),
        view: b.view,
      })),
      activeBoardId: activeId,
    }
  }

  function applyWorkspace(doc: WorkspaceDocument) {
    setBoards(
      doc.boards.map((board) => ({
        id: board.id,
        name: board.name,
        widgets: board.widgets.map((w) => ({ id: w.id, kind: w.kind })),
        layout: board.layout.map((item) => ({ ...item })),
        states: Object.fromEntries(board.widgets.map((w) => [w.id, w.state])),
        view: board.view ? { x: board.view.x, y: board.view.y, zoom: clampZoom(board.view.zoom) } : DEFAULT_VIEW,
      })),
    )
    setActiveId(doc.activeBoardId)
    const widgetMax = doc.boards
      .flatMap((b) => b.widgets)
      .reduce((max, w) => {
        const match = /^w-(\d+)$/.exec(w.id)
        return match ? Math.max(max, Number(match[1])) : max
      }, -1)
    widgetCounter.current = Math.max(widgetCounter.current, widgetMax + 1)
    const boardMax = doc.boards.reduce((max, b) => {
      const match = /^b-(\d+)$/.exec(b.id)
      return match ? Math.max(max, Number(match[1])) : max
    }, -1)
    boardCounter.current = Math.max(boardCounter.current, boardMax + 1)
  }

  useEffect(() => {
    let cancelled = false
    loadDocument()
      .then((doc) => {
        if (!cancelled && doc) applyWorkspace(doc)
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setHydrated(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const handle = setTimeout(() => {
      void saveDocument(buildWorkspace())
    }, 400)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards, activeId, hydrated])

  // Present mode: hide all chrome for a calm beamer view.
  useEffect(() => {
    document.body.classList.toggle('is-present', present)
    return () => document.body.classList.remove('is-present')
  }, [present])

  useEffect(() => {
    if (!present) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setPresent(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [present])

  function togglePresent() {
    const next = !present
    setPresent(next)
    // Fullscreen is a best-effort enhancement; ignore rejections (e.g. headless).
    try {
      if (next && !document.fullscreenElement) {
        document.documentElement.requestFullscreen?.()?.catch(() => undefined)
      } else if (!next && document.fullscreenElement) {
        document.exitFullscreen?.()?.catch(() => undefined)
      }
    } catch {
      // requestFullscreen is unavailable.
    }
  }

  // Widget operations act on the active board.
  function addWidget(kind: WidgetKind) {
    const id = `w-${widgetCounter.current++}`
    const { w, h } = MANIFESTS[kind].size
    // Drop the app into the centre of what the teacher is currently looking at,
    // finding a free slot so apps never land stacked on top of each other.
    const rect = viewportRef.current?.getBoundingClientRect()
    const zoom = active.view.zoom
    const originX = rect ? (rect.width / 2 - active.view.x) / zoom - w / 2 : 60
    const originY = rect ? (rect.height / 2 - active.view.y) / zoom - h / 2 : 60
    updateActive((b) => {
      const { x, y } = findSlot(b.layout, w, h, originX, originY)
      return {
        ...b,
        widgets: [...b.widgets, { id, kind }],
        states: { ...b.states, [id]: structuredClone(WIDGET_STATE[kind].default) },
        layout: [...b.layout, { i: id, x, y, w, h }],
      }
    })
  }

  function removeWidget(id: string) {
    updateActive((b) => {
      const states = { ...b.states }
      delete states[id]
      return {
        ...b,
        widgets: b.widgets.filter((w) => w.id !== id),
        layout: b.layout.filter((item) => item.i !== id),
        states,
      }
    })
  }

  function move(id: string, direction: MoveDirection) {
    updateActive((b) => ({ ...b, layout: moveItem(b.layout, id, direction) }))
  }

  function drag(id: string, clientDx: number, clientDy: number) {
    updateActive((b) => ({ ...b, layout: dragItem(b.layout, id, clientDx / b.view.zoom, clientDy / b.view.zoom) }))
  }

  function setWidgetState(id: string, next: unknown) {
    updateActive((b) => ({ ...b, states: { ...b.states, [id]: next } }))
  }

  function setView(view: ViewState) {
    updateActive((b) => ({ ...b, view }))
  }

  // Board operations.
  function addBoard() {
    const id = `b-${boardCounter.current++}`
    const board: BoardUI = {
      id,
      name: t('board.name', { number: boards.length + 1 }),
      widgets: [],
      layout: [],
      states: {},
      view: DEFAULT_VIEW,
    }
    setBoards((current) => [...current, board])
    setActiveId(id)
  }

  function renameBoard(id: string, name: string) {
    setBoards((current) => current.map((b) => (b.id === id ? { ...b, name } : b)))
  }

  function removeBoard(id: string) {
    if (boards.length <= 1) return
    const board = boards.find((b) => b.id === id)
    if (board && board.widgets.length > 0 && !window.confirm(t('board.confirmRemove', { name: board.name }))) {
      return
    }
    const remaining = boards.filter((b) => b.id !== id)
    setBoards(remaining)
    if (activeId === id) setActiveId(remaining[0].id)
  }

  function exportProject() {
    const blob = new Blob([serializeDocument(buildWorkspace())], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = buildExportFilename(new Date())
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function hasAnyWidgets() {
    return boards.some((b) => b.widgets.length > 0)
  }

  function onImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    void file.text().then((text) => {
      const result = deserializeDocument(text)
      if (!result.ok) {
        setImportError(t('project.importError', { reason: result.error }))
        return
      }
      if (hasAnyWidgets() && !window.confirm(t('project.confirmReplace'))) return
      applyWorkspace(result.doc)
      setImportError(null)
    })
  }

  function resetProject() {
    if (hasAnyWidgets() && !window.confirm(t('project.confirmReset'))) return
    const id = `b-${boardCounter.current++}`
    setBoards([{ id, name: t('board.name', { number: 1 }), widgets: [], layout: [], states: {}, view: DEFAULT_VIEW }])
    setActiveId(id)
    setImportError(null)
    void clearDocument()
  }

  return (
    <section className="dashboard" aria-label={t('dashboard.regionLabel')}>
      <h1 className="visually-hidden">{t('dashboard.title')}</h1>

      <div className="dashboard__toolbar">
        <div className="dashboard__toolbar-left">
          <AppPalette onAdd={addWidget} />
          <BoardTabs
            boards={boards.map((b) => ({ id: b.id, name: b.name }))}
            activeId={activeId}
            onSwitch={setActiveId}
            onAdd={addBoard}
            onRename={renameBoard}
            onRemove={removeBoard}
          />
        </div>
        <div className="dashboard__actions" role="group" aria-label={t('project.groupLabel')}>
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
            aria-label={t('project.import')}
            onChange={onImportFile}
          />
          <button type="button" className="dashboard__present" onClick={togglePresent}>
            {t('present.enter')}
          </button>
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

      <CanvasSurface view={active.view} onViewChange={setView} viewportRef={viewportRef}>
        {active.widgets.map((widget) => {
          const item = active.layout.find((l) => l.i === widget.id)
          if (!item) return null
          return (
            <div
              key={widget.id}
              className="canvas-item"
              style={{ left: item.x, top: item.y, width: item.w, height: item.h }}
            >
              <WidgetFrame
                title={t(MANIFESTS[widget.kind].labelKey)}
                onRemove={() => removeWidget(widget.id)}
                onMove={(direction) => move(widget.id, direction)}
                onDrag={(dx, dy) => drag(widget.id, dx, dy)}
              >
                <WidgetHost
                  kind={widget.kind}
                  state={active.states[widget.id]}
                  onChange={(next) => setWidgetState(widget.id, next)}
                />
              </WidgetFrame>
            </div>
          )
        })}
      </CanvasSurface>

      {active.widgets.length === 0 && (
        <div className="dashboard__empty" role="note">
          <p>{t('dashboard.emptyTitle')}</p>
          <p className="dashboard__empty-hint">{t('dashboard.emptyHint')}</p>
        </div>
      )}

      {present && (
        <button type="button" className="present-exit" onClick={togglePresent}>
          {t('present.exit')}
        </button>
      )}
    </section>
  )
}
