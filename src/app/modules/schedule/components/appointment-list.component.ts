import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import {
  AppointmentResponse,
  AppointmentStatus,
  APPOINTMENT_STATUS_DISPLAY_NAMES,
} from '../models';

@Component({
  selector: 'app-appointment-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
  styleUrl: './appointment-list.component.css',
  templateUrl: './appointment-list.component.html',
})
export class AppointmentListComponent {
  readonly appointments = input<AppointmentResponse[]>([]);
  readonly isLoading = input(false);

  readonly view = output<AppointmentResponse>();
  readonly reschedule = output<AppointmentResponse>();
  readonly cancel = output<AppointmentResponse>();

  readonly STATUS_DISPLAY = APPOINTMENT_STATUS_DISPLAY_NAMES;
  readonly AppointmentStatus = AppointmentStatus;

  statusClass(status: AppointmentStatus): string {
    const map: Record<AppointmentStatus, string> = {
      [AppointmentStatus.SCHEDULED]: 'badge--warning',
      [AppointmentStatus.CONFIRMED]: 'badge--info',
      [AppointmentStatus.COMPLETED]: 'badge--success',
      [AppointmentStatus.CANCELLED]: 'badge--danger',
      [AppointmentStatus.RESCHEDULED]: 'badge--neutral',
    };
    return map[status] ?? 'badge--neutral';
  }

  canReschedule(status: AppointmentStatus): boolean {
    return status === AppointmentStatus.SCHEDULED || status === AppointmentStatus.CONFIRMED;
  }

  canCancel(status: AppointmentStatus): boolean {
    return status === AppointmentStatus.SCHEDULED || status === AppointmentStatus.CONFIRMED;
  }
}

