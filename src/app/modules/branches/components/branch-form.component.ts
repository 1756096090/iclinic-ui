import {
  Component,
  input,
  output,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  BranchUnifiedResponse,
  CreateBranchUnifiedRequest,
  BranchType,
  BRANCH_TYPE_DISPLAY_NAMES,
} from '../models';
import { CompanyService } from '../../companies/services';
import { CompanyUnifiedResponse } from '../../companies/models';

@Component({
  selector: 'app-branch-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './branch-form.component.css',
  templateUrl: './branch-form.component.html',
})
export class BranchFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly companyService = inject(CompanyService);

  readonly initialBranch = input<BranchUnifiedResponse | null>(null);
  readonly isLoading = input(false);

  readonly submitted = output<CreateBranchUnifiedRequest>();
  readonly cancelled = output<void>();

  form!: FormGroup;
  isEditMode = false;
  readonly companies = signal<CompanyUnifiedResponse[]>([]);

  readonly branchTypes = Object.values(BranchType);
  readonly BRANCH_TYPE_DISPLAY_NAMES = BRANCH_TYPE_DISPLAY_NAMES;

  ngOnInit(): void {
    this.isEditMode = !!this.initialBranch();
    this.form = this.fb.group({
      companyId:     [this.initialBranch()?.companyId ?? '',   Validators.required],
      name:          [this.initialBranch()?.name ?? '',        Validators.required],
      address:       [this.initialBranch()?.address ?? '',     Validators.required],
      branchType:    [this.initialBranch()?.branchType ?? '',  Validators.required],
      hasLaboratory: [this.initialBranch()?.hasLaboratory ?? false],
      bedCapacity:   [this.initialBranch()?.bedCapacity ?? 0],
    });

    this.companyService.getAllCompanies().subscribe({
      next: (c) => this.companies.set(c),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.value as CreateBranchUnifiedRequest);
  }
}
