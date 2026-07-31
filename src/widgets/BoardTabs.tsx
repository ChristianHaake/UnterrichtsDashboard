import { useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface BoardTabsProps {
  boards: { id: string; name: string }[]
  activeId: string
  onSwitch: (id: string) => void
  onAdd: () => void
  onRename: (id: string, name: string) => void
  onRemove: (id: string) => void
}

export function BoardTabs({ boards, activeId, onSwitch, onAdd, onRename, onRemove }: BoardTabsProps) {
  const { t } = useTranslation()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  function startEdit(id: string, name: string) {
    setEditingId(id)
    setDraft(name)
  }

  function commit() {
    if (editingId) {
      const name = draft.trim()
      if (name) onRename(editingId, name)
    }
    setEditingId(null)
  }

  function onEditKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') commit()
    else if (event.key === 'Escape') setEditingId(null)
  }

  return (
    <div className="board-tabs" role="group" aria-label={t('board.tabsLabel')}>
      {boards.map((board) => {
        const active = board.id === activeId
        if (editingId === board.id) {
          return (
            <input
              key={board.id}
              className="board-tabs__edit"
              value={draft}
              aria-label={t('board.rename')}
              autoFocus
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onEditKeyDown}
              onBlur={commit}
            />
          )
        }
        return (
          <span key={board.id} className={`board-tab${active ? ' board-tab--active' : ''}`}>
            <button
              type="button"
              className="board-tab__name"
              aria-current={active ? 'true' : undefined}
              onClick={() => onSwitch(board.id)}
              onDoubleClick={() => startEdit(board.id, board.name)}
            >
              {board.name}
            </button>
            {boards.length > 1 && (
              <button
                type="button"
                className="board-tab__remove"
                aria-label={t('board.remove', { name: board.name })}
                onClick={() => onRemove(board.id)}
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
          </span>
        )
      })}
      <button type="button" className="board-tabs__add" aria-label={t('board.add')} onClick={onAdd}>
        <span aria-hidden="true">＋</span>
      </button>
    </div>
  )
}
