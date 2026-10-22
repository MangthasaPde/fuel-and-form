import type { Recipe } from '../types'

// Easy starter recipes: every one is 30 minutes or less with a short ingredient list.
// Nutrition numbers are approximate, per serving.
export const SEED_RECIPES: Recipe[] = [
  // ---------- Italian ----------
  {
    id: 1, name: 'Garlic Lemon Shrimp Pasta', emoji: '🍝', cuisine: 'italian', mealTypes: ['lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 570, protein: 40, carbs: 68, fat: 16, tags: ['high-protein', 'quick'],
    ingredients: ['6 oz spaghetti', '10 oz shrimp, peeled', '3 cloves garlic, sliced', '1 lemon (zest + juice)', '2 tbsp olive oil', 'Handful of parsley', 'Salt, pepper, chili flakes'],
    steps: ['Boil pasta in salted water until al dente; save ½ cup pasta water.', 'Sauté garlic in olive oil for 1 minute, add shrimp and cook 2 minutes per side.', 'Toss in pasta, lemon zest, juice and a splash of pasta water.', 'Finish with parsley, salt, pepper and chili flakes.'],
  },
  {
    id: 2, name: 'Caprese Chicken', emoji: '🍅', cuisine: 'italian', mealTypes: ['dinner'],
    minutes: 25, servings: 2, calories: 500, protein: 58, carbs: 10, fat: 23, tags: ['high-protein', 'low-carb'],
    ingredients: ['2 chicken breasts', '1 large tomato, sliced', '4 oz fresh mozzarella', 'Fresh basil', '1 tbsp olive oil', '1 tbsp balsamic glaze', 'Salt, pepper, Italian seasoning'],
    steps: ['Season chicken with salt, pepper and Italian seasoning.', 'Sear in olive oil 5–6 minutes per side until cooked through.', 'Top with tomato and mozzarella, cover pan 2 minutes to melt.', 'Add basil and drizzle with balsamic glaze.'],
  },
  {
    id: 3, name: 'Pesto Egg Toast', emoji: '🍳', cuisine: 'italian', mealTypes: ['breakfast'],
    minutes: 10, servings: 1, calories: 350, protein: 20, carbs: 23, fat: 19, tags: ['quick', 'vegetarian'],
    ingredients: ['1 slice sourdough', '1 tbsp pesto', '2 eggs', 'Cherry tomatoes, halved', 'Parmesan'],
    steps: ['Toast the bread.', 'Fry eggs in a pan with a little pesto.', 'Spread remaining pesto on toast, top with eggs.', 'Add tomatoes and grated parmesan.'],
  },
  {
    id: 4, name: 'Tuscan White Bean Soup', emoji: '🥣', cuisine: 'italian', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 3, calories: 340, protein: 21, carbs: 48, fat: 8, tags: ['vegetarian'],
    ingredients: ['2 cans white beans, drained', '1 onion, diced', '3 cloves garlic', '4 cups veggie broth', '3 cups spinach or kale', '1 can diced tomatoes', 'Parmesan to serve', '1 tbsp olive oil'],
    steps: ['Sauté onion and garlic until soft.', 'Add beans, tomatoes and broth; simmer 15 minutes.', 'Stir in greens until wilted.', 'Season and top with parmesan.'],
  },

  // ---------- Mexican ----------
  {
    id: 5, name: 'Chicken Burrito Bowl', emoji: '🌯', cuisine: 'mexican', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 2, calories: 720, protein: 61, carbs: 73, fat: 21, tags: ['high-protein'],
    ingredients: ['2 chicken breasts', '1 cup cooked rice', '1 can black beans', '1 cup corn', 'Salsa', '1 avocado', '1 tbsp taco seasoning', 'Lime', '1 tsp oil'],
    steps: ['Season chicken with taco seasoning and cook 6 minutes per side.', 'Warm beans and corn.', 'Slice chicken and build bowls over rice.', 'Top with salsa, avocado and a squeeze of lime.'],
  },
  {
    id: 6, name: 'Huevos Rancheros', emoji: '🍳', cuisine: 'mexican', mealTypes: ['breakfast'],
    minutes: 15, servings: 2, calories: 450, protein: 25, carbs: 47, fat: 18, tags: ['vegetarian'],
    ingredients: ['4 small corn tortillas', '4 eggs', '1 cup salsa', '½ can refried beans', 'Cotija or feta', 'Cilantro', '1 tsp oil'],
    steps: ['Warm tortillas in a dry pan.', 'Warm beans and spread on tortillas.', 'Fry eggs and place on top.', 'Spoon over warm salsa; add cheese and cilantro.'],
  },
  {
    id: 7, name: 'Sheet-Pan Fajitas', emoji: '🫑', cuisine: 'mexican', mealTypes: ['dinner'],
    minutes: 30, servings: 3, calories: 700, protein: 40, carbs: 61, fat: 34, tags: ['high-protein'],
    ingredients: ['1 lb chicken strips', '3 bell peppers, sliced', '1 onion, sliced', '2 tbsp fajita seasoning', '2 tbsp oil', '6 tortillas', 'Sour cream / Greek yogurt'],
    steps: ['Heat oven to 425°F (220°C).', 'Toss chicken, peppers and onion with oil and seasoning on a sheet pan.', 'Roast 20 minutes.', 'Serve in warm tortillas with yogurt or sour cream.'],
  },
  {
    id: 8, name: 'Black Bean Quesadilla', emoji: '🧀', cuisine: 'mexican', mealTypes: ['lunch', 'snack'],
    minutes: 10, servings: 1, calories: 520, protein: 26, carbs: 50, fat: 24, tags: ['quick', 'vegetarian'],
    ingredients: ['1 large tortilla', '½ cup black beans, mashed', '½ cup shredded cheese', '2 tbsp salsa', 'Pinch of cumin'],
    steps: ['Spread beans on half the tortilla; sprinkle cumin.', 'Add cheese and salsa, fold over.', 'Cook in a pan 2–3 minutes per side until golden.', 'Cut into wedges.'],
  },

  // ---------- Chinese ----------
  {
    id: 9, name: 'Egg Fried Rice', emoji: '🍚', cuisine: 'chinese', mealTypes: ['lunch', 'dinner'],
    minutes: 15, servings: 2, calories: 550, protein: 20, carbs: 77, fat: 17, tags: ['quick', 'vegetarian'],
    ingredients: ['3 cups cold cooked rice', '3 eggs', '1 cup frozen peas & carrots', '3 green onions', '2 tbsp soy sauce', '1 tsp sesame oil', '1 tbsp oil'],
    steps: ['Scramble eggs in oil, set aside.', 'Stir-fry peas and carrots 2 minutes.', 'Add rice and fry until hot and slightly crispy.', 'Add eggs, soy sauce, sesame oil and green onions.'],
  },
  {
    id: 10, name: 'Beef & Broccoli', emoji: '🥦', cuisine: 'chinese', mealTypes: ['dinner'],
    minutes: 20, servings: 2, calories: 350, protein: 36, carbs: 13, fat: 18, tags: ['high-protein', 'low-carb'],
    ingredients: ['10 oz flank steak, thinly sliced', '3 cups broccoli florets', '3 tbsp soy sauce', '1 tbsp oyster sauce', '1 tsp cornstarch', '2 cloves garlic', '1 tsp ginger', '1 tbsp oil'],
    steps: ['Mix soy, oyster sauce, cornstarch and 3 tbsp water.', 'Sear beef in a hot pan 2 minutes, remove.', 'Stir-fry broccoli with garlic and ginger 3 minutes.', 'Return beef, add sauce, toss until glossy.'],
  },
  {
    id: 11, name: 'Kung Pao Chicken', emoji: '🌶️', cuisine: 'chinese', mealTypes: ['dinner'],
    minutes: 25, servings: 2, calories: 450, protein: 52, carbs: 13, fat: 22, tags: ['high-protein', 'low-carb'],
    ingredients: ['2 chicken breasts, cubed', '¼ cup peanuts', '6 dried chilies', '1 bell pepper', '2 tbsp soy sauce', '1 tbsp rice vinegar', '1 tsp sugar', '1 tsp cornstarch', '1 tbsp oil'],
    steps: ['Mix soy, vinegar, sugar and cornstarch.', 'Stir-fry chicken until golden.', 'Add chilies, pepper and peanuts for 1 minute.', 'Pour in sauce and toss to coat.'],
  },
  {
    id: 12, name: 'Tomato Egg Stir-Fry', emoji: '🍅', cuisine: 'chinese', mealTypes: ['breakfast', 'lunch'],
    minutes: 10, servings: 2, calories: 250, protein: 14, carbs: 12, fat: 17, tags: ['quick', 'vegetarian', 'low-carb'],
    ingredients: ['4 eggs', '3 tomatoes, wedged', '1 tsp sugar', '1 tbsp ketchup', 'Green onion', '1 tbsp oil', 'Salt'],
    steps: ['Softly scramble eggs in oil, remove.', 'Cook tomatoes with sugar and ketchup until saucy.', 'Return eggs and fold together.', 'Top with green onion; great over rice.'],
  },

  // ---------- Japanese ----------
  {
    id: 13, name: 'Teriyaki Salmon Bowl', emoji: '🍣', cuisine: 'japanese', mealTypes: ['lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 710, protein: 42, carbs: 51, fat: 37, tags: ['high-protein'],
    ingredients: ['2 salmon fillets', '¼ cup teriyaki sauce', '1½ cups cooked rice', '1 cucumber', '1 avocado', 'Sesame seeds', 'Green onion', '1 tsp oil'],
    steps: ['Sear salmon skin-side down 4 minutes, flip 3 minutes.', 'Pour in teriyaki and glaze for 1 minute.', 'Slice cucumber and avocado.', 'Serve salmon over rice with toppings and sesame.'],
  },
  {
    id: 14, name: 'Chicken Katsu (Air-Fryer)', emoji: '🍗', cuisine: 'japanese', mealTypes: ['dinner'],
    minutes: 25, servings: 2, calories: 640, protein: 42, carbs: 94, fat: 9, tags: ['high-protein'],
    ingredients: ['2 thin chicken cutlets', '1 egg, beaten', '1 cup panko', '2 tbsp flour', 'Tonkatsu sauce', 'Shredded cabbage', 'Rice'],
    steps: ['Coat chicken in flour, egg, then panko.', 'Spray with oil and air-fry at 400°F (200°C) for 12 minutes, flipping halfway.', 'Slice into strips.', 'Serve with cabbage, rice and tonkatsu sauce.'],
  },
  {
    id: 15, name: 'Miso Soup with Tofu', emoji: '🍵', cuisine: 'japanese', mealTypes: ['breakfast', 'snack'],
    minutes: 10, servings: 2, calories: 80, protein: 6, carbs: 7, fat: 3, tags: ['quick', 'vegetarian', 'low-carb'],
    ingredients: ['3 cups water or dashi', '2 tbsp white miso', '½ block silken tofu, cubed', '1 tbsp dried wakame', 'Green onion'],
    steps: ['Bring water to a gentle simmer; add wakame.', 'Whisk miso with a little hot water, stir in.', 'Add tofu and warm 2 minutes (don\'t boil).', 'Top with green onion.'],
  },
  {
    id: 16, name: 'Yaki Udon', emoji: '🍜', cuisine: 'japanese', mealTypes: ['lunch', 'dinner'],
    minutes: 15, servings: 2, calories: 480, protein: 25, carbs: 55, fat: 16, tags: ['quick'],
    ingredients: ['2 packs udon noodles', '6 oz chicken or shrimp', '2 cups cabbage, sliced', '1 carrot, julienned', '2 tbsp soy sauce', '1 tbsp mirin', '1 tsp sesame oil', '1 tbsp oil'],
    steps: ['Loosen udon in hot water, drain.', 'Stir-fry protein until cooked, add veggies 2 minutes.', 'Add udon, soy, mirin and sesame oil.', 'Toss 2 minutes until coated.'],
  },

  // ---------- Thai ----------
  {
    id: 17, name: 'Thai Basil Chicken', emoji: '🌿', cuisine: 'thai', mealTypes: ['lunch', 'dinner'],
    minutes: 15, servings: 2, calories: 710, protein: 51, carbs: 55, fat: 30, tags: ['high-protein', 'quick'],
    ingredients: ['1 lb ground chicken', '4 cloves garlic', '2 Thai chilies', '1 cup Thai basil', '2 tbsp oyster sauce', '1 tbsp soy sauce', '1 tsp sugar', 'Fried egg & rice to serve', '1 tbsp oil'],
    steps: ['Fry garlic and chilies 30 seconds.', 'Add chicken, break up and cook through.', 'Stir in sauces and sugar.', 'Fold in basil; serve over rice with a fried egg.'],
  },
  {
    id: 18, name: 'Easy Pad Thai', emoji: '🍜', cuisine: 'thai', mealTypes: ['dinner'],
    minutes: 25, servings: 2, calories: 650, protein: 39, carbs: 83, fat: 18, tags: ['high-protein'],
    ingredients: ['6 oz rice noodles', '8 oz shrimp or tofu', '2 eggs', '1 cup bean sprouts', '3 tbsp pad thai sauce', 'Crushed peanuts', 'Lime, green onion', '1 tbsp oil'],
    steps: ['Soak noodles in hot water 8 minutes, drain.', 'Cook shrimp/tofu, push aside and scramble eggs.', 'Add noodles and sauce; toss 2 minutes.', 'Add sprouts, top with peanuts, lime and green onion.'],
  },
  {
    id: 19, name: 'Green Curry', emoji: '🍛', cuisine: 'thai', mealTypes: ['dinner'],
    minutes: 25, servings: 3, calories: 700, protein: 38, carbs: 58, fat: 36, tags: ['high-protein'],
    ingredients: ['1 lb chicken thigh, sliced', '2 tbsp green curry paste', '1 can coconut milk', '1 zucchini', '1 bell pepper', '1 tbsp fish sauce', 'Thai basil', 'Rice'],
    steps: ['Fry curry paste in a splash of coconut milk 1 minute.', 'Add chicken and cook 5 minutes.', 'Pour in remaining coconut milk and veggies; simmer 10 minutes.', 'Season with fish sauce, add basil, serve with rice.'],
  },
  {
    id: 20, name: 'Mango Sticky Rice Oats', emoji: '🥭', cuisine: 'thai', mealTypes: ['breakfast'],
    minutes: 10, servings: 1, calories: 380, protein: 8, carbs: 52, fat: 17, tags: ['quick', 'vegetarian'],
    ingredients: ['½ cup rolled oats', '¾ cup coconut milk (light)', '½ mango, diced', '1 tsp honey', 'Toasted sesame seeds'],
    steps: ['Simmer oats in coconut milk 5 minutes.', 'Stir in honey.', 'Top with mango and sesame seeds.'],
  },

  // ---------- Indian ----------
  {
    id: 21, name: 'Quick Chicken Tikka Masala', emoji: '🍛', cuisine: 'indian', mealTypes: ['dinner'],
    minutes: 30, servings: 3, calories: 650, protein: 42, carbs: 64, fat: 24, tags: ['high-protein'],
    ingredients: ['1 lb chicken breast, cubed', '2 tbsp tikka masala paste', '1 can crushed tomatoes', '½ cup cream or coconut milk', '1 onion, diced', '2 cloves garlic', 'Cilantro, rice or naan', '1 tbsp oil'],
    steps: ['Sauté onion and garlic until soft.', 'Add chicken and paste; cook 5 minutes.', 'Add tomatoes; simmer 15 minutes.', 'Stir in cream, top with cilantro, serve with rice or naan.'],
  },
  {
    id: 22, name: 'Chana Masala', emoji: '🫘', cuisine: 'indian', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 3, calories: 350, protein: 16, carbs: 55, fat: 9, tags: ['vegetarian'],
    ingredients: ['2 cans chickpeas', '1 onion', '1 can diced tomatoes', '2 tsp garam masala', '1 tsp cumin', '1 tbsp ginger-garlic paste', 'Lemon, cilantro', '1 tbsp oil'],
    steps: ['Sauté onion until golden, add ginger-garlic and spices.', 'Add tomatoes and chickpeas.', 'Simmer 15 minutes, mashing a few chickpeas.', 'Finish with lemon and cilantro.'],
  },
  {
    id: 23, name: 'Masala Omelette', emoji: '🍳', cuisine: 'indian', mealTypes: ['breakfast'],
    minutes: 10, servings: 1, calories: 280, protein: 20, carbs: 7, fat: 19, tags: ['quick', 'vegetarian', 'low-carb'],
    ingredients: ['3 eggs', '¼ onion, finely chopped', '½ tomato, chopped', '1 green chili', 'Cilantro', '¼ tsp turmeric', 'Salt', '1 tsp oil'],
    steps: ['Whisk eggs with everything.', 'Pour into a hot oiled pan.', 'Cook 2 minutes, fold and cook 1 more minute.'],
  },
  {
    id: 24, name: 'Dal Tadka', emoji: '🥣', cuisine: 'indian', mealTypes: ['lunch', 'dinner'],
    minutes: 30, servings: 3, calories: 280, protein: 16, carbs: 43, fat: 6, tags: ['vegetarian'],
    ingredients: ['1 cup red lentils', '3 cups water', '½ tsp turmeric', '1 tsp cumin seeds', '2 cloves garlic', '1 tomato', '1 tbsp ghee or oil'],
    steps: ['Simmer lentils with water and turmeric 20 minutes.', 'In a small pan, fry cumin seeds and garlic in ghee.', 'Add tomato for 2 minutes.', 'Pour the tadka over the dal and season.'],
  },

  // ---------- Korean ----------
  {
    id: 25, name: 'Beef Bulgogi Bowl', emoji: '🥩', cuisine: 'korean', mealTypes: ['dinner'],
    minutes: 20, servings: 2, calories: 640, protein: 34, carbs: 64, fat: 27, tags: ['high-protein'],
    ingredients: ['10 oz thin-sliced beef', '3 tbsp soy sauce', '1 tbsp brown sugar', '1 tbsp sesame oil', '½ grated pear or apple', '2 cloves garlic', 'Rice, green onion, sesame'],
    steps: ['Mix soy, sugar, sesame oil, pear and garlic; toss with beef.', 'Sear beef in a very hot pan 3–4 minutes.', 'Serve over rice.', 'Top with green onion and sesame.'],
  },
  {
    id: 26, name: 'Kimchi Fried Rice', emoji: '🍚', cuisine: 'korean', mealTypes: ['lunch', 'dinner'],
    minutes: 15, servings: 2, calories: 390, protein: 12, carbs: 51, fat: 15, tags: ['quick'],
    ingredients: ['2 cups cold cooked rice', '1 cup kimchi, chopped', '2 tbsp kimchi juice', '1 tbsp gochujang', '2 eggs', '1 tsp sesame oil', 'Seaweed strips', '1 tbsp oil'],
    steps: ['Fry kimchi 2 minutes.', 'Add rice, gochujang and kimchi juice; fry until hot.', 'Drizzle sesame oil.', 'Top each bowl with a fried egg and seaweed.'],
  },
  {
    id: 27, name: 'Korean Egg Roll (Gyeran-mari)', emoji: '🥚', cuisine: 'korean', mealTypes: ['breakfast', 'snack'],
    minutes: 10, servings: 1, calories: 270, protein: 19, carbs: 4, fat: 19, tags: ['quick', 'vegetarian', 'low-carb'],
    ingredients: ['3 eggs', '2 tbsp finely chopped carrot', '1 green onion, chopped', 'Pinch of salt', '1 tsp oil'],
    steps: ['Whisk eggs with veggies and salt.', 'Pour a thin layer into an oiled pan; roll when nearly set.', 'Add more egg, letting it join the roll; repeat.', 'Rest 1 minute and slice.'],
  },
  {
    id: 28, name: 'Gochujang Chicken', emoji: '🌶️', cuisine: 'korean', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 2, calories: 640, protein: 51, carbs: 67, fat: 18, tags: ['high-protein'],
    ingredients: ['1 lb chicken thighs', '2 tbsp gochujang', '1 tbsp honey', '1 tbsp soy sauce', '2 cloves garlic', 'Sesame seeds', 'Rice', '1 tbsp oil'],
    steps: ['Mix gochujang, honey, soy and garlic.', 'Pan-sear chicken 5 minutes per side.', 'Add sauce and simmer 2 minutes to glaze.', 'Slice, sprinkle sesame, serve with rice.'],
  },

  // ---------- Mediterranean ----------
  {
    id: 29, name: 'Greek Chicken Pita', emoji: '🥙', cuisine: 'mediterranean', mealTypes: ['lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 570, protein: 55, carbs: 46, fat: 18, tags: ['high-protein'],
    ingredients: ['2 chicken breasts', '2 pitas', '½ cup tzatziki', '1 tomato', '½ cucumber', '¼ red onion', '1 tsp oregano', '1 lemon', '1 tbsp olive oil'],
    steps: ['Season chicken with oregano, lemon, salt and pepper.', 'Cook 6 minutes per side and slice.', 'Warm pitas.', 'Fill with chicken, veggies and tzatziki.'],
  },
  {
    id: 30, name: 'Shakshuka', emoji: '🍳', cuisine: 'mediterranean', mealTypes: ['breakfast', 'lunch'],
    minutes: 20, servings: 2, calories: 460, protein: 23, carbs: 46, fat: 22, tags: ['vegetarian'],
    ingredients: ['4 eggs', '1 can crushed tomatoes', '1 bell pepper, diced', '1 onion, diced', '1 tsp cumin', '1 tsp paprika', 'Feta, parsley, bread', '1 tbsp olive oil'],
    steps: ['Sauté onion and pepper 5 minutes; add spices.', 'Add tomatoes and simmer 5 minutes.', 'Make wells and crack in eggs; cover 5–7 minutes.', 'Top with feta and parsley; serve with bread.'],
  },
  {
    id: 31, name: 'Lemon Herb Salmon & Couscous', emoji: '🐟', cuisine: 'mediterranean', mealTypes: ['dinner'],
    minutes: 20, servings: 2, calories: 680, protein: 43, carbs: 56, fat: 29, tags: ['high-protein'],
    ingredients: ['2 salmon fillets', '¾ cup couscous', '1 lemon', '1 tbsp olive oil', 'Fresh dill or parsley', 'Cherry tomatoes', 'Garlic'],
    steps: ['Pour boiling water over couscous, cover 5 minutes.', 'Sear salmon with garlic 4 minutes per side.', 'Squeeze lemon over salmon.', 'Fluff couscous with herbs and tomatoes; serve together.'],
  },
  {
    id: 32, name: 'Hummus Power Plate', emoji: '🫓', cuisine: 'mediterranean', mealTypes: ['lunch', 'snack'],
    minutes: 10, servings: 1, calories: 460, protein: 19, carbs: 59, fat: 18, tags: ['quick', 'vegetarian'],
    ingredients: ['½ cup hummus', '1 whole-wheat pita', 'Cucumber, carrots, cherry tomatoes', 'Handful of olives', '2 tbsp feta'],
    steps: ['Spread hummus on a plate.', 'Cut veggies and pita into dippers.', 'Add olives and feta; drizzle olive oil.'],
  },

  // ---------- American ----------
  {
    id: 33, name: 'Turkey Burger', emoji: '🍔', cuisine: 'american', mealTypes: ['lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 490, protein: 38, carbs: 36, fat: 21, tags: ['high-protein'],
    ingredients: ['10 oz ground turkey', '2 burger buns', '2 slices cheese', 'Lettuce, tomato, onion', '1 tsp garlic powder', 'Salt, pepper', 'Ketchup / mustard'],
    steps: ['Season turkey and form 2 patties.', 'Cook 5 minutes per side; add cheese at the end.', 'Toast buns.', 'Build burgers with toppings.'],
  },
  {
    id: 34, name: 'Protein Pancakes', emoji: '🥞', cuisine: 'american', mealTypes: ['breakfast'],
    minutes: 15, servings: 2, calories: 450, protein: 23, carbs: 69, fat: 9, tags: ['vegetarian'],
    ingredients: ['1 cup pancake mix', '1 scoop protein powder', '1 egg', '¾ cup milk', 'Berries', 'Maple syrup'],
    steps: ['Whisk mix, protein powder, egg and milk.', 'Pour ¼ cup batches into a hot pan.', 'Flip when bubbles form.', 'Top with berries and syrup.'],
  },
  {
    id: 35, name: 'BBQ Chicken Sheet Pan', emoji: '🍗', cuisine: 'american', mealTypes: ['dinner'],
    minutes: 30, servings: 3, calories: 440, protein: 38, carbs: 51, fat: 9, tags: ['high-protein'],
    ingredients: ['1 lb chicken breast', '½ cup BBQ sauce', '2 sweet potatoes, cubed', '2 cups green beans', '1 tbsp olive oil', 'Salt, pepper, paprika'],
    steps: ['Heat oven to 425°F (220°C).', 'Toss sweet potatoes with oil and roast 10 minutes.', 'Add chicken brushed with BBQ sauce and green beans.', 'Roast 18 more minutes.'],
  },
  {
    id: 36, name: 'Cobb Salad', emoji: '🥗', cuisine: 'american', mealTypes: ['lunch'],
    minutes: 15, servings: 2, calories: 430, protein: 34, carbs: 10, fat: 29, tags: ['high-protein', 'low-carb'],
    ingredients: ['Romaine lettuce', '1 cooked chicken breast', '2 hard-boiled eggs', '2 slices bacon', '1 avocado', 'Cherry tomatoes', 'Ranch or vinaigrette'],
    steps: ['Chop lettuce and arrange in a bowl.', 'Line up chicken, eggs, bacon, avocado and tomatoes in rows.', 'Drizzle dressing.'],
  },

  // ---------- Filipino ----------
  {
    id: 37, name: 'Chicken Adobo', emoji: '🍗', cuisine: 'filipino', mealTypes: ['dinner'],
    minutes: 30, servings: 3, calories: 520, protein: 51, carbs: 51, fat: 10, tags: ['high-protein'],
    ingredients: ['1½ lb chicken thighs', '⅓ cup soy sauce', '⅓ cup vinegar', '6 cloves garlic, smashed', '3 bay leaves', '1 tsp peppercorns', 'Rice'],
    steps: ['Brown chicken in a pan 3 minutes per side.', 'Add soy, vinegar, garlic, bay leaves and pepper.', 'Simmer covered 15 minutes, then uncovered 5 to thicken.', 'Serve with rice.'],
  },
  {
    id: 38, name: 'Tapsilog', emoji: '🍳', cuisine: 'filipino', mealTypes: ['breakfast'],
    minutes: 20, servings: 2, calories: 600, protein: 34, carbs: 54, fat: 27, tags: ['high-protein'],
    ingredients: ['8 oz thin beef slices', '2 tbsp soy sauce', '1 tbsp sugar', '4 cloves garlic', '2 cups cooked rice', '2 eggs', '1 tbsp oil'],
    steps: ['Marinate beef in soy, sugar and half the garlic for 5 minutes.', 'Fry remaining garlic in oil, add rice to make garlic rice.', 'Sear beef 3 minutes.', 'Fry eggs; serve beef, rice and egg together.'],
  },
  {
    id: 39, name: 'Pancit Canton', emoji: '🍜', cuisine: 'filipino', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 3, calories: 490, protein: 29, carbs: 62, fat: 14, tags: [],
    ingredients: ['8 oz pancit canton noodles', '8 oz chicken or shrimp', '2 cups cabbage', '1 carrot', '3 tbsp soy sauce', '1 tbsp oyster sauce', '1½ cups broth', 'Calamansi or lemon', '1 tbsp oil'],
    steps: ['Sauté protein until cooked, add veggies 2 minutes.', 'Add broth, soy and oyster sauce; bring to a boil.', 'Add noodles and toss until liquid is absorbed.', 'Serve with calamansi.'],
  },
  {
    id: 40, name: 'Ginisang Monggo', emoji: '🥣', cuisine: 'filipino', mealTypes: ['lunch'],
    minutes: 30, servings: 3, calories: 350, protein: 26, carbs: 50, fat: 6, tags: [],
    ingredients: ['1 cup mung beans (pre-soaked or canned)', '4 oz shrimp or pork', '1 tomato', '1 onion', '3 cloves garlic', '2 cups spinach', '3 cups water', 'Fish sauce', '1 tbsp oil'],
    steps: ['Simmer mung beans in water until soft (skip if canned).', 'Sauté garlic, onion, tomato and protein.', 'Add beans and simmer 10 minutes.', 'Stir in spinach and season with fish sauce.'],
  },

  // ---------- Vietnamese ----------
  {
    id: 41, name: 'Quick Chicken Pho (Phở Gà)', emoji: '🍜', cuisine: 'vietnamese', mealTypes: ['breakfast', 'lunch', 'dinner'],
    minutes: 30, servings: 2, calories: 410, protein: 33, carbs: 59, fat: 4, tags: ['high-protein'],
    ingredients: ['4 cups chicken broth', '1 chicken breast', '1 small onion, halved', '1 tbsp sliced ginger', '1 star anise', '1 cinnamon stick', '1 tbsp fish sauce', '1 tsp sugar', '4 oz rice noodles', '1 cup bean sprouts', 'Thai basil, lime, sliced chili'],
    steps: ['Char the onion and ginger in a dry pot for 3 minutes.', 'Add broth, star anise, cinnamon and the chicken; simmer 15 minutes.', 'Lift out the chicken and shred it. Season the broth with fish sauce and sugar.', 'Soak the noodles in hot water, divide into bowls, top with chicken and ladle over the broth.', 'Finish with bean sprouts, basil, lime and chili.'],
  },
  {
    id: 42, name: 'Fresh Spring Rolls (Gỏi Cuốn)', emoji: '🥬', cuisine: 'vietnamese', mealTypes: ['lunch', 'snack'],
    minutes: 25, servings: 2, calories: 450, protein: 31, carbs: 68, fat: 6, tags: ['high-protein'],
    ingredients: ['8 rice paper wrappers', '8 oz cooked shrimp, halved', '2 oz rice vermicelli', '1 cup lettuce', '1 carrot, julienned', '½ cucumber, julienned', 'Mint and cilantro', '3 tbsp hoisin sauce', '1 tbsp peanut butter'],
    steps: ['Cook the vermicelli for 3 minutes, then rinse in cold water.', 'Dip one rice paper in warm water for 5 seconds and lay it flat.', 'Add lettuce, noodles, carrot, cucumber, herbs and 2 shrimp halves; fold the sides and roll tightly.', 'Stir hoisin, peanut butter and a splash of water together for dipping.'],
  },
  {
    id: 43, name: 'Chicken Banh Mi', emoji: '🥖', cuisine: 'vietnamese', mealTypes: ['breakfast', 'lunch'],
    minutes: 20, servings: 2, calories: 690, protein: 40, carbs: 87, fat: 20, tags: ['high-protein'],
    ingredients: ['2 small baguettes (about 300 g)', '1 chicken breast', '1 tbsp soy sauce', '1 tsp sugar', '1 carrot, julienned', '½ cucumber, sliced', '2 tbsp rice vinegar', '2 tbsp mayonnaise', '1 tsp sriracha', 'Cilantro, sliced chili', '1 tsp oil'],
    steps: ['Toss the carrot with rice vinegar and a pinch of sugar to quick-pickle for 10 minutes.', 'Slice the chicken thinly, toss with soy sauce and sugar, and pan-fry in oil for 3 minutes per side.', 'Mix mayonnaise with sriracha.', 'Toast the baguettes, spread with spicy mayo, and fill with chicken, pickled carrot, cucumber, cilantro and chili.'],
  },
  {
    id: 44, name: 'Bún Thịt Nướng (Pork Noodle Bowl)', emoji: '🍜', cuisine: 'vietnamese', mealTypes: ['lunch', 'dinner'],
    minutes: 30, servings: 2, calories: 750, protein: 33, carbs: 70, fat: 38, tags: ['high-protein'],
    ingredients: ['10 oz pork shoulder, thinly sliced', '3 tbsp fish sauce, divided', '2 tbsp sugar, divided', '2 cloves garlic, minced', '1 stalk lemongrass, minced', '4 oz rice vermicelli', '2 tbsp lime juice', '1 cup lettuce', '1 cucumber, sliced', 'Mint, crushed peanuts', '1 tbsp oil'],
    steps: ['Marinate the pork with 1 tbsp fish sauce, 1 tbsp sugar, garlic and lemongrass for 10 minutes.', 'Cook the vermicelli, rinse and drain.', 'Sear the pork in oil over high heat for 4–5 minutes until caramelised.', 'Stir the rest of the fish sauce and sugar with lime juice and 3 tbsp water for the dressing.', 'Build bowls of noodles, lettuce, cucumber and pork; top with mint, peanuts and dressing.'],
  },

  // ---------- Indonesian ----------
  {
    id: 45, name: 'Nasi Goreng', emoji: '🍳', cuisine: 'indonesian', mealTypes: ['breakfast', 'lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 660, protein: 32, carbs: 90, fat: 17, tags: ['high-protein'],
    ingredients: ['3 cups cold cooked rice', '6 oz chicken thigh, diced', '2 shallots, sliced', '2 cloves garlic, minced', '1 red chili, sliced', '2 tbsp sweet soy sauce (kecap manis)', '1 tsp shrimp paste (optional)', '2 eggs', '1 tbsp oil', 'Cucumber, tomato, fried shallots'],
    steps: ['Fry shallots, garlic, chili and shrimp paste in oil for 1 minute.', 'Add the chicken and cook through, about 5 minutes.', 'Add the rice and sweet soy sauce; stir-fry until hot and glossy.', 'Fry the eggs and serve on top with cucumber, tomato and fried shallots.'],
  },
  {
    id: 46, name: 'Chicken Satay with Peanut Sauce', emoji: '🍢', cuisine: 'indonesian', mealTypes: ['lunch', 'dinner', 'snack'],
    minutes: 30, servings: 3, calories: 490, protein: 37, carbs: 19, fat: 30, tags: ['high-protein'],
    ingredients: ['1 lb chicken thigh, cut into strips', '2 tbsp sweet soy sauce', '1 tsp turmeric', '1 clove garlic, grated', '1 tbsp oil', '¼ cup peanut butter', '½ cup coconut milk', '1 tbsp soy sauce', '1 tsp sambal oelek', '1 tsp lime juice', 'Cucumber, red onion'],
    steps: ['Toss the chicken with sweet soy sauce, turmeric, garlic and oil; rest 10 minutes.', 'Thread onto skewers and grill or pan-fry 4 minutes per side.', 'Simmer peanut butter, coconut milk, soy sauce, sambal and lime for 3 minutes, stirring.', 'Serve the skewers with peanut sauce, cucumber and red onion.'],
  },
  {
    id: 47, name: 'Gado-Gado', emoji: '🥗', cuisine: 'indonesian', mealTypes: ['lunch'],
    minutes: 25, servings: 2, calories: 740, protein: 40, carbs: 60, fat: 43, tags: ['high-protein', 'vegetarian'],
    ingredients: ['2 eggs', '2 small potatoes', '1 cup green beans', '1 cup bean sprouts', '½ block firm tofu', '1 cucumber, sliced', '1 cup shredded cabbage', '¼ cup peanut butter', '¼ cup coconut milk', '1 tbsp sweet soy sauce', '1 tsp sambal oelek', '1 tbsp lime juice', '1 tbsp oil'],
    steps: ['Boil the potatoes for 12 minutes and the eggs for 8; blanch beans and sprouts for 2 minutes.', 'Cube the tofu and pan-fry in oil until golden.', 'Whisk peanut butter, coconut milk, sweet soy sauce, sambal, lime and a little hot water into a sauce.', 'Arrange everything on plates and pour over the peanut sauce.'],
  },
  {
    id: 48, name: 'Mie Goreng', emoji: '🍜', cuisine: 'indonesian', mealTypes: ['lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 740, protein: 43, carbs: 97, fat: 20, tags: ['high-protein'],
    ingredients: ['7 oz egg noodles', '6 oz chicken breast, sliced', '2 cups bok choy', '1 carrot, sliced', '2 cloves garlic', '2 shallots, sliced', '2 tbsp sweet soy sauce', '1 tbsp soy sauce', '1 tbsp oyster sauce', '1 tsp sambal oelek', '2 eggs', '1 tbsp oil', 'Fried shallots, lime'],
    steps: ['Cook the noodles, drain and rinse.', 'Fry garlic and shallots in oil, add chicken and cook 4 minutes.', 'Push aside, scramble the eggs, then add carrot and bok choy for 2 minutes.', 'Add noodles, sauces and sambal; toss until coated. Top with fried shallots and lime.'],
  },

  // ---------- Malaysian ----------
  {
    id: 49, name: 'Nasi Lemak', emoji: '🍚', cuisine: 'malaysian', mealTypes: ['breakfast', 'lunch'],
    minutes: 30, servings: 2, calories: 820, protein: 25, carbs: 90, fat: 41, tags: [],
    ingredients: ['1 cup jasmine rice', '¾ cup coconut milk', '½ cup water', '1 pandan leaf (optional)', '2 eggs', '¼ cup roasted peanuts', '¼ cup dried anchovies', '3 tbsp sambal', '1 cucumber, sliced', '1 tbsp oil'],
    steps: ['Cook the rice with coconut milk, water, a pinch of salt and the pandan leaf (rice cooker, or simmer covered 18 minutes).', 'Boil the eggs for 7–8 minutes, then peel and halve.', 'Fry the anchovies and peanuts in oil until crisp.', 'Serve the rice with sambal, egg, cucumber, anchovies and peanuts.'],
  },
  {
    id: 50, name: 'Curry Laksa', emoji: '🍜', cuisine: 'malaysian', mealTypes: ['lunch', 'dinner'],
    minutes: 30, servings: 2, calories: 870, protein: 60, carbs: 62, fat: 45, tags: ['high-protein'],
    ingredients: ['3 tbsp laksa paste', '1 cup coconut milk', '2 cups chicken broth', '8 oz chicken thigh, sliced', '6 oz shrimp', '4 oz rice vermicelli', '4 oz tofu puffs', '1 cup bean sprouts', '1 tbsp fish sauce', '1 tsp sugar', '1 tbsp oil', 'Lime, cilantro, sliced chili'],
    steps: ['Fry the laksa paste in oil for 1 minute until fragrant.', 'Add broth and coconut milk; bring to a simmer.', 'Add chicken for 6 minutes, then shrimp and tofu puffs for 2 minutes. Season with fish sauce and sugar.', 'Pour over cooked vermicelli and bean sprouts; top with lime, cilantro and chili.'],
  },
  {
    id: 51, name: 'Char Kway Teow', emoji: '🥢', cuisine: 'malaysian', mealTypes: ['dinner'],
    minutes: 20, servings: 2, calories: 650, protein: 40, carbs: 60, fat: 28, tags: ['high-protein'],
    ingredients: ['14 oz fresh flat rice noodles', '8 oz shrimp', '1 Chinese sausage, sliced', '2 eggs', '1 cup bean sprouts', '3 green onions, cut into lengths', '2 cloves garlic, minced', '1 tbsp dark soy sauce', '1 tbsp light soy sauce', '1 tbsp oyster sauce', '1 tsp sambal oelek', '2 tbsp oil'],
    steps: ['Mix the soy sauces, oyster sauce and sambal.', 'Fry garlic, sausage and shrimp in very hot oil for 2 minutes.', 'Add the noodles and sauce; toss until charred in spots.', 'Push aside, scramble in the eggs, then toss with bean sprouts and green onions for 1 minute.'],
  },
  {
    id: 52, name: 'Kaya Toast & Soft Eggs', emoji: '🍞', cuisine: 'malaysian', mealTypes: ['breakfast'],
    minutes: 10, servings: 1, calories: 490, protein: 21, carbs: 50, fat: 22, tags: ['quick', 'vegetarian'],
    ingredients: ['2 slices white bread', '1 tbsp kaya (coconut jam)', '10 g cold butter, thinly sliced', '2 eggs', '1 tsp soy sauce', 'Pinch of white pepper'],
    steps: ['Lower the eggs into just-boiled water, turn off the heat and cover for 6–7 minutes.', 'Toast the bread, spread with kaya and sandwich with thin slices of cold butter.', 'Crack the eggs into a small bowl and season with soy sauce and white pepper.', 'Dip the toast into the soft eggs.'],
  },

  // ---------- More Thai ----------
  {
    id: 53, name: 'Tom Yum Soup with Shrimp', emoji: '🦐', cuisine: 'thai', mealTypes: ['lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 180, protein: 30, carbs: 13, fat: 2, tags: ['high-protein', 'low-carb'],
    ingredients: ['3 cups chicken broth', '8 oz shrimp', '1 stalk lemongrass, bruised', '4 slices galangal or ginger', '4 kaffir lime leaves', '1 cup mushrooms', '1 tomato, wedged', '2 tbsp fish sauce', '2 tbsp lime juice', '1 tbsp chili paste', 'Cilantro, Thai chilies'],
    steps: ['Simmer broth with lemongrass, galangal and lime leaves for 5 minutes.', 'Add mushrooms and tomato for 3 minutes.', 'Add the shrimp and cook 2 minutes until pink.', 'Turn off the heat; stir in fish sauce, lime juice and chili paste. Top with cilantro and chilies.'],
  },
  {
    id: 54, name: 'Larb Gai (Thai Chicken Salad)', emoji: '🥗', cuisine: 'thai', mealTypes: ['lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 610, protein: 46, carbs: 63, fat: 19, tags: ['high-protein'],
    ingredients: ['1 lb ground chicken', '2 tbsp fish sauce', '2 tbsp lime juice', '1 tbsp toasted rice powder', '2 shallots, thinly sliced', '3 green onions, sliced', 'Mint, cilantro', '1 tsp chili flakes', 'Lettuce cups', 'Cooked sticky rice to serve'],
    steps: ['Cook the chicken with 3 tbsp water over medium heat, breaking it up, for 6 minutes.', 'Take off the heat; stir in fish sauce, lime juice, chili flakes and toasted rice powder.', 'Fold in shallots, green onions, mint and cilantro.', 'Serve in lettuce cups with sticky rice.'],
  },
  {
    id: 55, name: 'Thai Cashew Chicken', emoji: '🥜', cuisine: 'thai', mealTypes: ['dinner'],
    minutes: 20, servings: 2, calories: 800, protein: 51, carbs: 73, fat: 34, tags: ['high-protein'],
    ingredients: ['12 oz chicken breast, sliced', '½ cup roasted cashews', '1 onion, sliced', '1 red bell pepper, sliced', '4 dried chilies', '1 tbsp oyster sauce', '1 tbsp soy sauce', '1 tsp sugar', '2 tbsp oil', '3 green onions', 'Rice'],
    steps: ['Stir-fry the chicken in oil until just cooked; set aside.', 'Fry dried chilies, onion and bell pepper for 2 minutes.', 'Return the chicken with oyster sauce, soy sauce and sugar; toss 1 minute.', 'Add cashews and green onions; serve with rice.'],
  },
  {
    id: 56, name: 'Tom Kha Gai', emoji: '🥥', cuisine: 'thai', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 2, calories: 470, protein: 35, carbs: 15, fat: 32, tags: ['high-protein', 'low-carb'],
    ingredients: ['1 cup coconut milk', '2 cups chicken broth', '10 oz chicken thigh, sliced', '1 cup mushrooms', '1 stalk lemongrass, bruised', '5 slices galangal or ginger', '4 kaffir lime leaves', '2 tbsp fish sauce', '2 tbsp lime juice', '1 tsp sugar', 'Cilantro, Thai chilies'],
    steps: ['Simmer coconut milk and broth with lemongrass, galangal and lime leaves for 5 minutes.', 'Add the chicken and mushrooms; simmer 8 minutes.', 'Season with fish sauce, lime juice and sugar.', 'Serve topped with cilantro and chilies.'],
  },

  // ---------- More Filipino ----------
  {
    id: 57, name: 'Chicken Tinola', emoji: '🍲', cuisine: 'filipino', mealTypes: ['lunch', 'dinner'],
    minutes: 30, servings: 3, calories: 490, protein: 37, carbs: 57, fat: 11, tags: ['high-protein'],
    ingredients: ['1 lb boneless chicken thighs', '1 onion, sliced', '3 cloves garlic, crushed', '2 tbsp julienned ginger', '2 tbsp fish sauce', '1 chayote or green papaya, cubed', '2 cups malunggay or spinach', '4 cups water', '1 tbsp oil', 'Rice'],
    steps: ['Sauté garlic, onion and ginger in oil until fragrant.', 'Add the chicken and fish sauce; cook 3 minutes.', 'Add water and simmer 15 minutes, then add chayote for 5 minutes.', 'Stir in the greens until wilted and serve with rice.'],
  },
  {
    id: 58, name: 'Sinigang na Hipon', emoji: '🦐', cuisine: 'filipino', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 3, calories: 460, protein: 39, carbs: 72, fat: 2, tags: ['high-protein'],
    ingredients: ['1 lb shrimp', '1 packet sinigang mix (40 g)', '6 cups water', '1 onion, quartered', '2 tomatoes, quartered', '1 radish, sliced', '1 cup long beans', '2 cups water spinach (kangkong)', '2 green chilies', '1 tbsp fish sauce', 'Rice'],
    steps: ['Boil water with onion and tomatoes for 5 minutes.', 'Add radish and long beans; simmer 5 minutes.', 'Stir in the sinigang mix, then the shrimp and chilies for 3 minutes.', 'Add water spinach, season with fish sauce and serve with rice.'],
  },
  {
    id: 59, name: 'Chicken Arroz Caldo', emoji: '🍚', cuisine: 'filipino', mealTypes: ['breakfast', 'lunch'],
    minutes: 30, servings: 3, calories: 420, protein: 29, carbs: 49, fat: 12, tags: [],
    ingredients: ['¾ cup glutinous rice', '8 oz chicken thigh, diced', '1 onion, chopped', '4 cloves garlic, minced', '2 tbsp julienned ginger', '6 cups chicken broth', '2 tbsp fish sauce', '1 tsp turmeric (optional)', '2 hard-boiled eggs', 'Green onion, fried garlic, calamansi', '1 tbsp oil'],
    steps: ['Sauté garlic, onion and ginger in oil; add the chicken and cook 3 minutes.', 'Add rice and turmeric, stir 1 minute, then add broth and fish sauce.', 'Simmer 20 minutes, stirring often, until thick and creamy.', 'Serve topped with egg, green onion, fried garlic and a squeeze of calamansi.'],
  },
  {
    id: 60, name: 'Pork Giniling', emoji: '🥘', cuisine: 'filipino', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 3, calories: 810, protein: 35, carbs: 83, fat: 37, tags: ['high-protein'],
    ingredients: ['1 lb ground pork', '1 onion, chopped', '3 cloves garlic, minced', '2 tomatoes, diced', '1 potato, diced', '1 carrot, diced', '½ cup frozen peas', '2 tbsp soy sauce', '1 tbsp fish sauce', '¼ cup raisins (optional)', '½ cup water', '1 tbsp oil', 'Rice'],
    steps: ['Sauté garlic, onion and tomatoes in oil until soft.', 'Add the pork and brown, breaking it up.', 'Add potato, carrot, soy sauce, fish sauce and water; simmer 12 minutes.', 'Stir in peas and raisins for 2 minutes and serve with rice.'],
  },
]
