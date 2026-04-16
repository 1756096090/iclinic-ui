/**
 * Servicio de autenticación
 * Gestiona el estado de autenticación y tokens
 */

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpService } from './http.service';
import { API_ENDPOINTS } from '../models';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user?: {
    id: number;
    email: string;
    fullName: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpService);

  private readonly token$ = new BehaviorSubject<string | null>(
    localStorage.getItem('accessToken')
  );
  private readonly isAuthenticated$ = computed(() => !!this.token$.value);

  /**
   * Observable del token actual
   */
  token = this.token$.asObservable();

  /**
   * Señal que indica si el usuario está autenticado
   */
  isAuthenticated = this.isAuthenticated$;

  /**
   * Inicia sesión con credenciales
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    ).pipe(
      tap((response) => {
        this.setToken(response.accessToken);
      })
    );
  }

  /**
   * Cierra sesión
   */
  logout(): Observable<void> {
    return this.http.post<void>(
      API_ENDPOINTS.AUTH.LOGOUT,
      {}
    ).pipe(
      tap(() => {
        this.clearToken();
      })
    );
  }

  /**
   * Obtiene información del usuario actual
   */
  getCurrentUser(): Observable<any> {
    return this.http.get(API_ENDPOINTS.AUTH.ME);
  }

  /**
   * Refresca el token de acceso
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<LoginResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    ).pipe(
      tap((response) => {
        this.setToken(response.accessToken);
      })
    );
  }

  /**
   * Establece el token en el almacenamiento local
   */
  private setToken(token: string): void {
    localStorage.setItem('accessToken', token);
    this.token$.next(token);
  }

  /**
   * Limpia el token del almacenamiento local
   */
  private clearToken(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.token$.next(null);
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.token$.value;
  }
}
