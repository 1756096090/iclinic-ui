import { AppointmentStatus } from './appointment.enums';

export interface AppointmentResponse {
  id: number;
  companyId: number;
  companyName?: string;
  branchId: number;
  branchName?: string;
  contactId: number;
  contactName?: string;
  scheduledStart: string;
  scheduledEnd: string;
  notes?: string;
  status: AppointmentStatus;
  cancelReason?: string;
  createdAt: string;
}

export interface CreateAppointmentRequestDto {
  companyId: number;
  branchId: number;
  contactId: number;
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
  reason: string;
}

export interface AvailableSlot {
  start: string;
  end: string;
}
