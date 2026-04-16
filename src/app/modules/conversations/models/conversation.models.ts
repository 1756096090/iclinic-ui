/**
 * DTOs y Modelos para Conversaciones
 */

import { ConversationStatus } from './conversation.enums';

/**
 * Response de conversación
 */
export interface ConversationResponseDto {
  id: number;
  contactId: number;
  channelConnectionId: number;
  assignedUserId?: number;
  status: ConversationStatus;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request para crear conversación
 */
export interface CreateConversationRequest {
  contactId: number;
  channelConnectionId: number;
}

/**
 * Request para actualizar conversación
 */
export interface UpdateConversationRequest {
  assignedUserId?: number;
  status?: ConversationStatus;
}

/**
 * Clase modelo para conversación
 */
export class Conversation implements ConversationResponseDto {
  id!: number;
  contactId!: number;
  channelConnectionId!: number;
  assignedUserId?: number;
  status!: ConversationStatus;
  lastMessageAt!: string;
  createdAt!: string;
  updatedAt!: string;

  static fromResponse(response: ConversationResponseDto): Conversation {
    const conversation = new Conversation();
    Object.assign(conversation, response);
    return conversation;
  }
}

export type ConversationResponse = ConversationResponseDto;
