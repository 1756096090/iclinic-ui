import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { catchError, of } from 'rxjs';
import { AppConfig, DEFAULT_APP_CONFIG } from './app-config.model';

/**
 * Configuration Service
 * 
 * Loads application configuration from public/env.json at startup.
 * Provides a singleton signal-based access to configuration throughout the app.
 * 
 * Usage:
 * injection:
 *   const config = inject(ConfigService);
 *   config.config() -> AppConfig
 *   config.getApiUrl() -> string
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private configSignal = signal<AppConfig>(DEFAULT_APP_CONFIG);

  constructor(private http: HttpClient) {
    // Logging effect for debugging
    if (DEFAULT_APP_CONFIG.enableLogging) {
      effect(() => {
        console.info('[CONFIG] Application configuration loaded:', this.configSignal());
      }, { allowSignalWrites: true });
    }
  }

  /**
   * Loads configuration from env.json
   * Called during APP_INITIALIZER in main.ts
   * 
   * @returns Promise<void>
   */
  async loadConfig(): Promise<void> {
    try {
      const config = await firstValueFrom(
        this.http.get<AppConfig>('/env.json').pipe(
          catchError(error => {
            console.warn(
              '[CONFIG] Could not load env.json, using defaults. Error:',
              error.message
            );
            return of(DEFAULT_APP_CONFIG);
          })
        )
      );

      this.configSignal.set(config);

      if (DEFAULT_APP_CONFIG.enableLogging) {
        console.info('[CONFIG] Configuration loaded successfully');
      }
    } catch (error) {
      console.error('[CONFIG] Unexpected error loading config:', error);
      this.configSignal.set(DEFAULT_APP_CONFIG);
    }
  }

  /**
   * Get the current configuration as a signal
   * @returns signal<AppConfig>
   */
  config() {
    return this.configSignal.asReadonly();
  }

  /**
   * Get API URL from configuration
   * @returns string
   */
  getApiUrl(): string {
    return this.configSignal().apiUrl;
  }

  /**
   * Get app name
   * @returns string
   */
  getAppName(): string {
    return this.configSignal().appName;
  }

  /**
   * Get app version
   * @returns string
   */
  getAppVersion(): string {
    return this.configSignal().appVersion;
  }

  /**
   * Get session timeout in milliseconds
   * @returns number
   */
  getSessionTimeoutMs(): number {
    return this.configSignal().sessionTimeoutMinutes * 60 * 1000;
  }

  /**
   * Check if logging is enabled
   * @returns boolean
   */
  isLoggingEnabled(): boolean {
    return this.configSignal().enableLogging;
  }

  /**
   * Check if advanced analytics is enabled
   * @returns boolean
   */
  isAdvancedAnalyticsEnabled(): boolean {
    return this.configSignal().enableAdvancedAnalytics;
  }

  /**
   * Check if beta features are enabled
   * @returns boolean
   */
  areBetaFeaturesEnabled(): boolean {
    return this.configSignal().enableBetaFeatures;
  }

  /**
   * Retorna la URL del WebSocket STOMP (nativo, sin SockJS).
   * Usa wsUrl de env.json si está definida. Si no, la deriva de apiUrl:
   *   http://host:port/api/v1  →  ws://host:port/ws-stomp
   *   https://tunnel.com/api/v1 →  wss://tunnel.com/ws-stomp
   */
  getWsUrl(): string {
    const cfg = this.configSignal();
    if (cfg.wsUrl && cfg.wsUrl.trim() !== '') {
      return cfg.wsUrl;
    }
    const base = cfg.apiUrl.replace(/\/api\/v1\/?$/, '');
    const wsBase = base
      .replace(/^https:\/\//, 'wss://')
      .replace(/^http:\/\//, 'ws://');
    return `${wsBase}/ws-stomp`;
  }
}

/**
 * Initializer factory for APP_INITIALIZER token
 * 
 * Usage in main.ts:
 * providers: [
 *   {
 *     provide: APP_INITIALIZER,
 *     useFactory: configInitializer,
 *     deps: [ConfigService],
 *     multi: true
 *   }
 * ]
 */
export function configInitializer(configService: ConfigService): () => Promise<void> {
  return () => configService.loadConfig();
}
