/**
 * Componente de formulario para crear/editar usuarios
 */

import {
  Component,
  input,
  output,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  CreateUserRequest,
  UserResponse,
  UserRole,
  UserType,
  DocumentType,
  USER_ROLE_DISPLAY_NAMES,
  USER_TYPE_DISPLAY_NAMES,
  DOCUMENT_TYPE_DISPLAY_NAMES,
} from '../models';

@Component({
  selector: 'app-user-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  styleUrl: './user-form.component.css',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly initialUser = input<UserResponse | null>(null);
  readonly isLoading = input(false);
  readonly submitted = output<CreateUserRequest>();

  form!: FormGroup;
  isEditMode = false;

  readonly userRoles = Object.values(UserRole);
  readonly userTypes = Object.values(UserType);
  readonly documentTypes = Object.values(DocumentType);

  readonly USER_ROLE_DISPLAY_NAMES = USER_ROLE_DISPLAY_NAMES;
  readonly USER_TYPE_DISPLAY_NAMES = USER_TYPE_DISPLAY_NAMES;
  readonly DOCUMENT_TYPE_DISPLAY_NAMES = DOCUMENT_TYPE_DISPLAY_NAMES;

  ngOnInit(): void {
    this.isEditMode = !!this.initialUser();
    this.initializeForm();
  }

  private initializeForm(): void {
    const user = this.initialUser();
    const { firstName, lastName } = this.splitFullName(user?.fullName);

    this.form = this.fb.group({
      firstName: [firstName, Validators.required],
      lastName: [lastName, Validators.required],
      email: [user?.email ?? '', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : Validators.required],
      phone: [user?.phone ?? '', Validators.required],
      role: [user?.role ?? '', Validators.required],
      userType: [user?.userType ?? '', Validators.required],
      documentType: [user?.documentType ?? '', Validators.required],
      documentNumber: [user?.documentNumber ?? '', Validators.required],
      nationality: [user?.nationality ?? '', Validators.required],
      companyId: [user?.companyId ?? '', Validators.required],
      branchId: [user?.branchId ?? '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.getRawValue());
    }
  }

  private splitFullName(fullName?: string): { firstName: string; lastName: string } {
    const normalized = fullName?.trim() ?? '';

    if (!normalized) {
      return { firstName: '', lastName: '' };
    }

    const [firstName, ...rest] = normalized.split(/\s+/);
    return {
      firstName,
      lastName: rest.join(' '),
    };
  }
}
