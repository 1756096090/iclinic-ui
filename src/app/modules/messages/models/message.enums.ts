/**
 * Enumeraciones para el módulo de Mensajes
 */

export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  TEMPLATE = 'TEMPLATE',
}

export enum MessageStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

export const MESSAGE_DIRECTION_DISPLAY_NAMES: Record<MessageDirection, string> = {
  [MessageDirection.INBOUND]: 'Entrante',
  [MessageDirection.OUTBOUND]: 'Saliente',
};

export const MESSAGE_TYPE_DISPLAY_NAMES: Record<MessageType, string> = {
  [MessageType.TEXT]: 'Texto',
  [MessageType.IMAGE]: 'Imagen',
  [MessageType.VIDEO]: 'Video',
  [MessageType.AUDIO]: 'Audio',
  [MessageType.DOCUMENT]: 'Documento',
  [MessageType.TEMPLATE]: 'Plantilla',
};

export const MESSAGE_STATUS_DISPLAY_NAMES: Record<MessageStatus, string> = {
  [MessageStatus.PENDING]: 'Pendiente',
  [MessageStatus.SENT]: 'Enviado',
  [MessageStatus.DELIVERED]: 'Entregado',
  [MessageStatus.READ]: 'Leído',
  [MessageStatus.FAILED]: 'Fallido',
};
