import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Trash2, Check, X, Pencil, ArrowLeft, ImageUp, Languages, Loader2 } from 'lucide-react'
import type { StoredCard } from './types'
import { loadCards, saveCards } from './utils/cards'
import { translateToFrench } from './utils/translate'

type DraftCard = StoredCard & { id: number }
type EditState = { original: string; translation: string }

let nextId = 0

export default function CameraCapture() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [draft, setDraft] = useState<DraftCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editState, setEditState] = useState<EditState>({ original: '', translation: '' })
  const [translateProgress, setTranslateProgress] = useState<{ done: number; total: number } | null>(null)
  const [translateError, setTranslateError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setDraft([])
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      setPreview(dataUrl)

      const base64 = dataUrl.split(',')[1]
      const mediaType = file.type || 'image/jpeg'

      setLoading(true)
      try {
        const { extractCardsFromImage } = await import('./utils/extractCards')
        const cards = await extractCardsFromImage(base64, mediaType)
        setDraft(cards.map((c) => ({ ...c, id: nextId++ })))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to extract cards. Check your API key and image.')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeItem = (id: number) => setDraft((d) => d.filter((c) => c.id !== id))

  const startEdit = (card: DraftCard) => {
    setEditingId(card.id)
    setEditState({ original: card.original, translation: card.translation })
  }

  const confirmEdit = (id: number) => {
    if (!editState.original.trim() || !editState.translation.trim()) return
    setDraft((d) => d.map((c) => c.id === id ? { ...c, ...editState } : c))
    setEditingId(null)
  }

  const cancelEdit = () => setEditingId(null)

  const translateDraft = async () => {
    if (translateProgress) return
    setTranslateError(null)
    setTranslateProgress({ done: 0, total: draft.length })
    const updated = [...draft]
    for (let i = 0; i < draft.length; i++) {
      try {
        updated[i] = { ...updated[i], original: await translateToFrench(draft[i].original) }
        setDraft([...updated])
      } catch (err) {
        setTranslateError(err instanceof Error ? err.message : 'Translation failed.')
        setTranslateProgress(null)
        return
      }
      setTranslateProgress({ done: i + 1, total: draft.length })
    }
    setTranslateProgress(null)
  }

  const addAll = () => {
    const existing = loadCards()
    saveCards([...existing, ...draft.map(({ original, translation, showIn }) => ({ original, translation, showIn }))])
    navigate('/add-cards-default')
  }

  return (
    <div className="min-h-svh bg-gray-950 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-lg">
        <button
          onClick={() => navigate('/add-cards-default')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Use camera</h1>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />

        {!preview ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex items-center justify-center gap-3 w-full py-12 rounded-2xl border-2 border-dashed border-gray-700 hover:border-violet-500 hover:bg-violet-500/5 transition"
            >
              <Camera size={28} className="text-gray-400" />
              <span className="text-gray-400">Take a photo</span>
            </button>
            <button
              onClick={() => { if (inputRef.current) { inputRef.current.removeAttribute('capture'); inputRef.current.click(); inputRef.current.setAttribute('capture', 'environment') } }}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border border-gray-800 hover:border-gray-600 transition text-sm text-gray-400 hover:text-white"
            >
              <ImageUp size={18} />
              Upload from library
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="relative">
              <img src={preview} alt="Captured" className="w-full rounded-2xl object-contain max-h-64" />
              <button
                onClick={() => { setPreview(null); setDraft([]); setError(null) }}
                className="absolute top-2 right-2 bg-gray-900/80 rounded-full p-1 text-gray-400 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {loading && (
              <div className="flex flex-col items-center gap-3 py-8 text-gray-400">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Extracting vocabulary…</span>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 rounded-xl px-4 py-3">{error}</p>
            )}

            {draft.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs uppercase tracking-widest text-gray-400">{draft.length} cards found</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={translateDraft}
                      disabled={!!translateProgress}
                      className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 disabled:text-gray-500 disabled:cursor-not-allowed transition"
                    >
                      {translateProgress
                        ? <><Loader2 size={13} className="animate-spin" /> {translateProgress.done} / {translateProgress.total}</>
                        : <><Languages size={13} /> Translate to French</>
                      }
                    </button>
                    <button
                      onClick={addAll}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 transition text-sm font-medium"
                    >
                      <Check size={16} /> Add all
                    </button>
                  </div>
                </div>
                {translateError && (
                  <p className="text-xs text-red-400 bg-red-400/10 rounded-xl px-3 py-2">{translateError}</p>
                )}

                <div className="flex flex-col gap-2">
                  {draft.map((card) =>
                    editingId === card.id ? (
                      <div key={card.id} className="flex flex-col gap-2 rounded-xl bg-gray-800 px-4 py-3">
                        <input
                          autoFocus
                          value={editState.original}
                          onChange={(e) => setEditState((s) => ({ ...s, original: e.target.value }))}
                          className="rounded-lg bg-gray-700 px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <input
                          value={editState.translation}
                          onChange={(e) => setEditState((s) => ({ ...s, translation: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') confirmEdit(card.id); if (e.key === 'Escape') cancelEdit() }}
                          className="rounded-lg bg-gray-700 px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <div className="flex gap-2 self-end">
                          <button onClick={cancelEdit} className="text-gray-400 hover:text-white transition">
                            <X size={18} />
                          </button>
                          <button onClick={() => confirmEdit(card.id)} className="text-violet-400 hover:text-violet-300 transition">
                            <Check size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={card.id} className="flex items-center justify-between rounded-xl bg-gray-800 px-4 py-3">
                        <div className="flex gap-4 text-sm min-w-0">
                          <span className="font-medium truncate">{card.original}</span>
                          <span className="text-gray-400 shrink-0">→</span>
                          <span className="text-gray-300 truncate">{card.translation}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <button onClick={() => startEdit(card)} className="text-gray-500 hover:text-gray-300 transition">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => removeItem(card.id)} className="text-gray-500 hover:text-red-400 transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
