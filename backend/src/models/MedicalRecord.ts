import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { MedicalRecord as MedicalRecordInterface, Medication, LabResult, VitalSigns } from '../types';

interface MedicalRecordCreationAttributes extends Optional<MedicalRecordInterface, 'id' | 'createdAt' | 'updatedAt'> {}

class MedicalRecord extends Model<MedicalRecordInterface, MedicalRecordCreationAttributes> implements MedicalRecordInterface {
  public id!: string;
  public patientId!: string;
  public doctorId!: string;
  public appointmentId?: string;
  public date!: Date;
  public diagnosis!: string;
  public symptoms!: string;
  public treatment!: string;
  public medications!: Medication[];
  public labResults?: LabResult[];
  public vitals?: VitalSigns;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MedicalRecord.init(
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
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    symptoms: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    medications: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    labResults: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    vitals: {
      type: DataTypes.JSONB,
    },
    notes: {
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
    modelName: 'MedicalRecord',
    tableName: 'medical_records',
  }
);

export default MedicalRecord;