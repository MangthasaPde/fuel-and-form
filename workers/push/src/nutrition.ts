// Estimates calories, protein, carbs and fat for a recipe from its ingredient lines
// (e.g. "2 chicken breasts", "1 lb Egg Plants", "½ cup coconut milk").
//
// Values are per 100 g, rounded from USDA FoodData Central (SR Legacy / Foundation Foods) entries for the
// raw or as-sold form named. Results are estimates: real dishes vary with brands, cuts and portion sizes.

interface Food {
  names: string[]
  kcal: number
  p: number // protein g
  c: number // carbs g
  f: number // fat g
  each?: number // grams for one item ("2 eggs", "1 onion", "3 cloves garlic")
  cup?: number // grams in one US cup; tbsp = cup/16, tsp = cup/48
  can?: number // grams in one can / pack / block
  slice?: number
  portion?: number // grams per serving when a line gives no amount ("Rice", "Lettuce, tomato")
  seasoning?: boolean // salt, spices, water: never counted as "unrecognised"
}

const F = (names: string, kcal: number, p: number, c: number, f: number, extra: Partial<Food> = {}): Food => ({
  names: names.split('|'), kcal, p, c, f, ...extra,
})
const OIL = { cup: 216, portion: 5 }
const SPICE = { cup: 100, portion: 0, seasoning: true }
const HERB = { cup: 20, portion: 2, each: 1 }
const SAUCE = { cup: 255, portion: 8 }

export const FOODS: Food[] = [
  // poultry
  F('chicken breast|chicken breasts|chicken fillet', 120, 22.5, 0, 2.6, { each: 200, cup: 140, portion: 150 }),
  F('chicken cutlet|chicken escalope', 120, 22.5, 0, 2.6, { each: 120 }),
  F('chicken thigh|boneless chicken thigh', 121, 19.7, 0, 4.1, { each: 110, cup: 140, portion: 150 }),
  F('chicken wing', 191, 17.5, 0, 12.8, { each: 35 }),
  F('chicken leg|drumstick|chicken drumstick', 161, 19.3, 0, 8.7, { each: 90 }),
  F('ground chicken|minced chicken|chicken mince', 143, 17.4, 0, 8.1, { cup: 225 }),
  F('chicken|whole chicken|chicken pieces|chicken strips', 150, 20, 0, 7.5, { each: 200, cup: 140, portion: 150 }),
  F('ground turkey|turkey mince|minced turkey', 150, 18.7, 0, 8.3, { cup: 225 }),
  F('turkey|turkey breast', 114, 23.7, 0, 1.5, { slice: 28 }),
  F('duck|duck breast', 201, 23.5, 0, 11.2, { each: 200 }),
  // red meat
  F('flank steak|sirloin|sirloin steak|lean beef|beef tenderloin|fillet steak', 155, 21, 0, 7.5, { each: 225 }),
  F('ground beef|minced beef|beef mince|mince', 254, 17.2, 0, 20, { cup: 225 }),
  F('beef|steak|stewing beef|beef chuck|chuck|brisket|rump steak|ribeye|beef short ribs', 200, 19, 0, 13.5, { each: 225, portion: 150 }),
  F('ground pork|minced pork|pork mince', 263, 16.9, 0, 21.2, { cup: 225 }),
  F('pork belly', 518, 9.3, 0, 53, {}),
  F('pork loin|pork chop|pork tenderloin|pork fillet', 143, 21, 0, 5.9, { each: 180 }),
  F('pork|pork shoulder', 236, 17, 0, 18, { portion: 150 }),
  F('bacon|streaky bacon|bacon rashers|rashers', 541, 37, 1.4, 42, { slice: 8, each: 8 }),
  F('ham|parma ham|prosciutto', 180, 22, 1.5, 9.5, { slice: 20, each: 20 }),
  F('sausage|sausages|chorizo|pork sausage', 330, 14, 2.5, 29, { each: 75 }),
  F('chinese sausage|lap cheong', 490, 18, 18, 39, { each: 45 }),
  F('lamb|lamb shoulder|lamb leg|lamb mince|minced lamb|ground lamb', 282, 16.6, 0, 23.4, { portion: 150 }),
  // seafood
  F('salmon|salmon fillet|salmon fillets', 208, 20, 0, 13, { each: 170, portion: 150 }),
  F('white fish|cod|tilapia|haddock|fish fillet|fish fillets|basa|sea bass|snapper|fish', 90, 19, 0, 1, { each: 150, portion: 150 }),
  F('shrimp|prawn|prawns|king prawns|tiger prawns', 85, 20.1, 0, 0.5, { each: 15, cup: 145, portion: 100 }),
  F('sardines|sardine|mackerel|herring|trout|anchovies|anchovy|kippers|smoked salmon', 208, 24, 0, 11.5, { each: 25, can: 120, portion: 100 }),
  F('tuna|canned tuna|tinned tuna', 116, 25.5, 0, 0.8, { can: 140 }),
  F('squid|calamari', 92, 15.6, 3.1, 1.4, {}),
  F('mussels|clams', 86, 11.9, 3.7, 2.2, {}),
  F('fish ball|fish balls|fishcake|fish cake', 120, 11, 13, 2.5, { each: 15 }),
  F('dried anchovies|ikan bilis', 300, 60, 0, 5, { cup: 60, portion: 10 }),
  // eggs, tofu
  F('egg|eggs|large egg', 143, 12.6, 0.7, 9.5, { each: 50, portion: 50 }),
  F('egg white|egg whites', 52, 10.9, 0.7, 0.2, { each: 33 }),
  F('egg yolk|egg yolks', 322, 15.9, 3.6, 26.5, { each: 17 }),
  F('silken tofu|soft tofu', 55, 4.8, 2.9, 2.7, { can: 340, cup: 250 }),
  F('tofu|firm tofu|extra firm tofu|fried tofu|tofu puffs', 144, 17.3, 2.8, 8.7, { can: 400, cup: 250, portion: 100 }),
  F('tempeh', 192, 20.3, 7.6, 10.8, { can: 225 }),
  // dairy
  F('milk|whole milk|semi skimmed milk', 61, 3.2, 4.8, 3.3, { cup: 244 }),
  F('evaporated milk', 134, 6.8, 10, 7.6, { cup: 252, can: 354 }),
  F('condensed milk|sweetened condensed milk', 321, 7.9, 54.4, 8.7, { cup: 306, can: 397 }),
  F('heavy cream|double cream|whipping cream|cream', 340, 2.8, 2.7, 36, { cup: 238 }),
  F('single cream|light cream|cooking cream', 195, 2.7, 3.7, 19.3, { cup: 240 }),
  F('sour cream|creme fraiche|crème fraîche', 198, 2.4, 4.6, 19.4, { cup: 230, portion: 30 }),
  F('greek yogurt|greek yoghurt', 73, 10, 3.9, 1.9, { cup: 245, portion: 50 }),
  F('yogurt|yoghurt|natural yogurt|plain yogurt', 61, 3.5, 4.7, 3.3, { cup: 245, portion: 50 }),
  F('tzatziki', 110, 4, 5, 8, { cup: 240, portion: 40 }),
  F('butter|unsalted butter|salted butter', 717, 0.9, 0.1, 81, { cup: 227, portion: 5 }),
  F('ghee|clarified butter', 900, 0, 0, 100, { cup: 205 }),
  F('cheese|cheddar|cheddar cheese|shredded cheese|grated cheese|cheese slices|monterey jack|gruyere|swiss cheese|american cheese', 403, 24.9, 1.3, 33, { cup: 113, slice: 21, portion: 20 }),
  F('mozzarella|fresh mozzarella|mozzarella cheese', 280, 22, 2.2, 20, { cup: 112, each: 125, portion: 30 }),
  F('parmesan|parmesan cheese|parmigiano reggiano|grana padano|pecorino', 392, 35.8, 3.2, 25.8, { cup: 100, portion: 8 }),
  F('feta|feta cheese|cotija|queso fresco', 264, 14.2, 4.1, 21.3, { cup: 150, portion: 15 }),
  F('cream cheese|mascarpone', 342, 6, 4.1, 34, { cup: 232 }),
  F('ricotta|ricotta cheese', 174, 11.3, 3, 13, { cup: 246 }),
  F('coconut milk|coconut milk canned', 197, 2, 2.8, 21, { cup: 240, can: 400 }),
  F('light coconut milk|reduced fat coconut milk|coconut milk light', 74, 0.6, 1.7, 7.2, { cup: 240, can: 400 }),
  F('coconut cream', 330, 3.6, 6.7, 34.7, { cup: 240, can: 400 }),
  // grains & starches
  F('cooked rice|steamed rice|cooked white rice|cold cooked rice|leftover rice|day old rice', 130, 2.7, 28.2, 0.3, { cup: 158, portion: 160 }),
  F('cooked jasmine rice|cooked basmati rice', 130, 2.7, 28.2, 0.3, { cup: 158, portion: 160 }),
  F('rice|white rice|jasmine rice|basmati rice|long grain rice|long grain white rice|risotto rice|arborio rice|sushi rice', 360, 6.6, 79.3, 0.6, { cup: 185, portion: 60 }),
  F('glutinous rice|sticky rice|sweet rice', 370, 6.8, 81.7, 0.6, { cup: 185, portion: 60 }),
  F('brown rice', 367, 7.5, 76.2, 3.2, { cup: 190, portion: 60 }),
  F('spaghetti|pasta|penne|fettuccine|linguine|tagliatelle|macaroni|rigatoni|fusilli|lasagne sheets|lasagna sheets|lasagne|farfalle|orzo', 371, 13, 74.7, 1.5, { cup: 100, portion: 85 }),
  F('udon|udon noodles', 105, 2.6, 21.6, 0.4, { can: 200, portion: 200 }),
  F('rice noodles|rice vermicelli|vermicelli|rice sticks|pad thai noodles|bun noodles|pho noodles|bee hoon', 364, 6, 80, 0.6, { cup: 90, portion: 70 }),
  F('fresh rice noodles|flat rice noodles|kway teow|hor fun|fresh flat rice noodles', 108, 1.8, 24, 0.2, { cup: 175, portion: 200 }),
  F('egg noodles|noodles|pancit canton|pancit canton noodles|mee|yellow noodles|lo mein noodles|chow mein noodles|ramen noodles|soba|soba noodles', 384, 14.2, 71.3, 4.4, { cup: 70, can: 250, portion: 75 }),
  F('instant noodles|instant ramen', 440, 9, 60, 18, { can: 85, each: 85 }),
  F('glass noodles|cellophane noodles|mung bean noodles|sotanghon', 351, 0.2, 86, 0.1, { portion: 40 }),
  F('couscous', 376, 12.8, 77.4, 0.6, { cup: 173, portion: 60 }),
  F('quinoa', 368, 14.1, 64.2, 6.1, { cup: 170 }),
  F('oats|rolled oats|porridge oats|oatmeal', 379, 13.2, 67.7, 6.5, { cup: 81 }),
  F('bread|white bread|sourdough|wholemeal bread|whole wheat bread|toast|bread slices', 270, 9, 50, 3.2, { slice: 40, each: 40, portion: 40 }),
  F('baguette|french bread|banh mi roll|bread roll', 274, 10.8, 52, 3, { each: 150, slice: 30 }),
  F('burger bun|hamburger bun|buns|brioche bun', 279, 9.5, 50, 4.3, { each: 55 }),
  F('pita|pitta|pita bread|pitta bread', 275, 9.1, 55.7, 1.2, { each: 60, portion: 60 }),
  F('naan|naan bread', 291, 9.6, 50.4, 5.7, { each: 90, portion: 90 }),
  F('tortilla|flour tortilla|tortillas|wrap|wraps', 312, 8.3, 51.6, 8, { each: 45, portion: 45 }),
  F('corn tortilla|corn tortillas', 218, 5.7, 44.6, 2.9, { each: 30 }),
  F('roti|chapati|paratha', 300, 8, 46, 9, { each: 60, portion: 60 }),
  F('panko|breadcrumbs|bread crumbs|panko breadcrumbs', 395, 13, 72, 5.3, { cup: 100 }),
  F('flour|plain flour|all purpose flour|self raising flour|self rising flour|wheat flour|bread flour', 364, 10.3, 76.3, 1, { cup: 125 }),
  F('rice flour|glutinous rice flour', 366, 6, 80, 1.4, { cup: 158 }),
  F('cornstarch|cornflour|corn starch|potato starch|tapioca starch', 381, 0.3, 91.3, 0.1, { cup: 128 }),
  F('pancake mix', 376, 8, 73, 4.5, { cup: 120 }),
  F('puff pastry', 558, 7.3, 45.7, 38.5, { can: 320 }),
  F('shortcrust pastry|pie crust|pastry', 527, 6.4, 52.2, 32.4, { can: 320 }),
  F('spring roll wrappers|rice paper|rice paper wrappers|lumpia wrappers', 330, 6, 75, 0.5, { each: 9 }),
  F('wonton wrappers|dumpling wrappers', 291, 9.8, 58, 1.5, { each: 8 }),
  F('potato|potatoes|baby potatoes|new potatoes', 77, 2, 17.5, 0.1, { each: 210, cup: 150, portion: 200 }),
  F('sweet potato|sweet potatoes|yam', 86, 1.6, 20.1, 0.1, { each: 200, cup: 133 }),
  F('corn|sweetcorn|sweet corn|corn kernels', 86, 3.3, 19, 1.4, { cup: 145, can: 285, each: 100 }),
  // legumes, nuts, seeds
  F('black beans', 120, 7.5, 21, 0.5, { cup: 172, can: 240, portion: 80 }),
  F('kidney beans|red kidney beans|pinto beans|beans', 115, 7.7, 20.4, 0.5, { cup: 172, can: 240 }),
  F('white beans|cannellini beans|cannellini|butter beans|haricot beans|navy beans', 110, 7.3, 19.6, 0.4, { cup: 180, can: 240 }),
  F('chickpeas|garbanzo beans|chick peas', 150, 8, 24, 2.6, { cup: 164, can: 240 }),
  F('refried beans', 90, 5.5, 15, 1.2, { cup: 250, can: 450 }),
  F('red lentils|lentils|green lentils|brown lentils|split peas|toor dal|moong dal|dal|dhal', 358, 24, 63, 2.2, { cup: 192 }),
  F('mung beans|monggo|mung bean', 347, 23.9, 62.6, 1.2, { cup: 207 }),
  F('edamame', 121, 11.9, 8.9, 5.2, { cup: 155 }),
  F('peas|green peas|frozen peas|garden peas', 81, 5.4, 14.5, 0.4, { cup: 145 }),
  F('peas and carrots|frozen peas and carrots|mixed vegetables|frozen mixed vegetables', 53, 3.1, 10, 0.4, { cup: 140 }),
  F('peanuts|roasted peanuts|crushed peanuts|chopped peanuts', 585, 23.7, 21.5, 49.7, { cup: 146, portion: 10 }),
  F('peanut butter|smooth peanut butter|crunchy peanut butter', 588, 25, 20, 50, { cup: 258 }),
  F('cashews|cashew nuts|roasted cashews', 553, 18.2, 30.2, 43.9, { cup: 137 }),
  F('almonds|ground almonds|flaked almonds', 579, 21.2, 21.6, 49.9, { cup: 143 }),
  F('walnuts|pecans', 654, 15.2, 13.7, 65.2, { cup: 117 }),
  F('sesame seeds|toasted sesame seeds', 573, 17.7, 23.4, 49.7, { cup: 144, portion: 2 }),
  F('desiccated coconut|grated coconut|shredded coconut|coconut', 354, 3.3, 15.2, 33.5, { cup: 80 }),
  // vegetables
  F('onion|onions|yellow onion|red onion|white onion|brown onion', 40, 1.1, 9.3, 0.1, { each: 110, cup: 160, portion: 30 }),
  F('shallot|shallots|small red onion', 72, 2.5, 16.8, 0.1, { each: 25, cup: 160 }),
  F('fried shallots|crispy shallots|fried onions', 500, 5, 50, 30, { cup: 50, portion: 5 }),
  F('green onion|green onions|scallion|scallions|spring onion|spring onions|chives', 32, 1.8, 7.3, 0.2, { each: 15, cup: 100, portion: 5 }),
  F('garlic|garlic cloves|cloves garlic|clove garlic', 149, 6.4, 33.1, 0.5, { each: 3, cup: 136, portion: 3 }),
  F('ginger|fresh ginger|ginger root|galangal', 80, 1.8, 17.8, 0.8, { each: 10, cup: 96, portion: 2 }),
  F('ginger garlic paste|garlic ginger paste', 100, 3, 22, 0.5, { cup: 240 }),
  F('lemongrass|lemon grass|lemongrass stalk', 99, 1.8, 25.3, 0.5, { each: 5, portion: 2 }),
  F('tomato|tomatoes|plum tomato|roma tomato|vine tomatoes|large tomato', 18, 0.9, 3.9, 0.2, { each: 120, cup: 180, portion: 40 }),
  F('cherry tomatoes|cherry tomato|grape tomatoes', 18, 0.9, 3.9, 0.2, { each: 17, cup: 150, portion: 40 }),
  F('sun dried tomatoes|sundried tomatoes|sun dried tomato', 258, 14.1, 55.8, 3, { each: 6, cup: 54 }),
  F('canned tomatoes|diced tomatoes|crushed tomatoes|chopped tomatoes|tinned tomatoes|plum tomatoes|passata|tomato sauce|marinara', 32, 1.6, 7.3, 0.3, { cup: 240, can: 400 }),
  F('tomato paste|tomato puree|tomato purée', 82, 4.3, 18.9, 0.5, { cup: 262 }),
  F('bell pepper|bell peppers|red pepper|green pepper|yellow pepper|capsicum|red bell pepper|peppers', 26, 1, 6, 0.3, { each: 120, cup: 150, portion: 40 }),
  F('chili|chilli|chilies|chillies|chili pepper|thai chili|bird eye chili|red chili|green chili|jalapeno|jalapeño|serrano|scotch bonnet', 40, 1.9, 8.8, 0.4, { each: 5, cup: 150, portion: 2 }),
  F('dried chili|dried chilies|dried chillies|dried red chilies', 318, 12, 57, 17, { each: 1 }),
  F('broccoli|broccoli florets|tenderstem broccoli', 34, 2.8, 6.6, 0.4, { cup: 91, each: 300, portion: 80 }),
  F('cauliflower', 25, 1.9, 5, 0.3, { cup: 107, each: 600 }),
  F('spinach|baby spinach', 23, 2.9, 3.6, 0.4, { cup: 30, portion: 30 }),
  F('kale|cavolo nero', 35, 2.9, 4.4, 1.5, { cup: 67 }),
  F('water spinach|kangkong|morning glory', 19, 2.6, 3.1, 0.2, { cup: 56 }),
  F('malunggay|moringa|chili leaves|chilli leaves', 64, 9.4, 8.3, 1.4, { cup: 21 }),
  F('cabbage|napa cabbage|chinese cabbage|white cabbage|red cabbage|savoy cabbage|shredded cabbage|coleslaw mix', 25, 1.3, 5.8, 0.1, { cup: 89, each: 900, portion: 40 }),
  F('bok choy|pak choi|baby bok choy|choy sum|gai lan|chinese broccoli', 13, 1.5, 2.2, 0.2, { each: 100, cup: 70 }),
  F('carrot|carrots', 41, 0.9, 9.6, 0.2, { each: 61, cup: 128, portion: 30 }),
  F('cucumber|cucumbers|english cucumber', 15, 0.7, 3.6, 0.1, { each: 300, cup: 120, portion: 40 }),
  F('zucchini|courgette|courgettes', 17, 1.2, 3.1, 0.3, { each: 200, cup: 124 }),
  F('eggplant|eggplants|egg plants|egg plant|aubergine|aubergines', 25, 1, 5.9, 0.2, { each: 300, cup: 82 }),
  F('green papaya|chayote|sayote|bottle gourd|upo', 19, 0.8, 4.5, 0.1, { each: 200, cup: 132 }),
  F('mushroom|mushrooms|shiitake|shiitake mushrooms|button mushrooms|oyster mushrooms|enoki', 22, 3.1, 3.3, 0.3, { each: 18, cup: 70 }),
  F('bean sprouts|beansprouts|mung bean sprouts', 30, 3, 5.9, 0.2, { cup: 104, portion: 30 }),
  F('green beans|string beans|long beans|french beans|snake beans', 31, 1.8, 7, 0.2, { cup: 110 }),
  F('snow peas|mangetout|sugar snap peas', 42, 2.8, 7.6, 0.2, { cup: 63 }),
  F('lettuce|romaine|romaine lettuce|iceberg lettuce|salad leaves|mixed greens|little gem', 17, 1.2, 3.3, 0.3, { cup: 47, each: 300, portion: 30 }),
  F('celery|celery stalks|celery stick', 14, 0.7, 3, 0.2, { each: 40, cup: 101 }),
  F('radish|daikon|daikon radish|white radish|labanos', 18, 0.6, 4.1, 0.1, { each: 300, cup: 116 }),
  F('okra|ladies fingers', 33, 1.9, 7.5, 0.2, { each: 12, cup: 100 }),
  F('asparagus', 20, 2.2, 3.9, 0.1, { each: 16 }),
  F('avocado|avocados', 160, 2, 8.5, 14.7, { each: 150, portion: 50 }),
  F('pumpkin|squash|butternut squash|kabocha', 26, 1, 6.5, 0.1, { cup: 116 }),
  F('olives|black olives|green olives|kalamata olives', 115, 0.8, 6.3, 10.7, { each: 4, cup: 135, portion: 15 }),
  F('kimchi', 15, 1.1, 2.4, 0.5, { cup: 150 }),
  F('kimchi juice', 15, 1.1, 2.4, 0.5, { cup: 240 }),
  F('pickled radish|pickled carrot|pickled vegetables|pickles|gherkins|pickle', 20, 0.5, 4, 0.2, { cup: 140, each: 30, portion: 20 }),
  F('wakame|dried wakame|seaweed|nori|seaweed strips|kombu', 45, 3, 9, 0.6, { cup: 30, each: 3, portion: 1 }),
  // herbs & aromatics (near zero, kept so they count as recognised)
  F('basil|thai basil|holy basil|cilantro|coriander leaves|fresh coriander|coriander|parsley|flat leaf parsley|mint|mint leaves|dill|rosemary|thyme|sage|tarragon|oregano leaves|curry leaves|kaffir lime leaves|lime leaves|bay leaves|bay leaf|pandan|pandan leaves|herbs|fresh herbs', 23, 3, 3, 0.6, HERB),
  // fruit
  F('lemon|lemons|lemon juice', 29, 1.1, 9.3, 0.3, { each: 60, cup: 244, portion: 10 }),
  F('lime|limes|lime juice|calamansi|kalamansi', 30, 0.7, 10.5, 0.2, { each: 45, cup: 244, portion: 10 }),
  F('mango|mangoes|ripe mango', 60, 0.8, 15, 0.4, { each: 200, cup: 165 }),
  F('banana|bananas', 89, 1.1, 22.8, 0.3, { each: 118 }),
  F('berries|mixed berries|blueberries|strawberries|raspberries', 50, 0.8, 12, 0.3, { cup: 145, portion: 50 }),
  F('apple|apples|pear|pears|asian pear', 52, 0.3, 13.8, 0.2, { each: 180 }),
  F('pineapple|pineapple chunks', 50, 0.5, 13.1, 0.1, { cup: 165, can: 435 }),
  F('raisins|sultanas|dried cranberries', 299, 3.1, 79, 0.5, { cup: 145 }),
  F('dates|medjool dates', 277, 1.8, 75, 0.2, { each: 24 }),
  F('tamarind|tamarind paste|tamarind pulp', 239, 2.8, 62.5, 0.6, { cup: 120 }),
  F('sinigang mix|tamarind soup base', 350, 5, 70, 5, { can: 40 }),
  // sauces & condiments
  F('soy sauce|light soy sauce|dark soy sauce|tamari', 53, 8.1, 4.9, 0.6, SAUCE),
  F('sweet soy sauce|kecap manis|kicap manis', 290, 2, 70, 0, SAUCE),
  F('oyster sauce', 51, 1.4, 10.9, 0.3, SAUCE),
  F('fish sauce|patis', 35, 5.1, 3.6, 0, SAUCE),
  F('hoisin|hoisin sauce', 220, 3.3, 44.1, 3.4, SAUCE),
  F('teriyaki sauce|teriyaki', 89, 5.9, 15.6, 0, SAUCE),
  F('pad thai sauce', 150, 1, 35, 1, SAUCE),
  F('gochujang|korean chili paste', 230, 5, 48, 2, { cup: 280 }),
  F('curry paste|green curry paste|red curry paste|yellow curry paste|massaman curry paste|laksa paste|tikka masala paste|curry sauce', 150, 3, 15, 9, { cup: 240 }),
  F('sambal|sambal oelek|chili sauce|sriracha|sweet chili sauce|chilli sauce|chili paste|chili garlic sauce', 93, 2, 19, 1, SAUCE),
  F('peanut sauce|satay sauce', 300, 10, 20, 22, { cup: 260 }),
  F('miso|miso paste|white miso|red miso|doenjang', 198, 12.8, 26.5, 6, { cup: 275 }),
  F('mirin|rice wine|shaoxing wine|sake|cooking wine', 240, 0.3, 43, 0, { cup: 240 }),
  F('vinegar|rice vinegar|white vinegar|cane vinegar|apple cider vinegar|red wine vinegar|white wine vinegar|black vinegar', 18, 0, 0.1, 0, { cup: 240, portion: 0 }),
  F('balsamic glaze|balsamic vinegar', 250, 0.5, 60, 0, { cup: 300 }),
  F('bbq sauce|barbecue sauce', 172, 0.8, 40.8, 0.6, { cup: 280 }),
  F('ketchup|tomato ketchup|banana ketchup', 101, 1, 27, 0.1, { cup: 240, portion: 10 }),
  F('mustard|dijon mustard|wholegrain mustard', 66, 4.4, 5.8, 4, { cup: 250, portion: 5 }),
  F('mayonnaise|mayo|kewpie mayonnaise', 680, 1, 0.6, 75, { cup: 220, portion: 10 }),
  F('ranch|ranch dressing|caesar dressing', 430, 1.3, 6, 45, { cup: 240, portion: 15 }),
  F('vinaigrette|salad dressing|italian dressing', 450, 0, 10, 45, { cup: 240, portion: 15 }),
  F('salsa', 36, 1.5, 7, 0.2, { cup: 260, portion: 40 }),
  F('pesto|basil pesto', 418, 5, 6, 42, { cup: 240 }),
  F('hummus|houmous', 166, 7.9, 14.3, 9.6, { cup: 246 }),
  F('tonkatsu sauce|worcestershire sauce|worcestershire', 130, 1, 30, 0.2, SAUCE),
  F('kaya|coconut jam', 300, 3, 50, 10, { cup: 300 }),
  F('shrimp paste|belacan|bagoong|terasi', 200, 30, 10, 3, { cup: 250, portion: 2 }),
  // sweeteners
  F('honey', 304, 0.3, 82.4, 0, { cup: 340, portion: 10 }),
  F('maple syrup|golden syrup|corn syrup|syrup', 260, 0, 67, 0.1, { cup: 315, portion: 20 }),
  F('sugar|white sugar|caster sugar|granulated sugar|icing sugar|powdered sugar|superfine sugar', 387, 0, 100, 0, { cup: 200 }),
  F('brown sugar|light brown sugar|dark brown sugar|muscovado sugar|demerara sugar', 380, 0.1, 98, 0, { cup: 220 }),
  F('palm sugar|coconut sugar|gula melaka|jaggery', 375, 0.5, 97, 0.1, { cup: 200 }),
  F('dark chocolate|chocolate|milk chocolate|chocolate chips', 546, 4.9, 61, 31, { cup: 170 }),
  F('cocoa|cocoa powder', 228, 19.6, 57.9, 13.7, { cup: 86 }),
  F('protein powder|whey protein|whey', 400, 78, 10, 5, { each: 30 }),
  // fats
  F('olive oil|extra virgin olive oil|vegetable oil|oil|sesame oil|toasted sesame oil|canola oil|coconut oil|peanut oil|sunflower oil|groundnut oil|cooking oil|frying oil|rapeseed oil', 884, 0, 0, 100, OIL),
  F('lard|shortening|suet|dripping', 900, 0, 0, 100, { cup: 205 }),
  // liquids
  F('broth|stock|chicken stock|chicken broth|beef stock|beef broth|vegetable stock|veggie broth|vegetable broth|dashi|fish stock|bone broth', 7, 1, 0.5, 0.2, { cup: 240, portion: 0 }),
  F('wine|red wine|white wine|dry white wine', 85, 0.1, 2.6, 0, { cup: 240 }),
  F('beer|stout|lager', 43, 0.5, 3.6, 0, { cup: 240 }),
  F('coconut water', 19, 0.7, 3.7, 0.2, { cup: 240 }),
  F('water|cold water|hot water|boiling water|ice water|warm water|ice', 0, 0, 0, 0, { cup: 240, seasoning: true }),
  // less common ingredients seen in online recipes
  F('leek|leeks', 61, 1.5, 14.2, 0.3, { each: 90, cup: 89 }),
  F('fennel|fennel bulb', 31, 1.2, 7.3, 0.2, { each: 230, cup: 87 }),
  F('beetroot|beet|beets', 43, 1.6, 9.6, 0.2, { each: 80, cup: 136 }),
  F('swede|turnip|rutabaga|parsnip|parsnips|celeriac', 42, 1.2, 9.5, 0.2, { each: 150, cup: 140 }),
  F('rocket|arugula|watercress|callaloo', 25, 2.6, 3.7, 0.7, { cup: 20, portion: 15 }),
  F('plantain|plantains|breadfruit', 122, 1.3, 31.9, 0.4, { each: 180 }),
  F('sauerkraut', 19, 0.9, 4.3, 0.1, { cup: 142 }),
  F('orange|oranges|zest of 1 orange|orange zest|clementine|tangerine', 47, 0.9, 11.8, 0.1, { each: 130, portion: 10 }),
  F('orange juice|fruit juice|apple juice|pineapple juice', 45, 0.7, 10.4, 0.2, { cup: 248 }),
  F('dried apricots|apricots|apricot|prunes|figs|dried figs|currants', 240, 2.7, 63, 0.4, { cup: 130, each: 10 }),
  F('pine nuts|pistachios|hazelnuts|pecan nuts|macadamia nuts|brazil nuts', 650, 14.5, 13.5, 64, { cup: 135 }),
  F('semolina|polenta|cornmeal|bulgur|bulgur wheat', 360, 12.7, 73, 1, { cup: 167 }),
  F('jam|raspberry jam|strawberry jam|apricot jam|marmalade', 250, 0.4, 65, 0.1, { cup: 320 }),
  F('black treacle|treacle|molasses', 290, 0, 75, 0.1, { cup: 337 }),
  F('dulce de leche|caramel|caramel sauce', 315, 6.8, 55, 7.4, { cup: 300 }),
  F('marzipan|almond paste', 444, 9, 50.5, 24, { cup: 230 }),
  F('chimichurri|chimichurri sauce|salsa verde', 400, 1, 4, 42, { cup: 240, portion: 15 }),
  F('harissa|harissa paste|harissa spice|gochugaru|pul biber|aleppo pepper', 150, 4, 15, 9, { cup: 240, portion: 3 }),
  F('dry sherry|sherry|port|marsala|vermouth', 140, 0.2, 8, 0, { cup: 240 }),
  F('brandy|rum|whisky|whiskey|vodka|cognac', 231, 0, 0, 0, { cup: 240 }),
  F('goose fat|duck fat', 900, 0, 0, 100, { cup: 205 }),
  F('hot sauce|hotsauce|tabasco|piri piri sauce', 12, 0.5, 1.8, 0.4, SAUCE),
  F('starch|arrowroot', 381, 0.3, 91.3, 0.1, { cup: 128 }),
  F('sesame seed|sesame', 573, 17.7, 23.4, 49.7, { cup: 144, portion: 2 }),
  F('challots|eschalots', 72, 2.5, 16.8, 0.1, { each: 25, cup: 160 }),
  F('allspice|ground allspice|ground clove|ground cloves|almond extract|caraway|caraway seed|caraway seeds|marjoram|dried marjoram|mace|ground ginger|fenugreek|asafoetida|celery salt|onion salt|garlic salt|mixed spice', 300, 10, 50, 8, SPICE),
  // seasonings (tiny amounts, counted as recognised)
  F('salt|sea salt|kosher salt|pepper|black pepper|white pepper|ground pepper|peppercorns|black peppercorns|cumin|ground cumin|cumin seeds|paprika|smoked paprika|turmeric|ground turmeric|garam masala|curry powder|chili powder|chilli powder|cayenne|cayenne pepper|chili flakes|red pepper flakes|chilli flakes|oregano|dried oregano|italian seasoning|mixed herbs|dried herbs|cinnamon|cinnamon stick|nutmeg|whole cloves|star anise|cardamom|five spice|chinese five spice|coriander seeds|ground coriander|fennel seeds|mustard seeds|baking powder|baking soda|bicarbonate of soda|yeast|vanilla|vanilla extract|msg|seasoning|taco seasoning|fajita seasoning|cajun seasoning|stock cube|bouillon cube|chicken stock cube|gelatin|food coloring|saffron|sumac|za atar|dried thyme|dried basil|garlic powder|onion powder', 300, 10, 50, 8, SPICE),
]

const OIL_FOOD = FOODS.find((f) => f.names.includes('vegetable oil'))!

// longest names first, so "coconut milk" wins over "milk" and "chicken breast" over "chicken"
const INDEX: { name: string; re: RegExp; food: Food }[] = FOODS.flatMap((food) =>
  food.names.map((name) => ({ name, food, re: new RegExp(`(^|[^a-z])${name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(es|s)?(?=$|[^a-z])`) })),
).sort((a, b) => b.name.length - a.name.length)

const FRACTIONS: Record<string, number> = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125 }
const UNITS: [RegExp, (food: Food) => number | undefined][] = [
  [/^(kg|kilograms?|kilos?)$/, () => 1000],
  [/^(g|grams?|gr|gms?)$/, () => 1],
  [/^(mg)$/, () => 0.001],
  [/^(lbs?|pounds?)$/, () => 453.6],
  [/^(oz|ounces?)$/, () => 28.35],
  [/^(l|litres?|liters?)$/, (f) => (f.cup ?? 240) * 4.17],
  [/^(ml|millilitres?|milliliters?)$/, (f) => (f.cup ?? 240) / 240],
  [/^(cups?|c)$/, (f) => f.cup ?? 200],
  [/^(tbsp|tbsps|tbs|tblsp|tbls|tablespoons?|tbl)$/, (f) => (f.cup ?? 200) / 16],
  [/^(tsp|tsps|teaspoons?)$/, (f) => (f.cup ?? 200) / 48],
  [/^(cans?|tins?|jars?|packs?|packets?|packages?|pkgs?|blocks?|bags?|boxes?|cartons?)$/, (f) => f.can ?? 400],
  [/^(slices?|rashers?|strips?|sheets?)$/, (f) => f.slice ?? f.each ?? 20],
  [/^(cloves?)$/, () => 3],
  [/^(stalks?|sticks?|sprigs?)$/, (f) => f.each ?? 10],
  [/^(bunch|bunches)$/, () => 80],
  [/^(handfuls?|handful)$/, () => 30],
  [/^(heads?)$/, (f) => f.each ?? 300],
  [/^(fillets?|breasts?|thighs?|pieces?|whole|large|medium|small|big|thick|thin)$/, (f) => f.each],
  [/^(scoops?)$/, (f) => f.each ?? 30],
  [/^(pinch|pinches|dash|dashes|sprinkle|sprinkling|drizzle|splash)$/, () => 0.5],
  [/^(knobs?)$/, () => 10],
]
const SIZE: Record<string, number> = { large: 1.25, big: 1.25, medium: 1, small: 0.75 }

const NUM = String.raw`(?:\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?)?\s*[½¼¾⅓⅔⅛]?`
// a range needs a second number: "2-3 eggs", "1 to 2 cups" (but not "1 tomato")
const QTY = new RegExp(`^\\s*(${NUM})(?:(?:\\s*[-–]\\s*|\\s+to\\s+)(?=[\\d½¼¾⅓⅔⅛])(${NUM}))?`)

/** "1 1/2", "1½", "½", "1/2", "1.5" -> number */
function toNumber(s: string): number {
  let v = 0
  const uni = /[½¼¾⅓⅔⅛]/.exec(s)
  if (uni) {
    v += FRACTIONS[uni[0]]
    s = s.replace(uni[0], '')
  }
  for (const part of s.trim().split(/\s+/).filter(Boolean)) {
    if (part.includes('/')) {
      const [a, b] = part.split('/').map(Number)
      if (b) v += a / b
    } else v += parseFloat(part.replace(',', '.')) || 0
  }
  return v
}

function parseQuantity(s: string): { qty: number | undefined; rest: string } {
  const m = QTY.exec(s)
  if (!m || !m[1].trim()) return { qty: undefined, rest: s }
  const a = toNumber(m[1])
  const b = m[2]?.trim() ? toNumber(m[2]) : 0
  const qty = b ? (a + b) / 2 : a // ranges ("2-3"): use the middle
  return { qty: qty || undefined, rest: s.slice(m[0].length) }
}

const clean = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9½¼¾⅓⅔⅛.,/\s-]/g, ' ').replace(/(?<!\d)-|-(?!\d)/g, ' ').replace(/\s+/g, ' ').trim()

function findFoods(text: string): { food: Food; at: number }[] {
  const hits: { food: Food; at: number; end: number }[] = []
  for (const { re, food } of INDEX) {
    const m = re.exec(text)
    if (!m) continue
    const at = m.index + m[1].length
    const end = m.index + m[0].length
    if (hits.some((h) => at < h.end && end > h.at)) continue // overlaps a longer name already found
    hits.push({ food, at, end })
  }
  return hits.sort((a, b) => a.at - b.at)
}

export interface LineResult { line: string; grams: number; food?: string; recognised: boolean; seasoning: boolean }

/** Grams of each food in one ingredient line, for a recipe with `servings` servings. */
export function analyseLine(raw: string, servings: number): { parts: { food: Food; grams: number }[]; recognised: boolean; seasoning: boolean } {
  // "(about 150 g)" overrides everything else
  const explicitGrams = /\(\s*(?:about|approx\.?|~)?\s*(\d+(?:\.\d+)?)\s*(g|grams?|ml)\s*\)/i.exec(raw)
  const text = clean(
    raw
      .replace(/\([^)]*\)/g, (p) => (/light|reduced/i.test(p) ? ` ${p.replace(/[()]/g, '')} ` : ' '))
      // "175g/6oz flour", "650g/1lb 8 oz potatoes": keep the metric amount only
      .replace(/^(\s*[\d.,½¼¾⅓⅔⅛\s]+\s*(?:g|kg|ml|l))\s*\/\s*[\d.,½¼¾⅓⅔⅛\s]*(?:fl\.?\s*oz|oz|lbs?|pints?|cups?)(?:\s*[\d½¼¾⅓⅔⅛.]+\s*oz)?/i, '$1'),
  )
  const segments = text.split(',').map((s) => s.trim()).filter(Boolean)
  const parts: { food: Food; grams: number }[] = []
  let recognised = false
  let seasoning = true
  let anything = false

  segments.forEach((segment, i) => {
    // "spinach or kale", "sour cream / greek yogurt": use the first option only
    const option = segment.split(/\s+or\s+|\s*\/\s*(?![0-9])/)[0]
    const { qty, rest } = i === 0 ? parseQuantity(option) : { qty: undefined, rest: option }
    const foods = findFoods(rest)
    if (!foods.length) {
      if (i === 0 && /[a-z]/.test(rest)) anything = true
      return
    }
    anything = true
    recognised = true
    foods.forEach(({ food }, j) => {
      if (!food.seasoning) seasoning = false
      let grams: number | undefined
      if (j === 0 && explicitGrams) grams = parseFloat(explicitGrams[1])
      else if (j === 0 && qty !== undefined) {
        const words = rest.trim().split(' ')
        const unit = UNITS.find(([re]) => re.test(words[0] ?? ''))
        const size = SIZE[words[0]] ?? 1
        const per = unit ? unit[1](food) : undefined
        grams = qty * (per ?? (food.each !== undefined ? food.each * size : food.portion !== undefined ? food.portion : 100))
        if (!unit && qty > 20 && food.each === undefined) grams = qty // "175 plain flour": a bare large number is grams
        if (unit && SIZE[words[0]] && food.each) grams = qty * food.each * size
      } else {
        grams = (food.portion ?? 0) * servings // "Rice", "Lettuce": a typical side per serving
      }
      if (food.seasoning && grams > 30) grams = 0 // "salt to taste" etc.
      if (food === OIL_FOOD && /fry|frying/i.test(raw) && grams > 60) grams *= 0.15 // deep-frying: only a little oil is absorbed
      parts.push({ food, grams })
    })
  })
  return { parts, recognised: recognised || !anything, seasoning: seasoning && recognised }
}

export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  coverage: number // share of non-seasoning lines that were recognised (0–1)
  unrecognised: string[]
}

/** Per-serving estimate for a whole recipe. */
export function estimateNutrition(lines: string[], servings: number): Nutrition {
  const total = { kcal: 0, p: 0, c: 0, f: 0 }
  const unrecognised: string[] = []
  let counted = 0
  let known = 0
  for (const line of lines) {
    const r = analyseLine(line, servings)
    if (!r.seasoning) {
      counted++
      if (r.recognised) known++
      else unrecognised.push(line)
    }
    for (const { food, grams } of r.parts) {
      total.kcal += (food.kcal * grams) / 100
      total.p += (food.p * grams) / 100
      total.c += (food.c * grams) / 100
      total.f += (food.f * grams) / 100
    }
  }
  const s = Math.max(1, servings)
  return {
    calories: Math.round(total.kcal / s / 10) * 10,
    protein: Math.round(total.p / s),
    carbs: Math.round(total.c / s),
    fat: Math.round(total.f / s),
    coverage: counted ? known / counted : 1,
    unrecognised,
  }
}

/** For recipes that don't say how many they serve (web recipes): assume a plate of about 700 kcal. */
export function guessServings(lines: string[]): number {
  const total = estimateNutrition(lines, 1).calories
  return Math.max(1, Math.min(8, Math.round(total / 700)))
}
