/**
 * Servicio para gestionar empresas
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services';
import { API_ENDPOINTS } from '../../../core/models';
import {
  CreateCompanyUnifiedRequest,
  CompanyUnifiedResponse,
  CreateEcuadorianCompanyRequest,
  CreateColombianCompanyRequest,
  ColombianCompanyResponse,
  Company,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly http = inject(HttpService);

  /**
   * Obtiene todas las empresas
   */
  getAllCompanies(): Observable<CompanyUnifiedResponse[]> {
    return this.http.get<CompanyUnifiedResponse[]>(
      API_ENDPOINTS.COMPANIES.GET_ALL
    );
  }

  /**
   * Obtiene una empresa por ID
   */
  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(API_ENDPOINTS.COMPANIES.GET_BY_ID(id));
  }

  /**
   * Crea una empresa unificada
   */
  createCompanyUnified(
    request: CreateCompanyUnifiedRequest
  ): Observable<CompanyUnifiedResponse> {
    return this.http.post<CompanyUnifiedResponse>(
      API_ENDPOINTS.COMPANIES.CREATE_UNIFIED,
      request
    );
  }

  /**
   * Crea una empresa ecuatoriana
   */
  createEcuadorianCompany(
    request: CreateEcuadorianCompanyRequest
  ): Observable<CompanyUnifiedResponse> {
    return this.http.post<CompanyUnifiedResponse>(
      API_ENDPOINTS.COMPANIES.CREATE,
      request
    );
  }

  /**
   * Crea una empresa colombiana
   */
  createColombianCompany(
    request: CreateColombianCompanyRequest
  ): Observable<ColombianCompanyResponse> {
    return this.http.post<ColombianCompanyResponse>(
      API_ENDPOINTS.COMPANIES.CREATE,
      request
    );
  }

  /**
   * Actualiza una empresa
   */
  updateCompany(
    id: number,
    request: Partial<CreateCompanyUnifiedRequest>
  ): Observable<CompanyUnifiedResponse> {
    return this.http.put<CompanyUnifiedResponse>(
      API_ENDPOINTS.COMPANIES.UPDATE(id),
      request
    );
  }

  /**
   * Elimina una empresa
   */
  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.COMPANIES.DELETE(id));
  }

  /**
   * Obtiene empresas por tipo
   */
  getCompaniesByType(type: string): Observable<CompanyUnifiedResponse[]> {
    return this.http.get<CompanyUnifiedResponse[]>(
      API_ENDPOINTS.COMPANIES.GET_BY_TYPE(type)
    );
  }
}
