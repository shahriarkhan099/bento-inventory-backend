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
exports.findWasteLogBySearchTerm = exports.updateWasteLog = exports.addToWasteLogByCheckingExpirationDateOfAllIngredientBatchesOfAllRestaurant = exports.addWasteLog = exports.findAllWasteLogWithIngredient = void 0;
const sequelize_1 = require("sequelize");
const wasteLog_model_1 = __importDefault(require("./wasteLog.model"));
const ingredientBatch_model_1 = __importDefault(require("../ingredientBatch/ingredientBatch.model"));
const ingredient_model_1 = __importDefault(require("../ingredient/ingredient.model"));
function findAllWasteLogWithIngredient(restaurantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const wasteLog = yield wasteLog_model_1.default.findAll({
                where: {
                    restaurantId: restaurantId
                },
                include: [ingredient_model_1.default],
            });
            return wasteLog;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error finding waste logs.');
        }
    });
}
exports.findAllWasteLogWithIngredient = findAllWasteLogWithIngredient;
function addWasteLog(wasteLog, restaurantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            wasteLog.restaurantId = restaurantId;
            const createdWasteLog = yield wasteLog_model_1.default.create(wasteLog);
            return createdWasteLog;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error creating waste log.');
        }
    });
}
exports.addWasteLog = addWasteLog;
// export async function addWasteLogAndRemoveFromIngredient(ingredientBatchId: number, wasteLog: IWasteLog, restaurantId: number) {
//   try {
//     const ingredientBatch = await IngredientBatch.findOne({
//       where: {
//         id: ingredientBatchId
//       }
//     });
//     if (!ingredientBatch) {
//       throw new Error('Ingredient batch not found.');
//     }
//     const createdWasteLog = await addWasteLog(wasteLog, restaurantId);
//     await ingredientBatch.destroy();
//     return createdWasteLog;
//   } catch (error) {
//     console.log(error);
//     throw new Error('Error creating waste log.');
//   }
// }
function addToWasteLogByCheckingExpirationDateOfAllIngredientBatchesOfAllRestaurant() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ingredientBatches = yield ingredientBatch_model_1.default.findAll({
                where: {
                    currentStockQuantity: {
                        [sequelize_1.Op.gt]: 0
                    },
                },
                order: [
                    ['createdAt', 'ASC']
                ]
            });
            for (let i = 0; i < ingredientBatches.length; i++) {
                const ingredientBatch = ingredientBatches[i];
                const wasteLog = yield wasteLog_model_1.default.findOne({
                    where: {
                        id: ingredientBatch.id
                    }
                });
                if (wasteLog) {
                    continue;
                }
                const today = new Date();
                const expirationDate = new Date(ingredientBatch.expirationDate);
                if (today > expirationDate) {
                    const wasteLog = {
                        id: ingredientBatch.id,
                        ingredientName: ingredientBatch.ingredientName,
                        unitOfStock: ingredientBatch.unitOfStock,
                        totalQuantity: ingredientBatch.currentStockQuantity,
                        unitOfPrice: ingredientBatch.unitOfPrice,
                        totalCost: ingredientBatch.currentStockQuantity * ingredientBatch.costPerUnit,
                        costPerUnit: ingredientBatch.costPerUnit,
                        expirationDate: ingredientBatch.expirationDate,
                        ingredientId: ingredientBatch.ingredientId,
                        restaurantId: ingredientBatch.restaurantId,
                    };
                    yield addWasteLog(wasteLog, ingredientBatch.restaurantId);
                }
            }
        }
        catch (error) {
            throw new Error('Error creating waste log.');
        }
    });
}
exports.addToWasteLogByCheckingExpirationDateOfAllIngredientBatchesOfAllRestaurant = addToWasteLogByCheckingExpirationDateOfAllIngredientBatchesOfAllRestaurant;
function updateWasteLog(wasteLogId, wasteLog) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedWasteLog = yield wasteLog_model_1.default.update(wasteLog, {
                where: {
                    id: wasteLogId
                }
            });
            return updatedWasteLog;
        }
        catch (error) {
            throw new Error('Error updating waste log.');
        }
    });
}
exports.updateWasteLog = updateWasteLog;
function findWasteLogBySearchTerm(restaurantId, searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const wasteLog = yield wasteLog_model_1.default.findAll({
                where: {
                    ingredientName: { [sequelize_1.Op.iLike]: `%${searchTerm}%` },
                    restaurantId: restaurantId
                }
            });
            return wasteLog;
        }
        catch (error) {
            throw new Error('Error searching for waste log.');
        }
    });
}
exports.findWasteLogBySearchTerm = findWasteLogBySearchTerm;
