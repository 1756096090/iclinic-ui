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
import { UserListComponent } from '../components';
import { UserService } from '../services';
import { UserResponse } from '../models';

@Component({
  selector: 'app-users-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, UserListComponent, IconComponent],
  styleUrl: './users.page.css',
  templateUrl: './users.page.html',
})
export class UsersPageComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly users = signal<UserResponse[]>([]);
  readonly isLoading = signal(false);
  readonly totalElements = signal(0);
  readonly pageSize = signal(10);
  readonly currentPage = signal(0);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.totalElements.set(users.length);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  onCreateNew(): void {
    console.log('Create new user');
  }

  onViewUser(user: UserResponse): void {
    console.log('View user:', user);
  }

  onEditUser(user: UserResponse): void {
    console.log('Edit user:', user);
  }

  onDeleteUser(user: UserResponse): void {
    console.log('Delete user:', user);
  }

  onPageChange(event: { pageIndex: number }): void {
    this.currentPage.set(event.pageIndex);
  }
}
