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
}

type Status = 'idle' | 'loading' | 'done' | 'error' | 'offline'
const cache = new Map<string, WebRecipe[]>()

/** Searches online once you've typed 3+ letters and paused for half a second. */
export function useWebSearch(query: string) {
  const q = query.trim().toLowerCase()
  const [state, setState] = useState<{ status: Status; results: WebRecipe[] }>({ status: 'idle', results: [] })

  useEffect(() => {
    if (q.length < 3 || !API) return setState({ status: 'idle', results: [] })
    const hit = cache.get(q)
    if (hit) return setState({ status: 'done', results: hit })
    if (!navigator.onLine) return setState({ status: 'offline', results: [] })

    setState((s) => ({ status: 'loading', results: s.results }))
    const ctrl = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/recipes?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        if (!res.ok) throw new Error(String(res.status))
        const { results } = (await res.json()) as { results: WebRecipe[] }
        cache.set(q, results)
        setState({ status: 'done', results })
      } catch {
        if (!ctrl.signal.aborted) setState({ status: navigator.onLine ? 'error' : 'offline', results: [] })
      }
    }, 500)
    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [q])

  return state
}

const mealTypesFor = (category: string): MealType[] =>
  category === 'Breakfast' ? ['breakfast'] : ['Dessert', 'Starter', 'Side'].includes(category) ? ['snack'] : ['lunch', 'dinner']

/** Turns a web recipe into one of your recipes. Time, servings and nutrition aren't provided online, so they start empty. */
export function webToRecipe(w: WebRecipe): Omit<Recipe, 'id'> {
  return {
    name: w.name,
    emoji: '🍽️',
    cuisine: (CUISINES.some((c) => c.id === w.cuisine) ? w.cuisine : 'world') as CuisineId,
    mealTypes: mealTypesFor(w.category),
    minutes: 0, servings: 0, calories: 0, protein: 0, carbs: 0, fat: 0,
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
