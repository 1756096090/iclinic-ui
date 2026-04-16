import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import { BranchUnifiedResponse, BranchType, BRANCH_TYPE_DISPLAY_NAMES } from '../models';

@Component({
  selector: 'app-branch-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
  styleUrl: './branch-list.component.css',
  templateUrl: './branch-list.component.html',
})
export class BranchListComponent {
  readonly branches = input<BranchUnifiedResponse[]>([]);
  readonly isLoading = input(false);
  readonly totalElements = input(0);
  readonly pageSize = input(10);

  readonly view = output<BranchUnifiedResponse>();
  readonly edit = output<BranchUnifiedResponse>();
  readonly delete = output<BranchUnifiedResponse>();
  readonly pageChange = output<{pageIndex: number}>();

  readonly displayedColumns = ['name', 'type', 'company', 'active', 'actions'];

  branchIcon(type: BranchType): string {
    const icons: Partial<Record<BranchType, string>> = {
      [BranchType.HOSPITAL]: 'local_hospital',
      [BranchType.CLINIC]: 'medical_services',
      [BranchType.LABORATORY]: 'science',
      [BranchType.PHARMACY]: 'local_pharmacy',
      [BranchType.DENTAL_CLINIC]: 'dentistry',
      [BranchType.ADMINISTRATIVE]: 'apartment',
    };
    return icons[type] ?? 'location_city';
  }
}
