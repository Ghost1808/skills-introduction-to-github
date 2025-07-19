import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Create appointment - patients, doctors, admin, receptionist
router.post('/', AppointmentController.createAppointment);

// Get appointments - role-based filtering applied in controller
router.get('/', AppointmentController.getAppointments);

// Get specific appointment
router.get('/:id', AppointmentController.getAppointmentById);

// Update appointment
router.put('/:id', AppointmentController.updateAppointment);

// Cancel appointment
router.patch('/:id/cancel', AppointmentController.cancelAppointment);

// Get doctor availability - public for scheduling
router.get('/doctor/:doctorId/availability', AppointmentController.getDoctorAvailability);

export default router;