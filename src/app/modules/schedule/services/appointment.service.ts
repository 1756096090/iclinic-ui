import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services';
import { API_ENDPOINTS } from '../../../core/models';
import {
  AppointmentResponse,
  AvailableSlot,
  CreateAppointmentRequestDto,
  RescheduleAppointmentRequestDto,
  CancelAppointmentRequestDto,
} from '../models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpService);

  getById(id: number): Observable<AppointmentResponse> {
    return this.http.get<AppointmentResponse>(API_ENDPOINTS.APPOINTMENTS.GET_BY_ID(id));
  }

  getByBranch(branchId: number): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(API_ENDPOINTS.APPOINTMENTS.GET_BY_BRANCH(branchId));
  }

  getByContact(contactId: number): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(API_ENDPOINTS.APPOINTMENTS.GET_BY_CONTACT(contactId));
  }

  getAvailableSlots(branchId: number, doctorId: number, date: string): Observable<AvailableSlot[]> {
    return this.http.get<AvailableSlot[]>(API_ENDPOINTS.APPOINTMENTS.AVAILABLE_SLOTS(branchId, doctorId, date));
  }

  create(request: CreateAppointmentRequestDto): Observable<AppointmentResponse> {
    return this.http.post<AppointmentResponse>(API_ENDPOINTS.APPOINTMENTS.CREATE, request);
  }

  reschedule(id: number, request: RescheduleAppointmentRequestDto): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(API_ENDPOINTS.APPOINTMENTS.RESCHEDULE(id), request);
  }

  cancel(id: number, request: CancelAppointmentRequestDto): Observable<AppointmentResponse> {
    return this.http.delete<AppointmentResponse>(
      API_ENDPOINTS.APPOINTMENTS.CANCEL(id),
      { body: request }
    );
  }
}
