"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ingredient_controller_1 = require("../controllers/ingredient.controller");
const router = (0, express_1.Router)();
router.get('/restaurant/:restaurantId', ingredient_controller_1.getAllIngredientOfRestaurant);
router.post('/restaurant/:restaurantId', ingredient_controller_1.postIngredientToRestaurant);
router.put('/restaurant/:ingredientId', ingredient_controller_1.updateIngredient);
router.delete('/restaurant/:ingredientId', ingredient_controller_1.deleteIngredient);
router.get('/restaurant/:restaurantId/search', ingredient_controller_1.searchIngredient);
// get all ingredients of a restaurant with categories
router.get('/restaurant/:restaurantId/ingredients/categories', ingredient_controller_1.getIngredientWithCategory);
router.get('/restaurant/:restaurantId/ingredients/categories/:categoryName', ingredient_controller_1.getIngredientsByCategoryName);
router.get('/restaurant/:restaurantId/ingredients', ingredient_controller_1.getAllIngredientOfRestaurantWithCategoryAndIngredientBatch);
router.get('/restaurant/ingredients/:ingredientId', ingredient_controller_1.getIngredientbyId);
router.post('/restaurant/:restaurantId/deductIngredients', ingredient_controller_1.deductIngredientsController);
router.get('/restaurant/:restaurantId/:ingredientUniqueId', ingredient_controller_1.getIngredientByIngredientUniqueId);
exports.default = router;
