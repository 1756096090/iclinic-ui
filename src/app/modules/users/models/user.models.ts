/**
 * DTOs y Modelos para Usuarios
 */

import { UserRole, UserType, DocumentType } from './user.enums';

/**
 * Request para crear un nuevo usuario
 */
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  userType: UserType;
  documentType: DocumentType;
  documentNumber: string;
  nationality: string;
  companyId: number;
  branchId: number;
}

/**
 * Response con información del usuario
 */
export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  roleDisplayName: string;
  userType: UserType;
  documentType: DocumentType;
  documentTypeDisplayName: string;
  documentNumber: string;
  nationality: string;
  active: boolean;
  createdAt: string;
  companyId: number;
  companyName: string;
  branchId: number;
  branchName: string;
}

/**
 * Request para actualizar un usuario
 */
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  userType?: UserType;
  documentType?: DocumentType;
  documentNumber?: string;
  nationality?: string;
  active?: boolean;
}

/**
 * Modelo de usuario intern para el frontend
 */
export class User implements UserResponse {
  id!: number;
  fullName!: string;
  email!: string;
  phone!: string;
  role!: UserRole;
  roleDisplayName!: string;
  userType!: UserType;
  documentType!: DocumentType;
  documentTypeDisplayName!: string;
  documentNumber!: string;
  nationality!: string;
  active!: boolean;
  createdAt!: string;
  companyId!: number;
  companyName!: string;
  branchId!: number;
  branchName!: string;

  /**
   * Crea un Usuario a partir de un response del backend
   */
  static fromResponse(response: UserResponse): User {
    const user = new User();
    Object.assign(user, response);
    return user;
  }
}
