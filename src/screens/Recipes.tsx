import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Chip, EmptyState, IconButton, ScreenHeader, inputClass } from '../components/ui'
import { CUISINES, cuisineById } from '../data/cuisines'
import { useRecipes } from '../lib/store'
import { RecipeDetailSheet, RecipeEditorSheet } from './RecipeSheets'
import type { CuisineId, Recipe } from '../types'

const TAG_FILTERS = [
  { id: 'high-protein', label: '💪 High protein' },
  { id: 'vegetarian', label: '🥬 Vegetarian' },
  { id: 'quick', label: '⚡ 15 min' },
  { id: 'mine', label: '⭐ My recipes' },
]

export default function Recipes() {
  const recipes = useRecipes()
  const [q, setQ] = useState('')
  const [cuisine, setCuisine] = useState<CuisineId | 'all'>('all')
  const [tag, setTag] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<number | null>(null)
  const [editing, setEditing] = useState<{ recipe: Recipe | null } | null>(null)

  const detail = recipes.find((r) => r.id === detailId) ?? null

  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    return recipes.filter((r) => {
      if (cuisine !== 'all' && r.cuisine !== cuisine) return false
      if (tag === 'mine' && !r.custom) return false
      if (tag === 'quick' && r.minutes > 15) return false
      if (tag && tag !== 'mine' && tag !== 'quick' && !r.tags.includes(tag)) return false
      if (query && !(r.name.toLowerCase().includes(query) || r.ingredients.some((i) => i.toLowerCase().includes(query)))) return false
      return true
    })
  }, [recipes, q, cuisine, tag])

  return (
    <div>
      <ScreenHeader
        title="Recipes"
        subtitle={`${recipes.length} easy dishes`}
        right={
          <IconButton label="New recipe" onClick={() => setEditing({ recipe: null })} className="!bg-grape text-white">
            <Plus size={22} />
          </IconButton>
        }
      />

      <div className="px-5">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes or ingredients" className={`${inputClass} pl-11 shadow-sm`} />
        </div>
      </div>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5">
        <Chip active={cuisine === 'all'} onClick={() => setCuisine('all')}>All</Chip>
        {CUISINES.map((c) => (
          <Chip key={c.id} active={cuisine === c.id} onClick={() => setCuisine(c.id)}>
            {c.emoji} {c.name}
          </Chip>
        ))}
      </div>
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto px-5">
        {TAG_FILTERS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTag(tag === t.id ? null : t.id)}
            className={`press shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold ${tag === t.id ? 'border-grape bg-grape/10 text-grape' : 'border-line text-muted'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-5">
        {list.map((r) => (
          <button key={r.id} onClick={() => setDetailId(r.id)} className="press overflow-hidden rounded-3xl bg-card text-left shadow-sm">
            <div className={`grid h-28 place-items-center bg-gradient-to-br ${cuisineById(r.cuisine).tint}`}>
              <span className="text-[52px]">{r.emoji}</span>
            </div>
            <div className="p-3">
              <p className="line-clamp-2 min-h-[40px] text-[15px] font-semibold leading-tight">{r.name}</p>
              <p className="mt-1 text-[13px] text-muted">{r.minutes} min · {r.calories} kcal</p>
            </div>
          </button>
        ))}
      </div>
      {list.length === 0 && (
        <EmptyState
          emoji="🔍"
          title="No recipes found"
          text={tag === 'mine' ? 'Tap + to add your own recipe.' : 'Try a different search or filter.'}
        />
      )}

      <RecipeDetailSheet
        recipe={detail}
        onClose={() => setDetailId(null)}
        onEdit={(r) => {
          setDetailId(null)
          setEditing({ recipe: r })
        }}
      />
      <RecipeEditorSheet open={!!editing} initial={editing?.recipe ?? null} onClose={() => setEditing(null)} />
    </div>
  )
}
