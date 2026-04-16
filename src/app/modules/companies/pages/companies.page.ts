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
import { CompanyListComponent } from '../components';
import { CompanyService } from '../services';
import { CompanyUnifiedResponse } from '../models';

@Component({
  selector: 'app-companies-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, CompanyListComponent, IconComponent],
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
    console.log('Create new company - form not yet implemented');
  }

  onViewCompany(company: CompanyUnifiedResponse): void {
    console.log('View company:', company);
  }

  onEditCompany(company: CompanyUnifiedResponse): void {
    console.log('Edit company:', company);
  }

  onDeleteCompany(company: CompanyUnifiedResponse): void {
    console.log('Delete company:', company);
  }

  onPageChange(event: {pageIndex: number}): void {
    this.currentPage.set(event.pageIndex);
  }
}
