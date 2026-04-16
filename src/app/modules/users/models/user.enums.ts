/**
 * User Module - Enums
 * 
 * Define tipos enumerados para usuarios, roles, tipos de documento.
 * Los valores deben coincidir exactamente con el backend.
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  AGENT = 'AGENT',
  USER = 'USER',
}

export enum UserType {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  STAFF = 'STAFF',
  PATIENT = 'PATIENT',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

export enum DocumentType {
  PASSPORT = 'PASSPORT',
  NATIONAL_ID = 'NATIONAL_ID',
  RUC = 'RUC', // Ecuador
  NIT = 'NIT', // Colombia
  CEDULA = 'CEDULA', // Generic ID
}

export const USER_ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.MANAGER]: 'Gerente',
  [UserRole.AGENT]: 'Agente',
  [UserRole.USER]: 'Usuario',
};

export const USER_TYPE_DISPLAY_NAMES: Record<UserType, string> = {
  [UserType.DOCTOR]: 'Doctor',
  [UserType.NURSE]: 'Enfermera',
  [UserType.STAFF]: 'Personal',
  [UserType.PATIENT]: 'Paciente',
  [UserType.ADMINISTRATOR]: 'Administrador',
};

export const DOCUMENT_TYPE_DISPLAY_NAMES: Record<DocumentType, string> = {
  [DocumentType.PASSPORT]: 'Pasaporte',
  [DocumentType.NATIONAL_ID]: 'Cédula Nacional',
  [DocumentType.RUC]: 'RUC (Ecuador)',
  [DocumentType.NIT]: 'NIT (Colombia)',
  [DocumentType.CEDULA]: 'Cédula',
};
