// Photos are free-licensed images from Wikimedia Commons. Each entry credits its photographer.
export interface PhotoCredit { author: string; license: string; page: string }

export const PHOTO_CREDITS: Record<number, PhotoCredit> = {
  1: { author: "naotakem", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Spaghetti_with_shrimp_and_broccoli_in_a_lemon_garlic_sauce_with_lots_of_homegrown_Italian_parsley_%E8%87%AA%E5%AE%B6%E6%A0%BD%E5%9F%B9%E3%81%AE%E3%82%A4%E3%82%BF%E3%83%AA%E3%82%A2%E3%83%B3%E3%83%91%E3%82%BB%E3%83%AA%E3%82%92%E3%81%9F%E3%81%A3%E3%81%B7%E3%82%8A%E6%95%A3%E3%82%89%E3%81%97%E3%81%9F%E3%82%A8%E3%83%93%E3%81%A8%E3%83%96%E3%83%AD%E3%83%83%E3%82%B3%E3%83%AA%E3%83%BC%E3%81%AE%E3%82%B9%E3%83%91%E3%82%B2%E3%83%86%E3%82%A3.jpg" },
  2: { author: "Tristan Kenney", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Chicken_parmigiana.jpg" },
  3: { author: "Andy Li", license: "CC0", page: "https://commons.wikimedia.org/wiki/File:Eggs_On_Toast_-_FIKA_2023-09-02.jpg" },
  4: { author: "Personal Creations", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Tuscan_kale_and_white_bean_soup_in_personalized_bowls_with_spoons_on_a_decorative_tree_cross_cut_(16085794138).jpg" },
  5: { author: "Sharon Chen from Austin, United States", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Grilled_Chicken_Burrito_Bowl_6_(28365051003).jpg" },
  6: { author: "jeffreyw", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Huevos_rancheros_832957.jpg" },
  7: { author: "Missvain", license: "CC BY 4.0", page: "https://commons.wikimedia.org/wiki/File:Chicken_fajitas_-_La_Hacienda_-_Sarah_Stierch.jpg" },
  8: { author: "Daderot", license: "CC0", page: "https://commons.wikimedia.org/wiki/File:Quesadilla_with_cheese,_black_beans,_and_beef_brisket_-_Cambridge,_MA.jpg" },
  9: { author: "Gaurav Dhwaj Khadka", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Egg_Fried_Rice.jpg" },
  10: { author: "Joy", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Beef_and_broccoli_stir_fry.jpg" },
  11: { author: "N509FZ", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Kung_Pao_Chicken_at_Yujiayan_Restaurant_(20230510123120).jpg" },
  12: { author: "Huangdan2060", license: "CC BY 3.0", page: "https://commons.wikimedia.org/wiki/File:Hunan_cuisine,_stir-fried_tomato_with_eggs.jpg" },
  13: { author: "JIP", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Salmon_Teriyaki_at_restaurant_Same_Same_But_Different.jpg" },
  14: { author: "Ocdp", license: "CC0", page: "https://commons.wikimedia.org/wiki/File:Chicken_Cutlet_001.jpg" },
  15: { author: "Ocdp", license: "CC0", page: "https://commons.wikimedia.org/wiki/File:Miso_Soup_001.jpg" },
  16: { author: "Flickr.com user \"Blue Lotus\"", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Yaki-udon.jpg" },
  17: { author: "Asturio Cantabrio", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Siam_Garden_Phat_kaphrao_ac.jpg" },
  18: { author: "Takeaway", license: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Phat_Thai_kung_Chang_Khien_street_stall.jpg" },
  19: { author: "Takeaway", license: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Thai_green_chicken_curry_and_roti.jpg" },
  20: { author: "Dennis Wong from Hong Kong, Hong Kong", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Mango_sticy_rice_(3859549574).jpg" },
  21: { author: "Missvain", license: "CC BY 4.0", page: "https://commons.wikimedia.org/wiki/File:Chicken_tikka_masala_at_Yeti_in_Glen_Ellen_2015_-_Sarah_Stierch.jpg" },
  22: { author: "Parzeus", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Chana_Masala_in_Paul%C3%ADnia,_2023-10-16.jpg" },
  23: { author: "SwingingUvula", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Masala_omelette.JPG" },
  24: { author: "Monali.mishra", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Dal_Fry_Tadka,_Cumin_Rice,_Roasted_Papad_on_the_side.jpg" },
  25: { author: "A Healthier Michigan from Detroit, United States", license: "CC BY-SA 2.0", page: "https://commons.wikimedia.org/wiki/File:Korean_Beef_Bulgogi_Rice_Bowl_(34817154336).jpg" },
  26: { author: "Sharon Ang", license: "CC0", page: "https://commons.wikimedia.org/wiki/File:Kimchi_fried_rice.jpg" },
  27: { author: "Asadal", license: "CC BY 4.0", page: "https://commons.wikimedia.org/wiki/File:Gyeran-mari_4.jpg" },
  28: { author: "Startandstar", license: "CC0", page: "https://commons.wikimedia.org/wiki/File:Yangnyeom_Chicken_Korean_fried_chicken.jpg" },
  29: { author: "Beno\u00eet Prieur", license: "CC0", page: "https://commons.wikimedia.org/wiki/File:Pita_Chicken_at_Orlando_(May_2023).jpg" },
  30: { author: "Calliopejen1", license: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Shakshuka_by_Calliopejen1.jpg" },
  31: { author: "Andy / Andrew Fogg from near Cambridge, UK", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Time_for_another_food_picture_-)_(4200042228).jpg" },
  32: { author: "Alloyblue", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Palestinian_Salvadoran_Hummus_and_Pita_bread.png" },
  33: { author: "Mosa Meat", license: "CC BY 4.0", page: "https://commons.wikimedia.org/wiki/File:Cultivated_hamburger,_2013.jpg" },
  34: { author: "Herson Rodriguez hero", license: "CC0", page: "https://commons.wikimedia.org/wiki/File:Pancakes_with_Berries_(Unsplash).jpg" },
  35: { author: "Midget Skeeter", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Yummy_Meal.jpg" },
  36: { author: "Daderot", license: "CC0", page: "https://commons.wikimedia.org/wiki/File:Cobb_salad_with_apples,_walnuts,_etc_-_Massachusetts.jpg" },
  37: { author: "dbgg1979 on flickr", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Chicken_adobo.jpg" },
  38: { author: "Halil S. Mucaram Halil marx07 (talk) 18:26, 13 November 2012 (UTC)", license: "CC BY 3.0", page: "https://commons.wikimedia.org/wiki/File:Tapsilog_in_saudi_arabia.jpg" },
  39: { author: "pulaw", license: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Pancit_Ilonggo_Style_-_12110089845.jpg" },
  40: { author: "Judgefloro", license: "CC0", page: "https://commons.wikimedia.org/wiki/File:5011Paksiw_na_Isda_Ginisang_monggo_18.jpg" },
}

/** URL of the recipe's photo, or undefined for recipes without one (e.g. your own). */
export const photoFor = (id: number): string | undefined =>
  PHOTO_CREDITS[id] ? `${import.meta.env.BASE_URL}photos/${id}.jpg` : undefined
