/**
 * Interceptor para agregar el token de autenticación a las solicitudes
 */

import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly auth = inject(AuthService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.auth.getToken();

    if (token && !this.isPublicEndpoint(req.url)) {
      // Clona el request y añade el header de autorización
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req);
  }

  private isPublicEndpoint(url: string): boolean {
    const publicEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
    return publicEndpoints.some((endpoint) => url.includes(endpoint));
  }
}
