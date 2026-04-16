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
    this.initializeForm();
    this.isEditMode = !!this.initialUser();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : Validators.required],
      phone: ['', Validators.required],
      role: ['', Validators.required],
      userType: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      nationality: ['', Validators.required],
      companyId: ['', Validators.required],
      branchId: ['', Validators.required],
    });

    if (this.initialUser()) {
      const user = this.initialUser()!;
      this.form.patchValue({
        firstName: user.fullName.split(' ')[0],
        lastName: user.fullName.split(' ')[1] || '',
        email: user.email,
        phone: user.phone,
        role: user.role,
        userType: user.userType,
        documentType: user.documentType,
        documentNumber: user.documentNumber,
        nationality: user.nationality,
        companyId: user.companyId,
        branchId: user.branchId,
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.getRawValue());
    }
  }
}
