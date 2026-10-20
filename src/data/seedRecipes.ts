import type { Recipe } from '../types'

// Easy starter recipes: every one is 30 minutes or less with a short ingredient list.
// Nutrition numbers are approximate, per serving.
export const SEED_RECIPES: Recipe[] = [
  // ---------- Italian ----------
  {
    id: 1, name: 'Garlic Lemon Shrimp Pasta', emoji: '🍝', cuisine: 'italian', mealTypes: ['lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 520, protein: 32, carbs: 62, fat: 14, tags: ['high-protein', 'quick'],
    ingredients: ['6 oz spaghetti', '10 oz shrimp, peeled', '3 cloves garlic, sliced', '1 lemon (zest + juice)', '2 tbsp olive oil', 'Handful of parsley', 'Salt, pepper, chili flakes'],
    steps: ['Boil pasta in salted water until al dente; save ½ cup pasta water.', 'Sauté garlic in olive oil for 1 minute, add shrimp and cook 2 minutes per side.', 'Toss in pasta, lemon zest, juice and a splash of pasta water.', 'Finish with parsley, salt, pepper and chili flakes.'],
  },
  {
    id: 2, name: 'Caprese Chicken', emoji: '🍅', cuisine: 'italian', mealTypes: ['dinner'],
    minutes: 25, servings: 2, calories: 430, protein: 45, carbs: 8, fat: 23, tags: ['high-protein', 'low-carb'],
    ingredients: ['2 chicken breasts', '1 large tomato, sliced', '4 oz fresh mozzarella', 'Fresh basil', '1 tbsp olive oil', '1 tbsp balsamic glaze', 'Salt, pepper, Italian seasoning'],
    steps: ['Season chicken with salt, pepper and Italian seasoning.', 'Sear in olive oil 5–6 minutes per side until cooked through.', 'Top with tomato and mozzarella, cover pan 2 minutes to melt.', 'Add basil and drizzle with balsamic glaze.'],
  },
  {
    id: 3, name: 'Pesto Egg Toast', emoji: '🍳', cuisine: 'italian', mealTypes: ['breakfast'],
    minutes: 10, servings: 1, calories: 380, protein: 18, carbs: 28, fat: 22, tags: ['quick', 'vegetarian'],
    ingredients: ['1 slice sourdough', '1 tbsp pesto', '2 eggs', 'Cherry tomatoes, halved', 'Parmesan'],
    steps: ['Toast the bread.', 'Fry eggs in a pan with a little pesto.', 'Spread remaining pesto on toast, top with eggs.', 'Add tomatoes and grated parmesan.'],
  },
  {
    id: 4, name: 'Tuscan White Bean Soup', emoji: '🥣', cuisine: 'italian', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 3, calories: 340, protein: 17, carbs: 45, fat: 9, tags: ['vegetarian'],
    ingredients: ['2 cans white beans, drained', '1 onion, diced', '3 cloves garlic', '4 cups veggie broth', '3 cups spinach or kale', '1 can diced tomatoes', 'Parmesan to serve'],
    steps: ['Sauté onion and garlic until soft.', 'Add beans, tomatoes and broth; simmer 15 minutes.', 'Stir in greens until wilted.', 'Season and top with parmesan.'],
  },

  // ---------- Mexican ----------
  {
    id: 5, name: 'Chicken Burrito Bowl', emoji: '🌯', cuisine: 'mexican', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 2, calories: 560, protein: 42, carbs: 58, fat: 16, tags: ['high-protein'],
    ingredients: ['2 chicken breasts', '1 cup cooked rice', '1 can black beans', '1 cup corn', 'Salsa', '1 avocado', '1 tbsp taco seasoning', 'Lime'],
    steps: ['Season chicken with taco seasoning and cook 6 minutes per side.', 'Warm beans and corn.', 'Slice chicken and build bowls over rice.', 'Top with salsa, avocado and a squeeze of lime.'],
  },
  {
    id: 6, name: 'Huevos Rancheros', emoji: '🍳', cuisine: 'mexican', mealTypes: ['breakfast'],
    minutes: 15, servings: 2, calories: 410, protein: 20, carbs: 34, fat: 21, tags: ['vegetarian'],
    ingredients: ['4 small corn tortillas', '4 eggs', '1 cup salsa', '½ can refried beans', 'Cotija or feta', 'Cilantro'],
    steps: ['Warm tortillas in a dry pan.', 'Warm beans and spread on tortillas.', 'Fry eggs and place on top.', 'Spoon over warm salsa; add cheese and cilantro.'],
  },
  {
    id: 7, name: 'Sheet-Pan Fajitas', emoji: '🫑', cuisine: 'mexican', mealTypes: ['dinner'],
    minutes: 30, servings: 3, calories: 450, protein: 35, carbs: 38, fat: 17, tags: ['high-protein'],
    ingredients: ['1 lb chicken strips', '3 bell peppers, sliced', '1 onion, sliced', '2 tbsp fajita seasoning', '2 tbsp oil', '6 tortillas', 'Sour cream / Greek yogurt'],
    steps: ['Heat oven to 425°F (220°C).', 'Toss chicken, peppers and onion with oil and seasoning on a sheet pan.', 'Roast 20 minutes.', 'Serve in warm tortillas with yogurt or sour cream.'],
  },
  {
    id: 8, name: 'Black Bean Quesadilla', emoji: '🧀', cuisine: 'mexican', mealTypes: ['lunch', 'snack'],
    minutes: 10, servings: 1, calories: 480, protein: 22, carbs: 52, fat: 20, tags: ['quick', 'vegetarian'],
    ingredients: ['1 large tortilla', '½ cup black beans, mashed', '½ cup shredded cheese', '2 tbsp salsa', 'Pinch of cumin'],
    steps: ['Spread beans on half the tortilla; sprinkle cumin.', 'Add cheese and salsa, fold over.', 'Cook in a pan 2–3 minutes per side until golden.', 'Cut into wedges.'],
  },

  // ---------- Chinese ----------
  {
    id: 9, name: 'Egg Fried Rice', emoji: '🍚', cuisine: 'chinese', mealTypes: ['lunch', 'dinner'],
    minutes: 15, servings: 2, calories: 450, protein: 16, carbs: 62, fat: 15, tags: ['quick', 'vegetarian'],
    ingredients: ['3 cups cold cooked rice', '3 eggs', '1 cup frozen peas & carrots', '3 green onions', '2 tbsp soy sauce', '1 tsp sesame oil', '1 tbsp oil'],
    steps: ['Scramble eggs in oil, set aside.', 'Stir-fry peas and carrots 2 minutes.', 'Add rice and fry until hot and slightly crispy.', 'Add eggs, soy sauce, sesame oil and green onions.'],
  },
  {
    id: 10, name: 'Beef & Broccoli', emoji: '🥦', cuisine: 'chinese', mealTypes: ['dinner'],
    minutes: 20, servings: 2, calories: 480, protein: 38, carbs: 22, fat: 25, tags: ['high-protein'],
    ingredients: ['10 oz flank steak, thinly sliced', '3 cups broccoli florets', '3 tbsp soy sauce', '1 tbsp oyster sauce', '1 tsp cornstarch', '2 cloves garlic', '1 tsp ginger'],
    steps: ['Mix soy, oyster sauce, cornstarch and 3 tbsp water.', 'Sear beef in a hot pan 2 minutes, remove.', 'Stir-fry broccoli with garlic and ginger 3 minutes.', 'Return beef, add sauce, toss until glossy.'],
  },
  {
    id: 11, name: 'Kung Pao Chicken', emoji: '🌶️', cuisine: 'chinese', mealTypes: ['dinner'],
    minutes: 25, servings: 2, calories: 470, protein: 40, carbs: 20, fat: 26, tags: ['high-protein'],
    ingredients: ['2 chicken breasts, cubed', '¼ cup peanuts', '6 dried chilies', '1 bell pepper', '2 tbsp soy sauce', '1 tbsp rice vinegar', '1 tsp sugar', '1 tsp cornstarch'],
    steps: ['Mix soy, vinegar, sugar and cornstarch.', 'Stir-fry chicken until golden.', 'Add chilies, pepper and peanuts for 1 minute.', 'Pour in sauce and toss to coat.'],
  },
  {
    id: 12, name: 'Tomato Egg Stir-Fry', emoji: '🍅', cuisine: 'chinese', mealTypes: ['breakfast', 'lunch'],
    minutes: 10, servings: 2, calories: 260, protein: 14, carbs: 10, fat: 18, tags: ['quick', 'vegetarian'],
    ingredients: ['4 eggs', '3 tomatoes, wedged', '1 tsp sugar', '1 tbsp ketchup', 'Green onion', '1 tbsp oil', 'Salt'],
    steps: ['Softly scramble eggs in oil, remove.', 'Cook tomatoes with sugar and ketchup until saucy.', 'Return eggs and fold together.', 'Top with green onion; great over rice.'],
  },

  // ---------- Japanese ----------
  {
    id: 13, name: 'Teriyaki Salmon Bowl', emoji: '🍣', cuisine: 'japanese', mealTypes: ['lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 540, protein: 36, carbs: 55, fat: 18, tags: ['high-protein'],
    ingredients: ['2 salmon fillets', '¼ cup teriyaki sauce', '1½ cups cooked rice', '1 cucumber', '1 avocado', 'Sesame seeds', 'Green onion'],
    steps: ['Sear salmon skin-side down 4 minutes, flip 3 minutes.', 'Pour in teriyaki and glaze for 1 minute.', 'Slice cucumber and avocado.', 'Serve salmon over rice with toppings and sesame.'],
  },
  {
    id: 14, name: 'Chicken Katsu (Air-Fryer)', emoji: '🍗', cuisine: 'japanese', mealTypes: ['dinner'],
    minutes: 25, servings: 2, calories: 500, protein: 42, carbs: 38, fat: 18, tags: ['high-protein'],
    ingredients: ['2 thin chicken cutlets', '1 egg, beaten', '1 cup panko', '2 tbsp flour', 'Tonkatsu sauce', 'Shredded cabbage', 'Rice'],
    steps: ['Coat chicken in flour, egg, then panko.', 'Spray with oil and air-fry at 400°F (200°C) for 12 minutes, flipping halfway.', 'Slice into strips.', 'Serve with cabbage, rice and tonkatsu sauce.'],
  },
  {
    id: 15, name: 'Miso Soup with Tofu', emoji: '🍵', cuisine: 'japanese', mealTypes: ['breakfast', 'snack'],
    minutes: 10, servings: 2, calories: 120, protein: 9, carbs: 8, fat: 5, tags: ['quick', 'vegetarian'],
    ingredients: ['3 cups water or dashi', '2 tbsp white miso', '½ block silken tofu, cubed', '1 tbsp dried wakame', 'Green onion'],
    steps: ['Bring water to a gentle simmer; add wakame.', 'Whisk miso with a little hot water, stir in.', 'Add tofu and warm 2 minutes (don\'t boil).', 'Top with green onion.'],
  },
  {
    id: 16, name: 'Yaki Udon', emoji: '🍜', cuisine: 'japanese', mealTypes: ['lunch', 'dinner'],
    minutes: 15, servings: 2, calories: 460, protein: 22, carbs: 64, fat: 12, tags: ['quick'],
    ingredients: ['2 packs udon noodles', '6 oz chicken or shrimp', '2 cups cabbage, sliced', '1 carrot, julienned', '2 tbsp soy sauce', '1 tbsp mirin', '1 tsp sesame oil'],
    steps: ['Loosen udon in hot water, drain.', 'Stir-fry protein until cooked, add veggies 2 minutes.', 'Add udon, soy, mirin and sesame oil.', 'Toss 2 minutes until coated.'],
  },

  // ---------- Thai ----------
  {
    id: 17, name: 'Thai Basil Chicken', emoji: '🌿', cuisine: 'thai', mealTypes: ['lunch', 'dinner'],
    minutes: 15, servings: 2, calories: 420, protein: 38, carbs: 14, fat: 22, tags: ['high-protein', 'quick'],
    ingredients: ['1 lb ground chicken', '4 cloves garlic', '2 Thai chilies', '1 cup Thai basil', '2 tbsp oyster sauce', '1 tbsp soy sauce', '1 tsp sugar', 'Fried egg & rice to serve'],
    steps: ['Fry garlic and chilies 30 seconds.', 'Add chicken, break up and cook through.', 'Stir in sauces and sugar.', 'Fold in basil; serve over rice with a fried egg.'],
  },
  {
    id: 18, name: 'Easy Pad Thai', emoji: '🍜', cuisine: 'thai', mealTypes: ['dinner'],
    minutes: 25, servings: 2, calories: 560, protein: 28, carbs: 70, fat: 18, tags: [],
    ingredients: ['6 oz rice noodles', '8 oz shrimp or tofu', '2 eggs', '1 cup bean sprouts', '3 tbsp pad thai sauce', 'Crushed peanuts', 'Lime, green onion'],
    steps: ['Soak noodles in hot water 8 minutes, drain.', 'Cook shrimp/tofu, push aside and scramble eggs.', 'Add noodles and sauce; toss 2 minutes.', 'Add sprouts, top with peanuts, lime and green onion.'],
  },
  {
    id: 19, name: 'Green Curry', emoji: '🍛', cuisine: 'thai', mealTypes: ['dinner'],
    minutes: 25, servings: 3, calories: 480, protein: 30, carbs: 18, fat: 32, tags: [],
    ingredients: ['1 lb chicken thigh, sliced', '2 tbsp green curry paste', '1 can coconut milk', '1 zucchini', '1 bell pepper', '1 tbsp fish sauce', 'Thai basil', 'Rice'],
    steps: ['Fry curry paste in a splash of coconut milk 1 minute.', 'Add chicken and cook 5 minutes.', 'Pour in remaining coconut milk and veggies; simmer 10 minutes.', 'Season with fish sauce, add basil, serve with rice.'],
  },
  {
    id: 20, name: 'Mango Sticky Rice Oats', emoji: '🥭', cuisine: 'thai', mealTypes: ['breakfast'],
    minutes: 10, servings: 1, calories: 390, protein: 10, carbs: 68, fat: 10, tags: ['quick', 'vegetarian'],
    ingredients: ['½ cup rolled oats', '¾ cup coconut milk (light)', '½ mango, diced', '1 tsp honey', 'Toasted sesame seeds'],
    steps: ['Simmer oats in coconut milk 5 minutes.', 'Stir in honey.', 'Top with mango and sesame seeds.'],
  },

  // ---------- Indian ----------
  {
    id: 21, name: 'Quick Chicken Tikka Masala', emoji: '🍛', cuisine: 'indian', mealTypes: ['dinner'],
    minutes: 30, servings: 3, calories: 490, protein: 38, carbs: 16, fat: 30, tags: ['high-protein'],
    ingredients: ['1 lb chicken breast, cubed', '2 tbsp tikka masala paste', '1 can crushed tomatoes', '½ cup cream or coconut milk', '1 onion, diced', '2 cloves garlic', 'Cilantro, rice or naan'],
    steps: ['Sauté onion and garlic until soft.', 'Add chicken and paste; cook 5 minutes.', 'Add tomatoes; simmer 15 minutes.', 'Stir in cream, top with cilantro, serve with rice or naan.'],
  },
  {
    id: 22, name: 'Chana Masala', emoji: '🫘', cuisine: 'indian', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 3, calories: 360, protein: 14, carbs: 50, fat: 11, tags: ['vegetarian'],
    ingredients: ['2 cans chickpeas', '1 onion', '1 can diced tomatoes', '2 tsp garam masala', '1 tsp cumin', '1 tbsp ginger-garlic paste', 'Lemon, cilantro'],
    steps: ['Sauté onion until golden, add ginger-garlic and spices.', 'Add tomatoes and chickpeas.', 'Simmer 15 minutes, mashing a few chickpeas.', 'Finish with lemon and cilantro.'],
  },
  {
    id: 23, name: 'Masala Omelette', emoji: '🍳', cuisine: 'indian', mealTypes: ['breakfast'],
    minutes: 10, servings: 1, calories: 290, protein: 19, carbs: 6, fat: 21, tags: ['quick', 'high-protein', 'vegetarian'],
    ingredients: ['3 eggs', '¼ onion, finely chopped', '½ tomato, chopped', '1 green chili', 'Cilantro', '¼ tsp turmeric', 'Salt'],
    steps: ['Whisk eggs with everything.', 'Pour into a hot oiled pan.', 'Cook 2 minutes, fold and cook 1 more minute.'],
  },
  {
    id: 24, name: 'Dal Tadka', emoji: '🥣', cuisine: 'indian', mealTypes: ['lunch', 'dinner'],
    minutes: 30, servings: 3, calories: 320, protein: 17, carbs: 46, fat: 8, tags: ['vegetarian'],
    ingredients: ['1 cup red lentils', '3 cups water', '½ tsp turmeric', '1 tsp cumin seeds', '2 cloves garlic', '1 tomato', '1 tbsp ghee or oil'],
    steps: ['Simmer lentils with water and turmeric 20 minutes.', 'In a small pan, fry cumin seeds and garlic in ghee.', 'Add tomato for 2 minutes.', 'Pour the tadka over the dal and season.'],
  },

  // ---------- Korean ----------
  {
    id: 25, name: 'Beef Bulgogi Bowl', emoji: '🥩', cuisine: 'korean', mealTypes: ['dinner'],
    minutes: 20, servings: 2, calories: 560, protein: 36, carbs: 52, fat: 22, tags: ['high-protein'],
    ingredients: ['10 oz thin-sliced beef', '3 tbsp soy sauce', '1 tbsp brown sugar', '1 tbsp sesame oil', '½ grated pear or apple', '2 cloves garlic', 'Rice, green onion, sesame'],
    steps: ['Mix soy, sugar, sesame oil, pear and garlic; toss with beef.', 'Sear beef in a very hot pan 3–4 minutes.', 'Serve over rice.', 'Top with green onion and sesame.'],
  },
  {
    id: 26, name: 'Kimchi Fried Rice', emoji: '🍚', cuisine: 'korean', mealTypes: ['lunch', 'dinner'],
    minutes: 15, servings: 2, calories: 480, protein: 18, carbs: 60, fat: 18, tags: ['quick'],
    ingredients: ['2 cups cold cooked rice', '1 cup kimchi, chopped', '2 tbsp kimchi juice', '1 tbsp gochujang', '2 eggs', '1 tsp sesame oil', 'Seaweed strips'],
    steps: ['Fry kimchi 2 minutes.', 'Add rice, gochujang and kimchi juice; fry until hot.', 'Drizzle sesame oil.', 'Top each bowl with a fried egg and seaweed.'],
  },
  {
    id: 27, name: 'Korean Egg Roll (Gyeran-mari)', emoji: '🥚', cuisine: 'korean', mealTypes: ['breakfast', 'snack'],
    minutes: 10, servings: 1, calories: 240, protein: 17, carbs: 4, fat: 17, tags: ['quick', 'vegetarian'],
    ingredients: ['3 eggs', '2 tbsp finely chopped carrot', '1 green onion, chopped', 'Pinch of salt'],
    steps: ['Whisk eggs with veggies and salt.', 'Pour a thin layer into an oiled pan; roll when nearly set.', 'Add more egg, letting it join the roll; repeat.', 'Rest 1 minute and slice.'],
  },
  {
    id: 28, name: 'Gochujang Chicken', emoji: '🌶️', cuisine: 'korean', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 2, calories: 450, protein: 40, carbs: 26, fat: 18, tags: ['high-protein'],
    ingredients: ['1 lb chicken thighs', '2 tbsp gochujang', '1 tbsp honey', '1 tbsp soy sauce', '2 cloves garlic', 'Sesame seeds', 'Rice'],
    steps: ['Mix gochujang, honey, soy and garlic.', 'Pan-sear chicken 5 minutes per side.', 'Add sauce and simmer 2 minutes to glaze.', 'Slice, sprinkle sesame, serve with rice.'],
  },

  // ---------- Mediterranean ----------
  {
    id: 29, name: 'Greek Chicken Pita', emoji: '🥙', cuisine: 'mediterranean', mealTypes: ['lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 490, protein: 40, carbs: 42, fat: 16, tags: ['high-protein'],
    ingredients: ['2 chicken breasts', '2 pitas', '½ cup tzatziki', '1 tomato', '½ cucumber', '¼ red onion', '1 tsp oregano', '1 lemon'],
    steps: ['Season chicken with oregano, lemon, salt and pepper.', 'Cook 6 minutes per side and slice.', 'Warm pitas.', 'Fill with chicken, veggies and tzatziki.'],
  },
  {
    id: 30, name: 'Shakshuka', emoji: '🍳', cuisine: 'mediterranean', mealTypes: ['breakfast', 'lunch'],
    minutes: 20, servings: 2, calories: 320, protein: 18, carbs: 20, fat: 19, tags: ['vegetarian'],
    ingredients: ['4 eggs', '1 can crushed tomatoes', '1 bell pepper, diced', '1 onion, diced', '1 tsp cumin', '1 tsp paprika', 'Feta, parsley, bread'],
    steps: ['Sauté onion and pepper 5 minutes; add spices.', 'Add tomatoes and simmer 5 minutes.', 'Make wells and crack in eggs; cover 5–7 minutes.', 'Top with feta and parsley; serve with bread.'],
  },
  {
    id: 31, name: 'Lemon Herb Salmon & Couscous', emoji: '🐟', cuisine: 'mediterranean', mealTypes: ['dinner'],
    minutes: 20, servings: 2, calories: 520, protein: 38, carbs: 40, fat: 22, tags: ['high-protein'],
    ingredients: ['2 salmon fillets', '¾ cup couscous', '1 lemon', '1 tbsp olive oil', 'Fresh dill or parsley', 'Cherry tomatoes', 'Garlic'],
    steps: ['Pour boiling water over couscous, cover 5 minutes.', 'Sear salmon with garlic 4 minutes per side.', 'Squeeze lemon over salmon.', 'Fluff couscous with herbs and tomatoes; serve together.'],
  },
  {
    id: 32, name: 'Hummus Power Plate', emoji: '🫓', cuisine: 'mediterranean', mealTypes: ['lunch', 'snack'],
    minutes: 10, servings: 1, calories: 420, protein: 16, carbs: 46, fat: 20, tags: ['quick', 'vegetarian'],
    ingredients: ['½ cup hummus', '1 whole-wheat pita', 'Cucumber, carrots, cherry tomatoes', 'Handful of olives', '2 tbsp feta'],
    steps: ['Spread hummus on a plate.', 'Cut veggies and pita into dippers.', 'Add olives and feta; drizzle olive oil.'],
  },

  // ---------- American ----------
  {
    id: 33, name: 'Turkey Burger', emoji: '🍔', cuisine: 'american', mealTypes: ['lunch', 'dinner'],
    minutes: 20, servings: 2, calories: 470, protein: 34, carbs: 32, fat: 22, tags: ['high-protein'],
    ingredients: ['10 oz ground turkey', '2 burger buns', '2 slices cheese', 'Lettuce, tomato, onion', '1 tsp garlic powder', 'Salt, pepper', 'Ketchup / mustard'],
    steps: ['Season turkey and form 2 patties.', 'Cook 5 minutes per side; add cheese at the end.', 'Toast buns.', 'Build burgers with toppings.'],
  },
  {
    id: 34, name: 'Protein Pancakes', emoji: '🥞', cuisine: 'american', mealTypes: ['breakfast'],
    minutes: 15, servings: 2, calories: 360, protein: 28, carbs: 40, fat: 9, tags: ['high-protein', 'vegetarian'],
    ingredients: ['1 cup pancake mix', '1 scoop protein powder', '1 egg', '¾ cup milk', 'Berries', 'Maple syrup'],
    steps: ['Whisk mix, protein powder, egg and milk.', 'Pour ¼ cup batches into a hot pan.', 'Flip when bubbles form.', 'Top with berries and syrup.'],
  },
  {
    id: 35, name: 'BBQ Chicken Sheet Pan', emoji: '🍗', cuisine: 'american', mealTypes: ['dinner'],
    minutes: 30, servings: 3, calories: 450, protein: 40, carbs: 36, fat: 14, tags: ['high-protein'],
    ingredients: ['1 lb chicken breast', '½ cup BBQ sauce', '2 sweet potatoes, cubed', '2 cups green beans', '1 tbsp olive oil', 'Salt, pepper, paprika'],
    steps: ['Heat oven to 425°F (220°C).', 'Toss sweet potatoes with oil and roast 10 minutes.', 'Add chicken brushed with BBQ sauce and green beans.', 'Roast 18 more minutes.'],
  },
  {
    id: 36, name: 'Cobb Salad', emoji: '🥗', cuisine: 'american', mealTypes: ['lunch'],
    minutes: 15, servings: 2, calories: 430, protein: 34, carbs: 10, fat: 28, tags: ['high-protein', 'low-carb'],
    ingredients: ['Romaine lettuce', '1 cooked chicken breast', '2 hard-boiled eggs', '2 slices bacon', '1 avocado', 'Cherry tomatoes', 'Ranch or vinaigrette'],
    steps: ['Chop lettuce and arrange in a bowl.', 'Line up chicken, eggs, bacon, avocado and tomatoes in rows.', 'Drizzle dressing.'],
  },

  // ---------- Filipino ----------
  {
    id: 37, name: 'Chicken Adobo', emoji: '🍗', cuisine: 'filipino', mealTypes: ['dinner'],
    minutes: 30, servings: 3, calories: 430, protein: 36, carbs: 6, fat: 28, tags: ['high-protein', 'low-carb'],
    ingredients: ['1½ lb chicken thighs', '⅓ cup soy sauce', '⅓ cup vinegar', '6 cloves garlic, smashed', '3 bay leaves', '1 tsp peppercorns', 'Rice'],
    steps: ['Brown chicken in a pan 3 minutes per side.', 'Add soy, vinegar, garlic, bay leaves and pepper.', 'Simmer covered 15 minutes, then uncovered 5 to thicken.', 'Serve with rice.'],
  },
  {
    id: 38, name: 'Tapsilog', emoji: '🍳', cuisine: 'filipino', mealTypes: ['breakfast'],
    minutes: 20, servings: 2, calories: 590, protein: 34, carbs: 56, fat: 24, tags: ['high-protein'],
    ingredients: ['8 oz thin beef slices', '2 tbsp soy sauce', '1 tbsp sugar', '4 cloves garlic', '2 cups cooked rice', '2 eggs', '1 tbsp oil'],
    steps: ['Marinate beef in soy, sugar and half the garlic for 5 minutes.', 'Fry remaining garlic in oil, add rice to make garlic rice.', 'Sear beef 3 minutes.', 'Fry eggs; serve beef, rice and egg together.'],
  },
  {
    id: 39, name: 'Pancit Canton', emoji: '🍜', cuisine: 'filipino', mealTypes: ['lunch', 'dinner'],
    minutes: 25, servings: 3, calories: 470, protein: 24, carbs: 62, fat: 14, tags: [],
    ingredients: ['8 oz pancit canton noodles', '8 oz chicken or shrimp', '2 cups cabbage', '1 carrot', '3 tbsp soy sauce', '1 tbsp oyster sauce', '1½ cups broth', 'Calamansi or lemon'],
    steps: ['Sauté protein until cooked, add veggies 2 minutes.', 'Add broth, soy and oyster sauce; bring to a boil.', 'Add noodles and toss until liquid is absorbed.', 'Serve with calamansi.'],
  },
  {
    id: 40, name: 'Ginisang Monggo', emoji: '🥣', cuisine: 'filipino', mealTypes: ['lunch'],
    minutes: 30, servings: 3, calories: 330, protein: 20, carbs: 42, fat: 9, tags: [],
    ingredients: ['1 cup mung beans (pre-soaked or canned)', '4 oz shrimp or pork', '1 tomato', '1 onion', '3 cloves garlic', '2 cups spinach', '3 cups water', 'Fish sauce'],
    steps: ['Simmer mung beans in water until soft (skip if canned).', 'Sauté garlic, onion, tomato and protein.', 'Add beans and simmer 10 minutes.', 'Stir in spinach and season with fish sauce.'],
  },
]
