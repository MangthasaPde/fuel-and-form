import { useMemo, useState } from 'react'
import { Check, Globe, Plus, Search, WifiOff } from 'lucide-react'
import { Chip, EmptyState, IconButton, ScreenHeader, inputClass } from '../components/ui'
import RecipePhoto from '../components/RecipePhoto'
import { recipeMeta } from '../components/RecipeView'
import { CUISINES, cuisineById } from '../data/cuisines'
import { useRecipes } from '../lib/store'
import { useWebSearch, type WebRecipe } from '../lib/online'
import { RecipeDetailSheet, RecipeEditorSheet, WebRecipeSheet } from './RecipeSheets'
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
  const [webOpen, setWebOpen] = useState<WebRecipe | null>(null)

  const detail = recipes.find((r) => r.id === detailId) ?? null
  const web = useWebSearch(q)
  const searchingWeb = q.trim().length >= 3
  const savedWebIds = useMemo(() => new Set(recipes.map((r) => r.webId).filter(Boolean)), [recipes])

  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    return recipes.filter((r) => {
      if (cuisine !== 'all' && r.cuisine !== cuisine) return false
      if (tag === 'mine' && !r.custom) return false
      if (tag === 'quick' && !(r.minutes > 0 && r.minutes <= 15)) return false
      if (tag && tag !== 'mine' && tag !== 'quick' && !r.tags.includes(tag)) return false
      if (query && !(r.name.toLowerCase().includes(query) || r.ingredients.some((i) => i.toLowerCase().includes(query)))) return false
      return true
    })
  }, [recipes, q, cuisine, tag])

  return (
    <div>
      <ScreenHeader
        title="Recipes"
        subtitle={`${recipes.length} dishes · search any dish online`}
        right={
          <IconButton label="New recipe" onClick={() => setEditing({ recipe: null })} className="!bg-grape text-white">
            <Plus size={22} />
          </IconButton>
        }
      />

      <div className="px-5">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search any dish, e.g. lasagna"
            className={`${inputClass} pl-11 shadow-sm`}
          />
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

      {searchingWeb && list.length > 0 && <h2 className="mt-5 px-6 text-[20px] font-bold tracking-tight">Your recipes</h2>}
      <div className={`grid grid-cols-2 gap-3 px-5 ${searchingWeb && list.length > 0 ? 'mt-2.5' : 'mt-4'}`}>
        {list.map((r) => (
          <button key={r.id} onClick={() => setDetailId(r.id)} className="press overflow-hidden rounded-3xl bg-card text-left shadow-sm">
            <RecipePhoto recipe={r} className="h-36 w-full" emojiSize="text-[52px]" />
            <div className="p-3">
              <p className="line-clamp-2 min-h-[40px] text-[15px] font-semibold leading-tight">{r.name}</p>
              <p className="mt-1 text-[13px] text-muted">{recipeMeta(r) || `${cuisineById(r.cuisine).emoji} ${cuisineById(r.cuisine).name}`}</p>
            </div>
          </button>
        ))}
      </div>
      {list.length === 0 && !searchingWeb && (
        <EmptyState
          emoji="🔍"
          title="No recipes found"
          text={tag === 'mine' ? 'Tap + to add your own recipe, or search for any dish.' : 'Try a different search or filter.'}
        />
      )}

      {searchingWeb && (
        <section className="mt-7 px-5">
          <div className="mb-2.5 flex items-center gap-2 px-1">
            <Globe size={19} className="text-grape" />
            <h2 className="text-[20px] font-bold tracking-tight">From the web</h2>
          </div>

          {web.status === 'loading' && web.results.length === 0 && (
            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-[212px] animate-pulse rounded-3xl bg-card2" />
              ))}
            </div>
          )}
          {web.status === 'offline' && (
            <p className="flex items-center gap-2 rounded-2xl bg-card p-4 text-[15px] text-muted"><WifiOff size={18} /> You're offline. Online search needs internet.</p>
          )}
          {web.status === 'error' && <p className="rounded-2xl bg-card p-4 text-[15px] text-muted">Couldn't reach the recipe search right now. Try again in a moment.</p>}
          {web.status === 'done' && web.results.length === 0 && (
            <p className="rounded-2xl bg-card p-4 text-[15px] text-muted">
              No online recipes for “{q.trim()}”. Try a simpler word, like “curry”, “pasta” or “chicken”.
            </p>
          )}

          {web.results.length > 0 && (
            <div className={`grid grid-cols-2 gap-3 transition-opacity ${web.status === 'loading' ? 'opacity-50' : ''}`}>
              {web.results.map((w) => (
                <button key={w.webId} onClick={() => setWebOpen(w)} className="press relative overflow-hidden rounded-3xl bg-card text-left shadow-sm">
                  <img src={w.image} alt={w.name} loading="lazy" decoding="async" className="h-36 w-full bg-card2 object-cover" />
                  {savedWebIds.has(w.webId) && (
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-meal px-2 py-1 text-[11px] font-bold text-white shadow">
                      <Check size={12} strokeWidth={3} /> Saved
                    </span>
                  )}
                  <div className="p-3">
                    <p className="line-clamp-2 min-h-[40px] text-[15px] font-semibold leading-tight">{w.name}</p>
                    <p className="mt-1 truncate text-[13px] text-muted">{[w.area, w.category].filter((x) => x && x !== 'Unknown').join(' · ')}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <p className="mt-3 px-1 text-center text-[11px] text-muted">Online recipes from TheMealDB</p>
        </section>
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
      <WebRecipeSheet web={webOpen} onClose={() => setWebOpen(null)} />
    </div>
  )
}
