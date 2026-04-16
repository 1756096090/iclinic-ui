/**
 * Servicio para gestionar usuarios
 * Maneja todas las operaciones relacionadas con usuarios en el backend
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services';
import { API_ENDPOINTS } from '../../../core/models';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpService);

  /**
   * Obtiene todos los usuarios
   */
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(API_ENDPOINTS.USERS.GET_ALL);
  }

  /**
   * Obtiene un usuario por ID
   */
  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(API_ENDPOINTS.USERS.GET_BY_ID(id));
  }

  /**
   * Obtiene usuarios de una empresa
   */
  getUsersByCompany(companyId: number): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(
      API_ENDPOINTS.USERS.GET_BY_COMPANY(companyId)
    );
  }

  /**
   * Obtiene usuarios de una sucursal
   */
  getUsersByBranch(branchId: number): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(
      API_ENDPOINTS.USERS.GET_BY_BRANCH(branchId)
    );
  }

  /**
   * Crea un nuevo usuario
   */
  createUser(
    request: CreateUserRequest
  ): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      API_ENDPOINTS.USERS.CREATE,
      request
    );
  }

  /**
   * Actualiza un usuario
   */
  updateUser(
    id: number,
    request: UpdateUserRequest
  ): Observable<UserResponse> {
    return this.http.put<UserResponse>(
      API_ENDPOINTS.USERS.UPDATE(id),
      request
    );
  }

  /**
   * Elimina un usuario
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.USERS.DELETE(id));
  }
}
