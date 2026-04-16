/**
 * DTOs y Modelos para Sucursales
 */

import { BranchType } from './branch.enums';
import { CompanyUnifiedResponse } from '../../companies/models';

/**
 * Request base para crear sucursal
 */
export interface BranchRequest {
  name: string;
  address: string;
}

/**
 * Request unificado para crear sucursal
 */
export interface CreateBranchUnifiedRequest {
  companyId: number;
  name: string;
  address: string;
  branchType: BranchType;
  hasLaboratory: boolean;
  bedCapacity: number;
}

/**
 * Response de sucursal unificada
 */
export interface BranchUnifiedResponse {
  id: number;
  name: string;
  address: string;
  branchType: BranchType;
  branchTypeDisplayName: string;
  hasLaboratory?: boolean;
  bedCapacity?: number;
  active: boolean;
  createdAt: string;
  companyId: number;
  companyName?: string;
}

/**
 * Request para sucursal de hospital
 */
export interface CreateHospitalBranchRequest {
  name: string;
  address: string;
  bedCapacity: number;
}

/**
 * Response de sucursal hospital
 */
export interface HospitalBranchResponse {
  id: number;
  name: string;
  address: string;
  bedCapacity: number;
}

/**
 * Request para sucursal de clínica
 */
export interface CreateClinicBranchRequest {
  name: string;
  address: string;
  hasLaboratory: boolean;
}

/**
 * Response de sucursal clínica
 */
export interface ClinicBranchResponse {
  id: number;
  name: string;
  address: string;
  hasLaboratory: boolean;
}

/**
 * Modelo base de sucursal
 */
export interface Branch {
  id: number;
  name: string;
  address: string;
  branchType: BranchType;
  company: CompanyUnifiedResponse;
}

/**
 * Modelo de sucursal para el frontend
 */
export class BranchModel implements BranchUnifiedResponse {
  id!: number;
  name!: string;
  address!: string;
  branchType!: BranchType;
  branchTypeDisplayName!: string;
  hasLaboratory?: boolean;
  bedCapacity?: number;
  active!: boolean;
  createdAt!: string;
  companyId!: number;
  companyName?: string;

  /**
   * Crea una Sucursal a partir de un response del backend
   */
  static fromResponse(response: BranchUnifiedResponse): BranchModel {
    const branch = new BranchModel();
    Object.assign(branch, response);
    return branch;
  }
}

export type BranchResponse = BranchUnifiedResponse;
