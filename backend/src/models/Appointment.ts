import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Appointment as AppointmentInterface } from '../types';

interface AppointmentCreationAttributes extends Optional<AppointmentInterface, 'id' | 'createdAt' | 'updatedAt'> {}

class Appointment extends Model<AppointmentInterface, AppointmentCreationAttributes> implements AppointmentInterface {
  public id!: string;
  public patientId!: string;
  public doctorId!: string;
  public date!: Date;
  public startTime!: string;
  public endTime!: string;
  public status!: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  public type!: 'consultation' | 'follow-up' | 'emergency' | 'routine-checkup';
  public notes?: string;
  public symptoms?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
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
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'doctors',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'),
      allowNull: false,
      defaultValue: 'scheduled',
    },
    type: {
      type: DataTypes.ENUM('consultation', 'follow-up', 'emergency', 'routine-checkup'),
      allowNull: false,
      defaultValue: 'consultation',
    },
    notes: {
      type: DataTypes.TEXT,
    },
    symptoms: {
      type: DataTypes.TEXT,
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
    modelName: 'Appointment',
    tableName: 'appointments',
  }
);

export default Appointment;