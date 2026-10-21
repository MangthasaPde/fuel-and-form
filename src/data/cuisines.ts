import type { CuisineId } from '../types'

// `cover` is the id of the recipe whose photo is shown on the cuisine's tile.
export const CUISINES: { id: CuisineId; name: string; emoji: string; tint: string; cover: number }[] = [
  { id: 'italian', name: 'Italian', emoji: '🍝', tint: 'from-red-400/25 to-amber-300/20', cover: 1 },
  { id: 'mexican', name: 'Mexican', emoji: '🌮', tint: 'from-lime-400/25 to-orange-300/20', cover: 7 },
  { id: 'chinese', name: 'Chinese', emoji: '🥡', tint: 'from-rose-400/25 to-yellow-300/20', cover: 10 },
  { id: 'japanese', name: 'Japanese', emoji: '🍣', tint: 'from-pink-300/25 to-slate-300/20', cover: 14 },
  { id: 'thai', name: 'Thai', emoji: '🍜', tint: 'from-emerald-400/25 to-lime-300/20', cover: 18 },
  { id: 'indian', name: 'Indian', emoji: '🍛', tint: 'from-amber-400/25 to-orange-400/20', cover: 21 },
  { id: 'korean', name: 'Korean', emoji: '🥘', tint: 'from-red-500/25 to-rose-300/20', cover: 25 },
  { id: 'mediterranean', name: 'Mediterranean', emoji: '🫒', tint: 'from-sky-400/25 to-emerald-300/20', cover: 30 },
  { id: 'american', name: 'American', emoji: '🍔', tint: 'from-blue-400/25 to-red-300/20', cover: 34 },
  { id: 'filipino', name: 'Filipino', emoji: '🍲', tint: 'from-yellow-400/25 to-sky-300/20', cover: 39 },
]

export const cuisineById = (id: CuisineId) => CUISINES.find((c) => c.id === id)!
