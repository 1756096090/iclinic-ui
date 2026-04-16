/**
 * Servicio para gestionar conexiones de canales
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services';
import { API_ENDPOINTS } from '../../../core/models';
import {
  CreateChannelConnectionRequestDto,
  ChannelConnectionResponseDto,
  UpdateChannelConnectionRequest,
  WebhookInfoDto,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ChannelConnectionService {
  private readonly http = inject(HttpService);

  getAllConnections(): Observable<ChannelConnectionResponseDto[]> {
    return this.http.get<ChannelConnectionResponseDto[]>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.GET_ALL
    );
  }

  getConnectionById(id: number): Observable<ChannelConnectionResponseDto> {
    return this.http.get<ChannelConnectionResponseDto>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.GET_BY_ID(id)
    );
  }

  getConnectionsByBranch(
    branchId: number
  ): Observable<ChannelConnectionResponseDto[]> {
    return this.http.get<ChannelConnectionResponseDto[]>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.GET_BY_BRANCH(branchId)
    );
  }

  getConnectionsByType(
    type: string
  ): Observable<ChannelConnectionResponseDto[]> {
    return this.http.get<ChannelConnectionResponseDto[]>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.GET_BY_TYPE(type)
    );
  }

  createConnection(
    request: CreateChannelConnectionRequestDto
  ): Observable<ChannelConnectionResponseDto> {
    return this.http.post<ChannelConnectionResponseDto>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.CREATE,
      request
    );
  }

  updateConnection(
    id: number,
    request: UpdateChannelConnectionRequest
  ): Observable<ChannelConnectionResponseDto> {
    return this.http.put<ChannelConnectionResponseDto>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.UPDATE(id),
      request
    );
  }

  deleteConnection(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.CHANNEL_CONNECTIONS.DELETE(id));
  }

  activate(id: number): Observable<ChannelConnectionResponseDto> {
    return this.http.patch<ChannelConnectionResponseDto>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.ACTIVATE(id),
      {}
    );
  }

  deactivate(id: number): Observable<ChannelConnectionResponseDto> {
    return this.http.patch<ChannelConnectionResponseDto>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.DEACTIVATE(id),
      {}
    );
  }

  setWebhook(id: number, webhookBaseUrl: string): Observable<ChannelConnectionResponseDto> {
    return this.http.patch<ChannelConnectionResponseDto>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.SET_WEBHOOK(id),
      { webhookBaseUrl }
    );
  }

  getWebhookInfo(id: number): Observable<WebhookInfoDto> {
    return this.http.get<WebhookInfoDto>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.WEBHOOK_INFO(id)
    );
  }

  verifyWebhook(
    id: number,
    token: string
  ): Observable<{ verified: boolean }> {
    return this.http.post<{ verified: boolean }>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.VERIFY_WEBHOOK,
      { id, token }
    );
  }

  handleWebhook(payload: unknown): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      API_ENDPOINTS.CHANNEL_CONNECTIONS.HANDLE_WEBHOOK,
      payload
    );
  }
}
