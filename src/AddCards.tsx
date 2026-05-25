import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Pencil, Trash2, Check, X, Search, Camera, Languages, Loader2 } from 'lucide-react'
import type { StoredCard } from './types'
import { loadCards, saveCards } from './utils/cards'
import { translateToFrench } from './utils/translate'

const ITEM_HEIGHT = 56

type EditState = { original: string; translation: string }
type IndexedCard = StoredCard & { realIndex: number }

type CardListProps = {
  total: number
  filtered: IndexedCard[]
  query: string
  setQuery: (q: string) => void
  editingIndex: number | null
  editState: EditState
  onEditStateChange: (patch: Partial<EditState>) => void
  onStartEdit: (realIndex: number) => void
  onConfirmEdit: (realIndex: number) => void
  onCancelEdit: () => void
  onRemove: (realIndex: number) => void
  onTranslateAll: () => void
  translateProgress: { done: number; total: number } | null
  translateError: string | null
}

type EditModalProps = {
  editState: EditState
  onEditStateChange: (patch: Partial<EditState>) => void
  onConfirm: () => void
  onCancel: () => void
}

function EditModal({ editState, onEditStateChange, onConfirm, onCancel }: EditModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-gray-800 p-6 flex flex-col gap-4">
        <h2 className="text-sm uppercase tracking-widest text-gray-400">Edit card</h2>
        <div className="flex flex-col gap-3">
          <input
            autoFocus
            value={editState.original}
            onChange={(e) => onEditStateChange({ original: e.target.value })}
            placeholder="Original"
            className="rounded-xl bg-gray-700 px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          />
          <input
            value={editState.translation}
            onChange={(e) => onEditStateChange({ translation: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') onConfirm(); if (e.key === 'Escape') onCancel() }}
            placeholder="Translation (Dutch)"
            className="rounded-xl bg-gray-700 px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          />
        </div>
        <div className="flex gap-3 self-end">
          <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm transition">
            <X size={16} /> Cancel
          </button>
          <button onClick={onConfirm} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm transition">
            <Check size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  )
}

function CardList({ total, filtered, query, setQuery, editingIndex, editState, onEditStateChange, onStartEdit, onConfirmEdit, onCancelEdit, onRemove, onTranslateAll, translateProgress, translateError }: CardListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 8,
  })

  if (total === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {editingIndex !== null && (
        <EditModal
          editState={editState}
          onEditStateChange={onEditStateChange}
          onConfirm={() => onConfirmEdit(editingIndex)}
          onCancel={onCancelEdit}
        />
      )}

      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xs uppercase tracking-widest text-gray-400">
          Saved cards ({filtered.length}{query ? ` of ${total}` : ''})
        </h2>
        <button
          onClick={onTranslateAll}
          disabled={!!translateProgress}
          className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 disabled:text-gray-500 disabled:cursor-not-allowed transition"
        >
          {translateProgress
            ? <><Loader2 size={13} className="animate-spin" /> {translateProgress.done} / {translateProgress.total}</>
            : <><Languages size={13} /> Translate to French</>
          }
        </button>
      </div>

      {translateError && (
        <p className="text-xs text-red-400 bg-red-400/10 rounded-xl px-3 py-2">{translateError}</p>
      )}

      <div className="relative mb-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cards…"
          className="w-full rounded-xl bg-gray-800 pl-9 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-violet-500 text-sm"
        />
      </div>

      <div ref={scrollRef} className="overflow-auto max-h-[420px]">
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((row) => {
            const card = filtered[row.index]
            return (
              <div
                key={row.key}
                style={{ position: 'absolute', top: row.start, left: 0, right: 0 }}
              >
                <div className="flex items-center justify-between rounded-xl bg-gray-800 px-4 h-12 mb-2">
                  <div className="flex gap-4 text-sm min-w-0">
                    <span className="font-medium truncate">{card.original}</span>
                    <span className="text-gray-400 shrink-0">→</span>
                    <span className="text-gray-300 truncate">{card.translation}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <button onClick={() => onStartEdit(card.realIndex)} className="text-gray-500 hover:text-gray-300 transition">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => onRemove(card.realIndex)} className="text-gray-500 hover:text-red-400 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function AddCards() {
  const navigate = useNavigate()
  const [cards, setCards] = useState<StoredCard[]>(loadCards)
  const [original, setOriginal] = useState('')
  const [translation, setTranslation] = useState('')
  const [query, setQuery] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editState, setEditState] = useState<EditState>({ original: '', translation: '' })
  const [translateProgress, setTranslateProgress] = useState<{ done: number; total: number } | null>(null)
  const [translateError, setTranslateError] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return cards.map((c, i) => ({ ...c, realIndex: i }))
    return cards
      .map((c, i) => ({ ...c, realIndex: i }))
      .filter((c) => c.original.toLowerCase().includes(q) || c.translation.toLowerCase().includes(q))
  }, [cards, query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!original.trim() || !translation.trim()) return
    const today = new Date().toISOString().slice(0, 10)
    const updated = [...cards, { original: original.trim(), translation: translation.trim(), showIn: today }]
    saveCards(updated)
    setCards(updated)
    setOriginal('')
    setTranslation('')
  }

  const startEdit = (realIndex: number) => {
    setEditingIndex(realIndex)
    setEditState({ original: cards[realIndex].original, translation: cards[realIndex].translation })
  }

  const confirmEdit = (realIndex: number) => {
    if (!editState.original.trim() || !editState.translation.trim()) return
    const updated = cards.map((c, idx) =>
      idx === realIndex ? { ...c, original: editState.original.trim(), translation: editState.translation.trim() } : c
    )
    saveCards(updated)
    setCards(updated)
    setEditingIndex(null)
  }

  const cancelEdit = () => setEditingIndex(null)

  const removeCard = (realIndex: number) => {
    const updated = cards.filter((_, idx) => idx !== realIndex)
    saveCards(updated)
    setCards(updated)
    if (editingIndex === realIndex) setEditingIndex(null)
  }

  const translateAll = async () => {
    if (translateProgress) return
    setTranslateError(null)
    const current = loadCards()
    setTranslateProgress({ done: 0, total: current.length })
    const updated = [...current]
    for (let i = 0; i < current.length; i++) {
      try {
        updated[i] = { ...updated[i], original: await translateToFrench(current[i].original) }
        saveCards(updated)
        setCards([...updated])
      } catch (err) {
        setTranslateError(err instanceof Error ? err.message : 'Translation failed.')
        setTranslateProgress(null)
        return
      }
      setTranslateProgress({ done: i + 1, total: current.length })
    }
    setTranslateProgress(null)
  }

  return (
    <div className="min-h-svh bg-gray-950 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Add cards</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-gray-400">Original</label>
            <input
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="e.g. Bonjour"
              className="rounded-xl bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-gray-400">Translation</label>
            <input
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="e.g. Hallo"
              className="rounded-xl bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="mt-2 flex justify-around gap-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 transition font-medium"
            >
              Add card
            </button>
            <button
              type="button"
              onClick={() => navigate('/add-cards-default/camera')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-95 transition font-medium"
            >
              <Camera size={18} />
              Use camera
            </button>
          </div>
        </form>

        <CardList
          total={cards.length}
          filtered={filtered}
          query={query}
          setQuery={setQuery}
          editingIndex={editingIndex}
          editState={editState}
          onEditStateChange={(patch) => setEditState((s) => ({ ...s, ...patch }))}
          onStartEdit={startEdit}
          onConfirmEdit={confirmEdit}
          onCancelEdit={cancelEdit}
          onRemove={removeCard}
          onTranslateAll={translateAll}
          translateProgress={translateProgress}
          translateError={translateError}
        />
      </div>
    </div>
  )
}
