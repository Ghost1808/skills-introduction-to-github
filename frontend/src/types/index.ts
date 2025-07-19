export interface User {
  id: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient';
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  profilePicture?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
    expirationDate: string;
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
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine-checkup';
  notes?: string;
  symptoms?: string;
  patient?: Pick<Patient, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'medicalRecordNumber'>;
  doctor?: Pick<Doctor, 'id' | 'firstName' | 'lastName' | 'specialization' | 'consultationFee'>;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  date: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  medications: Medication[];
  labResults?: LabResult[];
  vitals?: VitalSigns;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
  date: string;
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

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  role: User['role'];
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: User['gender'];
  // Patient specific fields
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalRecordNumber?: string;
  // Doctor specific fields
  licenseNumber?: string;
  specialization?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: Appointment['type'];
  notes?: string;
  symptoms?: string;
}