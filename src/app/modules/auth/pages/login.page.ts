import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services';
import { APP_CONFIG } from '@shared/config/app.config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-layout">
      <div class="login-benefits">
        <div class="benefits-content">
          <h1 class="app-title">
            <svg class="brand-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="9 14 12 11 15 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            iClinic CRM
          </h1>
          <p class="app-subtitle">Gestiona tus pacientes, conversaciones y agenda desde un solo lugar.</p>
          <span class="badge">CRM dental omnicanal</span>

          <div class="benefits-list">
            <div class="benefit-item">
              <svg class="benefit-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>
              <span>Gestión de pacientes</span>
            </div>
            <div class="benefit-item">
              <svg class="benefit-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>
              <span>Conversaciones centralizadas</span>
            </div>
            <div class="benefit-item">
              <svg class="benefit-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Agenda clínica</span>
            </div>
            <div class="benefit-item">
              <svg class="benefit-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                <path d="M12 1v6m0 6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M1 12h6m6 0h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>Canales integrados</span>
            </div>
          </div>
        </div>
      </div>

      <div class="login-card-container">
        <div class="login-card">
          <h2 class="login-title">Inicia sesión</h2>
          <p class="login-subtitle">Accede a tu cuenta iClinic</p>

          @if (error()) {
            <div class="error-message">
              <svg class="error-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ error() }}
            </div>
          }

          <div class="oauth-buttons">
            <button
              class="social-btn google-btn"
              (click)="loginGoogle()"
              [disabled]="loading()"
              type="button">
              <svg class="btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continuar con Google</span>
            </button>

            <button
              class="social-btn microsoft-btn"
              (click)="loginMicrosoft()"
              [disabled]="loading()"
              type="button">
              <svg class="btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.4 24H0V12.6h11.4V24z" fill="#F25022"/>
                <path d="M24 24H12.6V12.6H24V24z" fill="#7FBA00"/>
                <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#00A4EF"/>
                <path d="M24 11.4H12.6V0H24v11.4z" fill="#FFB900"/>
              </svg>
              <span>Continuar con Microsoft</span>
            </button>

            <button
              class="social-btn facebook-btn"
              (click)="loginFacebook()"
              [disabled]="loading()"
              type="button">
              <svg class="btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              <span>Continuar con Facebook</span>
            </button>

            <button
              class="social-btn guest-btn"
              (click)="loginAnonymous()"
              [disabled]="loading()"
              type="button">
              <svg class="btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
              </svg>
              <span>Entrar como Invitado</span>
            </button>
          </div>

          <div class="divider">
            <span>o continúa con correo</span>
          </div>

          <form (ngSubmit)="loginEmail()" class="email-form">
            <div class="form-group">
              <label for="email" class="form-label">Correo Electrónico</label>
              <input
                id="email"
                class="form-input"
                type="email"
                [value]="email()"
                (change)="email.set($any($event.target).value)"
                placeholder="tu@email.com"
                required />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Contraseña</label>
              <input
                id="password"
                class="form-input"
                type="password"
                [value]="password()"
                (change)="password.set($any($event.target).value)"
                placeholder="••••••••"
                required />
            </div>

            <button
              class="btn-primary"
              type="submit"
              [disabled]="loading() || !email() || !password()">
              @if (loading() && activeProvider() === 'email') {
                <span class="loading-spinner"></span>
                Iniciando sesión...
              } @else {
                Iniciar Sesión
              }
            </button>
          </form>

          <div class="footer-text">
            <span>¿Primera vez?</span>
            <button class="link-btn" type="button">Crea una cuenta</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    * {
      box-sizing: border-box;
    }

    .login-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
      background-color: #f6f8fb;
      gap: 0;
    }

    .login-benefits {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: linear-gradient(135deg, #f6f8fb 0%, #eef2f7 100%);
    }

    .benefits-content {
      max-width: 380px;
    }

    .app-title {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 16px 0;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      color: #2563eb;
      flex-shrink: 0;
    }

    .app-subtitle {
      font-size: 16px;
      color: #475569;
      margin: 0 0 20px 0;
      line-height: 1.6;
    }

    .badge {
      display: inline-block;
      background: #dbeafe;
      color: #1e40af;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 32px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .benefits-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .benefit-item {
      display: flex;
      gap: 12px;
      align-items: center;
      font-size: 14px;
      color: #334155;
      line-height: 1.5;
    }

    .benefit-icon {
      width: 20px;
      height: 20px;
      color: #64748b;
      flex-shrink: 0;
    }

    .login-card-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background-color: #ffffff;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
    }

    .login-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #0f172a;
    }

    .login-subtitle {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 24px 0;
    }

    .error-message {
      background-color: #fee2e2;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      display: flex;
      gap: 8px;
      align-items: center;
      border-left: 4px solid #dc2626;
    }

    .error-icon {
      width: 18px;
      height: 18px;
      color: #dc2626;
      flex-shrink: 0;
    }

    .oauth-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      height: 44px;
      border: 1px solid #d0d7e2;
      background-color: #ffffff;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 500;
      color: #0f172a;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .social-btn:hover:not(:disabled) {
      background-color: #f8f9fa;
      border-color: #cbd2d8;
      transform: translateY(-1px);
    }

    .social-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .social-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .guest-btn .btn-icon {
      color: #64748b;
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 24px 0;
      font-size: 13px;
      color: #94a3b8;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: #e2e8f0;
    }

    .divider::before {
      margin-right: 12px;
    }

    .divider::after {
      margin-left: 12px;
    }

    .email-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }

    .form-input {
      padding: 10px 12px;
      border: 1px solid #d0d7e2;
      border-radius: 10px;
      font-size: 14px;
      background-color: #ffffff;
      color: #0f172a;
      transition: all 0.2s ease;
      height: 44px;
    }

    .form-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-input::placeholder {
      color: #94a3b8;
    }

    .btn-primary {
      padding: 12px 16px;
      height: 44px;
      background-color: #2563eb;
      color: #ffffff;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1d4ed8;
      transform: translateY(-1px);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .footer-text {
      text-align: center;
      font-size: 13px;
      color: #64748b;
      margin-top: 24px;
    }

    .link-btn {
      background: none;
      border: none;
      color: #2563eb;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      padding: 0;
      margin-left: 4px;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .link-btn:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .login-layout {
        grid-template-columns: 1fr;
      }

      .login-benefits {
        display: none;
      }

      .login-card-container {
        padding: 24px;
        background-color: #f6f8fb;
      }

      .oauth-buttons {
        grid-template-columns: 1fr;
      }

      .social-btn {
        width: 100%;
      }
    }

    @media (prefers-color-scheme: dark) {
      .login-layout {
        background-color: #0f172a;
      }

      .login-benefits {
        background: linear-gradient(135deg, #0f172a 0%, #1a2238 100%);
      }

      .app-title {
        color: #f1f5f9;
      }

      .app-subtitle {
        color: #cbd5e1;
      }

      .badge {
        background: #1e3a8a;
        color: #93c5fd;
      }

      .benefit-item {
        color: #cbd5e1;
      }

      .login-card-container {
        background-color: #111827;
      }

      .login-title {
        color: #f1f5f9;
      }

      .login-subtitle {
        color: #94a3b8;
      }

      .error-message {
        background-color: #7f1d1d;
        color: #fecaca;
      }

      .social-btn {
        background-color: #1f2937;
        border-color: #374151;
        color: #f1f5f9;
      }

      .social-btn:hover:not(:disabled) {
        background-color: #293548;
        border-color: #4b5563;
      }

      .form-label {
        color: #f1f5f9;
      }

      .form-input {
        background-color: #1f2937;
        border-color: #374151;
        color: #f1f5f9;
      }

      .form-input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .form-input::placeholder {
        color: #6b7280;
      }

      .divider::before,
      .divider::after {
        background-color: #374151;
      }

      .divider {
        color: #6b7280;
      }

      .footer-text {
        color: #9ca3af;
      }

      .link-btn {
        color: #3b82f6;
      }

      .link-btn:hover {
        color: #60a5fa;
      }
    }

    @media (max-width: 480px) {
      .login-card-container {
        padding: 16px;
      }

      .login-card {
        max-width: 100%;
      }

      .login-title {
        font-size: 24px;
      }

      .social-btn {
        font-size: 12px;
        padding: 10px 12px;
      }

      .social-btn span {
        display: none;
      }

      .btn-icon {
        width: 20px;
        height: 20px;
      }

      .form-input,
      .btn-primary,
      .social-btn {
        height: 40px;
        font-size: 13px;
      }
    }
  `,
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);
  activeProvider = signal<string>('');

  async loginGoogle() {
    await this.login('google', () => this.auth.loginWithGoogle());
  }

  async loginMicrosoft() {
    await this.login('microsoft', () => this.auth.loginWithMicrosoft());
  }

  async loginFacebook() {
    await this.login('facebook', () => this.auth.loginWithFacebook());
  }

  async loginAnonymous() {
    await this.login('anonymous', () => this.auth.loginAnonymous());
  }

  async loginEmail() {
    await this.login('email', () =>
      this.auth.loginWithEmailAndPassword(this.email(), this.password())
    );
  }

  private async login(
    provider: string,
    loginFn: () => Promise<any>
  ): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    this.loading.set(true);
    this.activeProvider.set(provider);
    this.error.set('');

    try {
      await loginFn();
      this.router.navigate([APP_CONFIG.ROUTES.DASHBOARD]);
    } catch (err: any) {
      console.error(`${provider} login error:`, err);
      this.error.set(
        err?.message || `Error al iniciar sesión con ${provider}`
      );
    } finally {
      this.loading.set(false);
      this.activeProvider.set('');
    }
  }
}
