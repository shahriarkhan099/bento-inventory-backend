export interface IConsumptionLog {
    id: number;
    ingredientName: string;
    unitOfStock: string;
    currentStockQuantity: number;
    unitOfPrice: string;
    costPerUnit: number;
    expirationDate: Date; 
    ingredientId: number;
    restaurantId: number;
}