"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ingredient_controller_1 = require("../controllers/ingredient.controller");
const router = (0, express_1.Router)();
router.get('/restaurant/:restaurantId', ingredient_controller_1.getAllIngredientOfRestaurant);
router.post('/restaurant/:restaurantId', ingredient_controller_1.postIngredientToRestaurant);
router.put('/restaurant/ingredientId', ingredient_controller_1.updateIngredient);
router.delete('/restaurant/ingredientId', ingredient_controller_1.deleteIngredient);
router.get('/search', ingredient_controller_1.searchIngredient);
exports.default = router;
