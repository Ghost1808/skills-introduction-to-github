import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Invoice as InvoiceInterface, InvoiceItem } from '../types';

interface InvoiceCreationAttributes extends Optional<InvoiceInterface, 'id' | 'createdAt' | 'updatedAt'> {}

class Invoice extends Model<InvoiceInterface, InvoiceCreationAttributes> implements InvoiceInterface {
  public id!: string;
  public patientId!: string;
  public appointmentId?: string;
  public date!: Date;
  public items!: InvoiceItem[];
  public subtotal!: number;
  public tax!: number;
  public discount!: number;
  public total!: number;
  public status!: 'pending' | 'paid' | 'overdue' | 'cancelled';
  public paymentMethod?: string;
  public paymentDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id',
      },
    },
    appointmentId: {
      type: DataTypes.UUID,
      references: {
        model: 'appointments',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.STRING,
    },
    paymentDate: {
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices',
  }
);

export default Invoice;