import { useMemo, useSyncExternalStore } from 'react'
import { SEED_RECIPES } from '../data/seedRecipes'
import type { MealPlanEntry, MealType, Recipe, Settings, WeightEntry, Workout } from '../types'
import { addDays, startOfWeek, today } from './date'

// Everything the app remembers. It's saved to the phone's local storage,
// so it stays private and works offline.
export interface AppState {
  settings: Settings
  customRecipes: Recipe[]
  plan: MealPlanEntry[]
  workouts: Workout[]
  weights: WeightEntry[]
  grocery: Record<string, string[]> // week start -> checked items
  recent: number[] // recently suggested recipe ids
  pantry: string[] // "What can I make?" ingredients you have
  pantryBasics: boolean // assume salt, pepper, oil, water and sugar
}

const STORAGE_KEY = 'fuel-and-form-v1'

const DEFAULT_STATE: AppState = {
  settings: { name: '', weeklyGoal: 4, calorieTarget: 2000, proteinTarget: 140, weightUnit: 'lb', distanceUnit: 'mi', theme: 'system' },
  customRecipes: [],
  plan: [],
  workouts: [],
  weights: [],
  grocery: {},
  recent: [],
  pantry: [],
  pantryBasics: true,
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      return { ...DEFAULT_STATE, ...saved, settings: { ...DEFAULT_STATE.settings, ...saved.settings } }
    }
  } catch {
    // storage unavailable (private mode) — start fresh
  }
  return DEFAULT_STATE
}

let state = load()
const listeners = new Set<() => void>()

export const getSettings = () => state.settings

function setState(next: AppState) {
  state = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore write errors
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Read app state inside a component. The component re-renders when it changes. */
export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, () => state)
}

/** Built-in + your own recipes. */
export function useRecipes(): Recipe[] {
  const { customRecipes } = useAppState()
  return useMemo(() => [...SEED_RECIPES, ...customRecipes], [customRecipes])
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

// ---------- Actions ----------

export function updateSettings(patch: Partial<Settings>) {
  setState({ ...state, settings: { ...state.settings, ...patch } })
}

export function addToPlan(date: string, slot: MealType, recipeId: number) {
  // one dish per slot per day — replace what was there
  const plan = state.plan.filter((p) => !(p.date === date && p.slot === slot))
  setState({ ...state, plan: [...plan, { id: uid(), date, slot, recipeId }] })
}

export function removeFromPlan(id: string) {
  setState({ ...state, plan: state.plan.filter((p) => p.id !== id) })
}

export function rememberSuggestion(recipeId: number) {
  setState({ ...state, recent: [recipeId, ...state.recent.filter((r) => r !== recipeId)].slice(0, 8) })
}

export function saveRecipe(recipe: Omit<Recipe, 'id'> & { id?: number }) {
  if (recipe.id) {
    setState({ ...state, customRecipes: state.customRecipes.map((r) => (r.id === recipe.id ? (recipe as Recipe) : r)) })
  } else {
    const id = Math.max(1000, ...state.customRecipes.map((r) => r.id)) + 1
    setState({ ...state, customRecipes: [...state.customRecipes, { ...recipe, id, custom: true }] })
  }
}

export function deleteRecipe(id: number) {
  setState({
    ...state,
    customRecipes: state.customRecipes.filter((r) => r.id !== id),
    plan: state.plan.filter((p) => p.recipeId !== id),
  })
}

export function addWorkout(w: Omit<Workout, 'id'>) {
  setState({ ...state, workouts: [...state.workouts, { ...w, id: uid() }] })
}

export function deleteWorkout(id: string) {
  setState({ ...state, workouts: state.workouts.filter((w) => w.id !== id) })
}

export function logWeight(date: string, value: number) {
  const weights = state.weights.filter((w) => w.date !== date)
  setState({ ...state, weights: [...weights, { id: uid(), date, value }].sort((a, b) => a.date.localeCompare(b.date)) })
}

export function toggleGrocery(weekStart: string, item: string) {
  const checked = state.grocery[weekStart] ?? []
  const next = checked.includes(item) ? checked.filter((i) => i !== item) : [...checked, item]
  setState({ ...state, grocery: { ...state.grocery, [weekStart]: next } })
}

export function setPantry(pantry: string[]) {
  setState({ ...state, pantry })
}

export function setPantryBasics(pantryBasics: boolean) {
  setState({ ...state, pantryBasics })
}

export function exportData(): string {
  return JSON.stringify(state, null, 2)
}

export function importData(json: string) {
  const data = JSON.parse(json)
  setState({ ...DEFAULT_STATE, ...data, settings: { ...DEFAULT_STATE.settings, ...data.settings } })
}

export function resetAll() {
  setState(DEFAULT_STATE)
}

/** Fills the app with ~6 weeks of realistic history so you can preview the dashboard. */
export function loadSampleData() {
  const t = today()
  const workouts: Workout[] = []
  const weights: WeightEntry[] = []
  const lifts = [
    { name: 'Bench Press', start: 135 },
    { name: 'Squat', start: 185 },
    { name: 'Deadlift', start: 225 },
    { name: 'Overhead Press', start: 85 },
  ]
  for (let day = 42; day >= 0; day--) {
    const date = addDays(t, -day)
    const dow = new Date(date + 'T12:00').getDay()
    const progress = (42 - day) / 42
    if (dow === 1 || dow === 3 || dow === 5) {
      const pick = dow === 1 ? [0, 3] : dow === 3 ? [1] : [2, 0]
      workouts.push({
        id: uid(), date, kind: 'strength', createdAt: Date.now(), durationMin: 50 + Math.round(Math.random() * 15),
        exercises: pick.map((i) => {
          const w = Math.round((lifts[i].start * (1 + progress * 0.12)) / 5) * 5
          return { name: lifts[i].name, sets: [0, 1, 2].map(() => ({ reps: 5 + Math.round(Math.random() * 3), weight: w, done: true })) }
        }),
      })
    }
    if (dow === 2 || dow === 6) {
      const minutes = 25 + Math.round(Math.random() * 15)
      workouts.push({
        id: uid(), date, kind: 'cardio', createdAt: Date.now(), durationMin: minutes,
        cardio: { type: dow === 2 ? 'Run' : 'Cycle', minutes, distance: +(minutes / (dow === 2 ? 10 : 4)).toFixed(1) },
      })
    }
    if (day % 3 === 0) weights.push({ id: uid(), date, value: +(184 - progress * 6 + (Math.random() - 0.5)).toFixed(1) })
  }
  const week = startOfWeek(t)
  const plan: MealPlanEntry[] = []
  const picks: [number, MealType, number][] = [
    [0, 'breakfast', 34], [0, 'dinner', 5], [1, 'breakfast', 23], [1, 'dinner', 17], [2, 'lunch', 29], [2, 'dinner', 37],
    [3, 'breakfast', 30], [3, 'dinner', 13], [4, 'lunch', 26], [4, 'dinner', 21], [5, 'dinner', 1], [6, 'breakfast', 38],
  ]
  picks.forEach(([d, slot, id]) => plan.push({ id: uid(), date: addDays(week, d), slot, recipeId: id }))
  setState({ ...state, workouts, weights, plan, settings: { ...state.settings, name: state.settings.name || 'Friend' } })
}
