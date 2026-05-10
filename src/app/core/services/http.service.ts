/**
 * Base HTTP Service
 * 
 * Handles all HTTP communication with the backend API.
 * Automatically prepends the API base URL from configuration.
 * 
 * Usage:
 * this.http.get<UserResponse>('/users/1')
 * this.http.post<Company>('/companies', payload)
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestOptions, ApiResponse, OperationResult, PaginationParams, PaginatedResponse } from '../models';
import { ConfigService } from '../config';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  /**
   * Realiza una solicitud GET
   * @param url URL relativa (ej: /users, /users/1)
   * @param options Opciones adicionales (headers, query params, etc)
   */
  get<T>(
    url: string,
    options?: RequestOptions
  ): Observable<T> {
    const fullUrl = this.buildFullUrl(url);
    return this.http.get<T>(
      fullUrl,
      this.buildHttpOptions(options)
    );
  }

  /**
   * Realiza una solicitud POST
   * @param url URL relativa
   * @param body Cuerpo de la solicitud
   */
  post<T>(
    url: string,
    body: unknown,
    options?: RequestOptions
  ): Observable<T> {
    const fullUrl = this.buildFullUrl(url);
    return this.http.post<T>(
      fullUrl,
      body,
      this.buildHttpOptions(options)
    );
  }

  /**
   * Realiza una solicitud PUT
   */
  put<T>(
    url: string,
    body: unknown,
    options?: RequestOptions
  ): Observable<T> {
    const fullUrl = this.buildFullUrl(url);
    return this.http.put<T>(
      fullUrl,
      body,
      this.buildHttpOptions(options)
    );
  }

  /**
   * Realiza una solicitud PATCH
   */
  patch<T>(
    url: string,
    body: unknown,
    options?: RequestOptions
  ): Observable<T> {
    const fullUrl = this.buildFullUrl(url);
    return this.http.patch<T>(
      fullUrl,
      body,
      this.buildHttpOptions(options)
    );
  }

  /**
   * Realiza una solicitud DELETE
   */
  delete<T>(
    url: string,
    options?: RequestOptions
  ): Observable<T> {
    const fullUrl = this.buildFullUrl(url);
    return this.http.delete<T>(
      fullUrl,
      this.buildHttpOptions(options)
    );
  }

  /**
   * Builds the full API URL by combining base URL with relative path
   * @private
   */
  private buildFullUrl(url: string): string {
    // Remove leading slash if present
    const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
    const baseUrl = this.config.getApiUrl();
    
    // Ensure base URL doesn't end with slash
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    return `${cleanBase}/${normalizedUrl}`;
  }

  /**
   * Construye opciones HTTP con headers y parámetros
   * @private
   */
  private buildHttpOptions(options?: RequestOptions): {
    headers?: HttpHeaders;
    params?: HttpParams;
    body?: unknown;
    withCredentials?: boolean;
  } {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');

    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        httpHeaders = httpHeaders.set(key, value);
      });
    }

    let httpParams = new HttpParams();
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, String(value));
      });
    }

    return {
      headers: httpHeaders,
      ...(Object.keys(httpParams.keys()).length > 0 && { params: httpParams }),
      ...(options?.body !== undefined && { body: options.body }),
      withCredentials: options?.withCredentials ?? false,
    };
  }
}
