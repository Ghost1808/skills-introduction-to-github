import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Patient, Doctor } from '../models';
import { ApiResponse } from '../types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, role, firstName, lastName, ...otherData } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El usuario ya existe con este email',
        } as ApiResponse);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      let newUser;

      // Create user based on role
      if (role === 'patient') {
        newUser = await Patient.create({
          email,
          password: hashedPassword,
          role,
          firstName,
          lastName,
          ...otherData,
        });
      } else if (role === 'doctor') {
        newUser = await Doctor.create({
          email,
          password: hashedPassword,
          role,
          firstName,
          lastName,
          ...otherData,
        });
      } else {
        newUser = await User.create({
          email,
          password: hashedPassword,
          role,
          firstName,
          lastName,
          ...otherData,
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password from response
      const userResponse = { ...newUser.toJSON() };
      delete userResponse.password;

      return res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: userResponse,
          token,
        },
      } as ApiResponse);
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errors: [(error as Error).message],
      } as ApiResponse);
    }
  }

  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // Find user by email
      let user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Try to find in Patient table
        user = await Patient.findOne({ where: { email } });
      }
      
      if (!user) {
        // Try to find in Doctor table
        user = await Doctor.findOne({ where: { email } });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
        } as ApiResponse);
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Cuenta desactivada. Contacte al administrador.',
        } as ApiResponse);
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
        } as ApiResponse);
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password from response
      const userResponse = { ...user.toJSON() };
      delete userResponse.password;

      return res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: userResponse,
          token,
        },
      } as ApiResponse);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errors: [(error as Error).message],
      } as ApiResponse);
    }
  }

  static async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;

      let user;
      if (userRole === 'patient') {
        user = await Patient.findByPk(userId);
      } else if (userRole === 'doctor') {
        user = await Doctor.findByPk(userId);
      } else {
        user = await User.findByPk(userId);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        } as ApiResponse);
      }

      // Remove password from response
      const userResponse = { ...user.toJSON() };
      delete userResponse.password;

      return res.status(200).json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: userResponse,
      } as ApiResponse);
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errors: [(error as Error).message],
      } as ApiResponse);
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;
      const updateData = req.body;

      // Remove sensitive fields
      delete updateData.password;
      delete updateData.email;
      delete updateData.role;
      delete updateData.id;

      let user;
      if (userRole === 'patient') {
        user = await Patient.findByPk(userId);
        if (user) {
          await user.update(updateData);
        }
      } else if (userRole === 'doctor') {
        user = await Doctor.findByPk(userId);
        if (user) {
          await user.update(updateData);
        }
      } else {
        user = await User.findByPk(userId);
        if (user) {
          await user.update(updateData);
        }
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        } as ApiResponse);
      }

      // Remove password from response
      const userResponse = { ...user.toJSON() };
      delete userResponse.password;

      return res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: userResponse,
      } as ApiResponse);
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errors: [(error as Error).message],
      } as ApiResponse);
    }
  }

  static async changePassword(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;
      const { currentPassword, newPassword } = req.body;

      let user;
      if (userRole === 'patient') {
        user = await Patient.findByPk(userId);
      } else if (userRole === 'doctor') {
        user = await Doctor.findByPk(userId);
      } else {
        user = await User.findByPk(userId);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        } as ApiResponse);
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña actual incorrecta',
        } as ApiResponse);
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await user.update({ password: hashedNewPassword });

      return res.status(200).json({
        success: true,
        message: 'Contraseña cambiada exitosamente',
      } as ApiResponse);
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errors: [(error as Error).message],
      } as ApiResponse);
    }
  }
}