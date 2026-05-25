import { useState, useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Card from './shared/Card'
import { loadCards, saveCards } from './utils/cards'

const SLIDE_DURATION = 300
const FLIP_DURATION = 500

type Anim = { from: number }

function pickCards(mode: string | undefined) {
  const all = loadCards()
  if (mode === 'daily') {
    const today = new Date().toISOString().slice(0, 10)
    const daily = all.filter((c) => c.showIn <= today)
    return [...daily].sort(() => Math.random() - 0.5)
  }
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 40)
}

export default function Cards() {
  const { mode } = useParams<{ mode: string }>()
  const cards = useMemo(() => pickCards(mode), [mode])

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [anim, setAnim] = useState<Anim | null>(null)
  const [done, setDone] = useState(false)
  const busyRef = useRef(false)

  const goNext = (daysOffset: number) => {
    if (busyRef.current || cards.length === 0) return
    busyRef.current = true

    const nextShowIn = new Date()
    nextShowIn.setDate(nextShowIn.getDate() + daysOffset)
    const nextDate = nextShowIn.toISOString().slice(0, 10)

    const all = loadCards()
    const updated = all.map((c) =>
      c.original === cards[index].original && c.translation === cards[index].translation
        ? { ...c, showIn: nextDate }
        : c
    )
    saveCards(updated)

    const isLast = index === cards.length - 1

    const doSlide = (fromIndex: number) => {
      if (isLast) {
        setAnim(null)
        setDone(true)
        busyRef.current = false
        return
      }
      setAnim({ from: fromIndex })
      setIndex(fromIndex + 1)

      setTimeout(() => {
        setAnim(null)
        busyRef.current = false
      }, SLIDE_DURATION)
    }

    if (flipped) {
      setFlipped(false)
      const capturedIndex = index
      setTimeout(() => doSlide(capturedIndex), FLIP_DURATION - 75)
    } else {
      doSlide(index)
    }
  }

  const enterClass = 'animate-slide-in-right'
  const exitClass = 'animate-slide-out-left'

  const title = mode === 'daily' ? 'Daily Words' : 'Random Words'

  if (cards.length === 0) {
    return (
      <div className="min-h-svh bg-gray-950 text-white flex flex-col items-center justify-center p-6 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-gray-400">
          {mode === 'daily' ? 'No cards scheduled for today.' : 'No cards found. Add some cards first.'}
        </p>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-svh bg-gray-950 text-white flex flex-col items-center justify-center p-6 gap-4 text-center">
        <div className="text-6xl mb-2">🎉</div>
        <h1 className="text-3xl font-bold tracking-tight">All done!</h1>
        <p className="text-gray-400">You went through all {cards.length} cards. Great work!</p>
      </div>
    )
  }

  const current = cards[index]

  return (
    <div className="min-h-svh bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
      <p className="text-gray-400 text-sm mb-10">
        {index + 1} / {cards.length}
      </p>

      <div className="relative w-full max-w-sm h-48 mb-8 overflow-hidden">
        {anim && (
          <div className={`absolute inset-0 ${exitClass}`}>
            <Card
              card={{ id: anim.from, front: cards[anim.from].original, back: cards[anim.from].translation, lang: '' }}
              flipped={false}
              onFlip={() => {}}
            />
          </div>
        )}
        <div className={anim ? enterClass : ''}>
          <Card
            card={{ id: index, front: current.original, back: current.translation, lang: '' }}
            flipped={flipped}
            onFlip={() => !busyRef.current && setFlipped((f) => !f)}
          />
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4">Did you know the translation?</p>
      <div className="flex gap-3">
        <button
          onClick={() => goNext(14)}
          className="px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 transition font-medium text-sm"
        >
          No
        </button>
        <button
          onClick={() => goNext(7)}
          className="px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 transition font-medium text-sm"
        >
          Hardly
        </button>
        <button
          onClick={() => goNext(3)}
          className="px-4 py-3 rounded-xl bg-lime-600 hover:bg-lime-500 active:scale-95 transition font-medium text-sm"
        >
          Mostly
        </button>
        <button
          onClick={() => goNext(1)}
          className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition font-medium text-sm"
        >
          Yes
        </button>
      </div>
    </div>
  )
}
