/**
 * Constantes de endpoints de la API
 * 
 * Nota: Las URLs usan rutas relativas. El HttpService
 * automáticamente prependerá la URL base desde ConfigService.
 * 
 * Ejemplo: 'users' se convertirá en:
 * http://localhost:8080/api/v1/users (basado en env.json)
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    REFRESH: 'auth/refresh',
    ME: 'auth/me',
  },

  // Users
  USERS: {
    BASE: 'users',
    CREATE: 'users',
    GET_ALL: 'users',
    GET_BY_ID: (id: number) => `users/${id}`,
    UPDATE: (id: number) => `users/${id}`,
    DELETE: (id: number) => `users/${id}`,
    GET_BY_COMPANY: (companyId: number) => `users/company/${companyId}`,
    GET_BY_BRANCH: (branchId: number) => `users/branch/${branchId}`,
    SEARCH: 'users/search',
  },

  // Companies
  COMPANIES: {
    BASE: 'companies',
    CREATE: 'companies',
    GET_ALL: 'companies',
    GET_BY_ID: (id: number) => `companies/${id}`,
    UPDATE: (id: number) => `companies/${id}`,
    DELETE: (id: number) => `companies/${id}`,
    CREATE_UNIFIED: 'companies/unified',
    CREATE_ECUADORIAN: 'companies/ecuadorian',
    CREATE_COLOMBIAN: 'companies/colombian',
    GET_BY_TYPE: (type: string) => `companies/type/${type}`,
  },

  // Branches
  BRANCHES: {
    BASE: 'branches',
    CREATE: 'branches',
    GET_ALL: 'branches',
    GET_BY_ID: (id: number) => `branches/${id}`,
    UPDATE: (id: number) => `branches/${id}`,
    DELETE: (id: number) => `branches/${id}`,
    GET_BY_COMPANY: (companyId: number) => `branches/company/${companyId}`,
    CREATE_UNIFIED: 'branches',
    CREATE_HOSPITAL: 'branches/hospital',
    CREATE_CLINIC: 'branches/clinic',
    GET_BY_TYPE: (type: string) => `branches/type/${type}`,
  },

  // Conversations
  CONVERSATIONS: {
    BASE: 'crm/conversations',
    CREATE: 'crm/conversations',
    GET_ALL: 'crm/conversations',
    GET_BY_ID: (id: number) => `crm/conversations/${id}`,
    UPDATE: (id: number) => `crm/conversations/${id}`,
    GET_BY_BRANCH: (branchId: number) => `crm/conversations/branch/${branchId}`,
    GET_BY_CHANNEL: (channelId: number) => `crm/conversations/channel/${channelId}`,
    GET_BY_COMPANY: (companyId: number) => `crm/conversations/company/${companyId}`,
    ASSIGN: (conversationId: number) => `crm/conversations/${conversationId}/assign`,
    CLOSE: (id: number) => `crm/conversations/${id}/close`,
  },

  // Messages
  MESSAGES: {
    BASE: 'crm/messages',
    CREATE: 'crm/messages',
    GET_ALL: 'crm/messages',
    GET_BY_ID: (id: number) => `crm/messages/${id}`,
    SEND: 'crm/messages/send',
    GET_BY_CONVERSATION: (conversationId: number) =>
      `crm/messages/conversation/${conversationId}`,
    DELETE: (id: number) => `crm/messages/${id}`,
  },

  // Appointments / Schedule
  APPOINTMENTS: {
    BASE: 'appointments',
    CREATE: 'appointments',
    GET_BY_ID: (id: number) => `appointments/${id}`,
    GET_BY_BRANCH: (branchId: number) => `appointments/branch/${branchId}`,
    GET_BY_CONTACT: (contactId: number) => `appointments/contact/${contactId}`,
    RESCHEDULE: (id: number) => `appointments/${id}/reschedule`,
    CANCEL: (id: number) => `appointments/${id}/cancel`,
    AVAILABLE_SLOTS: (branchId: number, doctorId: number, date: string) =>
      `appointments/available-slots?branchId=${branchId}&doctorId=${doctorId}&date=${date}`,
  },

  // Channel Connections
  CHANNEL_CONNECTIONS: {
    BASE: 'crm/channels',
    CREATE: 'crm/channels',
    GET_ALL: 'crm/channels',
    GET_BY_ID: (id: number) => `crm/channels/${id}`,
    UPDATE: (id: number) => `crm/channels/${id}`,
    DELETE: (id: number) => `crm/channels/${id}`,
    GET_BY_COMPANY: (companyId: number) => `crm/channels/company/${companyId}`,
    GET_BY_BRANCH: (branchId: number) => `crm/channels/branch/${branchId}`,
    GET_BY_TYPE: (type: string) => `crm/channels/type/${type}`,
    ACTIVATE: (id: number) => `crm/channels/${id}/activate`,
    DEACTIVATE: (id: number) => `crm/channels/${id}/deactivate`,
    SET_WEBHOOK: (id: number) => `crm/channels/${id}/set-webhook`,    WEBHOOK_INFO:   (id: number) => `crm/channels/${id}/webhook-info`,    VERIFY_WEBHOOK: 'crm/channels/webhook/verify',
    HANDLE_WEBHOOK: 'crm/channels/webhook/handle',
  } as const,
} as const;
