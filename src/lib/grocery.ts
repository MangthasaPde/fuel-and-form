import type { MealPlanEntry, Recipe } from '../types'

/** Every ingredient from the plan on the given days (from `fromDate` onward), de-duplicated, with the dishes that need it. */
export function groceryFor(
  plan: MealPlanEntry[],
  byId: Map<number, Recipe>,
  days: string[],
  fromDate: string,
): [string, string[]][] {
  const items = new Map<string, string[]>()
  plan
    .filter((p) => days.includes(p.date) && p.date >= fromDate)
    .forEach((p) => {
      const r = byId.get(p.recipeId)
      r?.ingredients.forEach((ing) => items.set(ing, [...new Set([...(items.get(ing) ?? []), r.name])]))
    })
  return [...items.entries()]
}
