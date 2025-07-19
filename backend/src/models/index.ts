import User from './User';
import Patient from './Patient';
import Doctor from './Doctor';
import Appointment from './Appointment';
import MedicalRecord from './MedicalRecord';
import Invoice from './Invoice';

// Define associations
Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

Patient.hasMany(MedicalRecord, { foreignKey: 'patientId', as: 'medicalRecords' });
Doctor.hasMany(MedicalRecord, { foreignKey: 'doctorId', as: 'medicalRecords' });
MedicalRecord.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
MedicalRecord.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
MedicalRecord.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

Patient.hasMany(Invoice, { foreignKey: 'patientId', as: 'invoices' });
Invoice.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Invoice.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

export {
  User,
  Patient,
  Doctor,
  Appointment,
  MedicalRecord,
  Invoice,
};