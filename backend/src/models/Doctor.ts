import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Doctor as DoctorInterface, DoctorAvailability } from '../types';

interface DoctorCreationAttributes extends Optional<DoctorInterface, 'id' | 'createdAt' | 'updatedAt'> {}

class Doctor extends Model<DoctorInterface, DoctorCreationAttributes> implements DoctorInterface {
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
  public licenseNumber!: string;
  public specialization!: string;
  public yearsOfExperience!: number;
  public consultationFee!: number;
  public availability!: DoctorAvailability[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Doctor.init(
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
      defaultValue: 'doctor',
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
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    yearsOfExperience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    consultationFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    availability: {
      type: DataTypes.JSONB,
      defaultValue: [],
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
    modelName: 'Doctor',
    tableName: 'doctors',
  }
);

export default Doctor;