import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { appsByCategory, MANIFESTS } from './manifest'
import type { WidgetKind } from './types'

interface AppPaletteProps {
  onAdd: (kind: WidgetKind) => void
}

export function AppPalette({ onAdd }: AppPaletteProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const toggleRef = useRef<HTMLButtonElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  // Close when a pointer press lands outside the palette.
  useEffect(() => {
    if (!open) return
    function onDocPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('pointerdown', onDocPointerDown)
    return () => document.removeEventListener('pointerdown', onDocPointerDown)
  }, [open])

  const q = query.trim().toLowerCase()
  const groups = appsByCategory()
    .map((group) => ({
      ...group,
      kinds: group.kinds.filter((kind) => t(MANIFESTS[kind].labelKey).toLowerCase().includes(q)),
    }))
    .filter((group) => group.kinds.length > 0)

  function close() {
    setOpen(false)
    setQuery('')
    toggleRef.current?.focus()
  }

  function add(kind: WidgetKind) {
    onAdd(kind)
    close()
  }

  function onPanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') close()
  }

  return (
    <div className="palette" ref={rootRef}>
      <button
        ref={toggleRef}
        type="button"
        className="palette__toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">＋ </span>
        {t('palette.add')}
      </button>

      {open && (
        <div className="palette__panel" onKeyDown={onPanelKeyDown}>
          <input
            className="palette__search"
            type="search"
            value={query}
            placeholder={t('palette.search')}
            aria-label={t('palette.search')}
            autoFocus
            onChange={(event) => setQuery(event.target.value)}
          />
          {groups.length === 0 ? (
            <p className="palette__empty">{t('palette.noResults')}</p>
          ) : (
            groups.map((group) => (
              <div key={group.category} className="palette__group">
                <h3 className="palette__cat">{t(`palette.categories.${group.category}`)}</h3>
                <div className="palette__apps">
                  {group.kinds.map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      className="palette__app"
                      aria-label={t('widgets.add', { name: t(MANIFESTS[kind].labelKey) })}
                      onClick={() => add(kind)}
                    >
                      <span className="palette__app-icon" aria-hidden="true">
                        {MANIFESTS[kind].icon}
                      </span>
                      {t(MANIFESTS[kind].labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
