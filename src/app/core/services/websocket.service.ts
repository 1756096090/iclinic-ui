import { Injectable, computed, inject, signal, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import { ConfigService } from '../config';

export interface MessageNotificationDto {
  messageId: number;
  conversationId: number;
  contactId: number;
  contactName: string;
  channelType: string;
  preview: string;
  receivedAt: string;
  newConversation: boolean;
}

export interface NotificationFeedItem extends MessageNotificationDto {
  seen: boolean;
}

/**
 * Servicio WebSocket STOMP para notificaciones en tiempo real.
 *
 * Se conecta al endpoint nativo `/ws-stomp` del backend (sin SockJS),
 * compatible con Cloudflare Tunnel sobre `wss://`.
 *
 * Uso:
 *   wsService.connect(companyId);
 *   wsService.onNotification$.subscribe(notif => ...);
 *   wsService.disconnect(); // en ngOnDestroy
 */
@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly config = inject(ConfigService);

  private client: Client | null = null;
  private readonly notificationSubject = new Subject<MessageNotificationDto>();
  private readonly notificationFeed = signal<NotificationFeedItem[]>([]);

  /** Signal del estado de conexión */
  readonly isConnected = signal(false);

  /** Observable de notificaciones entrantes desde el broker STOMP */
  readonly onNotification$: Observable<MessageNotificationDto> =
    this.notificationSubject.asObservable();
  readonly notifications = computed(() => this.notificationFeed());
  readonly unreadCount = computed(() =>
    this.notificationFeed().reduce((count, item) => count + (item.seen ? 0 : 1), 0)
  );

  private shouldPlayNotificationSound(notification: MessageNotificationDto): boolean {
    return notification.messageId > 0 && notification.preview.trim().length > 0;
  }

  private playNotificationSound(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) {
        return;
      }

      const context = new AudioContextCtor();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(740, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(988, context.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.0001, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.022, context.currentTime + 0.018);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.2);

      oscillator.onended = () => {
        void context.close();
      };
    } catch {
      // Browsers may block autoplay-style audio until the user interacts with the page.
    }
  }

  /**
   * Conecta al broker STOMP y suscribe al topic de notificaciones de la empresa.
   * No hace nada si ya está conectado o si se ejecuta en SSR.
   */
  connect(companyId: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.client?.active) return;

    const brokerURL = this.config.getWsUrl();

    this.client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      onConnect: () => {
        this.isConnected.set(true);
        this.client!.subscribe(
          `/topic/notifications/${companyId}`,
          (msg: IMessage) => {
            try {
              const notification: MessageNotificationDto = JSON.parse(msg.body);
              if (this.shouldPlayNotificationSound(notification)) {
                this.playNotificationSound();
              }
              this.notificationFeed.update((items) => {
                const nextItem: NotificationFeedItem = { ...notification, seen: false };
                const filtered = items.filter((item) => item.messageId !== notification.messageId);
                return [nextItem, ...filtered].slice(0, 15);
              });
              this.notificationSubject.next(notification);
            } catch {
              console.error('[WS] Error al parsear notificación');
            }
          }
        );
      },
      onDisconnect: () => {
        this.isConnected.set(false);
      },
      onStompError: (frame) => {
        console.error('[WS] Error STOMP:', frame.headers['message']);
        this.isConnected.set(false);
      },
      onWebSocketError: (event) => {
        console.error('[WS] Error WebSocket:', event);
        this.isConnected.set(false);
      },
    });

    this.client.activate();
  }

  /** Desconecta del broker y limpia el cliente */
  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
    this.isConnected.set(false);
  }

  markAllNotificationsAsSeen(): void {
    this.notificationFeed.update((items) =>
      items.map((item) => ({ ...item, seen: true }))
    );
  }

  markNotificationAsSeen(messageId: number): void {
    this.notificationFeed.update((items) =>
      items.map((item) =>
        item.messageId === messageId ? { ...item, seen: true } : item
      )
    );
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
