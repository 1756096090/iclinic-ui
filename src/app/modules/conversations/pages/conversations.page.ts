import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  ElementRef,
  viewChild,
  AfterViewChecked,
  PLATFORM_ID,
  DestroyRef,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { map } from 'rxjs/operators';
import { ConversationService } from '../services';
import { MessageService } from '../../messages/services';
import { WebSocketService, MessageNotificationDto } from '../../../core/services';
import {
  ConversationResponseDto,
  ConversationStatus,
  CONVERSATION_STATUS_DISPLAY_NAMES,
} from '../models';
import {
  MessageResponseDto,
  MessageDirection,
  SendMessageRequestDto,
} from '../../messages/models';

interface ConversationRealtimeState {
  lastReceivedAt: string;
  unreadCount: number;
}

@Component({
  selector: 'app-conversations-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, FormsModule, MatIcon, MatProgressSpinner, MatTooltip],
  styleUrl: './conversations.page.css',
  templateUrl: './conversations.page.html',
})
export class ConversationsPageComponent implements OnInit, AfterViewChecked {
  private readonly convService = inject(ConversationService);
  private readonly msgService = inject(MessageService);
  private readonly wsService = inject(WebSocketService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly route = inject(ActivatedRoute);

  readonly msgBodyRef = viewChild<ElementRef<HTMLDivElement>>('msgBody');

  readonly conversations = signal<ConversationResponseDto[]>([]);
  readonly realtimeState = signal<Record<number, ConversationRealtimeState>>({});
  readonly sortedConversations = computed(() =>
    [...this.conversations()].sort(
      (left, right) =>
        this.conversationSortTime(right) - this.conversationSortTime(left)
    )
  );
  readonly messages = signal<MessageResponseDto[]>([]);
  readonly selectedConversation = signal<ConversationResponseDto | null>(null);
  readonly selectedId = computed(() => this.selectedConversation()?.id ?? null);
  readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 640px)').pipe(map((r) => r.matches)),
    { initialValue: false }
  );
  readonly loadingConvs = signal(false);
  readonly loadingMsgs = signal(false);
  readonly sending = signal(false);

  readonly closedStatus = ConversationStatus.CLOSED;
  readonly inbound = MessageDirection.INBOUND;
  readonly outbound = MessageDirection.OUTBOUND;
  readonly readStatus = 'READ';

  messageText = '';

  private shouldScrollBottom = false;
  private pendingConversationId: number | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const conversationId = Number(params.get('conversationId'));
        this.pendingConversationId = Number.isInteger(conversationId) && conversationId > 0
          ? conversationId
          : null;
        this.syncPendingConversationFromRoute();
      });

    this.wsService.onNotification$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notification) => this.handleIncomingNotification(notification));

    this.loadConversations();
    this.loadUnreadCounts();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollBottom) {
      this.scrollToBottom();
      this.shouldScrollBottom = false;
    }
  }

  private loadConversations(): void {
    const currentSelectedId = this.selectedConversation()?.id ?? null;

    this.loadingConvs.set(true);
    this.convService.getAllConversations().subscribe({
      next: (convs) => {
        this.conversations.set(convs);

        if (currentSelectedId != null) {
          const refreshedSelected = convs.find((c) => c.id === currentSelectedId) ?? null;
          this.selectedConversation.set(refreshedSelected);
        }

        this.syncPendingConversationFromRoute();

        this.loadingConvs.set(false);
      },
      error: () => {
        this.loadingConvs.set(false);
      },
    });
  }

  selectConversation(conv: ConversationResponseDto): void {
    this.selectedConversation.set(conv);
    this.realtimeState.update((state) => ({
      ...state,
      [conv.id]: {
        lastReceivedAt: state[conv.id]?.lastReceivedAt ?? conv.lastMessageAt,
        unreadCount: 0,
      },
    }));
    this.messages.set([]);
    this.loadMessages(conv.id);
  }

  backToList(): void {
    this.selectedConversation.set(null);
    this.messages.set([]);
  }

  private loadMessages(convId: number): void {
    this.loadingMsgs.set(true);
    this.msgService.getMessagesByConversation(convId).subscribe({
      next: (msgs) => {
        this.messages.set(msgs);
        this.loadingMsgs.set(false);
        this.shouldScrollBottom = true;
      },
      error: () => {
        this.loadingMsgs.set(false);
      },
    });
  }

  sendMessage(): void {
    const content = this.messageText.trim();
    const conv = this.selectedConversation();
    if (!content || !conv || this.sending()) return;

    const dto: SendMessageRequestDto = {
      conversationId: conv.id,
      sentByUserId: 1,
      content,
    };

    this.sending.set(true);
    this.messageText = '';

    this.msgService.sendMessage(dto).subscribe({
      next: (msg) => {
        this.messages.update((list) => [...list, msg]);
        this.sending.set(false);
        this.shouldScrollBottom = true;
      },
      error: () => {
        this.sending.set(false);
      },
    });
  }

  onEnter(event: Event): void {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  closeConversation(): void {
    const conv = this.selectedConversation();
    if (!conv) return;
    this.convService.closeConversation(conv.id).subscribe({
      next: (updated) => {
        this.selectedConversation.set(updated);
        this.conversations.update((list) =>
          list.map((c) => (c.id === conv.id ? updated : c))
        );
      },
    });
  }

  statusLabel(status: ConversationStatus): string {
    return CONVERSATION_STATUS_DISPLAY_NAMES[status] ?? status;
  }

  unreadCountForConversation(conversationId: number): number {
    return this.realtimeState()[conversationId]?.unreadCount ?? 0;
  }

  conversationLastActivityAt(conversation: ConversationResponseDto): string {
    return this.realtimeState()[conversation.id]?.lastReceivedAt ?? conversation.lastMessageAt;
  }

  private scrollToBottom(): void {
    const el = this.msgBodyRef()?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  private loadUnreadCounts(): void {
    this.msgService.getAllMessages().subscribe({
      next: (msgs) => {
        const nextState = msgs.reduce<Record<number, ConversationRealtimeState>>((acc, msg) => {
          const prev = acc[msg.conversationId] ?? {
            lastReceivedAt: msg.createdAt,
            unreadCount: 0,
          };
          const lastReceivedAt =
            new Date(msg.createdAt).getTime() > new Date(prev.lastReceivedAt).getTime()
              ? msg.createdAt
              : prev.lastReceivedAt;

          if (msg.direction === this.inbound && msg.status !== this.readStatus) {
            acc[msg.conversationId] = {
              lastReceivedAt,
              unreadCount: prev.unreadCount + 1,
            };
            return acc;
          }

          acc[msg.conversationId] = {
            lastReceivedAt,
            unreadCount: prev.unreadCount,
          };
          return acc;
        }, {});
        this.realtimeState.update((state) => ({ ...nextState, ...state }));
      },
      error: () => {
        this.realtimeState.update((state) => state);
      },
    });
  }

  private conversationSortTime(conversation: ConversationResponseDto): number {
    return new Date(this.conversationLastActivityAt(conversation)).getTime();
  }

  private handleIncomingNotification(notification: MessageNotificationDto): void {
    this.realtimeState.update((state) => {
      const prev = state[notification.conversationId] ?? {
        lastReceivedAt: notification.receivedAt,
        unreadCount: 0,
      };

      return {
        ...state,
        [notification.conversationId]: {
          lastReceivedAt: notification.receivedAt,
          unreadCount: this.selectedId() === notification.conversationId ? 0 : prev.unreadCount + 1,
        },
      };
    });

    if (!this.conversations().some((item) => item.id === notification.conversationId) || notification.newConversation) {
      this.loadConversations();
    }

    if (this.selectedId() === notification.conversationId) {
      this.loadMessages(notification.conversationId);
    }
  }

  private syncPendingConversationFromRoute(): void {
    if (this.pendingConversationId == null) {
      return;
    }

    const conversation = this.conversations().find((item) => item.id === this.pendingConversationId);
    if (!conversation) {
      return;
    }

    if (this.selectedId() !== conversation.id) {
      this.selectConversation(conversation);
    } else if (this.messages().length === 0) {
      this.loadMessages(conversation.id);
    }

    this.pendingConversationId = null;
  }
}
