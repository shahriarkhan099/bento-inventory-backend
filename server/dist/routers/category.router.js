"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const router = (0, express_1.Router)();
router.get('/restaurant/:restaurantId', category_controller_1.getAllCategoryOfRestaurant);
router.post('/restaurant/:restaurantId', category_controller_1.postCategoryToRestaurant);
router.get('/restaurant/:restaurantId/categories/search', category_controller_1.searchCategory);
router.put('/restaurant/:categoryId', category_controller_1.updateCategory);
router.delete('/restaurant/:categoryId', category_controller_1.deleteCategory);
exports.default = router;