/**
 * Application Configuration Model
 * Loaded from public/env.json at startup
 */
export interface AppConfig {
  apiUrl: string;
  wsUrl?: string;
  telegramAutoWebhookDev?: boolean;
  appName: string;
  appVersion: string;
  enableLogging: boolean;
  sessionTimeoutMinutes: number;
  enableAdvancedAnalytics: boolean;
  enableBetaFeatures: boolean;
}

/**
 * Default configuration fallback
 * Used if env.json cannot be loaded
 */
export const DEFAULT_APP_CONFIG: AppConfig = {
  apiUrl: '/api/v1',
  wsUrl: undefined,
  telegramAutoWebhookDev: false,
  appName: 'iClinic',
  appVersion: '1.0.0',
  enableLogging: true,
  sessionTimeoutMinutes: 30,
  enableAdvancedAnalytics: false,
  enableBetaFeatures: false,
};
