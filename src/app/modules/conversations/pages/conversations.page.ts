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
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { ConversationService } from '../services';
import { MessageService } from '../../messages/services';
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

  readonly msgBodyRef = viewChild<ElementRef<HTMLDivElement>>('msgBody');

  readonly conversations = signal<ConversationResponseDto[]>([]);
  readonly messages = signal<MessageResponseDto[]>([]);
  readonly selectedConversation = signal<ConversationResponseDto | null>(null);
  readonly selectedId = computed(() => this.selectedConversation()?.id ?? null);
  readonly loadingConvs = signal(false);
  readonly loadingMsgs = signal(false);
  readonly sending = signal(false);

  readonly closedStatus = ConversationStatus.CLOSED;
  readonly inbound = MessageDirection.INBOUND;
  readonly outbound = MessageDirection.OUTBOUND;

  messageText = '';

  private shouldScrollBottom = false;

  ngOnInit(): void {
    this.loadConversations();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollBottom) {
      this.scrollToBottom();
      this.shouldScrollBottom = false;
    }
  }

  private loadConversations(): void {
    this.loadingConvs.set(true);
    this.convService.getAllConversations().subscribe({
      next: (convs) => {
        this.conversations.set(convs);
        this.loadingConvs.set(false);
      },
      error: () => {
        this.loadingConvs.set(false);
      },
    });
  }

  selectConversation(conv: ConversationResponseDto): void {
    this.selectedConversation.set(conv);
    this.messages.set([]);
    this.loadMessages(conv.id);
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

  private scrollToBottom(): void {
    const el = this.msgBodyRef()?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
