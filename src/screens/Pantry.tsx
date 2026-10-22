import { useMemo, useState } from 'react'
import { Check, Globe, Plus, WifiOff, X } from 'lucide-react'
import Sheet from '../components/Sheet'
import RecipePhoto from '../components/RecipePhoto'
import { EmptyState, inputClass } from '../components/ui'
import { setPantry, setPantryBasics, useAppState, useRecipes } from '../lib/store'
import { matchIngredients, PANTRY_SUGGESTIONS, shortName, type PantryMatch } from '../lib/pantry'
import { useWebByIngredients, type WebRecipe } from '../lib/online'
import { RecipeDetailSheet, WebRecipeSheet } from './RecipeSheets'
import type { Recipe } from '../types'

const MAX_MISSING = 3

function MatchLine({ match }: { match: PantryMatch }) {
  if (match.missing.length === 0)
    return (
      <span className="flex items-center gap-1 text-[13px] font-semibold text-meal">
        <Check size={14} strokeWidth={3} /> You have everything
      </span>
    )
  return <span className="line-clamp-2 text-[13px] text-muted">Missing: {match.missing.map(shortName).join(', ')}</span>
}

/** "What can I make?": type what's in your kitchen, see dishes you can cook now or with a few extras. */
export default function PantrySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pantry, pantryBasics } = useAppState()
  const recipes = useRecipes()
  const [text, setText] = useState('')
  const [detailId, setDetailId] = useState<number | null>(null)
  const [webOpen, setWebOpen] = useState<WebRecipe | null>(null)

  const add = (raw: string) => {
    const items = raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    if (items.length) setPantry([...new Set([...pantry, ...items])])
    setText('')
  }
  const remove = (item: string) => setPantry(pantry.filter((p) => p !== item))

  const local = useMemo(() => {
    if (!pantry.length) return []
    return recipes
      .map((r) => ({ r, m: matchIngredients(r.ingredients, pantry, pantryBasics) }))
      .filter(({ m }) => m.have.length > 0 && m.missing.length <= MAX_MISSING)
      .sort((a, b) => a.m.missing.length - b.m.missing.length || b.m.have.length - a.m.have.length)
  }, [recipes, pantry, pantryBasics])

  const web = useWebByIngredients(pantry)
  const savedWebIds = new Set(recipes.map((r) => r.webId).filter(Boolean))
  const webMatches = useMemo(
    () =>
      web.results
        .filter((w) => !savedWebIds.has(w.webId))
        .map((w) => ({ w, m: matchIngredients(w.ingredients, pantry, pantryBasics) }))
        .filter(({ m }) => m.have.length > 0 && m.missing.length <= MAX_MISSING + 1)
        .sort((a, b) => a.m.missing.length - b.m.missing.length),
    [web.results, pantry, pantryBasics, recipes],
  )

  const ready = local.filter(({ m }) => m.missing.length === 0)
  const almost = local.filter(({ m }) => m.missing.length > 0)
  const detail: Recipe | null = recipes.find((r) => r.id === detailId) ?? null

  const row = (key: string | number, photo: React.ReactNode, name: string, m: PantryMatch, meta: string, onClick: () => void) => (
    <button key={key} onClick={onClick} className="press flex w-full items-center gap-3 px-4 py-3 text-left">
      {photo}
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-semibold leading-tight">{name}</span>
        <MatchLine match={m} />
        {meta && <span className="block text-[12px] text-muted">{meta}</span>}
      </span>
    </button>
  )

  return (
    <Sheet open={open} onClose={onClose} tall title="🧺 What can I make?">
      <p className="mb-3 text-[15px] text-muted">Add what's in your kitchen. We'll find dishes you can cook now, or with just a few extras.</p>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          add(text)
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. chicken, rice, garlic"
          enterKeyHint="done"
          className={`${inputClass} flex-1`}
        />
        <button type="submit" aria-label="Add ingredient" disabled={!text.trim()} className="press grid w-12 place-items-center rounded-2xl bg-meal text-white disabled:opacity-40">
          <Plus size={22} />
        </button>
      </form>

      {pantry.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {pantry.map((p) => (
            <span key={p} className="flex items-center gap-1 rounded-full bg-meal px-3 py-1.5 text-[14px] font-semibold text-white">
              {p}
              <button aria-label={`Remove ${p}`} onClick={() => remove(p)} className="-mr-1 grid h-5 w-5 place-items-center rounded-full bg-white/25">
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          ))}
          <button onClick={() => setPantry([])} className="px-2 text-[13px] font-semibold text-muted underline">Clear all</button>
        </div>
      )}

      <p className="mt-4 mb-1.5 px-1 text-[12px] font-semibold uppercase tracking-wide text-muted">Quick add</p>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {PANTRY_SUGGESTIONS.filter((s) => !pantry.includes(s)).map((s) => (
          <button key={s} onClick={() => add(s)} className="press shrink-0 rounded-full border border-line bg-card px-3 py-1.5 text-[14px]">
            + {s}
          </button>
        ))}
      </div>

      <label className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3">
        <span className="text-[15px]">I have salt, pepper, oil, water & sugar</span>
        <button
          role="switch"
          aria-checked={pantryBasics}
          onClick={() => setPantryBasics(!pantryBasics)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${pantryBasics ? 'bg-meal' : 'bg-card2'}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${pantryBasics ? 'left-6' : 'left-1'}`} />
        </button>
      </label>

      {pantry.length === 0 ? (
        <EmptyState emoji="🥕" title="Your kitchen is empty" text="Add a few ingredients above to see what you can cook." />
      ) : (
        <>
          {ready.length > 0 && (
            <>
              <h3 className="mt-6 mb-2 px-1 text-[18px] font-bold">Ready to cook 🎉</h3>
              <div className="divide-y divide-line rounded-2xl bg-card">
                {ready.map(({ r, m }) =>
                  row(r.id, <RecipePhoto recipe={r} className="h-14 w-14 shrink-0 rounded-2xl" emojiSize="text-2xl" />, r.name, m, r.calories ? `${r.calories} kcal · ${r.protein}g protein` : '', () => setDetailId(r.id)),
                )}
              </div>
            </>
          )}
          {almost.length > 0 && (
            <>
              <h3 className="mt-6 mb-2 px-1 text-[18px] font-bold">Just a few extras</h3>
              <div className="divide-y divide-line rounded-2xl bg-card">
                {almost.slice(0, 15).map(({ r, m }) =>
                  row(r.id, <RecipePhoto recipe={r} className="h-14 w-14 shrink-0 rounded-2xl" emojiSize="text-2xl" />, r.name, m, r.calories ? `${r.calories} kcal · ${r.protein}g protein` : '', () => setDetailId(r.id)),
                )}
              </div>
            </>
          )}
          {local.length === 0 && <p className="mt-6 rounded-2xl bg-card p-4 text-[15px] text-muted">None of your saved recipes match yet. Try adding a main ingredient like chicken, rice or eggs.</p>}

          <div className="mt-7 mb-2 flex items-center gap-2 px-1">
            <Globe size={18} className="text-grape" />
            <h3 className="text-[18px] font-bold">More ideas from the web</h3>
          </div>
          {web.status === 'loading' && webMatches.length === 0 && <div className="h-24 animate-pulse rounded-2xl bg-card2" />}
          {web.status === 'offline' && (
            <p className="flex items-center gap-2 rounded-2xl bg-card p-4 text-[15px] text-muted"><WifiOff size={18} /> You're offline. Web ideas need internet.</p>
          )}
          {web.status === 'error' && <p className="rounded-2xl bg-card p-4 text-[15px] text-muted">Couldn't reach the recipe search right now.</p>}
          {web.status === 'done' && webMatches.length === 0 && <p className="rounded-2xl bg-card p-4 text-[15px] text-muted">No close matches online. Try adding another ingredient.</p>}
          {webMatches.length > 0 && (
            <div className={`divide-y divide-line rounded-2xl bg-card transition-opacity ${web.status === 'loading' ? 'opacity-50' : ''}`}>
              {webMatches.slice(0, 10).map(({ w, m }) =>
                row(w.webId, <img src={w.image} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-2xl bg-card2 object-cover" />, w.name, m, w.calories ? `≈ ${w.calories} kcal · ${w.protein}g protein` : '', () => setWebOpen(w)),
              )}
            </div>
          )}
          <p className="mt-3 text-center text-[11px] text-muted">Web ideas from TheMealDB</p>
        </>
      )}

      <RecipeDetailSheet recipe={detail} onClose={() => setDetailId(null)} />
      <WebRecipeSheet web={webOpen} onClose={() => setWebOpen(null)} />
    </Sheet>
  )
}
