import { useState } from 'react'
import { cuisineById } from '../data/cuisines'
import { photoFor } from '../data/photos'
import type { Recipe } from '../types'

/** A recipe's photo. Recipes without one (or if it fails to load) show their emoji on a soft gradient. */
export default function RecipePhoto({
  recipe, className = '', emojiSize = 'text-5xl', eager,
}: { recipe: Recipe; className?: string; emojiSize?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  const src = photoFor(recipe.id)
  if (!src || failed) {
    return (
      <div className={`grid place-items-center bg-gradient-to-br ${cuisineById(recipe.cuisine).tint} ${className}`}>
        <span className={emojiSize}>{recipe.emoji}</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={recipe.name}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`bg-card2 object-cover ${className}`}
    />
  )
}
