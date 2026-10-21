import { Clock, Flame, Users } from 'lucide-react'
import RecipePhoto from './RecipePhoto'
import { cuisineById } from '../data/cuisines'
import { PHOTO_CREDITS } from '../data/photos'
import type { MealType, Recipe } from '../types'

export const SLOTS: { value: MealType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍎' },
]

/** Full recipe: hero, quick facts, macros, ingredients and steps. */
export default function RecipeView({ recipe }: { recipe: Recipe }) {
  const cuisine = cuisineById(recipe.cuisine)
  return (
    <div>
      <RecipePhoto recipe={recipe} eager className="h-60 w-full rounded-[28px] shadow-md" emojiSize="text-[84px]" />

      <p className="mt-4 text-[13px] font-semibold uppercase tracking-wide text-meal">
        {cuisine.emoji} {cuisine.name} · Easy
      </p>
      <h2 className="mt-1 text-[26px] font-bold leading-tight tracking-tight">{recipe.name}</h2>

      <div className="mt-3 flex flex-wrap gap-2 text-[14px] font-medium">
        <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5"><Clock size={15} className="text-muted" />{recipe.minutes} min</span>
        <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5"><Users size={15} className="text-muted" />Serves {recipe.servings}</span>
        <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5"><Flame size={15} className="text-fit" />{recipe.calories} kcal</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Protein', value: recipe.protein, color: 'bg-sky' },
          { label: 'Carbs', value: recipe.carbs, color: 'bg-meal' },
          { label: 'Fat', value: recipe.fat, color: 'bg-fit' },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl bg-card p-3">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
              <span className={`h-2 w-2 rounded-full ${m.color}`} />
              {m.label}
            </div>
            <div className="mt-0.5 text-[20px] font-bold tabular-nums">{m.value}<span className="text-[13px] text-muted">g</span></div>
          </div>
        ))}
      </div>

      <h3 className="mt-6 mb-2 text-[18px] font-bold">Ingredients</h3>
      <ul className="divide-y divide-line rounded-2xl bg-card px-4">
        {recipe.ingredients.map((ing) => (
          <li key={ing} className="flex items-center gap-3 py-3 text-[15px]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-meal" />
            {ing}
          </li>
        ))}
      </ul>

      <h3 className="mt-6 mb-2 text-[18px] font-bold">Steps</h3>
      <ol className="space-y-2">
        {recipe.steps.map((step, i) => (
          <li key={i} className="flex gap-3 rounded-2xl bg-card p-4 text-[15px] leading-relaxed">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-meal-soft text-[14px] font-bold text-meal">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>

      {PHOTO_CREDITS[recipe.id] && (
        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
          Photo: {PHOTO_CREDITS[recipe.id].author} ·{' '}
          <a href={PHOTO_CREDITS[recipe.id].page} target="_blank" rel="noreferrer" className="underline">{PHOTO_CREDITS[recipe.id].license}</a>
          {' '}via Wikimedia Commons
        </p>
      )}
    </div>
  )
}
