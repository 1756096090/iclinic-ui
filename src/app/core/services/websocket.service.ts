import { Injectable, inject, signal, OnDestroy, PLATFORM_ID } from '@angular/core';
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

  /** Signal del estado de conexión */
  readonly isConnected = signal(false);

  /** Observable de notificaciones entrantes desde el broker STOMP */
  readonly onNotification$: Observable<MessageNotificationDto> =
    this.notificationSubject.asObservable();

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

  ngOnDestroy(): void {
    this.disconnect();
  }
}
