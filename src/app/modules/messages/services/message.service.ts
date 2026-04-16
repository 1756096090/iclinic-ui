/**
 * Servicio para gestionar mensajes
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services';
import { API_ENDPOINTS } from '../../../core/models';
import {
  SendMessageRequestDto,
  MessageResponseDto,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly http = inject(HttpService);

  getAllMessages(): Observable<MessageResponseDto[]> {
    return this.http.get<MessageResponseDto[]>(API_ENDPOINTS.MESSAGES.GET_ALL);
  }

  getMessageById(id: number): Observable<MessageResponseDto> {
    return this.http.get<MessageResponseDto>(
      API_ENDPOINTS.MESSAGES.GET_BY_ID(id)
    );
  }

  getMessagesByConversation(
    conversationId: number
  ): Observable<MessageResponseDto[]> {
    return this.http.get<MessageResponseDto[]>(
      API_ENDPOINTS.MESSAGES.GET_BY_CONVERSATION(conversationId)
    );
  }

  sendMessage(
    request: SendMessageRequestDto
  ): Observable<MessageResponseDto> {
    return this.http.post<MessageResponseDto>(
      API_ENDPOINTS.MESSAGES.SEND,
      request
    );
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.MESSAGES.DELETE(id));
  }
}
