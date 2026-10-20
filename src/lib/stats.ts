import type { MealPlanEntry, Recipe, StrengthSet, Workout } from '../types'
import { addDays, startOfWeek, weekDates } from './date'

/** Estimated one-rep max (Epley formula). */
export const e1rm = (s: Pick<StrengthSet, 'reps' | 'weight'>) => (s.reps <= 0 ? 0 : s.weight * (1 + s.reps / 30))

export function workoutsInWeek(workouts: Workout[], anyDayInWeek: string): Workout[] {
  const days = new Set(weekDates(anyDayInWeek))
  return workouts.filter((w) => days.has(w.date))
}

/** Consecutive weeks (ending this week) where the weekly goal was hit. This week counts once it's reached. */
export function weekStreak(workouts: Workout[], goal: number, todayISO: string): number {
  const countFor = (wk: string) => new Set(workoutsInWeek(workouts, wk).map((w) => w.date)).size
  let streak = countFor(todayISO) >= goal ? 1 : 0
  let wk = addDays(startOfWeek(todayISO), -7)
  while (countFor(wk) >= goal) {
    streak++
    wk = addDays(wk, -7)
  }
  return streak
}

export function dayNutrition(plan: MealPlanEntry[], recipes: Map<number, Recipe>, date: string) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }
  plan.filter((p) => p.date === date).forEach((p) => {
    const r = recipes.get(p.recipeId)
    if (!r) return
    totals.calories += r.calories
    totals.protein += r.protein
    totals.carbs += r.carbs
    totals.fat += r.fat
  })
  return totals
}

/** Exercise names you've logged, most frequent first. */
export function loggedExercises(workouts: Workout[]): string[] {
  const counts = new Map<string, number>()
  workouts.forEach((w) => w.exercises?.forEach((e) => counts.set(e.name, (counts.get(e.name) ?? 0) + 1)))
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([n]) => n)
}

/** Best estimated 1RM per workout for one exercise, oldest first. */
export function strengthHistory(workouts: Workout[], name: string) {
  return workouts
    .filter((w) => w.exercises?.some((e) => e.name === name))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((w) => {
      const sets = w.exercises!.filter((e) => e.name === name).flatMap((e) => e.sets.filter((s) => s.done))
      return { date: w.date, e1rm: Math.round(Math.max(0, ...sets.map(e1rm))), top: Math.max(0, ...sets.map((s) => s.weight)) }
    })
    .filter((p) => p.e1rm > 0)
}

export function bestE1rm(workouts: Workout[], name: string): number {
  return Math.max(0, ...strengthHistory(workouts, name).map((p) => p.e1rm))
}

/** The sets from the most recent time you did this exercise. */
export function lastSets(workouts: Workout[], name: string): StrengthSet[] {
  const last = [...workouts]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
    .find((w) => w.exercises?.some((e) => e.name === name))
  return last?.exercises?.find((e) => e.name === name)?.sets ?? []
}

export function cardioTotals(workouts: Workout[]) {
  return workouts.reduce(
    (t, w) => (w.cardio ? { minutes: t.minutes + w.cardio.minutes, distance: t.distance + w.cardio.distance, count: t.count + 1 } : t),
    { minutes: 0, distance: 0, count: 0 },
  )
}

export function workoutVolume(w: Workout): number {
  return (w.exercises ?? []).reduce((v, e) => v + e.sets.filter((s) => s.done).reduce((x, s) => x + s.reps * s.weight, 0), 0)
}
