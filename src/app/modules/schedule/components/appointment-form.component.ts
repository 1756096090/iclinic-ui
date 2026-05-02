import {
  Component,
  input,
  output,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentResponse, CreateAppointmentRequestDto, RescheduleAppointmentRequestDto, CancelAppointmentRequestDto, AvailableSlot } from '../models';
import { AppointmentService } from '../services';
import { BranchService } from '../../branches/services';
import { BranchUnifiedResponse } from '../../branches/models';

export type AppointmentFormMode = 'create' | 'reschedule' | 'cancel';

@Component({
  selector: 'app-appointment-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './appointment-form.component.css',
  templateUrl: './appointment-form.component.html',
})
export class AppointmentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);
  private readonly branchService = inject(BranchService);

  readonly mode = input<AppointmentFormMode>('create');
  readonly initialAppointment = input<AppointmentResponse | null>(null);
  readonly initialCreateDate = input<string | null>(null);
  readonly isLoading = input(false);

  readonly submitted = output<CreateAppointmentRequestDto | RescheduleAppointmentRequestDto | CancelAppointmentRequestDto>();
  readonly cancelled = output<void>();

  form!: FormGroup;
  readonly branches = signal<BranchUnifiedResponse[]>([]);
  readonly availableSlots = signal<AvailableSlot[]>([]);
  readonly loadingSlots = signal(false);

  readonly dialogTitle = computed(() => {
    switch (this.mode()) {
      case 'reschedule': return 'Reagendar cita';
      case 'cancel':     return 'Cancelar cita';
      default:           return 'Nueva cita';
    }
  });

  private createLocalDateTime(dateValue: string | null, hour: number, minute: number): string {
    if (!dateValue) {
      return '';
    }

    const date = new Date(dateValue);
    date.setHours(hour, minute, 0, 0);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    switch (this.mode()) {
      case 'create':
        const initialStart = this.createLocalDateTime(this.initialCreateDate(), 9, 0);
        const initialEnd = this.createLocalDateTime(this.initialCreateDate(), 9, 30);
        this.form = this.fb.group({
          companyId:      [null,  Validators.required],
          branchId:       [null,  Validators.required],
          contactId:      [null,  Validators.required],
          scheduledStart: [initialStart, Validators.required],
          scheduledEnd:   [initialEnd, Validators.required],
          notes:          [''],
        });
        this.branchService.getAllBranches().subscribe({ next: (b) => this.branches.set(b) });
        break;

      case 'reschedule':
        this.form = this.fb.group({
          scheduledStart: [this.initialAppointment()?.scheduledStart?.slice(0, 16) ?? '', Validators.required],
          scheduledEnd:   [this.initialAppointment()?.scheduledEnd?.slice(0, 16) ?? '',   Validators.required],
          notes:          [this.initialAppointment()?.notes ?? ''],
        });
        break;

      case 'cancel':
        this.form = this.fb.group({
          reason: ['', [Validators.required, Validators.minLength(3)]],
        });
        break;
    }
  }

  onBranchDateChange(): void {
    const branchId = this.form.get('branchId')?.value;
    const start = this.form.get('scheduledStart')?.value;
    if (!branchId || !start) return;
    const date = start.slice(0, 10);
    this.loadingSlots.set(true);
    this.appointmentService.getAvailableSlots(branchId, date).subscribe({
      next: (slots) => { this.availableSlots.set(slots); this.loadingSlots.set(false); },
      error: ()     => { this.loadingSlots.set(false); },
    });
  }

  onSlotSelect(slot: AvailableSlot): void {
    this.form.patchValue({ scheduledStart: slot.start.slice(0, 16), scheduledEnd: slot.end.slice(0, 16) });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.value);
  }
}
