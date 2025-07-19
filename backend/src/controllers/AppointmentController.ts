import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Appointment, Patient, Doctor } from '../models';
import { ApiResponse, PaginatedResponse } from '../types';

export class AppointmentController {
  static async createAppointment(req: Request, res: Response): Promise<Response> {
    try {
      const { patientId, doctorId, date, startTime, endTime, type, notes, symptoms } = req.body;
      const userRole = (req as any).user.role;
      const userId = (req as any).user.id;

      // Validate user permissions
      if (userRole === 'patient' && patientId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para crear citas para otros pacientes',
        } as ApiResponse);
      }

      // Check if doctor exists and is active
      const doctor = await Doctor.findByPk(doctorId);
      if (!doctor || !doctor.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Doctor no encontrado o inactivo',
        } as ApiResponse);
      }

      // Check if patient exists and is active
      const patient = await Patient.findByPk(patientId);
      if (!patient || !patient.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Paciente no encontrado o inactivo',
        } as ApiResponse);
      }

      // Check for conflicting appointments
      const conflictingAppointment = await Appointment.findOne({
        where: {
          doctorId,
          date,
          status: {
            [Op.notIn]: ['cancelled', 'no-show']
          },
          [Op.or]: [
            {
              startTime: {
                [Op.between]: [startTime, endTime]
              }
            },
            {
              endTime: {
                [Op.between]: [startTime, endTime]
              }
            },
            {
              [Op.and]: [
                { startTime: { [Op.lte]: startTime } },
                { endTime: { [Op.gte]: endTime } }
              ]
            }
          ]
        }
      });

      if (conflictingAppointment) {
        return res.status(400).json({
          success: false,
          message: 'El doctor ya tiene una cita programada en ese horario',
        } as ApiResponse);
      }

      const appointment = await Appointment.create({
        patientId,
        doctorId,
        date,
        startTime,
        endTime,
        type: type || 'consultation',
        notes,
        symptoms,
        status: 'scheduled'
      });

      const appointmentWithDetails = await Appointment.findByPk(appointment.id, {
        include: [
          {
            model: Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: Doctor,
            as: 'doctor',
            attributes: ['id', 'firstName', 'lastName', 'specialization', 'consultationFee']
          }
        ]
      });

      return res.status(201).json({
        success: true,
        message: 'Cita creada exitosamente',
        data: appointmentWithDetails,
      } as ApiResponse);
    } catch (error) {
      console.error('Create appointment error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errors: [(error as Error).message],
      } as ApiResponse);
    }
  }

  static async getAppointments(req: Request, res: Response): Promise<Response> {
    try {
      const userRole = (req as any).user.role;
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const date = req.query.date as string;
      const doctorId = req.query.doctorId as string;
      const patientId = req.query.patientId as string;

      const offset = (page - 1) * limit;
      let whereClause: any = {};

      // Apply role-based filters
      if (userRole === 'patient') {
        whereClause.patientId = userId;
      } else if (userRole === 'doctor') {
        whereClause.doctorId = userId;
      }

      // Apply additional filters
      if (status) {
        whereClause.status = status;
      }
      if (date) {
        whereClause.date = date;
      }
      if (doctorId && (userRole === 'admin' || userRole === 'receptionist')) {
        whereClause.doctorId = doctorId;
      }
      if (patientId && (userRole === 'admin' || userRole === 'receptionist' || userRole === 'doctor')) {
        whereClause.patientId = patientId;
      }

      const { count, rows } = await Appointment.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'medicalRecordNumber']
          },
          {
            model: Doctor,
            as: 'doctor',
            attributes: ['id', 'firstName', 'lastName', 'specialization', 'consultationFee']
          }
        ],
        limit,
        offset,
        order: [['date', 'ASC'], ['startTime', 'ASC']],
      });

      return res.status(200).json({
        success: true,
        message: 'Citas obtenidas exitosamente',
        data: rows,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      } as PaginatedResponse<typeof rows>);
    } catch (error) {
      console.error('Get appointments error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errors: [(error as Error).message],
      } as ApiResponse);
    }
  }

  static async getAppointmentById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userRole = (req as any).user.role;
      const userId = (req as any).user.id;

      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'medicalRecordNumber', 'emergencyContact', 'emergencyPhone']
          },
          {
            model: Doctor,
            as: 'doctor',
            attributes: ['id', 'firstName', 'lastName', 'specialization', 'consultationFee', 'licenseNumber']
          }
        ]
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Cita no encontrada',
        } as ApiResponse);
      }

      // Check permissions
      if (userRole === 'patient' && appointment.patientId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver esta cita',
        } as ApiResponse);
      }

      if (userRole === 'doctor' && appointment.doctorId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver esta cita',
        } as ApiResponse);
      }

      return res.status(200).json({
        success: true,
        message: 'Cita obtenida exitosamente',
        data: appointment,
      } as ApiResponse);
    } catch (error) {
      console.error('Get appointment by ID error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errors: [(error as Error).message],
      } as ApiResponse);
    }
  }

  static async updateAppointment(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userRole = (req as any).user.role;
      const userId = (req as any).user.id;
      const updateData = req.body;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Cita no encontrada',
        } as ApiResponse);
      }

      // Check permissions
      if (userRole === 'patient' && appointment.patientId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para modificar esta cita',
        } as ApiResponse);
      }

      if (userRole === 'doctor' && appointment.doctorId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para modificar esta cita',
        } as ApiResponse);
      }

      // Patients can only update notes and symptoms
      if (userRole === 'patient') {
        const allowedFields = ['notes', 'symptoms'];
        Object.keys(updateData).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete updateData[key];
          }
        });
      }

      // Check for conflicts if time is being changed
      if (updateData.date || updateData.startTime || updateData.endTime) {
        const newDate = updateData.date || appointment.date;
        const newStartTime = updateData.startTime || appointment.startTime;
        const newEndTime = updateData.endTime || appointment.endTime;
        const doctorId = updateData.doctorId || appointment.doctorId;

        const conflictingAppointment = await Appointment.findOne({
          where: {
            id: { [Op.ne]: id },
            doctorId,
            date: newDate,
            status: {
              [Op.notIn]: ['cancelled', 'no-show']
            },
            [Op.or]: [
              {
                startTime: {
                  [Op.between]: [newStartTime, newEndTime]
                }
              },
              {
                endTime: {
                  [Op.between]: [newStartTime, newEndTime]
                }
              },
              {
                [Op.and]: [
                  { startTime: { [Op.lte]: newStartTime } },
                  { endTime: { [Op.gte]: newEndTime } }
                ]
              }
            ]
          }
        });

        if (conflictingAppointment) {
          return res.status(400).json({
            success: false,
            message: 'El doctor ya tiene una cita programada en ese horario',
          } as ApiResponse);
        }
      }

      await appointment.update(updateData);

      const updatedAppointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: Doctor,
            as: 'doctor',
            attributes: ['id', 'firstName', 'lastName', 'specialization']
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: 'Cita actualizada exitosamente',
        data: updatedAppointment,
      } as ApiResponse);
    } catch (error) {
      console.error('Update appointment error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errors: [(error as Error).message],
      } as ApiResponse);
    }
  }

  static async cancelAppointment(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userRole = (req as any).user.role;
      const userId = (req as any).user.id;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Cita no encontrada',
        } as ApiResponse);
      }

      // Check permissions
      if (userRole === 'patient' && appointment.patientId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para cancelar esta cita',
        } as ApiResponse);
      }

      if (userRole === 'doctor' && appointment.doctorId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para cancelar esta cita',
        } as ApiResponse);
      }

      await appointment.update({ status: 'cancelled' });

      return res.status(200).json({
        success: true,
        message: 'Cita cancelada exitosamente',
        data: appointment,
      } as ApiResponse);
    } catch (error) {
      console.error('Cancel appointment error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errors: [(error as Error).message],
      } as ApiResponse);
    }
  }

  static async getDoctorAvailability(req: Request, res: Response): Promise<Response> {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;

      const doctor = await Doctor.findByPk(doctorId);
      if (!doctor || !doctor.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Doctor no encontrado o inactivo',
        } as ApiResponse);
      }

      // Get doctor's appointments for the date
      const appointments = await Appointment.findAll({
        where: {
          doctorId,
          date: date as string,
          status: {
            [Op.notIn]: ['cancelled', 'no-show']
          }
        },
        order: [['startTime', 'ASC']]
      });

      return res.status(200).json({
        success: true,
        message: 'Disponibilidad del doctor obtenida exitosamente',
        data: {
          doctor: {
            id: doctor.id,
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            specialization: doctor.specialization,
            availability: doctor.availability
          },
          appointments: appointments.map(apt => ({
            startTime: apt.startTime,
            endTime: apt.endTime,
            status: apt.status
          }))
        },
      } as ApiResponse);
    } catch (error) {
      console.error('Get doctor availability error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errors: [(error as Error).message],
      } as ApiResponse);
    }
  }
}