import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User as UserInterface } from '../types';

interface UserCreationAttributes extends Optional<UserInterface, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserInterface, UserCreationAttributes> implements UserInterface {
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
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
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
    modelName: 'User',
    tableName: 'users',
  }
);

export default User;