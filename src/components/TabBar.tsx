import { BookOpen, Dumbbell, LayoutGrid, UtensilsCrossed } from 'lucide-react'

export type Tab = 'dashboard' | 'meals' | 'recipes' | 'workouts'

const TABS = [
  { id: 'dashboard', label: 'Today', Icon: LayoutGrid, color: 'text-sky' },
  { id: 'meals', label: 'Meals', Icon: UtensilsCrossed, color: 'text-meal' },
  { id: 'recipes', label: 'Recipes', Icon: BookOpen, color: 'text-grape' },
  { id: 'workouts', label: 'Workouts', Icon: Dumbbell, color: 'text-fit' },
] as const

export default function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-40 border-t border-line pb-safe">
      <div className="mx-auto flex max-w-md justify-around pt-1.5">
        {TABS.map(({ id, label, Icon, color }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`press flex min-w-16 flex-col items-center gap-0.5 py-1 text-[11px] font-semibold ${active ? color : 'text-muted'}`}
            >
              <Icon size={25} strokeWidth={active ? 2.4 : 1.9} />
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
