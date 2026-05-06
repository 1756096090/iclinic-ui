import {
  Component,
  input,
  output,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
  computed,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, finalize, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { AppointmentResponse, CreateAppointmentRequestDto, RescheduleAppointmentRequestDto, CancelAppointmentRequestDto, AvailableSlot } from '../models';
import { AppointmentService } from '../services';
import { BranchService } from '../../branches/services';
import { BranchUnifiedResponse } from '../../branches/models';
import { CompanyService } from '../../companies/services';
import { CompanyUnifiedResponse } from '../../companies/models';
import { ConversationService } from '../../conversations/services';

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
  private readonly companyService = inject(CompanyService);
  private readonly conversationService = inject(ConversationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly mode = input<AppointmentFormMode>('create');
  readonly initialAppointment = input<AppointmentResponse | null>(null);
  readonly initialCreateDate = input<string | null>(null);
  readonly isLoading = input(false);

  readonly submitted = output<CreateAppointmentRequestDto | RescheduleAppointmentRequestDto | CancelAppointmentRequestDto>();
  readonly cancelled = output<void>();

  form!: FormGroup;
  readonly companies = signal<CompanyUnifiedResponse[]>([]);
  readonly loadingCompanies = signal(false);
  readonly branches = signal<BranchUnifiedResponse[]>([]);
  readonly contacts = signal<number[]>([]);
  readonly loadingContacts = signal(false);
  readonly availableSlots = signal<AvailableSlot[]>([]);
  private readonly loadingBranchesState = signal(false);
  private readonly branchLoadErrorState = signal<string | null>(null);
  readonly loadingSlots = signal(false);

  loadingBranches(): boolean {
    return this.loadingBranchesState();
  }

  branchLoadError(): string | null {
    return this.branchLoadErrorState();
  }

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
        this.loadCompanies();
        const initialStart = this.createLocalDateTime(this.initialCreateDate(), 9, 0);
        const initialEnd = this.createLocalDateTime(this.initialCreateDate(), 9, 30);
        this.form = this.fb.group({
          companyId:      [null,  Validators.required],
          branchId:       [{ value: null, disabled: true },  Validators.required],
          contactId:      [{ value: null, disabled: true },  Validators.required],
          scheduledStart: [initialStart, Validators.required],
          scheduledEnd:   [initialEnd, Validators.required],
          notes:          [''],
        });
        this.watchCompanyId();
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

  private loadCompanies(): void {
    this.loadingCompanies.set(true);
    this.companyService.getAllCompanies().pipe(
      catchError(() => of([])),
      finalize(() => this.loadingCompanies.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(companies => {
      this.companies.set(companies);
      if (companies.length === 1) {
        this.form.get('companyId')?.setValue(companies[0].id);
      }
    });
  }

  private watchCompanyId(): void {
    this.form.get('companyId')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.form.get('branchId')?.reset();
        this.form.get('branchId')?.disable();
        this.form.get('contactId')?.reset();
        this.form.get('contactId')?.disable();
        this.branches.set([]);
        this.contacts.set([]);
        this.availableSlots.set([]);
        this.branchLoadErrorState.set(null);
      }),
      switchMap((value) => {
        const companyId = Number(value);

        if (!Number.isFinite(companyId) || companyId <= 0) {
          this.loadingBranchesState.set(false);
          return of({ branches: [] as BranchUnifiedResponse[], contactIds: [] as number[] });
        }

        this.loadingBranchesState.set(true);
        this.loadingContacts.set(true);
        return forkJoin({
          branches: this.branchService.getBranchesByCompany(companyId).pipe(
            catchError(() => {
              this.branchLoadErrorState.set('No se pudieron cargar las sucursales de esta empresa');
              return of([]);
            }),
            finalize(() => this.loadingBranchesState.set(false))
          ),
          conversations: this.conversationService.getConversationsByCompany(companyId).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingContacts.set(false))
          ),
        }).pipe(
          map(({ branches, conversations }) => ({
            branches,
            contactIds: [...new Set(conversations.map(c => c.contactId))].sort((a, b) => a - b),
          }))
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ branches, contactIds }) => {
      this.branches.set(branches);
      if (branches.length > 0) {
        this.form.get('branchId')?.enable();
      }
      this.contacts.set(contactIds);
      if (contactIds.length > 0) {
        this.form.get('contactId')?.enable();
      }
    });
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
    if (this.mode() === 'create' && !this.form.getRawValue().branchId) {
      this.form.get('branchId')?.markAsTouched();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }
}
