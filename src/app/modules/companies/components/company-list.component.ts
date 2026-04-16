/**
 * Componente de listado de empresas
 */

import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import { CompanyUnifiedResponse, COMPANY_TYPE_DISPLAY_NAMES } from '../models';

@Component({
  selector: 'app-company-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, IconComponent],
  styleUrl: './company-list.component.css',
  templateUrl: './company-list.component.html',
})
export class CompanyListComponent {
  readonly companies = input<CompanyUnifiedResponse[]>([]);
  readonly isLoading = input(false);
  readonly totalElements = input(0);
  readonly pageSize = input(10);
  readonly taxIdLabel = input('ID Fiscal');

  readonly view = output<CompanyUnifiedResponse>();
  readonly edit = output<CompanyUnifiedResponse>();
  readonly delete = output<CompanyUnifiedResponse>();
  readonly pageChange = output<{pageIndex: number}>();

  readonly displayedColumns = ['name', 'type', 'taxId', 'actions'];
  readonly COMPANY_TYPE_DISPLAY_NAMES = COMPANY_TYPE_DISPLAY_NAMES;

  onViewClicked(company: CompanyUnifiedResponse): void {
    this.view.emit(company);
  }

  onEditClicked(company: CompanyUnifiedResponse): void {
    this.edit.emit(company);
  }

  onDeleteClicked(company: CompanyUnifiedResponse): void {
    this.delete.emit(company);
  }

  onPageChange(event: {pageIndex: number}): void {
    this.pageChange.emit(event);
  }
}
