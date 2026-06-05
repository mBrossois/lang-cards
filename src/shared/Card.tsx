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
      className="relative min-h-48 cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          display: 'grid',
          gridTemplateColumns: '1fr',
        }}
      >
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-violet-700 text-white shadow-lg py-6 min-w-0"
          style={{ backfaceVisibility: 'hidden', gridArea: '1 / 1' }}
        >
          <span className="text-xs uppercase tracking-widest text-violet-300 mb-2">
            original
          </span>
          <span className="text-4xl font-bold text-center px-4 w-full break-words hyphens-auto" lang={card.lang || 'nl'}>{card.front}</span>
          <span className="text-xs text-violet-400 mt-4">tap to reveal</span>
        </div>

        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-white text-gray-900 shadow-lg py-6 min-w-0"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', gridArea: '1 / 1' }}
        >
          <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">
            Translation
          </span>
          <span className="text-4xl font-bold text-center px-4 w-full break-words hyphens-auto" lang={card.lang || 'nl'}>{card.back}</span>
          <span className="text-xs text-gray-400 mt-4">tap to flip back</span>
        </div>
      </div>
    </div>
  )
}
