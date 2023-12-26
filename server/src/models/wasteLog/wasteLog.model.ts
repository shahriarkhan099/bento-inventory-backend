import { Model, DataTypes, Optional } from 'sequelize';
import { IWasteLog } from '../../interfaces/wasteLog.interface';
import sequelize from '..';

interface WasteLogCreationAttributes extends Optional<IWasteLog, 'id'> {};

interface WasteLogInstance extends Model<IWasteLog, WasteLogCreationAttributes>, IWasteLog {
  createdAt?: Date;
  updatedAt?: Date;
}

const WasteLog = sequelize.define<WasteLogInstance>('wasteLogs', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            unique: true,
        },
        ingredientName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        unitOfStock: {
            type: DataTypes.ENUM('gm', 'ml', 'piece'),
            allowNull: false,
        },
        totalQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unitOfCost: {
            type: DataTypes.ENUM('cents', 'usd'),
            allowNull: false,
        },
        totalCost: {
            type: DataTypes.FLOAT, 
            allowNull: false,
        },
        costPerUnit: {
            type: DataTypes.FLOAT,
        },
        expirationDate: {
            type: DataTypes.DATE,
        },
        ingredientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        restaurantId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
});

export default WasteLog;
