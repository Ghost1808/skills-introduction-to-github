export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient';
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  profilePicture?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient extends User {
  medicalRecordNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies?: string[];
  bloodType?: string;
  insurance?: {
    provider: string;
    policyNumber: string;
    expirationDate: Date;
  };
}

export interface Doctor extends User {
  licenseNumber: string;
  specialization: string;
  yearsOfExperience: number;
  consultationFee: number;
  availability: DoctorAvailability[];
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0-6, where 0 is Sunday
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine-checkup';
  notes?: string;
  symptoms?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  date: Date;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  medications: Medication[];
  labResults?: LabResult[];
  vitals?: VitalSigns;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface LabResult {
  id: string;
  testName: string;
  value: string;
  unit: string;
  normalRange: string;
  date: Date;
  status: 'normal' | 'abnormal' | 'critical';
}

export interface VitalSigns {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  date: Date;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  patientId: string;
  appointmentId?: string;
  date: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Inventory {
  id: string;
  name: string;
  category: 'medication' | 'equipment' | 'supplies';
  description?: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  supplier?: string;
  expirationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  headDoctorId?: string;
  location: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}