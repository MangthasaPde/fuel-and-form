import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Check, ChefHat, ChevronRight, Plus, Shuffle, ShoppingBasket, Sparkles, X } from 'lucide-react'
import Sheet from '../components/Sheet'
import RecipePhoto from '../components/RecipePhoto'
import { photoFor } from '../data/photos'
import RecipeView, { SLOTS } from '../components/RecipeView'
import { Button, Card, EmptyState, ScreenHeader, SectionTitle, Segmented } from '../components/ui'
import { toast } from '../components/Toast'
import { CUISINES, cuisineById } from '../data/cuisines'
import { addToPlan, rememberSuggestion, removeFromPlan, toggleGrocery, useAppState, useRecipes } from '../lib/store'
import { addDays, dayNum, dayShort, longDate, mealTypeForNow, today, weekDates } from '../lib/date'
import { groceryFor } from '../lib/grocery'
import { suggestRecipe } from '../lib/suggest'
import { AddToPlan, RecipeDetailSheet, RecipePickerSheet } from './RecipeSheets'
import type { CuisineId, MealType, Recipe } from '../types'

export default function Meals({ openGroceryKey = 0 }: { openGroceryKey?: number }) {
  const { plan, recent, grocery } = useAppState()
  const recipes = useRecipes()
  const byId = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes])
  const t = today()

  const [meal, setMeal] = useState<MealType>(mealTypeForNow())
  const [cuisine, setCuisine] = useState<CuisineId | null>(null)
  const [dish, setDish] = useState<Recipe | null>(null)
  const [otherDay, setOtherDay] = useState(false)
  const [viewDay, setViewDay] = useState<string | null>(null)
  const [picker, setPicker] = useState<{ date: string; slot: MealType } | null>(null)
  const [detail, setDetail] = useState<Recipe | null>(null)
  const [groceryOpen, setGroceryOpen] = useState(false)
  const [wk, setWk] = useState<'0' | '1'>('0') // which week the strip and grocery list show: this (0) or next (1)
  const week = useMemo(() => weekDates(addDays(t, wk === '1' ? 7 : 0)), [t, wk])

  // opened from the Saturday notification
  useEffect(() => {
    if (openGroceryKey) {
      setWk('1')
      setGroceryOpen(true)
    }
  }, [openGroceryKey])

  const weekToggle = (
    <Segmented options={[{ value: '0', label: 'This week' }, { value: '1', label: 'Next week' }]} value={wk} onChange={setWk} />
  )

  // Skip dishes eaten yesterday/today and ones suggested recently.
  const avoidBase = useMemo(
    () => [...plan.filter((p) => p.date === t || p.date === addDays(t, -1)).map((p) => p.recipeId), ...recent],
    [plan, recent, t],
  )

  const suggest = (c: CuisineId | null, current?: Recipe | null) => {
    const r = suggestRecipe(recipes, c, meal, current ? [current.id, ...avoidBase] : avoidBase)
    if (!r) return
    setCuisine(c)
    setDish(r)
    setOtherDay(false)
    rememberSuggestion(r.id)
  }

  const cookToday = () => {
    if (!dish) return
    const slot = dish.mealTypes.includes(meal) ? meal : dish.mealTypes[0]
    addToPlan(t, slot, dish.id)
    toast(`${dish.name} is on for ${slot}!`)
    setDish(null)
  }

  const plannedOn = (d: string) => plan.filter((p) => p.date === d).sort((a, b) => SLOTS.findIndex((s) => s.value === a.slot) - SLOTS.findIndex((s) => s.value === b.slot))
  const todayMeals = plannedOn(t)

  // Grocery list for the week being shown (this week counts from today onward).
  const weekStart = week[0]
  const groceryItems = useMemo(() => groceryFor(plan, byId, week, t), [plan, byId, week, t])
  const checked = grocery[weekStart] ?? []
  const weekWord = wk === '1' ? 'next week' : 'this week'

  return (
    <div>
      <ScreenHeader title="Meals" subtitle={longDate(t)} />

      <div className="px-5">
        {/* Hero question */}
        <Card className="overflow-hidden bg-gradient-to-br from-meal/15 via-card to-card">
          <div className="flex items-center gap-2 text-meal">
            <ChefHat size={20} />
            <span className="text-[13px] font-bold uppercase tracking-wide">Let's cook</span>
          </div>
          <h2 className="mt-1.5 text-[24px] font-bold leading-snug tracking-tight">What cuisine are you feeling today?</h2>
          <div className="mt-4">
            <Segmented
              options={SLOTS.slice(0, 3).map((s) => ({ value: s.value, label: `${s.emoji} ${s.label}` }))}
              value={meal}
              onChange={setMeal}
            />
          </div>
        </Card>

        {/* Cuisine tiles */}
        <button
          onClick={() => suggest(null)}
          className="press mt-3 flex w-full items-center gap-3 rounded-3xl bg-gradient-to-r from-meal to-[#86b46a] p-4 text-left text-white shadow-lg shadow-meal/25"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 text-2xl">🎲</span>
          <span className="flex-1">
            <span className="block text-[17px] font-bold">Surprise me</span>
            <span className="text-[14px] text-white/85">Any cuisine, ready in 30 min or less</span>
          </span>
          <Sparkles size={22} />
        </button>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {CUISINES.map((c) => (
            <button
              key={c.id}
              onClick={() => suggest(c.id)}
              className="press relative h-28 overflow-hidden rounded-3xl bg-card2 text-left shadow-sm"
            >
              <img src={photoFor(c.cover)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <span className="relative flex h-full min-w-0 items-end gap-2 p-3 text-white">
                <span className="text-[22px] leading-none drop-shadow">{c.emoji}</span>
                <span className="min-w-0 truncate text-[16px] font-semibold leading-none drop-shadow">{c.name}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Today */}
        <SectionTitle>Today's menu</SectionTitle>
        {todayMeals.length === 0 ? (
          <Card>
            <EmptyState emoji="🍽️" title="Nothing planned yet" text="Pick a cuisine above and we'll suggest something easy." />
          </Card>
        ) : (
          <Card className="divide-y divide-line !p-0">
            {todayMeals.map((p) => {
              const r = byId.get(p.recipeId)
              if (!r) return null
              return (
                <button key={p.id} onClick={() => setDetail(r)} className="press flex w-full items-center gap-3 px-4 py-3.5 text-left">
                  <RecipePhoto recipe={r} className="h-14 w-14 shrink-0 rounded-2xl" emojiSize="text-2xl" />
                  <span className="flex-1">
                    <span className="block text-[12px] font-semibold uppercase tracking-wide text-muted">{p.slot}</span>
                    <span className="block text-[16px] font-semibold">{r.name}</span>
                  </span>
                  <span className="text-[14px] text-muted">{r.calories} kcal</span>
                  <ChevronRight size={18} className="text-muted" />
                </button>
              )
            })}
          </Card>
        )}

        {/* Week strip */}
        <SectionTitle action={<div className="w-48">{weekToggle}</div>}>My week</SectionTitle>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {week.map((d) => {
            const items = plannedOn(d)
            const isToday = d === t
            return (
              <button
                key={d}
                onClick={() => setViewDay(d)}
                className={`press flex w-[86px] shrink-0 flex-col items-center rounded-3xl p-3 shadow-sm ${isToday ? 'bg-meal text-white' : 'bg-card'} ${d < t ? 'opacity-55' : ''}`}
              >
                <span className={`text-[12px] font-semibold uppercase ${isToday ? 'text-white/85' : 'text-muted'}`}>{dayShort(d)}</span>
                <span className="text-[22px] font-bold tabular-nums">{dayNum(d)}</span>
                <span className="mt-1.5 flex min-h-7 flex-wrap justify-center gap-0.5 text-[20px] leading-7">
                  {items.length ? items.slice(0, 3).map((p) => { const r = byId.get(p.recipeId); return r ? <RecipePhoto key={p.id} recipe={r} className="-ml-1.5 h-7 w-7 rounded-full ring-2 ring-card first:ml-0" emojiSize="text-[14px]" /> : null }) : <Plus size={18} className={`mt-1 ${isToday ? 'text-white/80' : 'text-muted'}`} />}
                </span>
              </button>
            )
          })}
        </div>

        <Card onClick={() => setGroceryOpen(true)} className="mt-3 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-meal-soft text-meal"><ShoppingBasket size={22} /></span>
          <span className="flex-1">
            <span className="block text-[16px] font-semibold">Grocery list · {weekWord}</span>
            <span className="text-[14px] text-muted">
              {groceryItems.length ? `${groceryItems.length - checked.filter((c) => groceryItems.some(([i]) => i === c)).length} items left to buy` : 'Plan meals to build your list'}
            </span>
          </span>
          <ChevronRight size={18} className="text-muted" />
        </Card>
      </div>

      {/* Suggested dish pop-up */}
      <Sheet
        open={!!dish}
        onClose={() => setDish(null)}
        tall
        title={
          <span className="flex items-center gap-2">
            {cuisine ? `${cuisineById(cuisine).emoji} ${cuisineById(cuisine).name}` : '🎲 Surprise'} pick
          </span>
        }
        footer={
          dish &&
          (otherDay ? (
            <AddToPlan recipe={dish} initialSlot={dish.mealTypes.includes(meal) ? meal : undefined} onDone={() => setDish(null)} />
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button variant="soft" className="flex-1 whitespace-nowrap px-3" onClick={() => suggest(cuisine, dish)}>
                  <Shuffle size={18} /> Another
                </Button>
                <Button variant="meal" className="flex-[1.6] whitespace-nowrap px-3" onClick={cookToday}>
                  <Check size={18} /> Cook this today
                </Button>
              </div>
              <Button variant="ghost" className="min-h-10 w-full text-[15px] text-meal" onClick={() => setOtherDay(true)}>
                <CalendarDays size={17} /> Add to another day
              </Button>
            </div>
          ))
        }
      >
        <AnimatePresence mode="wait">
          {dish && (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            >
              <RecipeView recipe={dish} />
            </motion.div>
          )}
        </AnimatePresence>
      </Sheet>

      {/* A day's plan */}
      <Sheet open={!!viewDay} onClose={() => setViewDay(null)} title={viewDay ? longDate(viewDay) : ''}>
        {viewDay && (
          <div className="space-y-2 pt-1">
            {SLOTS.map((s) => {
              const entry = plan.find((p) => p.date === viewDay && p.slot === s.value)
              const r = entry && byId.get(entry.recipeId)
              return (
                <div key={s.value} className="flex items-center gap-3 rounded-2xl bg-card p-3">
                  {r ? <RecipePhoto recipe={r} className="h-14 w-14 shrink-0 rounded-2xl" emojiSize="text-2xl" /> : <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-card2 text-2xl">{s.emoji}</span>}
                  <button className="flex-1 text-left" onClick={() => (r ? setDetail(r) : setPicker({ date: viewDay, slot: s.value }))}>
                    <span className="block text-[12px] font-semibold uppercase tracking-wide text-muted">{s.label}</span>
                    <span className={`block text-[16px] font-semibold ${r ? '' : 'text-meal'}`}>{r ? r.name : '+ Add a dish'}</span>
                  </button>
                  {entry && (
                    <button aria-label="Remove" onClick={() => removeFromPlan(entry.id)} className="press grid h-9 w-9 place-items-center rounded-full bg-card2 text-muted">
                      <X size={16} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Sheet>

      {/* Grocery list */}
      <Sheet open={groceryOpen} onClose={() => setGroceryOpen(false)} tall title="🧺 Grocery list">
        <div className="mb-3">{weekToggle}</div>
        {groceryItems.length === 0 ? (
          <EmptyState emoji="🛒" title="Your list is empty" text={`Dishes you plan for ${weekWord} will show their ingredients here.`} />
        ) : (
          <div className="divide-y divide-line rounded-2xl bg-card">
            {groceryItems.map(([item, from]) => {
              const done = checked.includes(item)
              return (
                <button key={item} onClick={() => toggleGrocery(weekStart, item)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${done ? 'border-meal bg-meal text-white' : 'border-muted/50'}`}>
                    {done && <Check size={14} strokeWidth={3} />}
                  </span>
                  <span className="flex-1">
                    <span className={`block text-[16px] ${done ? 'text-muted line-through' : ''}`}>{item}</span>
                    <span className="text-[12px] text-muted">{from.join(', ')}</span>
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </Sheet>

      <RecipePickerSheet target={picker} onClose={() => setPicker(null)} />
      <RecipeDetailSheet recipe={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
