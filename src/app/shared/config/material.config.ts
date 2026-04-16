/**
 * Configuración de Design System
 * Define colores, temas y variables globales
 */

import { provideAnimations } from '@angular/platform-browser/animations';

/**
 * Proveedores para animaciones
 */
export const ANIMATION_PROVIDERS = [
  provideAnimations(),
];

/**
 * Temas disponibles
 */
export const APP_THEMES = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

/**
 * Paleta de colores de la aplicación
 */
export const APP_COLORS = {
  PRIMARY: '#4f46e5',
  SECONDARY: '#06b6d4',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
  LIGHT_BG: '#f9fafb',
  DARK_BG: '#1f2937',
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#6b7280',
  BORDER: '#e5e7eb',
};

/**
 * Espaciado
 */
export const SPACING = {
  XS: '0.25rem',
  SM: '0.5rem',
  MD: '1rem',
  LG: '1.5rem',
  XL: '2rem',
  XXL: '3rem',
};

/**
 * Breakpoints responsivos
 */
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
};

/**
 * Tipografía
 */
export const TYPOGRAPHY = {
  FONT_FAMILY: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  FONT_SIZE_SM: '0.875rem',
  FONT_SIZE_BASE: '1rem',
  FONT_SIZE_LG: '1.125rem',
  FONT_SIZE_XL: '1.25rem',
  FONT_WEIGHT_NORMAL: 400,
  FONT_WEIGHT_MEDIUM: 500,
  FONT_WEIGHT_SEMIBOLD: 600,
  FONT_WEIGHT_BOLD: 700,
};
