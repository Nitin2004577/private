import express from "express";
import recipeController from "../controllers/recipeController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", recipeController.createRecipe);

// Rate a recipe (protected)
router.post("/:id/rate", auth, recipeController.rateRecipe);

// Get all recipes
router.get("/", recipeController.getAllRecipes);

// Get recipes by user (protected)
router.get("/user/:name", auth, recipeController.getByUser);

// Get recipe by name
router.get("/name/:name", recipeController.getByName);

// Get recipe by id
router.get("/:id", recipeController.getRecipeById);

export default router;
