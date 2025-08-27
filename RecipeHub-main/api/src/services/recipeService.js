import categoryModel from "../models/Category.js";
import RecipeModel from "../models/Recipe.js";
import UserModel from "../models/User.js";
import uploadImages from "../utils/file.js";
import { promptMessage } from "../constants/promptMessage.js";
import geminiReply from "../utils/gemini.js";
import cloudinary from "cloudinary";

const create = async (data, file, createdBy) => {
  let uploadedImage = "";

  if (file) {
    // generating a filename based on the recipe title
    const rawFileName = data.title;
    // random string for uniqueness in filename
    const randomStr = Math.random().toString(36).substring(2, 7); // 5 chars
    const filename = (
      rawFileName.replace(/\s+/g, "-") +
      "-" +
      randomStr
    ).toLowerCase();
    uploadedImage = await uploadImages(file, filename);
  }
  //checking if the category exists or not
  const categoryExists = await categoryModel.findById(data.category);

  if (!categoryExists) {
    throw new Error("Category not found");
  }

  const promptNutrients = promptMessage.PROMPT_RECIPE_NUTRIENTS;
  const promptDescription = promptMessage.PROMPT_RECIPE_DESCRIPTION;

  //  replacing placeholders in the prompt messages
  const nutrientsPrompt = promptNutrients
    .replace("$s", data.title)
    .replace("$s", data.description)
    .replace("$s", data.preparationTime)
    .replace("$s", data.servings)
    .replace("$s", data.ingredients)
    .replace("$s", data.instructions)
    .replace("$s", categoryExists.name);

  // replacing placeholders in the description prompt
  const descriptionPrompt = promptDescription
    .replace("$s", data.title)
    .replace("$s", data.preparationTime)
    .replace("$s", data.servings)
    .replace("$s", data.ingredients)
    .replace("$s", data.instructions)
    .replace("$s", categoryExists.name);

  // getting nutrients from Gemini AI and uploading the image to cloudinary
  const [nutrientsResponse, descriptionResponse] = await Promise.all([
    geminiReply(nutrientsPrompt),
    geminiReply(descriptionPrompt),
  ]);

  const createdRecipe = await RecipeModel.create({
    ...data,
    createdBy: createdBy._id,
    image: uploadedImage
      ? { url: uploadedImage.secure_url, public_id: uploadedImage.public_id }
      : { url: "", public_id: "" },
    nutrients:
      data.nutrients ??
      nutrientsResponse
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item),
    description: data.description ?? descriptionResponse,
  });

  return createdRecipe;
};

// Update Recipes
const update = async (data, file, user, recipeId) => {
  //check if the recipe exists
  const recipe = await RecipeModel.findById(recipeId);

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  //ownership checking
  if (!recipe.createdBy.equals(user._id)) {
    throw new Error("You are not authorized to update this recipe");
  }

  let uploadedImage = "";

  if (file) {
    //delete the old image from cloudinary
    if (recipe.image?.public_id) {
      await cloudinary.uploader.destroy(recipe.image.public_id);
    }

    //taking the name from the title
    const rawFileName = data.title ?? recipe.title;
    // random string for uniqueness in filename
    const randomStr = Math.random().toString(36).substring(2, 7); // 5 chars
    const filename = (
      rawFileName.replace(/\s+/g, "-") +
      "-" +
      randomStr
    ).toLowerCase();
    uploadedImage = await uploadImages(file, filename);
  }

  const recipeExists = await RecipeModel.findById(recipeId);
  const updatedRecipe = await RecipeModel.findByIdAndUpdate(
    recipeId,
    {
      ...data,
      image: uploadedImage ? uploadedImage.secure_url : recipeExists.image,
    },
    { new: true }
  );

  return updatedRecipe;
};
//rate recipes
const rateRecipe = async (recipeId, rating, userId) => {
  // Fetch recipe first
  const recipe = await RecipeModel.findById(recipeId);

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  let ratings = recipe.ratings || [];

  // Check if user already rated
  const existingRatingIndex = ratings.findIndex(
    (r) => r.user.toString() === userId.toString()
  );

  if (existingRatingIndex !== -1) {
    // Update existing rating
    ratings[existingRatingIndex].score = rating;
  } else {
    // Add new rating
    ratings.push({ user: userId, score: rating });
  }

  // Calculate average rating (rounded to 1 decimal place)
  let avgRating = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
  avgRating = Math.round(avgRating * 10) / 10; // e.g. 4.36 → 4.4

  // Update in DB
  const updatedRecipe = await RecipeModel.findByIdAndUpdate(
    recipeId,
    {
      $set: {
        ratings: ratings,
        averageRating: avgRating,
      },
    },
    { new: true } // return updated document
  );

  return updatedRecipe;
};

//get recipes by id
const getById = async (id) => {
  const recipes = await RecipeModel.findById(id);

  if (!recipes) {
    throw new Error("Recipe not found");
  }

  return recipes;
};

const getAll = async (page, limit) => {
  const skip = (page - 1) * limit;
  const recipes = await RecipeModel.find()
    .populate("createdBy", "fullName profileImage")
    .skip(skip)
    .limit(limit);

  if (recipes.length === 0) {
    throw new Error("No recipes found");
  }

  return recipes;
};

// get recipes by name

const getByName = async (name, page, limit) => {
  const skip = (page - 1) * limit;
  const recipes = await RecipeModel.find({
    title: { $regex: `^${name}`, $options: "i" },
  })
    .populate("createdBy", "fullName profileImage")
    .skip(skip)
    .limit(limit);

  if (recipes.length === 0) {
    throw new Error("No recipes found");
  }

  return recipes;
};

//get recipes by user
const getByUser = async (name, page, limit) => {
    const skip = (page - 1) * limit;
  const user = await UserModel.find({
    fullName: { $regex: `^${name}`, $options: "i" },
  });
  
  if (user.length === 0) {
    throw new Error("User not found");
  }
    const userIds = user.map(u => u._id);

  const recipes = await RecipeModel.find({ createdBy:{$in: userIds} })
    .populate("createdBy", "fullName profileImage")
    .skip(skip)
    .limit(limit);

  if (recipes.length === 0) {
    throw new Error("No recipes found for this user");
  }

  return recipes;
};

export default {
  create,
  update,
  getById,
  rateRecipe,
  getAll,
  getByName,
  getByUser,
};
