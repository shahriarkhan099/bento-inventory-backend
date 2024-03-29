"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIngredientIdByIngredientNameAndRestaurantId = exports.checkAllIngredientOfRestaurantIfNeededToOrderListWithFrequencyDays = exports.checkAllIngredientOfAllRestaurantsIfNeededToOrderList = exports.findOneIngredientWithUniqueIngredientId = exports.findOneIngredientOfRestaurantWithUniqueIngredientId = exports.deductIngredientsFromOrder = exports.updateIngredientInfoOfRestaurantWithNewIngredientBatch = exports.updateCurrentStockQuantityOfIngredient = exports.findOneIngredientOfRestaurant = exports.findAllIngredientOfRestaurantWithCategoryAndIngredientBatch = exports.findIngredientsByCategoryName = exports.findIngredientsByIngredientName = exports.findIngredientWithCategory = exports.deleteIngredientOfRestaurant = exports.updateIngredientOfRestaurant = exports.findIngredientBySearchTerm = exports.addIngredientToRestaurant = exports.findAllIngredientOfRestaurant = exports.findIngredientByIngredientUniqueId = exports.findIngredientbyId = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../index"));
const ingredient_model_1 = __importDefault(require("./ingredient.model"));
const category_model_1 = __importDefault(require("../category/category.model"));
const ingredientBatch_model_1 = __importDefault(require("../ingredientBatch/ingredientBatch.model"));
const ingredientBatch_query_1 = require("../ingredientBatch/ingredientBatch.query");
const consumptionLog_query_1 = require("../consumptionLog/consumptionLog.query");
function findIngredientbyId(ingredientId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findOne({
                where: {
                    id: ingredientId,
                },
                include: [category_model_1.default],
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.findIngredientbyId = findIngredientbyId;
function findIngredientByIngredientUniqueId(restaurantId, ingredientUniqueId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findOne({
                where: {
                    uniqueIngredientId: ingredientUniqueId,
                    restaurantId: restaurantId
                }
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.findIngredientByIngredientUniqueId = findIngredientByIngredientUniqueId;
function findAllIngredientOfRestaurant(restaurantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findAll({
                where: {
                    restaurantId: restaurantId,
                },
                order: [
                    ['ingredientName', 'ASC']
                ]
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.findAllIngredientOfRestaurant = findAllIngredientOfRestaurant;
function addIngredientToRestaurant(ingredient) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkExistent = yield findIngredientByIngredientUniqueId(ingredient.restaurantId, ingredient.uniqueIngredientId);
            if (!checkExistent) {
                if (ingredient.unitOfStock === "kg") {
                    ingredient.unitOfStock = "gm";
                }
                else if (ingredient.unitOfStock === "litre") {
                    ingredient.unitOfStock = "ml";
                }
                const newIngredient = yield ingredient_model_1.default.create(ingredient);
                return newIngredient;
            }
            else {
                throw new Error("Ingredient already exists.");
            }
        }
        catch (error) {
            console.log(error);
            throw new Error("Error creating global ingredient.");
        }
    });
}
exports.addIngredientToRestaurant = addIngredientToRestaurant;
function findIngredientBySearchTerm(restaurantId, searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findAll({
                where: {
                    ingredientName: { [sequelize_1.Op.iLike]: `%${searchTerm}%` },
                    restaurantId: restaurantId,
                },
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error searching for global ingredient.");
        }
    });
}
exports.findIngredientBySearchTerm = findIngredientBySearchTerm;
function updateIngredientOfRestaurant(ingredientId, ingredient) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedIngredient = yield ingredient_model_1.default.update(ingredient, {
                where: {
                    id: ingredientId,
                },
            });
            return updatedIngredient;
        }
        catch (error) {
            throw new Error("Error updating global ingredient.");
        }
    });
}
exports.updateIngredientOfRestaurant = updateIngredientOfRestaurant;
function deleteIngredientOfRestaurant(ingredientId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedIngredient = yield ingredient_model_1.default.destroy({
                where: {
                    id: ingredientId,
                },
            });
            return deletedIngredient;
        }
        catch (error) {
            throw new Error("Error deleting global ingredient.");
        }
    });
}
exports.deleteIngredientOfRestaurant = deleteIngredientOfRestaurant;
function findIngredientWithCategory(restaurantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findAll({
                where: {
                    restaurantId: restaurantId,
                },
                include: [category_model_1.default],
                order: [
                    ['updatedAt', 'DESC']
                ]
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.findIngredientWithCategory = findIngredientWithCategory;
function findIngredientsByIngredientName(restaurantId, ingredientName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findAll({
                where: {
                    ingredientName: ingredientName,
                    restaurantId: restaurantId,
                },
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.findIngredientsByIngredientName = findIngredientsByIngredientName;
function findIngredientsByCategoryName(restaurantId, categoryName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findAll({
                where: {
                    restaurantId: restaurantId,
                },
                include: [
                    {
                        model: category_model_1.default,
                        where: {
                            categoryName: categoryName,
                        },
                    },
                ],
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.findIngredientsByCategoryName = findIngredientsByCategoryName;
function findAllIngredientOfRestaurantWithCategoryAndIngredientBatch(restaurantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findAll({
                where: {
                    restaurantId: restaurantId,
                },
                include: [
                    {
                        model: category_model_1.default,
                    },
                    {
                        model: ingredientBatch_model_1.default,
                    },
                ],
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.findAllIngredientOfRestaurantWithCategoryAndIngredientBatch = findAllIngredientOfRestaurantWithCategoryAndIngredientBatch;
function findOneIngredientOfRestaurant(ingredientId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findOne({
                where: {
                    id: ingredientId,
                },
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.findOneIngredientOfRestaurant = findOneIngredientOfRestaurant;
function updateCurrentStockQuantityOfIngredient(ingredientId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield findOneIngredientOfRestaurant(ingredientId);
            let updatedIngredient;
            if (ingredient) {
                let totalStockQuantity = yield ingredientBatch_model_1.default.sum("currentStockQuantity", {
                    where: {
                        currentStockQuantity: {
                            [sequelize_1.Op.ne]: 0,
                        },
                        ingredientId: ingredient.id,
                    },
                });
                if (!totalStockQuantity) {
                    totalStockQuantity = 0;
                }
                updatedIngredient = yield ingredient_model_1.default.update({
                    currentStockQuantity: totalStockQuantity,
                }, {
                    where: {
                        id: ingredient.id,
                    },
                });
            }
            else {
                throw new Error('Ingredient not found.');
            }
            return updatedIngredient;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error updating global ingredient.");
        }
    });
}
exports.updateCurrentStockQuantityOfIngredient = updateCurrentStockQuantityOfIngredient;
function updateIngredientInfoOfRestaurantWithNewIngredientBatch(ingredientBatch) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield findOneIngredientOfRestaurant(ingredientBatch.ingredientId);
            let updatedIngredient;
            if (ingredient) {
                yield updateCurrentStockQuantityOfIngredient(ingredient.id);
                const averageCostPerUnit = ingredientBatch.costPerUnit ? ingredientBatch.costPerUnit : 0;
                updatedIngredient = yield ingredient_model_1.default.update({
                    costPerUnit: averageCostPerUnit
                        ? averageCostPerUnit
                        : 0,
                }, {
                    where: {
                        id: ingredientBatch.ingredientId,
                    },
                });
            }
            else {
                throw new Error("Ingredient not found.");
            }
            return updatedIngredient;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error updating global ingredient.");
        }
    });
}
exports.updateIngredientInfoOfRestaurantWithNewIngredientBatch = updateIngredientInfoOfRestaurantWithNewIngredientBatch;
function deductIngredientsFromOrder(order) {
    return __awaiter(this, void 0, void 0, function* () {
        const { orderType, ingredientsToReduce, restaurantId } = order;
        const transaction = yield index_1.default.transaction();
        try {
            const deductedIngredients = [];
            for (const ingredientToReduce of ingredientsToReduce) {
                const { id, quantity } = ingredientToReduce;
                const ingredient = yield findIngredientbyId(id);
                if (ingredient) {
                    const deductedBatches = yield (0, ingredientBatch_query_1.deductIngredientBatchesInFIFO)(ingredient.id, quantity, orderType);
                    updateCurrentStockQuantityOfIngredient(ingredient.id);
                    deductedIngredients.push({ ingredientId: ingredient.id, deductedIngredientBatches: deductedBatches, });
                    // check reorder point by ingredient id
                    // if (ingredient.currentStockQuantity <= ingredient.reorderPoint) {
                    //   console.log("Reorder point reached.");
                    // }
                }
                else {
                    throw new Error(`Ingredient with ID ${id} not found.`);
                }
            }
            yield transaction.commit();
            return deductedIngredients;
        }
        catch (error) {
            throw new Error(`Error deducting ingredients: ${error}`);
        }
    });
}
exports.deductIngredientsFromOrder = deductIngredientsFromOrder;
function findOneIngredientOfRestaurantWithUniqueIngredientId(uniqueIngredientId, restaurantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findOne({
                where: {
                    uniqueIngredientId: uniqueIngredientId,
                    restaurantId: restaurantId
                }
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.findOneIngredientOfRestaurantWithUniqueIngredientId = findOneIngredientOfRestaurantWithUniqueIngredientId;
function findOneIngredientWithUniqueIngredientId(uniqueIngredientId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findOne({
                where: {
                    uniqueIngredientId: uniqueIngredientId,
                },
                order: [
                    ['createdAt', 'ASC']
                ]
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.findOneIngredientWithUniqueIngredientId = findOneIngredientWithUniqueIngredientId;
function checkAllIngredientOfAllRestaurantsIfNeededToOrderList() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredients = yield ingredient_model_1.default.findAll();
            let ingredientsToOrder = [];
            for (const ingredient of ingredients) {
                const hundredPercentIngredientAmount = yield (0, consumptionLog_query_1.findAvgConsumptionOfIngredientOfLastTwoWeeks)(ingredient.id, 3);
                console.log("ingredient", ingredient.ingredientName);
                console.log("hundredPercentIngredientAmount", hundredPercentIngredientAmount);
                const todayDateWithOnlyDate = new Date(new Date().setHours(0, 0, 0, 0));
                const totalAmountOfIngredientThatExpiresToday = yield (0, ingredientBatch_query_1.getTotalAmountOfIngredientThatExpiresInSpecificDate)(ingredient.id, todayDateWithOnlyDate);
                const totalAmountOfIngredientThatExpiresTomorrow = yield (0, ingredientBatch_query_1.getTotalAmountOfIngredientThatExpiresInSpecificDate)(ingredient.id, new Date(todayDateWithOnlyDate.setDate(todayDateWithOnlyDate.getDate() + 1)));
                const totalAmountOfIngredientThatExpiresInThreeDays = yield (0, ingredientBatch_query_1.getTotalAmountOfIngredientThatExpiresInSpecificDate)(ingredient.id, new Date(todayDateWithOnlyDate.setDate(todayDateWithOnlyDate.getDate() + 2)));
                if ((ingredient.currentStockQuantity <= ingredient.reorderPoint && ingredient.reorderPoint !== 0)
                    && ingredient.currentStockQuantity <= (hundredPercentIngredientAmount * 0.2)) {
                    ingredientsToOrder.push(ingredient);
                }
                else if (totalAmountOfIngredientThatExpiresToday) {
                    if ((ingredient.currentStockQuantity - totalAmountOfIngredientThatExpiresToday) <= (hundredPercentIngredientAmount * 0.2)) {
                        ingredientsToOrder.push(ingredient);
                    }
                }
                else if (totalAmountOfIngredientThatExpiresTomorrow) {
                    if ((ingredient.currentStockQuantity - totalAmountOfIngredientThatExpiresTomorrow) <= (hundredPercentIngredientAmount * 0.2)) {
                        ingredientsToOrder.push(ingredient);
                    }
                }
                else if (totalAmountOfIngredientThatExpiresInThreeDays) {
                    if ((ingredient.currentStockQuantity - totalAmountOfIngredientThatExpiresInThreeDays) <= (hundredPercentIngredientAmount * 0.2)) {
                        ingredientsToOrder.push(ingredient);
                    }
                }
            }
            return ingredientsToOrder;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.checkAllIngredientOfAllRestaurantsIfNeededToOrderList = checkAllIngredientOfAllRestaurantsIfNeededToOrderList;
function checkAllIngredientOfRestaurantIfNeededToOrderListWithFrequencyDays(frequencyDays) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredients = yield ingredient_model_1.default.findAll();
            let ingredientsToOrder = [];
            for (const ingredient of ingredients) {
                const hundredPercentIngredientAmount = yield (0, consumptionLog_query_1.findAvgConsumptionOfIngredientOfLastTwoWeeks)(ingredient.id, frequencyDays);
                const todayDateWithOnlyDate = new Date(new Date().setHours(0, 0, 0, 0));
                if ((ingredient.currentStockQuantity <= ingredient.reorderPoint && ingredient.reorderPoint !== 0)
                    || ingredient.currentStockQuantity <= (hundredPercentIngredientAmount * 0.2)) {
                    ingredientsToOrder.push(ingredient);
                }
                else {
                    for (let i = 0; i < frequencyDays; i++) {
                        let currentDate = new Date(todayDateWithOnlyDate.getTime());
                        currentDate.setDate(currentDate.getDate() + i);
                        const totalWastageAmount = yield (0, ingredientBatch_query_1.getTotalAmountOfIngredientThatExpiresInSpecificDate)(ingredient.id, currentDate);
                        if (totalWastageAmount) {
                            if ((ingredient.currentStockQuantity - totalWastageAmount) <= (hundredPercentIngredientAmount * 0.2)) {
                                ingredientsToOrder.push(ingredient);
                            }
                        }
                    }
                }
            }
            console.log("Before Converting", ingredientsToOrder);
            let ingredientsWithRestaurants = sortIngredientsByRestaurant(ingredientsToOrder);
            console.log("After Converting", ingredientsWithRestaurants);
            return ingredientsWithRestaurants;
        }
        catch (error) {
            throw new Error("Error finding global ingredient.");
        }
    });
}
exports.checkAllIngredientOfRestaurantIfNeededToOrderListWithFrequencyDays = checkAllIngredientOfRestaurantIfNeededToOrderListWithFrequencyDays;
function sortIngredientsByRestaurant(ingredients) {
    const ingredientsByRestaurant = {};
    ingredients.forEach((ingredient) => {
        const { restaurantId } = ingredient;
        if (!ingredientsByRestaurant[restaurantId]) {
            ingredientsByRestaurant[restaurantId] = [];
        }
        ingredientsByRestaurant[restaurantId].push(ingredient);
    });
    return ingredientsByRestaurant;
}
function findIngredientIdByIngredientNameAndRestaurantId(restaurantId, ingredientName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findOne({
                where: {
                    ingredientName: ingredientName,
                    restaurantId: restaurantId
                }
            });
            return ingredient;
        }
        catch (error) {
            throw new Error("Error finding ingredient by IngredientName and RestaurantId.");
        }
    });
}
exports.findIngredientIdByIngredientNameAndRestaurantId = findIngredientIdByIngredientNameAndRestaurantId;
