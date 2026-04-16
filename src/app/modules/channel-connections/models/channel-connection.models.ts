/**
 * DTOs y Modelos para Conexiones de Canales
 */

import { ChannelType, ChannelProvider, ChannelConnectionStatus } from './channel-connection.enums';

/**
 * Request para crear conexión de canal
 */
export interface CreateChannelConnectionRequestDto {
  companyId: number;
  branchId: number;
  channelType: ChannelType;
  provider: ChannelProvider;
  externalAccountId: string;
  externalPhoneNumberId?: string;
  accessToken: string;
  webhookVerifyToken?: string;
  webhookBaseUrl?: string;
}

/**
 * Response de conexión de canal
 */
export interface ChannelConnectionResponseDto {
  id: number;
  branchId: number;
  channelType: ChannelType;
  provider: ChannelProvider;
  externalAccountId: string;
  externalPhoneNumberId?: string;
  status: ChannelConnectionStatus;
  createdAt: string;
}

/**
 * Request para actualizar conexión de canal
 */
export interface UpdateChannelConnectionRequest {
  accessToken?: string;
  webhookVerifyToken?: string;
  webhookBaseUrl?: string;
  status?: ChannelConnectionStatus;
}

/**
 * Clase modelo para conexión de canal
 */
export class ChannelConnection implements ChannelConnectionResponseDto {
  id!: number;
  branchId!: number;
  channelType!: ChannelType;
  provider!: ChannelProvider;
  externalAccountId!: string;
  externalPhoneNumberId?: string;
  status!: ChannelConnectionStatus;
  createdAt!: string;

  static fromResponse(response: ChannelConnectionResponseDto): ChannelConnection {
    const connection = new ChannelConnection();
    Object.assign(connection, response);
    return connection;
  }
}

export type ChannelConnectionResponse = ChannelConnectionResponseDto;

export interface WebhookInfoDto {
  url: string;
  hasCustomCertificate: boolean;
  pendingUpdateCount: number;
  lastErrorDate?: number;
  lastErrorMessage?: string;
  maxConnections: number;
  urlMatches: boolean;
  expectedUrl: string;
}
