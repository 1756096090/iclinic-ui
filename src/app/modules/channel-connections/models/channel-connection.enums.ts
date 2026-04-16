/**
 * Enumeraciones para el módulo de Conexiones de Canales
 */

export enum ChannelType {
  WHATSAPP = 'WHATSAPP',
  TELEGRAM = 'TELEGRAM',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  SLACK = 'SLACK',
  WEBHOOK = 'WEBHOOK',
}

export enum ChannelProvider {
  TELEGRAM = 'TELEGRAM',
  META = 'META',
  TWILIO = 'TWILIO',
  SENDGRID = 'SENDGRID',
  CUSTOM = 'CUSTOM',
}

export enum ChannelConnectionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR',
  VERIFIED = 'VERIFIED',
}

export const CHANNEL_TYPE_DISPLAY_NAMES: Record<ChannelType, string> = {
  [ChannelType.WHATSAPP]: 'WhatsApp',
  [ChannelType.TELEGRAM]: 'Telegram',
  [ChannelType.SMS]: 'SMS',
  [ChannelType.EMAIL]: 'Email',
  [ChannelType.FACEBOOK]: 'Facebook',
  [ChannelType.INSTAGRAM]: 'Instagram',
  [ChannelType.SLACK]: 'Slack',
  [ChannelType.WEBHOOK]: 'Webhook',
};

export const CHANNEL_PROVIDER_DISPLAY_NAMES: Record<ChannelProvider, string> = {
  [ChannelProvider.TELEGRAM]: 'Telegram',
  [ChannelProvider.META]: 'Meta (WhatsApp/Instagram)',
  [ChannelProvider.TWILIO]: 'Twilio',
  [ChannelProvider.SENDGRID]: 'SendGrid',
  [ChannelProvider.CUSTOM]: 'Personalizado',
};

export const CHANNEL_STATUS_DISPLAY_NAMES: Record<ChannelConnectionStatus, string> = {
  [ChannelConnectionStatus.ACTIVE]: 'Activo',
  [ChannelConnectionStatus.INACTIVE]: 'Inactivo',
  [ChannelConnectionStatus.PENDING]: 'Pendiente',
  [ChannelConnectionStatus.DISCONNECTED]: 'Desconectado',
  [ChannelConnectionStatus.ERROR]: 'Error',
  [ChannelConnectionStatus.VERIFIED]: 'Verificado',
};
