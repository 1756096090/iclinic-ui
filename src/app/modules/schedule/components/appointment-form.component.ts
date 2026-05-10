import {
  Component,
  input,
  output,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentResponse, CreateAppointmentRequestDto, RescheduleAppointmentRequestDto, CancelAppointmentRequestDto, AvailableSlot } from '../models';
import { AppointmentService } from '../services';
import { BranchService } from '../../branches/services';
import { BranchUnifiedResponse } from '../../branches/models';
import { CompanyService } from '../../companies/services';
import { CompanyUnifiedResponse } from '../../companies/models';
import { UserService } from '../../users/services';
import { UserResponse, UserRole } from '../../users/models';

export type AppointmentFormMode = 'create' | 'reschedule' | 'cancel';

@Component({
  selector: 'app-appointment-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './appointment-form.component.css',
  templateUrl: './appointment-form.component.html',
})
export class AppointmentFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);
  private readonly branchService = inject(BranchService);
  private readonly companyService = inject(CompanyService);
  private readonly userService = inject(UserService);
  private readonly contactSearchSubject = new Subject<string>();

  readonly mode = input<AppointmentFormMode>('create');
  readonly initialAppointment = input<AppointmentResponse | null>(null);
  readonly initialCreateDate = input<string | null>(null);
  readonly isLoading = input(false);

  readonly submitted = output<CreateAppointmentRequestDto | RescheduleAppointmentRequestDto | CancelAppointmentRequestDto>();
  readonly cancelled = output<void>();

  form!: FormGroup;
  readonly companies = signal<CompanyUnifiedResponse[]>([]);
  readonly allBranches = signal<BranchUnifiedResponse[]>([]);
  readonly doctors = signal<UserResponse[]>([]);
  readonly contacts = signal<UserResponse[]>([]);
  readonly availableSlots = signal<AvailableSlot[]>([]);
  readonly loadingSlots = signal(false);
  readonly loadingContacts = signal(false);
  readonly loadingDoctors = signal(false);
  readonly contactSearchQuery = signal('');
  readonly selectedCompanyId = signal<number | null>(null);
  readonly currentBranchId = signal<number | null>(null);

  readonly filteredBranches = computed(() => {
    const companyId = this.selectedCompanyId();
    if (!companyId) return [];
    return this.allBranches().filter(b => b.companyId === companyId);
  });

  readonly filteredContacts = computed(() => {
    return this.contacts();
  });

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
    // Configurar debounce para búsqueda de contactos
    this.contactSearchSubject
      .pipe(debounceTime(300))
      .subscribe((query) => this.performContactSearch(query));

    switch (this.mode()) {
      case 'create':
        const initialStart = this.createLocalDateTime(this.initialCreateDate(), 9, 0);
        const initialEnd = this.createLocalDateTime(this.initialCreateDate(), 9, 30);
        this.form = this.fb.group({
          companyId:      [null,  Validators.required],
          branchId:       [null,  Validators.required],
          doctorId:       [null,  Validators.required],
          contactId:      [null,  Validators.required],
          scheduledStart: [initialStart, Validators.required],
          scheduledEnd:   [initialEnd, Validators.required],
          notes:          [''],
        });
        this.companyService.getAllCompanies().subscribe({ next: (c) => this.companies.set(c) });
        this.branchService.getAllBranches().subscribe({ next: (b) => this.allBranches.set(b) });
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

  ngOnDestroy(): void {
    this.contactSearchSubject.complete();
  }

  onCompanyChange(): void {
    const companyId = this.form.get('companyId')?.value;
    this.selectedCompanyId.set(companyId);
    this.form.patchValue({ branchId: null, doctorId: null, contactId: null });
    this.contacts.set([]);
    this.doctors.set([]);
    this.contactSearchQuery.set('');
    this.currentBranchId.set(null);
  }

  onBranchChange(): void {
    const branchId = this.form.get('branchId')?.value;
    console.log('🔄 onBranchChange llamado con branchId:', branchId);
    this.form.patchValue({ doctorId: null, contactId: null });
    this.contactSearchQuery.set('');
    this.contacts.set([]);
    this.availableSlots.set([]);
    this.currentBranchId.set(branchId || null);
    console.log('📞 Llamando loadDoctors...');
    this.loadDoctors(branchId);
  }

  private loadDoctors(branchId: number | null): void {
    console.log('🏥 loadDoctors iniciado con branchId:', branchId);
    if (!branchId) {
      console.log('⚠️ No hay branchId, limpiando doctores');
      this.doctors.set([]);
      this.loadingDoctors.set(false);
      return;
    }
    this.loadingDoctors.set(true);
    console.log('📡 Llamando userService.getUsersByBranch(', branchId, ')');
    this.userService.getUsersByBranch(branchId).subscribe({
      next: (users) => {
        console.log('✅ Usuarios recibidos del backend:', users);
        console.log('📊 Total usuarios:', users.length);

        if (!users || users.length === 0) {
          console.warn('⚠️ No hay usuarios en esta sucursal');
          this.doctors.set([]);
          this.loadingDoctors.set(false);
          return;
        }

        users.forEach((u, i) => {
          console.log(`👤 [${i}] ${u.fullName} | role: "${u.role}" | role displayName: "${u.roleDisplayName}"`);
        });

        // Filtrar por rol DENTIST (en lugar de userType)
        const doctors = users.filter(u => {
          const isDentist = u.role === 'DENTIST';
          console.log(`   → ${u.fullName}: role="${u.role}" === "DENTIST" ? ${isDentist}`);
          return isDentist;
        });

        console.log('🎯 Doctores encontrados:', doctors.length);
        console.log('📋 Lista de doctores:', doctors);
        this.doctors.set(doctors);
        this.loadingDoctors.set(false);
      },
      error: (err) => {
        console.error('❌ Error en getUsersByBranch:', err);
        this.doctors.set([]);
        this.loadingDoctors.set(false);
      },
    });
  }

  onContactSearch(query: string): void {
    this.contactSearchQuery.set(query);
    if (!query.trim() || !this.currentBranchId()) {
      this.contacts.set([]);
      return;
    }
    this.contactSearchSubject.next(query);
  }

  private performContactSearch(query: string): void {
    if (!query.trim() || !this.currentBranchId()) {
      this.contacts.set([]);
      return;
    }
    this.loadingContacts.set(true);
    this.userService.searchUsersByBranch(this.currentBranchId()!, query).subscribe({
      next: (users) => {
        // Filtrar solo usuarios que no sean dentistas (para permitir contacto)
        const contacts = users.filter(u => u.role !== 'DENTIST');
        this.contacts.set(contacts);
        this.loadingContacts.set(false);
      },
      error: () => { this.loadingContacts.set(false); },
    });
  }

  selectContact(contact: UserResponse): void {
    this.form.patchValue({ contactId: contact.id });
    this.contactSearchQuery.set(contact.fullName);
    this.contacts.set([]);
  }

  getSelectedContactName(): string {
    const contactId = this.form.get('contactId')?.value;
    if (!contactId) return '';
    return this.contactSearchQuery();
  }

  onBranchDateChange(): void {
    const branchId = this.form.get('branchId')?.value;
    const doctorId = this.form.get('doctorId')?.value;
    const start = this.form.get('scheduledStart')?.value;

    // Validar que todos los parámetros requeridos estén presentes
    if (!branchId || !doctorId || !start) {
      this.availableSlots.set([]);
      return;
    }

    const date = start.slice(0, 10);

    // Validar formato de fecha
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      this.availableSlots.set([]);
      return;
    }

    this.loadingSlots.set(true);
    this.appointmentService.getAvailableSlots(branchId, doctorId, date).subscribe({
      next: (slots) => {
        this.availableSlots.set(slots);
        this.loadingSlots.set(false);
      },
      error: () => {
        this.availableSlots.set([]);
        this.loadingSlots.set(false);
      },
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
    const formValue = this.form.value;
    const payload = {
      companyId: formValue.companyId,
      branchId: formValue.branchId,
      contactId: formValue.contactId,
      doctorId: formValue.doctorId,
      scheduledStart: this.formatDateTime(formValue.scheduledStart),
      scheduledEnd: this.formatDateTime(formValue.scheduledEnd),
      notes: formValue.notes || '',
    };
    this.submitted.emit(payload);
  }

  private formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const parts = dateTimeString.split(':');
    if (parts.length === 2) {
      return `${dateTimeString}:00`;
    }
    return dateTimeString;
  }
}
