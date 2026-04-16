/**
 * Guard de autenticación
 * Protege rutas que requieren autenticación
 */

import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getToken()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Guard para rutas públicas
 * Redirige a dashboard si ya está autenticado
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.getToken()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
