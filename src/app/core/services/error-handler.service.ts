/**
 * Error Handler Service
 * 
 * Centraliza el manejo de errores HTTP y frontend.
 * Transforma HttpErrorResponse en ErrorResponse tipado.
 * Proporciona métodos para mostrar errores al usuario.
 * 
 * Usage:
 * this.errorHandler.handle(error) - Procesa y muestra el error
 * this.errorHandler.showError(message, duration) - Muestra snackbar
 * this.errorHandler.showSuccess(message) - Muestra success snackbar
 */

import { Injectable, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { ErrorResponse } from '../models/common.models';
import { ConfigService } from '../config/config.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private readonly router = inject(Router);
  private readonly config = inject(ConfigService);
  
  // Signal para rastrear si hay un error activo
  private currentError = signal<ErrorResponse | null>(null);
  currentError$ = this.currentError.asReadonly();

  /**
   * Maneja un error HTTP o de aplicación
   * 
   * @param error - Error a manejar (HttpErrorResponse o unknown)
   * @param defaultMessage - Mensaje por defecto si el error no tiene detalles
   */
  handle(error: unknown, defaultMessage: string = 'Ocurrió un error'): void {
    const errorResponse = this.parseError(error);
    this.currentError.set(errorResponse);

    // Log si logging está habilitado
    if (this.config.isLoggingEnabled()) {
      console.error('[ERROR]', errorResponse);
    }

    // Mostrar al usuario
    this.showError(errorResponse.message || defaultMessage);

    // Manejar casos especiales
    this.handleSpecialCases(errorResponse);
  }

  /**
   * Transforma diferentes tipos de error en ErrorResponse estándar
   * @private
   */
  private parseError(error: unknown): ErrorResponse {
    if (error instanceof HttpErrorResponse) {
      return this.parseHttpError(error);
    }

    if (error instanceof Error) {
      return {
        timestamp: new Date().toISOString(),
        status: 0,
        message: error.message || 'Error desconocido',
        details: error.stack || '',
        path: this.router.url,
      };
    }

    // Unknown error
    return {
      timestamp: new Date().toISOString(),
      status: 0,
      message: 'Ocurrió un error desconocido',
      details: JSON.stringify(error),
      path: this.router.url,
    };
  }

  /**
   * Parsea errores HTTP
   * @private
   */
  private parseHttpError(error: HttpErrorResponse): ErrorResponse {
    // Si el backend devolvió un ErrorResponse tipado
    if (error.error && typeof error.error === 'object') {
      return {
        timestamp: error.error.timestamp || new Date().toISOString(),
        status: error.status,
        message: error.error.message || this.getStatusMessage(error.status),
        details: error.error.details || error.message || '',
        path: error.error.path || this.router.url,
      };
    }

    // Response genérico (sin tipado backend)
    return {
      timestamp: new Date().toISOString(),
      status: error.status,
      message: this.getStatusMessage(error.status),
      details: error.message || '',
      path: this.router.url,
    };
  }

  /**
   * Obtiene mensaje legible según código HTTP
   * @private
   */
  private getStatusMessage(status: number): string {
    const messages: Record<number, string> = {
      0: 'No se pudo conectar con el servidor',
      400: 'Solicitud inválida. Verifica los datos',
      401: 'No autorizado. Inicia sesión nuevamente',
      403: 'No tienes permiso para esta acción',
      404: 'Recurso no encontrado',
      409: 'Conflicto: Los datos ya existen',
      422: 'Error de validación en los datos',
      500: 'Error interno del servidor',
      503: 'Servidor no disponible',
    };

    return messages[status] || 'Ocurrió un error. Intenta nuevamente';
  }

  /**
   * Maneja casos especiales según el código de error
   * @private
   */
  private handleSpecialCases(error: ErrorResponse): void {
    switch (error.status) {
      case 401:
        // No autorizado - desloguear y redirigir a login
        this.router.navigate(['/login']);
        break;
      case 403:
        // Acceso denegado
        this.router.navigate(['/unauthorized']);
        break;
      case 404:
        // Recurso no encontrado
        this.router.navigate(['/not-found']);
        break;
    }
  }

  /**
   * Muestra un mensaje de error al usuario
   * (Requiere Material SnackBar - implementar según tu UI)
   */
  showError(message: string, duration: number = 5000): void {
    // Si implementas MatSnackBar:
    // this.snackBar.open(message, 'Cerrar', { duration, panelClass: 'error-snackbar' });
    
    // Por ahora, solo logging
    if (this.config.isLoggingEnabled()) {
      console.warn('[USER MESSAGE]', message);
    }
  }

  /**
   * Muestra un mensaje de éxito al usuario
   */
  showSuccess(message: string, duration: number = 3000): void {
    // Si implementas MatSnackBar:
    // this.snackBar.open(message, 'Cerrar', { duration, panelClass: 'success-snackbar' });
    
    if (this.config.isLoggingEnabled()) {
      console.info('[SUCCESS]', message);
    }
  }

  /**
   * Muestra un mensaje informativo
   */
  showInfo(message: string, duration: number = 4000): void {
    if (this.config.isLoggingEnabled()) {
      console.info('[INFO]', message);
    }
  }

  /**
   * Limpia el error actual
   */
  clearError(): void {
    this.currentError.set(null);
  }

  /**
   * Obtiene el error actual como signal
   */
  getCurrentError() {
    return this.currentError$;
  }

  /**
   * Helper para manejo de errores en observables con catchError
   * 
   * Ejemplo:
   * this.service.getUsers()
   *   .pipe(catchError(err => this.errorHandler.handleError(err, 'No se pudieron cargar usuarios')))
   *   .subscribe(...)
   */
  handleError(error: unknown, message?: string): Observable<never> {
    this.handle(error, message);
    return throwError(() => error);
  }
}
