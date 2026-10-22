// Recalculates each built-in recipe's nutrition from its ingredients and prints a comparison.
//   node scripts/nutrition-report.ts           -> report only
//   node scripts/nutrition-report.ts --write   -> also update src/data/seedRecipes.ts
import { readFileSync, writeFileSync } from 'node:fs'
import { SEED_RECIPES } from '../src/data/seedRecipes.ts'
import { estimateNutrition } from '../workers/push/src/nutrition.ts'

const rows = SEED_RECIPES.map((r) => ({ r, n: estimateNutrition(r.ingredients, r.servings) }))
for (const { r, n } of rows) {
  const flag = n.coverage < 1 ? `  ?? ${n.unrecognised.join(' | ')}` : ''
  console.log(
    `${String(r.id).padStart(2)} ${r.name.padEnd(34).slice(0, 34)} s${r.servings}  was ${String(r.calories).padStart(4)}/${String(r.protein).padStart(2)}g  now ${String(n.calories).padStart(4)}kcal ${String(n.protein).padStart(3)}p ${String(n.carbs).padStart(3)}c ${String(n.fat).padStart(3)}f${flag}`,
  )
}

if (process.argv.includes('--write')) {
  let src = readFileSync('src/data/seedRecipes.ts', 'utf8')
  for (const { r, n } of rows) {
    const re = new RegExp(`(id: ${r.id}, [^]*?)calories: \\d+, protein: \\d+, carbs: \\d+, fat: \\d+`)
    src = src.replace(re, `$1calories: ${n.calories}, protein: ${n.protein}, carbs: ${n.carbs}, fat: ${n.fat}`)
    // keep the "High protein" / "Low carb" labels in step with the numbers
    const tags = r.tags.filter((t) => t !== 'high-protein' && t !== 'low-carb')
    if (n.protein >= 30) tags.unshift('high-protein')
    if (n.carbs <= 15) tags.push('low-carb')
    const tagRe = new RegExp(`(id: ${r.id}, [^]*?)tags: \\[[^\\]]*\\]`)
    src = src.replace(tagRe, `$1tags: [${tags.map((t) => `'${t}'`).join(', ')}]`)
  }
  writeFileSync('src/data/seedRecipes.ts', src)
  console.log('\nUpdated src/data/seedRecipes.ts')
}
