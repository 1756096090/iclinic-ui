import {
  Component,
  signal,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  DestroyRef,
  effect,
} from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { WebSocketService } from '../../core/services';
import { BottomNavComponent } from './bottom-nav.component';

interface NavItem {
  route: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    MatIcon,
    MatTooltip,
    BottomNavComponent,
  ],
  styleUrl: './sidebar.component.css',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly wsService = inject(WebSocketService);

  readonly isMobile = toSignal(
    this.breakpointObserver
      .observe('(max-width: 767px)')
      .pipe(map(r => r.matches)),
    { initialValue: false }
  );

  readonly collapsed = signal(false);
  readonly isDark = signal(true);
  readonly hasNotification = signal(false);

  readonly gestionItems: NavItem[] = [
    { route: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { route: '/users', icon: 'people', label: 'Usuarios' },
    { route: '/companies', icon: 'business', label: 'Empresas' },
    { route: '/branches', icon: 'location_city', label: 'Sucursales' },
  ];

  readonly crmItems: NavItem[] = [
    { route: '/conversations', icon: 'chat', label: 'Conversaciones' },
    { route: '/messages', icon: 'mail', label: 'Mensajes' },
    { route: '/channels', icon: 'hub', label: 'Canales' },
  ];

  private setFavicon(hasNotification: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const href = hasNotification ? 'wolf-logo-notification.svg' : 'wolf-logo.svg';
    const links = document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]');
    links.forEach((link) => {
      link.href = href;
    });
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('iclinic-theme');
      this.isDark.set(saved !== 'light');

      // Enciende indicador en tiempo real cuando entra una notificación.
      this.wsService.connect(1);
      this.wsService.onNotification$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.hasNotification.set(true));
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const theme = this.isDark() ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('iclinic-theme', theme);
      }
    });

    effect(() => {
      this.setFavicon(this.hasNotification());
    });
  }

  toggleSidebar(): void {
    this.collapsed.update(v => !v);
  }

  toggleTheme(): void {
    this.isDark.update(v => !v);
  }

  clearNotifications(): void {
    this.hasNotification.set(false);
  }
}
