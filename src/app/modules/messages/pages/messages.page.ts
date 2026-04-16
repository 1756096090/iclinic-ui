import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { MessageService } from '../services';
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

  readonly messages = signal<MessageResponseDto[]>([]);
  readonly isLoading = signal(false);

  readonly inbound = MessageDirection.INBOUND;

  ngOnInit(): void {
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
