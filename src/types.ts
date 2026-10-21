export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type CuisineId =
  | 'italian' | 'mexican' | 'chinese' | 'japanese' | 'thai'
  | 'indian' | 'korean' | 'mediterranean' | 'american' | 'filipino' | 'world'

export interface Recipe {
  id: number
  name: string
  emoji: string
  cuisine: CuisineId
  mealTypes: MealType[]
  minutes: number
  servings: number
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
  steps: string[]
  tags: string[]
  custom?: boolean
  // recipes saved from the web
  image?: string
  source?: string
  video?: string
  webId?: string
}

export interface MealPlanEntry {
  id: string
  date: string // YYYY-MM-DD
  slot: MealType
  recipeId: number
}

export interface StrengthSet { reps: number; weight: number; done: boolean }
export interface StrengthExercise { name: string; sets: StrengthSet[] }
export interface CardioEntry { type: string; minutes: number; distance: number }

export interface Workout {
  id: string
  date: string
  kind: 'strength' | 'cardio'
  createdAt: number
  durationMin: number
  exercises?: StrengthExercise[]
  cardio?: CardioEntry
  notes?: string
}

export interface WeightEntry { id: string; date: string; value: number }

export interface Settings {
  name: string
  weeklyGoal: number
  calorieTarget: number
  proteinTarget: number
  weightUnit: 'lb' | 'kg'
  distanceUnit: 'mi' | 'km'
  theme: 'system' | 'light' | 'dark'
}

