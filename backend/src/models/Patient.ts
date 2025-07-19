import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Patient as PatientInterface } from '../types';
import User from './User';

interface PatientCreationAttributes extends Optional<PatientInterface, 'id' | 'createdAt' | 'updatedAt'> {}

class Patient extends Model<PatientInterface, PatientCreationAttributes> implements PatientInterface {
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient';
  public firstName!: string;
  public lastName!: string;
  public phone?: string;
  public address?: string;
  public dateOfBirth?: Date;
  public gender?: 'male' | 'female' | 'other';
  public profilePicture?: string;
  public isActive!: boolean;
  public medicalRecordNumber!: string;
  public emergencyContact!: string;
  public emergencyPhone!: string;
  public allergies?: string[];
  public bloodType?: string;
  public insurance?: {
    provider: string;
    policyNumber: string;
    expirationDate: Date;
  };
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Patient.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'doctor', 'nurse', 'receptionist', 'patient'),
      allowNull: false,
      defaultValue: 'patient',
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    medicalRecordNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emergencyPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    allergies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    bloodType: {
      type: DataTypes.STRING,
    },
    insurance: {
      type: DataTypes.JSONB,
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
    modelName: 'Patient',
    tableName: 'patients',
  }
);

export default Patient;