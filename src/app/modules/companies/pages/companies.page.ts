/**
 * Página contenedora del módulo de empresas
 */

import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import { CompanyListComponent, CompanyFormComponent } from '../components';
import { CompanyService } from '../services';
import { CompanyUnifiedResponse, CreateCompanyUnifiedRequest } from '../models';

@Component({
  selector: 'app-companies-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, CompanyListComponent, CompanyFormComponent, IconComponent],
  styleUrl: './companies.page.css',
  templateUrl: './companies.page.html',
})
export class CompaniesPageComponent implements OnInit {
  private readonly companyService = inject(CompanyService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly companies = signal<CompanyUnifiedResponse[]>([]);
  readonly isLoading = signal(false);
  readonly totalElements = signal(0);
  readonly pageSize = signal(10);
  readonly currentPage = signal(0);
  readonly editingCompany = signal<CompanyUnifiedResponse | null>(null);
  readonly isFormOpen = signal(false);
  readonly isSaving = signal(false);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadCompanies();
  }

  private loadCompanies(): void {
    this.isLoading.set(true);
    this.companyService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companies.set(companies);
        this.totalElements.set(companies.length);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.isLoading.set(false);
      },
    });
  }

  onCreateNew(): void {
    this.editingCompany.set(null);
    this.isFormOpen.set(true);
  }

  onViewCompany(company: CompanyUnifiedResponse): void {
    this.editingCompany.set(company);
  }

  onEditCompany(company: CompanyUnifiedResponse): void {
    this.editingCompany.set(company);
    this.isFormOpen.set(true);
  }

  onDeleteCompany(company: CompanyUnifiedResponse): void {
    if (confirm(`¿Eliminar empresa ${company.name}?`)) {
      this.companyService.deleteCompany(company.id).subscribe({
        next: () => {
          this.companies.set(this.companies().filter(c => c.id !== company.id));
          this.totalElements.set(this.totalElements() - 1);
        },
        error: (error) => console.error('Error deleting company:', error),
      });
    }
  }

  onSaveForm(request: CreateCompanyUnifiedRequest): void {
    this.isSaving.set(true);
    const editingCompany = this.editingCompany();
    if (editingCompany) {
      this.companyService.updateCompany(editingCompany.id, request).subscribe({
        next: (updated) => {
          this.companies.set(
            this.companies().map(c => (c.id === updated.id ? updated : c))
          );
          this.closeForm();
          this.isSaving.set(false);
        },
        error: (error) => {
          console.error('Error updating company:', error);
          this.isSaving.set(false);
        },
      });
    } else {
      this.companyService.createCompanyUnified(request).subscribe({
        next: (newCompany) => {
          this.companies.set([...this.companies(), newCompany]);
          this.totalElements.set(this.totalElements() + 1);
          this.closeForm();
          this.isSaving.set(false);
        },
        error: (error) => {
          console.error('Error creating company:', error);
          this.isSaving.set(false);
        },
      });
    }
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingCompany.set(null);
  }

  onPageChange(event: {pageIndex: number}): void {
    this.currentPage.set(event.pageIndex);
  }
}
