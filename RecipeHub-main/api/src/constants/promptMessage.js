export const promptMessage = {
  PROMPT_RECIPE_NUTRIENTS:
    "For the Recipe with data: title: $s, description: $s, preparationTime: $s, servings: $s, ingredients: $s, instructions: $s, category: $s, Give the Nutrients and their amount found in there. Here is the format: first give Calories, then Proteins, Fats, Minerals, Vitamins, others. It must be accurate. No any friendly messages, Just name the Nutrients and numbers in normal format other than that nothing. Make them in a unordered bullet points. ",
  PROMPT_RECIPE_DESCRIPTION:
    "For the Recipe with data: title: $s, preparationTime: $s, servings: $s, ingredients: $s, instructions: $s, category: $s, Give a brief description of the product in 2-3 sentences. It must be accurate. No any friendly messages, Just name the description in normal format and nothing else.",
};
