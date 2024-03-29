"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
router.get('/restaurant/:restaurantId', order_controller_1.getAllOrderOfRestaurantWithBatch);
router.put('/restaurant/:orderId', order_controller_1.editOrderOfRestaurant);
router.delete('/restaurant/:orderId', order_controller_1.removeOrderOfRestaurant);
router.post('/restaurant/:restaurantId/ingredientBatches', order_controller_1.createOrderToRestaurantWithIngredientBatches);
router.post('/restaurant/:restaurantId/deliveryBoxBatches', order_controller_1.createOrderToRestaurantWithDeliveryBoxBatches);
router.post('/restaurant/:restaurantId/allBatches', order_controller_1.createOrderToRestaurantWithAllBatches);
exports.default = router;
