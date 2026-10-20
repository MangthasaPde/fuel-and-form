import { useMemo, useState } from 'react'
import { CalendarPlus, Pencil, Search, Trash2 } from 'lucide-react'
import Sheet from '../components/Sheet'
import RecipeView, { SLOTS } from '../components/RecipeView'
import DayPicker from '../components/DayPicker'
import { Button, Chip, Field, Segmented, inputClass } from '../components/ui'
import { toast } from '../components/Toast'
import { CUISINES } from '../data/cuisines'
import { addToPlan, deleteRecipe, saveRecipe, useRecipes } from '../lib/store'
import { mealTypeForNow, monthDay, today, weekDates } from '../lib/date'
import type { CuisineId, MealType, Recipe } from '../types'

/** Pick a day + meal slot and add a recipe to the plan. */
export function AddToPlan({ recipe, onDone, initialSlot }: { recipe: Recipe; onDone: () => void; initialSlot?: MealType }) {
  const [day, setDay] = useState(today())
  const [slot, setSlot] = useState<MealType>(initialSlot ?? (recipe.mealTypes.includes(mealTypeForNow()) ? mealTypeForNow() : recipe.mealTypes[0]))
  return (
    <div className="space-y-3">
      <DayPicker days={weekDates(today())} value={day} onChange={setDay} />
      <Segmented options={SLOTS.map((s) => ({ value: s.value, label: s.label }))} value={slot} onChange={setSlot} />
      <Button
        variant="meal"
        className="w-full"
        onClick={() => {
          addToPlan(day, slot, recipe.id)
          toast(`Added to ${day === today() ? 'today' : monthDay(day)} · ${slot}`)
          onDone()
        }}
      >
        <CalendarPlus size={18} /> Add to plan
      </Button>
    </div>
  )
}

export function RecipeDetailSheet({ recipe, onClose, onEdit }: { recipe: Recipe | null; onClose: () => void; onEdit?: (r: Recipe) => void }) {
  const [planning, setPlanning] = useState(false)
  const close = () => {
    setPlanning(false)
    onClose()
  }
  return (
    <Sheet
      open={!!recipe}
      onClose={close}
      tall
      footer={
        recipe &&
        (planning ? (
          <AddToPlan recipe={recipe} onDone={close} />
        ) : (
          <div className="flex gap-2">
            {recipe.custom && onEdit && (
              <>
                <Button variant="soft" onClick={() => onEdit(recipe)} className="px-4"><Pencil size={18} /></Button>
                <Button
                  variant="danger"
                  className="px-4"
                  onClick={() => {
                    if (confirm(`Delete "${recipe.name}"?`)) {
                      deleteRecipe(recipe.id)
                      close()
                    }
                  }}
                >
                  <Trash2 size={18} />
                </Button>
              </>
            )}
            <Button variant="meal" className="flex-1" onClick={() => setPlanning(true)}>
              <CalendarPlus size={18} /> Add to my week
            </Button>
          </div>
        ))
      }
    >
      {recipe && <RecipeView recipe={recipe} />}
    </Sheet>
  )
}

/** Searchable list for choosing a recipe for a specific day + slot. */
export function RecipePickerSheet({ target, onClose }: { target: { date: string; slot: MealType } | null; onClose: () => void }) {
  const recipes = useRecipes()
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    return recipes
      .filter((r) => !query || r.name.toLowerCase().includes(query) || r.cuisine.includes(query))
      .sort((a, b) => Number(b.mealTypes.includes(target?.slot ?? 'dinner')) - Number(a.mealTypes.includes(target?.slot ?? 'dinner')))
  }, [recipes, q, target])

  return (
    <Sheet open={!!target} onClose={onClose} tall title={target ? `${SLOTS.find((s) => s.value === target.slot)?.label} · ${monthDay(target.date)}` : ''}>
      <div className="relative mb-3">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search recipes" className={`${inputClass} pl-11`} />
      </div>
      <div className="divide-y divide-line rounded-2xl bg-card">
        {list.map((r) => (
          <button
            key={r.id}
            className="press flex w-full items-center gap-3 px-4 py-3 text-left"
            onClick={() => {
              if (!target) return
              addToPlan(target.date, target.slot, r.id)
              toast(`${r.name} added`)
              onClose()
            }}
          >
            <span className="text-3xl">{r.emoji}</span>
            <span className="flex-1">
              <span className="block text-[16px] font-semibold">{r.name}</span>
              <span className="text-[13px] text-muted">{r.minutes} min · {r.calories} kcal · {r.protein}g protein</span>
            </span>
          </button>
        ))}
      </div>
    </Sheet>
  )
}

const TAGS = ['high-protein', 'vegetarian', 'quick', 'low-carb']
const EMOJIS = ['🍲', '🥗', '🍝', '🍛', '🌮', '🍜', '🍳', '🥙', '🍔', '🍣', '🥘', '🍗', '🥩', '🐟', '🥞', '🥣']

type Draft = Omit<Recipe, 'id'> & { id?: number }
const blank = (): Draft => ({
  name: '', emoji: '🍲', cuisine: 'american', mealTypes: ['dinner'], minutes: 20, servings: 2,
  calories: 450, protein: 30, carbs: 40, fat: 15, ingredients: [], steps: [], tags: [], custom: true,
})

export function RecipeEditorSheet({ initial, open, onClose }: { initial: Recipe | null; open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} tall title={initial ? 'Edit recipe' : 'New recipe'}>
      {open && <RecipeForm key={initial?.id ?? 'new'} initial={initial} onSaved={onClose} />}
    </Sheet>
  )
}

function RecipeForm({ initial, onSaved }: { initial: Recipe | null; onSaved: () => void }) {
  const [d, setD] = useState<Draft>(initial ?? blank())
  const [ingredients, setIngredients] = useState((initial?.ingredients ?? []).join('\n'))
  const [steps, setSteps] = useState((initial?.steps ?? []).join('\n'))
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }))
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  const num = (k: 'minutes' | 'servings' | 'calories' | 'protein' | 'carbs' | 'fat', label: string, unit = '') => (
    <Field label={label}>
      <div className="relative">
        <input inputMode="numeric" value={d[k]} onChange={(e) => set(k, Number(e.target.value.replace(/\D/g, '')) || 0)} className={inputClass} />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-muted">{unit}</span>}
      </div>
    </Field>
  )

  const save = () => {
    saveRecipe({
      ...d,
      name: d.name.trim(),
      ingredients: ingredients.split('\n').map((s) => s.trim()).filter(Boolean),
      steps: steps.split('\n').map((s) => s.trim()).filter(Boolean),
    })
    toast(initial ? 'Recipe updated' : 'Recipe saved')
    onSaved()
  }

  return (
    <div className="space-y-5 pt-2">
      <Field label="Name">
        <input value={d.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Mom's chicken soup" className={inputClass} />
      </Field>

      <Field label="Icon">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {EMOJIS.map((e) => (
            <button key={e} onClick={() => set('emoji', e)} className={`press grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl ${d.emoji === e ? 'bg-meal-soft ring-2 ring-meal' : 'bg-card'}`}>
              {e}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Cuisine">
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <Chip key={c.id} active={d.cuisine === c.id} color="meal" onClick={() => set('cuisine', c.id as CuisineId)}>
              {c.emoji} {c.name}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Good for">
        <div className="flex flex-wrap gap-2">
          {SLOTS.map((s) => (
            <Chip key={s.value} active={d.mealTypes.includes(s.value)} color="meal" onClick={() => set('mealTypes', toggle(d.mealTypes, s.value))}>
              {s.emoji} {s.label}
            </Chip>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        {num('minutes', 'Time', 'min')}
        {num('servings', 'Servings')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {num('calories', 'Calories', 'kcal')}
        {num('protein', 'Protein', 'g')}
        {num('carbs', 'Carbs', 'g')}
        {num('fat', 'Fat', 'g')}
      </div>

      <Field label="Ingredients (one per line)">
        <textarea rows={5} value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder={'2 eggs\n1 cup rice'} className={inputClass} />
      </Field>
      <Field label="Steps (one per line)">
        <textarea rows={5} value={steps} onChange={(e) => setSteps(e.target.value)} placeholder={'Boil the rice.\nFry the eggs.'} className={inputClass} />
      </Field>

      <Field label="Tags">
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <Chip key={t} active={d.tags.includes(t)} onClick={() => set('tags', toggle(d.tags, t))}>{t}</Chip>
          ))}
        </div>
      </Field>

      <Button variant="meal" className="w-full" disabled={!d.name.trim() || d.mealTypes.length === 0} onClick={save}>
        Save recipe
      </Button>
    </div>
  )
}
