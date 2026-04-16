/**
 * Configuración global de la aplicación
 */

/**
 * Variables de entorno y configuración
 */
export const APP_CONFIG = {
  // API
  API_URL: '/api/v1',
  API_TIMEOUT: 30000,

  // Paginación
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],

  // Rutas
  ROUTES: {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    USERS: '/users',
    COMPANIES: '/companies',
    BRANCHES: '/branches',
    CONVERSATIONS: '/conversations',
    MESSAGES: '/messages',
    CHANNEL_CONNECTIONS: '/channel-connections',
  },

  // Sesión
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  TOKEN_REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutos

  // Notificaciones
  TOAST_DURATION: 3000, // milisegundos
  DIALOG_WIDTH: '600px',

  // Validaciones
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
} as const;
