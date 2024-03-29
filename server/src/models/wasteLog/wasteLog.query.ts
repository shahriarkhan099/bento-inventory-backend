import { Op, QueryTypes } from "sequelize";
import WasteLog from "./wasteLog.model";
import IngredientBatch from "../ingredientBatch/ingredientBatch.model";
import { IWasteLog } from "../../interfaces/wasteLog.interface";
import Ingredient from "../ingredient/ingredient.model";
import sequelize from "..";


export async function findAllWasteLogWithIngredient (restaurantId: number) {
    try {
      const wasteLog = await WasteLog.findAll({
        where: {
          restaurantId: restaurantId
        },
        include: [
        {
          model: Ingredient,
        }
      ],
      });

      return wasteLog;
    } catch (error) {
      console.log(error);
      throw new Error('Error finding waste logs.');
    }
}


export async function addWasteLog (wasteLog: IWasteLog, restaurantId: number) {
    try {
      wasteLog.restaurantId = restaurantId;
      const createdWasteLog = await WasteLog.create(wasteLog);
      return createdWasteLog;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating waste log.');
    }
}

export async function addToWasteLogByCheckingExpirationDateOfAllIngredientBatchesOfAllRestaurant () {
  try {
    const ingredientBatches = await IngredientBatch.findAll({
      where: {
        currentStockQuantity: {
          [Op.gt]: 0
        },
      },
      order: [
        ['createdAt', 'ASC']
      ]
    });

    for (let i = 0; i < ingredientBatches.length; i++) {
      const ingredientBatch = ingredientBatches[i];
      const wasteLog = await WasteLog.findOne({
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
          boughtAt: ingredientBatch.createdAt,
          expirationDate: ingredientBatch.expirationDate,
          ingredientId: ingredientBatch.ingredientId,
          restaurantId: ingredientBatch.restaurantId,
          consumptionQuantity: ingredientBatch.purchaseQuantity - ingredientBatch.currentStockQuantity,
          wastagePercentage: (ingredientBatch.purchaseQuantity - ingredientBatch.currentStockQuantity) / ingredientBatch.purchaseQuantity * 100
        }
        await addWasteLog(wasteLog, ingredientBatch.restaurantId);
      }
    }
  } catch (error) {
    throw new Error('Error creating waste log.');
  }
} 

export async function updateWasteLog (wasteLogId: number, wasteLog: IWasteLog) {
    try {
      const updatedWasteLog = await WasteLog.update(wasteLog, {
        where: {
          id: wasteLogId
        }
      });
      return updatedWasteLog;
    } catch (error) {
      throw new Error('Error updating waste log.');
    }
}


export async function findWasteLogBySearchTerm (restaurantId: number, searchTerm: string) {
    try {
      const wasteLog = await WasteLog.findAll({
        where: {
          ingredientName: {[Op.iLike]: `%${searchTerm}%`},
          restaurantId: restaurantId
        }
      });
      return wasteLog;
    } catch (error) {
      throw new Error('Error searching for waste log.');
    }
}

export async function deleteWasteLog(wasteLogId: number) {
  try {
    const deletedWasteLog = await WasteLog.destroy({
      where: {
        id: wasteLogId,
      },
    });
    return deletedWasteLog;
  } catch (error) {
    throw new Error("Error deleting waste log.");
  }
}

export async function getSevenMostWastedIngredients (restaurantId: number) {
  try {
    const sevenMostWastedIngredients = await sequelize.query(
      `SELECT "ingredientName", SUM("totalQuantity") as "totalWaste" FROM "wasteLogs" WHERE "restaurantId" = :restaurantId GROUP BY "ingredientName" ORDER BY "totalWaste" DESC LIMIT 7;`,
      {
        replacements: { restaurantId },
        type: QueryTypes.SELECT,
      }
    );
    return sevenMostWastedIngredients;
  } catch (error) {
    throw new Error('Error finding seven most wasted ingredients.');
  }
}