/**
 * Componente de formulario para crear/editar empresas
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
  CompanyUnifiedResponse,
  CreateCompanyUnifiedRequest,
  CompanyType,
  COMPANY_TYPE_DISPLAY_NAMES,
} from '../models';

@Component({
  selector: 'app-company-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  styleUrl: './company-form.component.css',
  templateUrl: './company-form.component.html',
})
export class CompanyFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly initialCompany = input<CompanyUnifiedResponse | null>(null);
  readonly isLoading = input(false);
  readonly submitted = output<CreateCompanyUnifiedRequest>();

  form!: FormGroup;
  isEditMode = false;

  readonly companyTypes = Object.values(CompanyType);
  readonly COMPANY_TYPE_DISPLAY_NAMES = COMPANY_TYPE_DISPLAY_NAMES;

  ngOnInit(): void {
    this.initializeForm();
    this.isEditMode = !!this.initialCompany();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      companyType: ['', Validators.required],
      taxId: ['', Validators.required],
    });

    if (this.initialCompany()) {
      const company = this.initialCompany()!;
      this.form.patchValue({
        name: company.name,
        companyType: company.companyType,
        taxId: company.taxId,
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.getRawValue());
    }
  }
}
