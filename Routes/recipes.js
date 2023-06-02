const express = require("express");
const recipesController = require("../Controllers/recipes.js")
const checkJWT = require("../util/auths")
const router = express.Router();

router.post("/save-recipe", checkJWT, recipesController.createRecipe)
router.get("/all-user-recipes", checkJWT, recipesController.getRecipesByUserId)
router.get("/all-recipes", recipesController.getAllRecipes)

router.delete("/delete-recipe/:id", checkJWT, recipesController.deleteRecipe)



module.exports=router