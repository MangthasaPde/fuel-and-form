import { useEffect, useState } from 'react'
import { CUISINES } from '../data/cuisines'
import type { CuisineId, MealType, Recipe } from '../types'

const API = import.meta.env.VITE_API_URL as string | undefined

/** A recipe found online (from TheMealDB, via the app's service). */
export interface WebRecipe {
  webId: string
  name: string
  image: string
  area: string
  category: string
  cuisine: string
  ingredients: string[]
  steps: string[]
  source?: string
  video?: string
  // per serving, estimated from the ingredients (0 = not enough recognised)
  servings: number
  calories: number
  protein: number
  carbs: number
  fat: number
}

type Status = 'idle' | 'loading' | 'done' | 'error' | 'offline'
const cache = new Map<string, WebRecipe[]>()

/** Fetches recipes from the app's service, waiting half a second after the last change. `path` null = nothing to fetch. */
function useResults(path: string | null) {
  const [state, setState] = useState<{ status: Status; results: WebRecipe[] }>({ status: 'idle', results: [] })

  useEffect(() => {
    if (!path || !API) return setState({ status: 'idle', results: [] })
    const hit = cache.get(path)
    if (hit) return setState({ status: 'done', results: hit })
    if (!navigator.onLine) return setState({ status: 'offline', results: [] })

    setState((s) => ({ status: 'loading', results: s.results }))
    const ctrl = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API}${path}`, { signal: ctrl.signal })
        if (!res.ok) throw new Error(String(res.status))
        const { results } = (await res.json()) as { results: WebRecipe[] }
        cache.set(path, results)
        setState({ status: 'done', results })
      } catch {
        if (!ctrl.signal.aborted) setState({ status: navigator.onLine ? 'error' : 'offline', results: [] })
      }
    }, 500)
    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [path])

  return state
}

/** Searches online once you've typed 3+ letters. */
export function useWebSearch(query: string) {
  const q = query.trim().toLowerCase()
  return useResults(q.length >= 3 ? `/api/recipes?q=${encodeURIComponent(q)}` : null)
}

/** Online dishes that use the ingredients you have. */
export function useWebByIngredients(items: string[]) {
  const key = [...items].sort().join(',')
  return useResults(key ? `/api/recipes/by-ingredients?i=${encodeURIComponent(key)}` : null)
}

const mealTypesFor = (category: string): MealType[] =>
  category === 'Breakfast' ? ['breakfast'] : ['Dessert', 'Starter', 'Side'].includes(category) ? ['snack'] : ['lunch', 'dinner']

/** Per-serving nutrition worked out by the app's service from ingredient lines like "2 chicken breasts". */
export async function estimateNutritionOnline(ingredients: string[], servings: number) {
  if (!API) throw new Error('Nutrition estimates need the online service.')
  if (!navigator.onLine) throw new Error("You're offline. Estimating needs internet.")
  const res = await fetch(`${API}/api/nutrition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients, servings }),
  })
  if (!res.ok) throw new Error('Could not estimate right now. Check the ingredients have amounts.')
  return (await res.json()) as { calories: number; protein: number; carbs: number; fat: number; coverage: number; unrecognised: string[] }
}

/** Turns a web recipe into one of your recipes. Cooking time isn't provided online; nutrition is an estimate. */
export function webToRecipe(w: WebRecipe): Omit<Recipe, 'id'> {
  return {
    name: w.name,
    emoji: '🍽️',
    cuisine: (CUISINES.some((c) => c.id === w.cuisine) ? w.cuisine : 'world') as CuisineId,
    mealTypes: mealTypesFor(w.category),
    minutes: 0,
    servings: w.servings,
    calories: w.calories,
    protein: w.protein,
    carbs: w.carbs,
    fat: w.fat,
    estimated: true,
    ingredients: w.ingredients,
    steps: w.steps,
    tags: ['Vegetarian', 'Vegan'].includes(w.category) ? ['vegetarian'] : [],
    custom: true,
    image: w.image,
    source: w.source,
    video: w.video,
    webId: w.webId,
  }
}
