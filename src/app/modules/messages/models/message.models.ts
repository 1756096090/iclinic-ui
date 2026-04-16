/**
 * DTOs y Modelos para Mensajes
 */

import { MessageDirection, MessageType, MessageStatus } from './message.enums';

/**
 * Request para enviar mensaje
 */
export interface SendMessageRequestDto {
  conversationId: number;
  sentByUserId: number;
  content: string;
}

/**
 * Response de mensaje
 */
export interface MessageResponseDto {
  id: number;
  conversationId: number;
  direction: MessageDirection;
  messageType: MessageType;
  status: MessageStatus;
  externalMessageId: string;
  content: string;
  mediaUrl?: string;
  sentByUserId: number;
  createdAt: string;
}

/**
 * Clase modelo para mensaje
 */
export class Message implements MessageResponseDto {
  id!: number;
  conversationId!: number;
  direction!: MessageDirection;
  messageType!: MessageType;
  status!: MessageStatus;
  externalMessageId!: string;
  content!: string;
  mediaUrl?: string;
  sentByUserId!: number;
  createdAt!: string;

  static fromResponse(response: MessageResponseDto): Message {
    const message = new Message();
    Object.assign(message, response);
    return message;
  }
}

export type MessageResponse = MessageResponseDto;
