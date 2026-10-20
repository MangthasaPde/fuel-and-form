import type { CuisineId, MealType, Recipe } from '../types'

/**
 * Picks a random easy dish for a cuisine and meal.
 * `avoid` holds recipe ids to skip (the one on screen, recent suggestions, yesterday's meals).
 * If the cuisine has nothing for that meal, any meal from the cuisine is allowed.
 */
export function suggestRecipe(
  recipes: Recipe[],
  cuisine: CuisineId | null,
  meal: MealType,
  avoid: number[],
): Recipe | undefined {
  const inCuisine = recipes.filter((r) => (cuisine ? r.cuisine === cuisine : true) && r.minutes <= 30)
  const forMeal = inCuisine.filter((r) => r.mealTypes.includes(meal))
  const base = forMeal.length ? forMeal : inCuisine
  const fresh = base.filter((r) => !avoid.includes(r.id))
  // if everything was recently shown, only skip the one currently on screen
  const pool = fresh.length ? fresh : base.filter((r) => r.id !== avoid[0])
  const final = pool.length ? pool : base
  return final[Math.floor(Math.random() * final.length)]
}
