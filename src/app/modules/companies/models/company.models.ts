/**
 * DTOs y Modelos para Empresas
 */

import { CompanyType } from './company.enums';
import { BranchResponse } from '../../branches/models';

/**
 * Request genérico para crear una empresa
 */
export interface CreateCompanyUnifiedRequest {
  name: string;
  companyType: CompanyType;
  taxId: string;
}

/**
 * Response genérico de empresa
 */
export interface CompanyUnifiedResponse {
  id: number;
  name: string;
  companyType: CompanyType;
  companyTypeDisplayName: string;
  taxIdLabel: string;
  taxId: string;
}

/**
 * Request específico para crear empresa ecuatoriana
 */
export interface CreateEcuadorianCompanyRequest {
  name: string;
  ruc: string;
  branches: BranchRequest[];
}

/**
 * Request específico para crear empresa colombiana
 */
export interface CreateColombianCompanyRequest {
  name: string;
  nit: string;
  branches: BranchRequest[];
}

/**
 * Response de empresa colombiana
 */
export interface ColombianCompanyResponse {
  id: number;
  name: string;
  nit: string;
}

/**
 * Request para rama/sucursal
 */
export interface BranchRequest {
  name: string;
  address: string;
}

/**
 * Modelo completo de empresa con ramas
 */
export interface Company {
  id: number;
  name: string;
  companyType: CompanyType;
  branches: BranchResponse[];
  taxId: string;
}

/**
 * Clase modelo para empresa
 */
export class CompanyModel implements CompanyUnifiedResponse {
  id!: number;
  name!: string;
  companyType!: CompanyType;
  companyTypeDisplayName!: string;
  taxIdLabel!: string;
  taxId!: string;

  /**
   * Crea una Empresa a partir de un response del backend
   */
  static fromResponse(response: CompanyUnifiedResponse): CompanyModel {
    const company = new CompanyModel();
    Object.assign(company, response);
    return company;
  }
}
