import { Link } from 'react-router-dom'

export default function CardsHub() {
  return (
    <div className="min-h-svh bg-gray-950 text-white flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Cards</h1>
      <p className="text-gray-400 text-sm">Choose a learning mode</p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          to="/cards/daily"
          className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 transition font-medium text-center"
        >
          Daily Words
        </Link>
        <Link
          to="/cards/random"
          className="px-8 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 active:scale-95 transition font-medium text-center"
        >
          Random Words
        </Link>
      </div>
    </div>
  )
}
