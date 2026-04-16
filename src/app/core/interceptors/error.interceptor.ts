/**
 * Interceptor para manejar errores de HTTP
 * Todas las respuestas de error pasan por aquí
 */

import {
  Injectable,
  inject,
  Injector,
} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponse } from '../models';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly injector = inject(Injector);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorResponse: ErrorResponse = {
          timestamp: new Date().toISOString(),
          status: error.status,
          message: error.error?.message || error.statusText || 'Unknown error',
          details: error.error?.details || error.message || '',
          path: error.url || req.url,
        };

        // Log del error en consola (solo en desarrollo)
        if (!this.isProduction()) {
          console.error('HTTP Error:', errorResponse);
        }

        return throwError(() => errorResponse);
      })
    );
  }

  private isProduction(): boolean {
    return (
      typeof window !== 'undefined' &&
      !window.location.hostname.includes('localhost')
    );
  }
}
