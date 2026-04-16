import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ChannelListComponent } from '../components';
import { ChannelFormComponent } from '../components/channel-form.component';
import { ChannelConnectionService } from '../services';
import {
  ChannelConnectionResponseDto,
  CreateChannelConnectionRequestDto,
  UpdateChannelConnectionRequest,
} from '../models';

@Component({
  selector: 'app-channel-connections-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChannelListComponent, MatIcon, ChannelFormComponent],
  styleUrl: './channel-connections.page.css',
  templateUrl: './channel-connections.page.html',
})
export class ChannelConnectionsPageComponent implements OnInit {
  private readonly channelService = inject(ChannelConnectionService);

  readonly channels = signal<ChannelConnectionResponseDto[]>([]);
  readonly isLoading = signal(false);
  readonly editingChannel = signal<ChannelConnectionResponseDto | null>(null);
  readonly isFormOpen = signal(false);
  readonly isSaving = signal(false);

  ngOnInit(): void {
    this.loadChannels();
  }

  private loadChannels(): void {
    this.isLoading.set(true);
    this.channelService.getAllConnections().subscribe({
      next: (channels) => {
        this.channels.set(channels);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  onToggleStatus({ id, req }: { id: number; req: UpdateChannelConnectionRequest }): void {
    this.channelService.updateConnection(id, req).subscribe({
      next: (updated) => {
        this.channels.update((list) =>
          list.map((ch) => (ch.id === id ? updated : ch))
        );
      },
    });
  }

  onCreateNew(): void {
    this.editingChannel.set(null);
    this.isFormOpen.set(true);
  }

  onEditChannel(ch: ChannelConnectionResponseDto): void {
    this.editingChannel.set(ch);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingChannel.set(null);
  }

  onSaveCreate(req: CreateChannelConnectionRequestDto): void {
    this.isSaving.set(true);
    this.channelService.createConnection(req).subscribe({
      next: (created) => {
        this.channels.update((list) => [...list, created]);
        this.isSaving.set(false);
        this.closeForm();
      },
      error: () => this.isSaving.set(false),
    });
  }

  onSaveEdit(req: UpdateChannelConnectionRequest): void {
    const ch = this.editingChannel();
    if (!ch?.id) return;
    this.isSaving.set(true);
    this.channelService.updateConnection(ch.id, req).subscribe({
      next: (updated) => {
        this.channels.update((list) =>
          list.map((c) => (c.id === updated.id ? updated : c))
        );
        this.isSaving.set(false);
        this.closeForm();
      },
      error: () => this.isSaving.set(false),
    });
  }

  onDeleteChannel(ch: ChannelConnectionResponseDto): void {
    this.channelService.deleteConnection(ch.id).subscribe({
      next: () => this.channels.update((list) => list.filter((c) => c.id !== ch.id)),
    });
  }
}
