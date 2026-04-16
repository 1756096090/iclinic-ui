/**
 * Servicio para gestionar conversaciones
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services';
import { API_ENDPOINTS } from '../../../core/models';
import {
  ConversationResponseDto,
  CreateConversationRequest,
  UpdateConversationRequest,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private readonly http = inject(HttpService);

  getAllConversations(): Observable<ConversationResponseDto[]> {
    return this.http.get<ConversationResponseDto[]>(
      API_ENDPOINTS.CONVERSATIONS.GET_ALL
    );
  }

  getConversationsByCompany(
    companyId: number
  ): Observable<ConversationResponseDto[]> {
    return this.http.get<ConversationResponseDto[]>(
      API_ENDPOINTS.CONVERSATIONS.GET_BY_COMPANY(companyId)
    );
  }

  getConversationById(id: number): Observable<ConversationResponseDto> {
    return this.http.get<ConversationResponseDto>(
      API_ENDPOINTS.CONVERSATIONS.GET_BY_ID(id)
    );
  }

  getConversationsByChannel(
    channelId: number
  ): Observable<ConversationResponseDto[]> {
    return this.http.get<ConversationResponseDto[]>(
      API_ENDPOINTS.CONVERSATIONS.GET_BY_CHANNEL(channelId)
    );
  }

  // Removed getConversationsByContact - use getConversationsByBranch or getConversationsByChannel instead

  createConversation(
    request: CreateConversationRequest
  ): Observable<ConversationResponseDto> {
    return this.http.post<ConversationResponseDto>(
      API_ENDPOINTS.CONVERSATIONS.CREATE,
      request
    );
  }

  updateConversation(
    id: number,
    request: UpdateConversationRequest
  ): Observable<ConversationResponseDto> {
    return this.http.put<ConversationResponseDto>(
      API_ENDPOINTS.CONVERSATIONS.UPDATE(id),
      request
    );
  }

  assignConversation(
    id: number,
    userId: number
  ): Observable<ConversationResponseDto> {
    return this.http.put<ConversationResponseDto>(
      API_ENDPOINTS.CONVERSATIONS.ASSIGN(id),
      { userId }
    );
  }

  closeConversation(id: number): Observable<ConversationResponseDto> {
    return this.http.put<ConversationResponseDto>(
      API_ENDPOINTS.CONVERSATIONS.CLOSE(id),
      {}
    );
  }
}
