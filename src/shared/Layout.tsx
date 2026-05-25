import type { ReactNode } from 'react'
import BottomNav from './BottomNav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="pb-16">
      {children}
      <BottomNav />
    </div>
  )
}
