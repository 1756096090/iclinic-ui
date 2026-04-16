/**
 * Enumeraciones para el módulo de Sucursales
 */

export enum BranchType {
  HOSPITAL = 'HOSPITAL',
  CLINIC = 'CLINIC',
  LABORATORY = 'LABORATORY',
  PHARMACY = 'PHARMACY',
  DENTAL_CLINIC = 'DENTAL_CLINIC',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
}

export const BRANCH_TYPE_DISPLAY_NAMES: Record<BranchType, string> = {
  [BranchType.HOSPITAL]: 'Hospital',
  [BranchType.CLINIC]: 'Clínica',
  [BranchType.LABORATORY]: 'Laboratorio',
  [BranchType.PHARMACY]: 'Farmacia',
  [BranchType.DENTAL_CLINIC]: 'Clínica Dental',
  [BranchType.ADMINISTRATIVE]: 'Administrativa',
};
