import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import {
  ChannelConnectionResponseDto,
  ChannelType,
  ChannelConnectionStatus,
  CHANNEL_TYPE_DISPLAY_NAMES,
  CHANNEL_STATUS_DISPLAY_NAMES,
  UpdateChannelConnectionRequest,
} from '../models';

@Component({
  selector: 'app-channel-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './channel-list.component.css',
  imports: [
    MatIcon,
    MatProgressSpinner,
    MatTooltip,
  ],
  templateUrl: './channel-list.component.html',
})
export class ChannelListComponent {
  readonly channels = input<ChannelConnectionResponseDto[]>([]);
  readonly isLoading = input(false);

  readonly edit = output<ChannelConnectionResponseDto>();
  readonly delete = output<ChannelConnectionResponseDto>();
  readonly toggleStatus = output<{ id: number; req: UpdateChannelConnectionRequest }>();

  readonly activeStatus = ChannelConnectionStatus.ACTIVE;

  channelLabel(type: ChannelType): string {
    return CHANNEL_TYPE_DISPLAY_NAMES[type] ?? type;
  }

  statusLabel(status: ChannelConnectionStatus): string {
    return CHANNEL_STATUS_DISPLAY_NAMES[status] ?? status;
  }

  channelIcon(type: ChannelType): string {
    const icons: Partial<Record<ChannelType, string>> = {
      [ChannelType.WHATSAPP]: 'chat',
      [ChannelType.TELEGRAM]: 'send',
      [ChannelType.SMS]: 'sms',
      [ChannelType.EMAIL]: 'email',
      [ChannelType.FACEBOOK]: 'thumb_up',
      [ChannelType.INSTAGRAM]: 'photo_camera',
      [ChannelType.SLACK]: 'workspaces',
      [ChannelType.WEBHOOK]: 'webhook',
    };
    return icons[type] ?? 'hub';
  }

  onToggle(ch: ChannelConnectionResponseDto): void {
    const newStatus =
      ch.status === ChannelConnectionStatus.ACTIVE
        ? ChannelConnectionStatus.INACTIVE
        : ChannelConnectionStatus.ACTIVE;
    this.toggleStatus.emit({ id: ch.id, req: { status: newStatus } });
  }
}
