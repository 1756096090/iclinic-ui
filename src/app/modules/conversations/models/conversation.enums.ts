/**
 * Enumeraciones para el módulo de Conversaciones
 */

export enum ConversationStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export const CONVERSATION_STATUS_DISPLAY_NAMES: Record<ConversationStatus, string> = {
  [ConversationStatus.OPEN]: 'Abierta',
  [ConversationStatus.ASSIGNED]: 'Asignada',
  [ConversationStatus.IN_PROGRESS]: 'En Progreso',
  [ConversationStatus.CLOSED]: 'Cerrada',
  [ConversationStatus.ARCHIVED]: 'Archivada',
};
