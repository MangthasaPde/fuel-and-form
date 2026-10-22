import { test } from 'node:test'
import assert from 'node:assert/strict'
import { analyseLine, estimateNutrition } from '../src/nutrition.ts'

const grams = (line: string, servings = 1) => analyseLine(line, servings).parts.map((p) => [p.food.names[0], Math.round(p.grams)])
const near = (a: number, b: number, tol = 0.03) => assert.ok(Math.abs(a - b) <= Math.max(1, b * tol), `${a} vs ${b}`)

test('counts, units and fractions', () => {
  assert.deepEqual(grams('2 chicken breasts'), [['chicken breast', 400]])
  assert.deepEqual(grams('1 cup cooked rice'), [['cooked rice', 158]])
  assert.deepEqual(grams('6 oz spaghetti'), [['spaghetti', 170]])
  assert.deepEqual(grams('1 1/2 lb beef'), [['beef', 680]])
  assert.deepEqual(grams('1½ lb chicken thighs'), [['chicken thigh', 680]])
  assert.deepEqual(grams('½ can refried beans'), [['refried beans', 225]])
  assert.deepEqual(grams('2 tbs Soy Sauce'), [['soy sauce', 32]])
  assert.deepEqual(grams('4 cloves garlic, smashed'), [['garlic', 12]])
  assert.deepEqual(grams('1 large tomato, sliced'), [['tomato', 150]])
  assert.deepEqual(grams('2-3 eggs'), [['egg', 125]])
  assert.deepEqual(grams('200g basmati rice'), [['rice', 200]])
  assert.deepEqual(grams('1/2 cup milk'), [['milk', 122]])
  assert.deepEqual(grams('175g/6oz plain flour'), [['flour', 175]])
  assert.deepEqual(grams('650g/1lb 8 oz Small Potatoes'), [['potato', 650]])
  assert.deepEqual(grams('125g/4½oz caster sugar'), [['sugar', 125]])
  assert.deepEqual(grams('1 litre vegetable oil, for frying'), [['olive oil', 135]])
  assert.deepEqual(grams('6 cloves sliced Garlic'), [['garlic', 18]])
  assert.deepEqual(grams('8 Sun-Dried Tomatoes'), [['sun dried tomatoes', 48]])
})

test('longest name wins and options pick the first', () => {
  assert.deepEqual(grams('1 can coconut milk'), [['coconut milk', 400]])
  assert.deepEqual(grams('¾ cup coconut milk (light)'), [['light coconut milk', 180]])
  assert.deepEqual(grams('2 cups spinach or kale'), [['spinach', 60]])
  assert.deepEqual(grams('1 cup frozen peas & carrots'), [['peas and carrots', 140]])
  assert.deepEqual(grams('8 oz chicken or shrimp'), [['chicken', 227]])
})

test('lines without amounts use a typical serving', () => {
  assert.deepEqual(grams('Rice', 2), [['rice', 120]])
  assert.deepEqual(grams('Fried egg & rice to serve', 2), [['egg', 100], ['rice', 120]])
  const salt = analyseLine('Salt, pepper, chili flakes', 2)
  assert.equal(salt.seasoning, true)
  assert.ok(salt.parts.every((p) => p.grams === 0))
})

test('whole recipe per serving', () => {
  // 2 chicken breasts (480 kcal, 90 g protein) + 1 tbsp olive oil (119 kcal), serves 2
  const n = estimateNutrition(['2 chicken breasts', '1 tbsp olive oil', 'Salt, pepper'], 2)
  near(n.calories, 300, 0.05)
  assert.equal(n.protein, 45)
  assert.equal(n.coverage, 1)
  const odd = estimateNutrition(['2 chicken breasts', '1 jar mystery sauce xyz'], 2)
  assert.equal(odd.coverage, 0.5)
  assert.deepEqual(odd.unrecognised, ['1 jar mystery sauce xyz'])
})
