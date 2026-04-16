import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import { UserResponse, UserRole, USER_ROLE_DISPLAY_NAMES } from '../models';

@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
  styleUrl: './user-list.component.css',
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  readonly users = input<UserResponse[]>([]);
  readonly isLoading = input(false);
  readonly totalElements = input(0);
  readonly pageSize = input(10);

  readonly view = output<UserResponse>();
  readonly edit = output<UserResponse>();
  readonly delete = output<UserResponse>();
  readonly pageChange = output<{pageIndex: number}>();

  readonly displayedColumns = ['fullName', 'role', 'company', 'branch', 'active', 'actions'];

  roleLabel(role: UserRole): string {
    return USER_ROLE_DISPLAY_NAMES[role] ?? role;
  }
}
