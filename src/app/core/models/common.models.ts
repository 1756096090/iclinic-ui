/**
 * Modelos comunes compartidos en toda la aplicación
 */

/**
 * Respuesta de error estándar del backend
 */
export interface ErrorResponse {
  timestamp: string;
  status: number;
  message: string;
  details: string;
  path: string;
}

/**
 * Envolvente genérico para respuestas paginadas
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
}

/**
 * Respuesta envolvente genérica
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

/**
 * Opciones de request genéricas
 */
export interface RequestOptions {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  body?: unknown;
}

/**
 * Estados comunes para entidades
 */
export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Resultado de operación
 */
export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Metadatos de auditoría
 */
export interface AuditMetadata {
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}
