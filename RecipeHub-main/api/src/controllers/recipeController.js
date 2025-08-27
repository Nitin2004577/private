import recipeService from "../services/recipeService.js";

const createRecipe = async (req, res) => {
  const input = req.body;
  const file = req.file;
  const user = req.user;

  try {
    const data = await recipeService.create(input, file, user);

    res.status(201).json(data);
  } catch (error) {

    // Handling duplicate recipe title for the same user
    if (error.code === 11000) {
      return res.status(400).send("You already have a recipe with that title!");
    } else {
      res.status(500).send(error.message);
    }

  }
};

//update recipe controller
const updateRecipe = async (req, res) => {
  const input = req.body;
  const recipeId = req.params.id;
  const file = req.file;
  const user = req.user;

  try {
    const data = await recipeService.update(input, file, user, recipeId);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//get Recipe by ID
const getRecipeById = async (req, res) => {

  try {
    const { id } = req.params;
    const recipe = await recipeService.getById(id);

    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
// rate recipes

const rateRecipe = async (req, res) => {

  try {
    const { id } = req.params; // recipe id
    const { rating } = req.body; // rating value
    const userId = req.user._id; // user id

    const updatedRecipe = await recipeService.rateRecipe(id, rating, userId);

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getAllRecipes = async (req, res) => {

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const recipes = await recipeService.getAll(page, limit);

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getByName = async (req, res) => {
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const recipes = await recipeService.getByName(req.params.name, page, limit);

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getByUser = async (req, res) => {

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const recipes = await recipeService.getByUser(req.params.name, page, limit);

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export default {
  createRecipe,
  updateRecipe,
  getRecipeById,
  rateRecipe,
  getByUser,
  getByName,
  getAllRecipes,
};
