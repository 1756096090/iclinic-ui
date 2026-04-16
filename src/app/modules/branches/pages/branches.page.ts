import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BranchListComponent, BranchFormComponent } from '../components';
import { BranchService } from '../services';
import { BranchUnifiedResponse, CreateBranchUnifiedRequest } from '../models';

@Component({
  selector: 'app-branches-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BranchListComponent, BranchFormComponent],
  styleUrl: './branches.page.css',
  templateUrl: './branches.page.html',
})
export class BranchesPageComponent implements OnInit {
  private readonly branchService = inject(BranchService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly branches = signal<BranchUnifiedResponse[]>([]);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly totalElements = signal(0);
  readonly pageSize = signal(10);

  readonly showForm = signal(false);
  readonly editingBranch = signal<BranchUnifiedResponse | null>(null);
  readonly deletingBranch = signal<BranchUnifiedResponse | null>(null);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadBranches();
  }

  private loadBranches(): void {
    this.isLoading.set(true);
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches.set(branches);
        this.totalElements.set(branches.length);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  onCreateNew(): void {
    this.editingBranch.set(null);
    this.showForm.set(true);
  }

  onViewBranch(b: BranchUnifiedResponse): void {
    this.editingBranch.set(b);
    this.showForm.set(true);
  }

  onEditBranch(b: BranchUnifiedResponse): void {
    this.editingBranch.set(b);
    this.showForm.set(true);
  }

  onDeleteBranch(b: BranchUnifiedResponse): void {
    this.deletingBranch.set(b);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingBranch.set(null);
  }

  onFormSubmit(request: CreateBranchUnifiedRequest): void {
    this.isSaving.set(true);
    const editing = this.editingBranch();

    const op$ = editing
      ? this.branchService.updateBranch(editing.id, request)
      : this.branchService.createBranchUnified(request);

    op$.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeForm();
        this.loadBranches();
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }

  confirmDelete(): void {
    const b = this.deletingBranch();
    if (!b) return;
    this.isSaving.set(true);
    this.branchService.deleteBranch(b.id).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.deletingBranch.set(null);
        this.loadBranches();
      },
      error: () => {
        this.isSaving.set(false);
        this.deletingBranch.set(null);
      },
    });
  }
}
