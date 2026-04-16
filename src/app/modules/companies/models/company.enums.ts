/**
 * Enumeraciones para el módulo de Empresas
 */

export enum CompanyType {
  HOSPITAL = 'HOSPITAL',
  CLINIC = 'CLINIC',
  LABORATORY = 'LABORATORY',
  PHARMACY = 'PHARMACY',
  DENTAL_CLINIC = 'DENTAL_CLINIC',
  OTHER = 'OTHER',
}

export enum CountryType {
  ECUADOR = 'ECUADOR',
  COLOMBIA = 'COLOMBIA',
  OTHER = 'OTHER',
}

export const COMPANY_TYPE_DISPLAY_NAMES: Record<CompanyType, string> = {
  [CompanyType.HOSPITAL]: 'Hospital',
  [CompanyType.CLINIC]: 'Clínica',
  [CompanyType.LABORATORY]: 'Laboratorio',
  [CompanyType.PHARMACY]: 'Farmacia',
  [CompanyType.DENTAL_CLINIC]: 'Clínica Dental',
  [CompanyType.OTHER]: 'Otro',
};

export const COUNTRY_TYPE_DISPLAY_NAMES: Record<CountryType, string> = {
  [CountryType.ECUADOR]: 'Ecuador',
  [CountryType.COLOMBIA]: 'Colombia',
  [CountryType.OTHER]: 'Otro',
};
