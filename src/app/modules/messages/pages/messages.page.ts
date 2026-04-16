import {
  Component,
  OnInit,
  inject,
  computed,
  signal,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  DestroyRef,
} from '@angular/core';
import { DatePipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from '../services';
import { WebSocketService } from '../../../core/services';
import {
  MessageResponseDto,
  MessageDirection,
  MessageStatus,
  MESSAGE_DIRECTION_DISPLAY_NAMES,
  MESSAGE_STATUS_DISPLAY_NAMES,
} from '../models';

@Component({
  selector: 'app-messages-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, CommonModule],
  styleUrl: './messages.page.css',
  templateUrl: './messages.page.html',
})
export class MessagesPageComponent implements OnInit {
  private readonly msgService = inject(MessageService);
  private readonly wsService = inject(WebSocketService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly messages = signal<MessageResponseDto[]>([]);
  readonly sortedMessages = computed(() =>
    [...this.messages()].sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    )
  );
  readonly unreadCount = computed(() =>
    this.messages().reduce(
      (count, msg) => count + (msg.direction === this.inbound && msg.status !== MessageStatus.READ ? 1 : 0),
      0
    )
  );
  readonly isLoading = signal(false);

  readonly inbound = MessageDirection.INBOUND;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.wsService.markAllNotificationsAsSeen();

    this.wsService.onNotification$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.wsService.markAllNotificationsAsSeen();
        this.loadMessages();
      });

    this.loadMessages();
  }

  private loadMessages(): void {
    this.isLoading.set(true);
    this.msgService.getAllMessages().subscribe({
      next: (msgs) => {
        this.messages.set(msgs);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  directionLabel(dir: MessageDirection): string {
    return MESSAGE_DIRECTION_DISPLAY_NAMES[dir] ?? dir;
  }

  statusLabel(status: MessageStatus): string {
    return MESSAGE_STATUS_DISPLAY_NAMES[status] ?? status;
  }
}
