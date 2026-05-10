import { AppointmentStatus } from './appointment.enums';

export interface AppointmentResponse {
  id: number;
  companyId: number;
  branchId: number;
  contactId: number;
  doctorId: number;
  doctorName?: string;
  scheduledStart: string;
  scheduledEnd: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequestDto {
  companyId: number;
  branchId: number;
  contactId: number;
  doctorId: number;
  scheduledStart: string;
  scheduledEnd: string;
  notes?: string;
}

export interface RescheduleAppointmentRequestDto {
  scheduledStart: string;
  scheduledEnd: string;
  notes?: string;
}

export interface CancelAppointmentRequestDto {
  reason?: string;
}

export interface AvailableSlot {
  start: string;
  end: string;
}
