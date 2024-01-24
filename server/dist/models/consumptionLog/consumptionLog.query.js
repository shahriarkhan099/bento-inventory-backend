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
exports.findAvgConsumptionOfIngredientOfLastTwoWeekWihSpecificDay = exports.findAvgConsumptionOfIngredientOfLastTwoMonthWithfrequencyDays = exports.findAvgConsumptionOfIngredientOfLastTwoWeekWithfrequencyDays = exports.findAvgConsumptionOfIngredientOfLastTwoMonthForCurrentDay = exports.findAvgConsumptionOfIngredientOfLastTwoWeekForCurrentDay = exports.deductIngredientsAndDeliveryBoxesFromOrder = exports.deleteConsumptionLog = exports.updateConsumptionLog = exports.createConsumptionLogOfRestaurantFromDeduction = exports.createConsumptionLogOfRestaurant = exports.findConsumptionLogsByIngredientName = exports.findAllConsumptionLogsOfRestaurant = void 0;
const sequelize_1 = require("sequelize");
const __1 = __importDefault(require(".."));
const consumptionLog_model_1 = __importDefault(require("./consumptionLog.model"));
const deliveryBox_query_1 = require("../deliveryBox/deliveryBox.query");
const ingredient_query_1 = require("../ingredient/ingredient.query");
function findAllConsumptionLogsOfRestaurant(restaurantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const consumptionLogs = yield consumptionLog_model_1.default.findAll({
                where: {
                    restaurantId: restaurantId,
                }
            });
            return consumptionLogs;
        }
        catch (error) {
            throw new Error("Error finding consumption logs.");
        }
    });
}
exports.findAllConsumptionLogsOfRestaurant = findAllConsumptionLogsOfRestaurant;
function findConsumptionLogsByIngredientName(restaurantId, ingredientName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const consumptionLogs = yield consumptionLog_model_1.default.findAll({
                where: {
                    restaurantId: restaurantId,
                    itemName: {
                        [sequelize_1.Op.like]: `%${ingredientName}%`,
                    },
                },
            });
            return consumptionLogs;
        }
        catch (error) {
            throw new Error("Error finding consumption logs.");
        }
    });
}
exports.findConsumptionLogsByIngredientName = findConsumptionLogsByIngredientName;
function createConsumptionLogOfRestaurant(consumptionLog, restaurantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            consumptionLog.restaurantId = restaurantId;
            const newConsumptionLog = yield consumptionLog_model_1.default.create(consumptionLog);
            return newConsumptionLog;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error creating consumption log.");
        }
    });
}
exports.createConsumptionLogOfRestaurant = createConsumptionLogOfRestaurant;
function createConsumptionLogOfRestaurantFromDeduction(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newConsumptionLog = yield consumptionLog_model_1.default.create(Object.assign(Object.assign({}, data), { consumedAt: new Date() }));
            return newConsumptionLog;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error creating consumption log.");
        }
    });
}
exports.createConsumptionLogOfRestaurantFromDeduction = createConsumptionLogOfRestaurantFromDeduction;
function updateConsumptionLog(consumptionLogId, consumptionLog) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedConsumptionLog = yield consumptionLog_model_1.default.update(consumptionLog, {
                where: {
                    id: consumptionLogId,
                },
            });
            return updatedConsumptionLog;
        }
        catch (error) {
            throw new Error("Error updating consumption log.");
        }
    });
}
exports.updateConsumptionLog = updateConsumptionLog;
function deleteConsumptionLog(consumptionLogId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedConsumptionLog = yield consumptionLog_model_1.default.destroy({
                where: {
                    id: consumptionLogId,
                },
            });
            return deletedConsumptionLog;
        }
        catch (error) {
            throw new Error("Error deleting consumption log.");
        }
    });
}
exports.deleteConsumptionLog = deleteConsumptionLog;
function deductIngredientsAndDeliveryBoxesFromOrder(order) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { orderType, ingredientsToReduce, deliveryBoxesToReduce, restaurantId } = order;
            const deductedIngredients = yield (0, ingredient_query_1.deductIngredientsFromOrder)({ ingredientsToReduce, orderType, restaurantId });
            const deductedDeliveryBoxes = yield (0, deliveryBox_query_1.deductDeliveryBoxesFromOrder)({ deliveryBoxesToReduce, orderType, restaurantId });
            return { deductedIngredients, deductedDeliveryBoxes };
        }
        catch (error) {
            throw new Error('Error deducting ingredients and delivery boxes from order.');
        }
    });
}
exports.deductIngredientsAndDeliveryBoxesFromOrder = deductIngredientsAndDeliveryBoxesFromOrder;
function findAvgConsumptionOfIngredientOfLastTwoWeekForCurrentDay(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentDayOfWeek = new Date().getDay();
            const avgConsumption = yield consumptionLog_model_1.default.findAll({
                attributes: [
                    [__1.default.fn("AVG", __1.default.col("quantity")), "avgConsumption"],
                ],
                where: {
                    itemId: productId,
                    consumedAt: {
                        [sequelize_1.Op.gte]: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),
                        [sequelize_1.Op.and]: __1.default.where(__1.default.fn("DAYOFWEEK", __1.default.col("consumedAt")), currentDayOfWeek),
                    },
                },
            });
            return avgConsumption;
        }
        catch (error) {
            throw new Error('Error finding average consumption of ingredient.');
        }
    });
}
exports.findAvgConsumptionOfIngredientOfLastTwoWeekForCurrentDay = findAvgConsumptionOfIngredientOfLastTwoWeekForCurrentDay;
function findAvgConsumptionOfIngredientOfLastTwoMonthForCurrentDay(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentDayOfWeek = new Date().getDay();
            const avgConsumption = yield consumptionLog_model_1.default.findAll({
                attributes: [
                    [__1.default.fn("AVG", __1.default.col("quantity")), "avgConsumption"],
                ],
                where: {
                    itemId: productId,
                    consumedAt: {
                        [sequelize_1.Op.gte]: new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000),
                        [sequelize_1.Op.and]: __1.default.where(__1.default.fn("DAYOFWEEK", __1.default.col("consumedAt")), currentDayOfWeek),
                    },
                },
            });
            return avgConsumption;
        }
        catch (error) {
            throw new Error('Error finding average consumption of ingredient.');
        }
    });
}
exports.findAvgConsumptionOfIngredientOfLastTwoMonthForCurrentDay = findAvgConsumptionOfIngredientOfLastTwoMonthForCurrentDay;
function findAvgConsumptionOfIngredientOfLastTwoWeekWithfrequencyDays(productId, frequencyDays) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentDayOfWeek = new Date().getDay();
            const frequencyDaysArray = Array.from({ length: frequencyDays }, (_, index) => (currentDayOfWeek + index + 1) % 7);
            const avgConsumption = yield consumptionLog_model_1.default.findAll({
                attributes: [
                    [__1.default.fn("AVG", __1.default.col("quantity")), "avgConsumption"],
                ],
                where: {
                    itemId: productId,
                    consumedAt: {
                        [sequelize_1.Op.gte]: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),
                        [sequelize_1.Op.and]: __1.default.where(__1.default.fn("DAYOFWEEK", __1.default.col("consumedAt")), {
                            [sequelize_1.Op.or]: frequencyDaysArray,
                        }),
                    },
                },
            });
            return avgConsumption;
        }
        catch (error) {
            throw new Error('Error finding average consumption of ingredient.');
        }
    });
}
exports.findAvgConsumptionOfIngredientOfLastTwoWeekWithfrequencyDays = findAvgConsumptionOfIngredientOfLastTwoWeekWithfrequencyDays;
function findAvgConsumptionOfIngredientOfLastTwoMonthWithfrequencyDays(productId, frequencyDays) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentDayOfWeek = new Date().getDay();
            const frequencyDaysArray = Array.from({ length: frequencyDays }, (_, index) => (currentDayOfWeek + index + 1) % 7);
            const avgConsumption = yield consumptionLog_model_1.default.findAll({
                attributes: [
                    [__1.default.fn("AVG", __1.default.col("quantity")), "avgConsumption"],
                ],
                where: {
                    itemId: productId,
                    consumedAt: {
                        [sequelize_1.Op.gte]: new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000),
                        [sequelize_1.Op.and]: __1.default.where(__1.default.fn("DAYOFWEEK", __1.default.col("consumedAt")), {
                            [sequelize_1.Op.or]: frequencyDaysArray,
                        }),
                    },
                },
            });
            return avgConsumption;
        }
        catch (error) {
            throw new Error('Error finding average consumption of ingredient.');
        }
    });
}
exports.findAvgConsumptionOfIngredientOfLastTwoMonthWithfrequencyDays = findAvgConsumptionOfIngredientOfLastTwoMonthWithfrequencyDays;
function findAvgConsumptionOfIngredientOfLastTwoWeekWihSpecificDay(productId, day) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const avgConsumption = yield consumptionLog_model_1.default.findAll({
                attributes: [
                    [__1.default.fn("AVG", __1.default.col("quantity")), "avgConsumption"],
                ],
                where: {
                    itemId: productId,
                    consumedAt: {
                        [sequelize_1.Op.gte]: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),
                        [sequelize_1.Op.and]: __1.default.where(__1.default.fn("DAYOFWEEK", __1.default.col("consumedAt")), day),
                    },
                },
            });
            return avgConsumption;
        }
        catch (error) {
            throw new Error('Error finding average consumption of ingredient.');
        }
    });
}
exports.findAvgConsumptionOfIngredientOfLastTwoWeekWihSpecificDay = findAvgConsumptionOfIngredientOfLastTwoWeekWihSpecificDay;
