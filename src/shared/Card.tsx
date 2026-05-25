type CardData = {
  id: number
  front: string
  back: string
  lang: string
}

type Props = {
  card: CardData
  flipped: boolean
  onFlip: () => void
}

export default function Card({ card, flipped, onFlip }: Props) {
  return (
    <div
      className="relative h-48 cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-violet-700 text-white shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-xs uppercase tracking-widest text-violet-300 mb-2">
            original
          </span>
          <span className="text-4xl font-bold">{card.front}</span>
          <span className="text-xs text-violet-400 mt-4">tap to reveal</span>
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white text-gray-900 shadow-lg"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">
            Translation
          </span>
          <span className="text-4xl font-bold">{card.back}</span>
          <span className="text-xs text-gray-400 mt-4">tap to flip back</span>
        </div>
      </div>
    </div>
  )
}
