import { NavLink } from 'react-router-dom'
import { Home, CreditCard, PlusCircle, Settings } from 'lucide-react'

const links = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/cards', icon: CreditCard, label: 'Cards', end: false },
  { to: '/add-cards-default', icon: PlusCircle, label: 'Add', end: true },
  { to: '/settings', icon: Settings, label: 'Settings', end: true },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 flex justify-around items-center h-16 bg-gray-900 border-t border-gray-800">
      {links.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-6 transition-colors ${
              isActive ? 'text-violet-400' : 'text-gray-500 hover:text-gray-300'
            }`
          }
        >
          <Icon size={22} />
          <span className="text-xs">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
