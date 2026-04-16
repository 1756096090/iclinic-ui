/**
 * Servicio de autenticación
 * Gestiona el estado de autenticación y tokens
 */

import { Injectable, inject, computed, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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

export interface CurrentUserResponse {
  id: number;
  email: string;
  fullName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenState = signal<string | null>(
    this.getStorageItem('accessToken')
  );

  private readonly token$ = new BehaviorSubject<string | null>(
    this.tokenState()
  );
  private readonly isAuthenticated$ = computed(() => !!this.tokenState());

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
        this.setSession(response);
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
  getCurrentUser(): Observable<CurrentUserResponse> {
    return this.http.get<CurrentUserResponse>(API_ENDPOINTS.AUTH.ME);
  }

  /**
   * Refresca el token de acceso
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getStorageItem('refreshToken');
    return this.http.post<LoginResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    ).pipe(
      tap((response) => {
        this.setSession(response);
      })
    );
  }

  /**
   * Establece el token en el almacenamiento local
   */
  private setToken(token: string): void {
    this.setStorageItem('accessToken', token);
    this.tokenState.set(token);
    this.token$.next(token);
  }

  private setSession(response: LoginResponse): void {
    this.setToken(response.accessToken);

    if (response.refreshToken) {
      this.setStorageItem('refreshToken', response.refreshToken);
    }
  }

  /**
   * Limpia el token del almacenamiento local
   */
  private clearToken(): void {
    this.removeStorageItem('accessToken');
    this.removeStorageItem('refreshToken');
    this.tokenState.set(null);
    this.token$.next(null);
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.tokenState();
  }

  private getStorageItem(key: string): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(key);
  }

  private setStorageItem(key: string, value: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(key);
  }
}
