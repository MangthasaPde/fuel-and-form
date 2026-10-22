// Matches the ingredients you have at home against a recipe's ingredient lines.

const SYNONYMS: [RegExp, string][] = [
  [/\b(scallion|spring onion)\b/g, 'green onion'],
  [/\bcoriander\b/g, 'cilantro'],
  [/\baubergine\b/g, 'eggplant'],
  [/\bcourgette\b/g, 'zucchini'],
  [/\bprawn\b/g, 'shrimp'],
  [/\bcapsicum\b/g, 'bell pepper'],
  [/\b(minced beef|beef mince|mince)\b/g, 'ground beef'],
  [/\b(minced pork|pork mince)\b/g, 'ground pork'],
  [/\byoghurt\b/g, 'yogurt'],
  [/\b(garbanzo|chick pea)\b/g, 'chickpea'],
  [/\bkangkong\b/g, 'water spinach'],
  [/\b(calamansi|kalamansi)\b/g, 'lime'],
  [/\b(kecap manis)\b/g, 'sweet soy sauce'],
  [/\b(spaghetti|penne|fettuccine|linguine|macaroni|fusilli|rigatoni|tagliatelle)\b/g, '$1 pasta'],
  [/\b(vermicelli|udon|soba|ramen|kway teow|pancit canton)\b/g, '$1 noodle'],
  [/\b(jasmine|basmati|glutinous|sticky)\b/g, '$1 rice'],
]

// Things almost every kitchen has; optional via the "I have the basics" switch.
const BASIC_WORDS = new Set(
  'salt pepper black white ground water oil olive vegetable cooking sugar to taste and of pinch cold hot warm sea kosher freshly cracked frying sunflower canola neutral sesame for'.split(' '),
)
const UNIT_WORDS = new Set(
  'cup cups tbsp tbs tsp tablespoon tablespoons teaspoon teaspoons oz ounce ounces lb lbs pound pounds g kg ml l can cans clove cloves slice slices pack packs packet block handful pinch bunch stalk stalks large medium small whole piece pieces thumb sprig sprigs about'.split(' '),
)

const singular = (w: string) =>
  w.endsWith('ies') ? `${w.slice(0, -3)}y` : w.endsWith('oes') ? w.slice(0, -2) : /(ch|sh|x|ss)es$/.test(w) ? w.slice(0, -2) : w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w

/** Lowercase, no accents/punctuation/amounts, singular words, common synonyms unified. */
export function norm(text: string): string {
  let t = text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  t = t.replace(/\([^)]*\)/g, ' ').replace(/[^a-z\s]/g, ' ')
  t = t.split(/\s+/).filter((w) => w && !UNIT_WORDS.has(w)).map(singular).join(' ')
  for (const [re, to] of SYNONYMS) t = t.replace(re, to)
  return t.replace(/\s+/g, ' ').trim()
}

const isBasic = (line: string) => {
  const words = norm(line).split(' ').filter(Boolean)
  return words.length > 0 && words.every((w) => BASIC_WORDS.has(w))
}

/** "Lime, cilantro, sliced chili" or "1 tsp shrimp paste (optional)": nice to have, not needed. */
const isOptional = (line: string) => /optional|to serve|for serving|garnish/i.test(line) || (!/^\s*[\d½¼¾⅓⅔⅛]/.test(line) && line.includes(','))

function covers(line: string, term: string): boolean {
  const options = line.split(/\s+or\s+|\//).map((o) => ` ${norm(o)} `)
  return options.some((o) => o.includes(` ${term} `) && !(term === 'egg' && o.includes(' egg noodle ')))
}

export interface PantryMatch {
  have: string[]
  missing: string[]
}

export function matchIngredients(ingredients: string[], pantry: string[], assumeBasics: boolean): PantryMatch {
  const terms = pantry.map(norm).filter(Boolean)
  const have: string[] = []
  const missing: string[] = []
  for (const line of ingredients) {
    if (terms.some((t) => covers(line, t))) have.push(line)
    else if (isOptional(line) || (assumeBasics && isBasic(line))) continue
    else missing.push(line)
  }
  return { have, missing }
}

/** Short name for a missing ingredient: "2 tbsp fish sauce" -> "fish sauce". */
export const shortName = (line: string) =>
  line
    .replace(/\([^)]*\)/g, '')
    .split(',')[0]
    .replace(/^[\s\d½¼¾⅓⅔⅛/.-]+/, '')
    .split(' ')
    .filter((w) => !UNIT_WORDS.has(w.toLowerCase()))
    .join(' ')
    .trim()

export const PANTRY_SUGGESTIONS = [
  'chicken', 'eggs', 'rice', 'garlic', 'onion', 'tomato', 'pasta', 'noodles', 'beef', 'pork', 'shrimp', 'tofu',
  'potato', 'cheese', 'spinach', 'carrot', 'bell pepper', 'cabbage', 'mushrooms', 'coconut milk', 'soy sauce',
  'fish sauce', 'lime', 'lemon', 'ginger', 'bread', 'milk', 'butter', 'beans', 'peanut butter',
]
