import { Link } from 'react-router-dom'
import { loadCards } from './utils/cards'

function getDayLabel(date: Date, index: number): string {
  if (index === 0) return 'Today'
  if (index === 1) return 'Tomorrow'
  return date.toLocaleDateString('en', { weekday: 'short' })
}

function buildChartData() {
  const cards = loadCards()
  const today = new Date().toISOString().slice(0, 10)
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().slice(0, 10)
    const count = i === 0
      ? cards.filter((c) => c.showIn <= today).length
      : cards.filter((c) => c.showIn === dateStr).length
    return { label: getDayLabel(d, i), date: dateStr, count }
  })
}

const BAR_MAX_PX = 96

function ScheduleChart() {
  const data = buildChartData()
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Upcoming words</h2>
      <div className="flex items-end gap-2">
        {data.map((d) => {
          const barHeight = d.count > 0 ? Math.max((d.count / max) * BAR_MAX_PX, 8) : 2
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{d.count > 0 ? d.count : ''}</span>
              <div className="w-full rounded-t-md bg-violet-600 transition-all duration-500" style={{ height: `${barHeight}px` }} />
              <span className="text-xs text-gray-500 truncate w-full text-center">{d.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-svh bg-gray-950 text-white flex flex-col items-center justify-center p-6 gap-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Lang Cards</h1>
        <p className="text-gray-400">Your language learning flashcard app</p>
      </div>
      <div className="flex gap-3 w-full max-w-sm">
        <Link
          to="/cards/daily"
          className="flex-1 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 transition font-medium text-center"
        >
          Daily Words
        </Link>
        <Link
          to="/cards/random"
          className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 active:scale-95 transition font-medium text-center"
        >
          Random Words
        </Link>
      </div>
      <ScheduleChart />
    </div>
  )
}
