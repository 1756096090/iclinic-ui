/**
 * Servicio para gestionar sucursales
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services';
import { API_ENDPOINTS } from '../../../core/models';
import {
  BranchUnifiedResponse,
  CreateBranchUnifiedRequest,
  CreateHospitalBranchRequest,
  CreateClinicBranchRequest,
  HospitalBranchResponse,
  ClinicBranchResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly http = inject(HttpService);

  /**
   * Obtiene todas las sucursales
   */
  getAllBranches(): Observable<BranchUnifiedResponse[]> {
    return this.http.get<BranchUnifiedResponse[]>(API_ENDPOINTS.BRANCHES.GET_ALL);
  }

  /**
   * Obtiene una sucursal por ID
   */
  getBranchById(id: number): Observable<BranchUnifiedResponse> {
    return this.http.get<BranchUnifiedResponse>(
      API_ENDPOINTS.BRANCHES.GET_BY_ID(id)
    );
  }

  /**
   * Obtiene sucursales de una empresa
   */
  getBranchesByCompany(companyId: number): Observable<BranchUnifiedResponse[]> {
    return this.http.get<BranchUnifiedResponse[]>(
      API_ENDPOINTS.BRANCHES.GET_BY_COMPANY(companyId)
    );
  }

  /**
   * Crea una sucursal unificada
   */
  createBranchUnified(
    request: CreateBranchUnifiedRequest
  ): Observable<BranchUnifiedResponse> {
    return this.http.post<BranchUnifiedResponse>(
      API_ENDPOINTS.BRANCHES.CREATE_UNIFIED,
      request
    );
  }

  /**
   * Crea una sucursal de hospital
   */
  createHospitalBranch(
    request: CreateHospitalBranchRequest
  ): Observable<HospitalBranchResponse> {
    return this.http.post<HospitalBranchResponse>(
      API_ENDPOINTS.BRANCHES.CREATE,
      request
    );
  }

  /**
   * Crea una sucursal de clínica
   */
  createClinicBranch(
    request: CreateClinicBranchRequest
  ): Observable<ClinicBranchResponse> {
    return this.http.post<ClinicBranchResponse>(
      API_ENDPOINTS.BRANCHES.CREATE,
      request
    );
  }

  /**
   * Actualiza una sucursal
   */
  updateBranch(
    id: number,
    request: Partial<CreateBranchUnifiedRequest>
  ): Observable<BranchUnifiedResponse> {
    return this.http.put<BranchUnifiedResponse>(
      API_ENDPOINTS.BRANCHES.UPDATE(id),
      request
    );
  }

  /**
   * Elimina una sucursal
   */
  deleteBranch(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.BRANCHES.DELETE(id));
  }

  /**
   * Obtiene sucursales por tipo
   */
  getBranchesByType(type: string): Observable<BranchUnifiedResponse[]> {
    return this.http.get<BranchUnifiedResponse[]>(
      API_ENDPOINTS.BRANCHES.GET_BY_TYPE(type)
    );
  }
}
