import {
  Component,
  signal,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DatePipe } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon.component';
import { forkJoin } from 'rxjs';
import { UserService } from '../../users/services';
import { CompanyService } from '../../companies/services';
import { BranchService } from '../../branches/services';
import { ChannelConnectionService } from '../../channel-connections/services';
import { ConversationService } from '../../conversations/services';
import { ConversationResponseDto, ConversationStatus, CONVERSATION_STATUS_DISPLAY_NAMES } from '../../conversations/models';

interface DashboardStats {
  companies: number;
  users: number;
  branches: number;
  channels: number;
}

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CommonModule, DatePipe, IconComponent],
  styleUrl: './dashboard.page.css',
  templateUrl: './dashboard.page.html',
})
export class DashboardPageComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly companyService = inject(CompanyService);
  private readonly branchService = inject(BranchService);
  private readonly channelService = inject(ChannelConnectionService);
  private readonly conversationService = inject(ConversationService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isLoading = signal(true);
  readonly stats = signal<DashboardStats>({ companies: 0, users: 0, branches: 0, channels: 0 });
  readonly conversations = signal<ConversationResponseDto[]>([]);
  readonly skeletons = [1, 2, 3, 4];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isLoading.set(false);
      return;
    }

    forkJoin({
      companies: this.companyService.getAllCompanies(),
      users: this.userService.getAllUsers(),
      branches: this.branchService.getAllBranches(),
      channels: this.channelService.getAllConnections(),
      conversations: this.conversationService.getAllConversations(),
    }).subscribe({
      next: ({ companies, users, branches, channels, conversations }) => {
        this.stats.set({
          companies: companies.length,
          users: users.length,
          branches: branches.length,
          channels: channels.length,
        });
        this.conversations.set(conversations.slice(0, 6));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  statusClass(status: ConversationStatus): string {
    return status.toLowerCase();
  }

  statusLabel(status: ConversationStatus): string {
    return CONVERSATION_STATUS_DISPLAY_NAMES[status] ?? status;
  }
}
