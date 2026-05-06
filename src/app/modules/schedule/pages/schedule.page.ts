import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AppointmentFormComponent,
  AppointmentFormMode,
  CalendarGridComponent,
} from '../components';
import { AppointmentService } from '../services';
import {
  AppointmentResponse,
  CreateAppointmentRequestDto,
  RescheduleAppointmentRequestDto,
  CancelAppointmentRequestDto,
} from '../models';

const MONTH_NAMES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

@Component({
  selector: 'app-schedule-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AppointmentFormComponent, CalendarGridComponent],
  styleUrl: './schedule.page.css',
  templateUrl: './schedule.page.html',
})
export class SchedulePageComponent implements OnInit {
  private readonly apptService = inject(AppointmentService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly appointments = signal<AppointmentResponse[]>([]);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);

  readonly formMode = signal<AppointmentFormMode>('create');
  readonly showForm = signal(false);
  readonly activeAppointment = signal<AppointmentResponse | null>(null);
  readonly initialCreateDate = signal<string | null>(null);

  // Calendar navigation
  private readonly today = new Date();
  readonly currentYear  = signal(this.today.getFullYear());
  readonly currentMonth = signal(this.today.getMonth()); // 0-based

  readonly monthLabel = computed(() =>
    `${MONTH_NAMES[this.currentMonth()]} ${this.currentYear()}`
  );

  readonly monthAppointments = computed(() =>
    this.appointments().filter((appointment) => {
      const date = new Date(appointment.scheduledStart);
      return (
        date.getFullYear() === this.currentYear() &&
        date.getMonth() === this.currentMonth()
      );
    })
  );

  // Appointments for the selected day (shown in list below calendar)
  readonly selectedDate = signal<Date | null>(null);
  readonly selectedDayAppts = computed(() => {
    const sel = this.selectedDate();
    if (!sel) return [];
    return this.monthAppointments()
      .filter(a => {
      const d = new Date(a.scheduledStart);
      return (
        d.getFullYear() === sel.getFullYear() &&
        d.getMonth()    === sel.getMonth() &&
        d.getDate()     === sel.getDate()
      );
      })
      .sort((left, right) => left.scheduledStart.localeCompare(right.scheduledStart));
  });

  readonly selectedDayLabel = computed(() => {
    const sel = this.selectedDate();
    return sel ? sel.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : '';
  });

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadMonth();
  }

  private loadMonth(): void {
    this.isLoading.set(true);
    this.apptService.getByBranch(1).subscribe({
      next: (list) => { this.appointments.set(list); this.isLoading.set(false); },
      error: ()     => { this.isLoading.set(false); },
    });
  }

  prevMonth(): void {
    const m = this.currentMonth();
    if (m === 0) {
      this.currentMonth.set(11);
      this.currentYear.update(y => y - 1);
    } else {
      this.currentMonth.update(m => m - 1);
    }
    this.selectedDate.set(null);
    this.loadMonth();
  }

  nextMonth(): void {
    const m = this.currentMonth();
    if (m === 11) {
      this.currentMonth.set(0);
      this.currentYear.update(y => y + 1);
    } else {
      this.currentMonth.update(m => m + 1);
    }
    this.selectedDate.set(null);
    this.loadMonth();
  }

  goToday(): void {
    this.currentYear.set(this.today.getFullYear());
    this.currentMonth.set(this.today.getMonth());
    this.selectedDate.set(null);
    this.loadMonth();
  }

  onDaySelected(date: Date): void {
    this.selectedDate.set(date);
  }

  onDayCreateRequested(date: Date): void {
    this.selectedDate.set(date);
    this.activeAppointment.set(null);
    this.initialCreateDate.set(date.toISOString());
    this.formMode.set('create');
    this.showForm.set(true);
  }

  onCreateNew(): void {
    this.activeAppointment.set(null);
    const selectedDate = this.selectedDate();
    this.initialCreateDate.set(selectedDate ? selectedDate.toISOString() : null);
    this.formMode.set('create');
    this.showForm.set(true);
  }

  onView(appt: AppointmentResponse): void {
    this.activeAppointment.set(appt);
    this.formMode.set('reschedule');
    this.showForm.set(true);
  }

  onReschedule(appt: AppointmentResponse): void {
    this.activeAppointment.set(appt);
    this.formMode.set('reschedule');
    this.showForm.set(true);
  }

  onCancel(appt: AppointmentResponse): void {
    this.activeAppointment.set(appt);
    this.formMode.set('cancel');
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.activeAppointment.set(null);
    this.initialCreateDate.set(null);
  }

  onFormSubmit(
    payload: CreateAppointmentRequestDto | RescheduleAppointmentRequestDto | CancelAppointmentRequestDto
  ): void {
    this.isSaving.set(true);
    const appt = this.activeAppointment();

    let op$;
    switch (this.formMode()) {
      case 'reschedule':
        op$ = this.apptService.reschedule(appt!.id, payload as RescheduleAppointmentRequestDto); break;
      case 'cancel':
        op$ = this.apptService.cancel(appt!.id, payload as CancelAppointmentRequestDto); break;
      default:
        op$ = this.apptService.create(payload as CreateAppointmentRequestDto);
    }

    op$.subscribe({
      next: () => { this.isSaving.set(false); this.closeForm(); this.loadMonth(); },
      error: () => { this.isSaving.set(false); },
    });
  }
}

