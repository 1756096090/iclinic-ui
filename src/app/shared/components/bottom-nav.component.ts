/**
 * Componente Bottom Navigation - Para móvil (Tailwind Responsive)
 */

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  ViewChild,
  ElementRef,
  AfterViewInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IconComponent } from './icon.component';
import type { IconKey } from '../utils/svg-icons';

interface BottomNavItem {
  route: string;
  icon: IconKey;
  label: string;
}

@Component({
  selector: 'app-bottom-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  styleUrl: './bottom-nav.component.css',
  templateUrl: './bottom-nav.component.html',
})
export class BottomNavComponent implements AfterViewInit {
  private readonly router = inject(Router);

  @ViewChild('scrollTrack') scrollTrack!: ElementRef<HTMLElement>;
  @ViewChildren('navLink') navLinks!: QueryList<ElementRef<HTMLElement>>;

  readonly navItems: BottomNavItem[] = [
    { route: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { route: '/users', icon: 'users', label: 'Usuarios' },
    { route: '/companies', icon: 'building', label: 'Empresas' },
    { route: '/branches', icon: 'store', label: 'Sucursales' },
    { route: '/schedule', icon: 'calendar', label: 'Agenda' },
    { route: '/conversations', icon: 'messageSquare', label: 'Chat' },
    { route: '/messages', icon: 'send', label: 'Mensajes' },
    { route: '/channels', icon: 'connectivity', label: 'Canales' },
  ];

  readonly activeRoute = signal(this.router.url);

  ngAfterViewInit(): void {
    this.scrollToActive();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.activeRoute.set(e.urlAfterRedirects);
        this.scrollToActive();
      });
  }

  isActive(route: string): boolean {
    return this.activeRoute().startsWith(route);
  }

  scrollToActive(): void {
    requestAnimationFrame(() => {
      const track = this.scrollTrack?.nativeElement;
      const links = this.navLinks?.toArray();
      if (!track || !links) return;

      const activeIndex = this.navItems.findIndex(item =>
        this.activeRoute().startsWith(item.route)
      );
      if (activeIndex === -1) return;

      const activeEl = links[activeIndex]?.nativeElement;
      if (!activeEl) return;

      const trackW = track.offsetWidth;
      const elLeft = activeEl.offsetLeft;
      const elW = activeEl.offsetWidth;
      track.scrollTo({ left: elLeft - trackW / 2 + elW / 2, behavior: 'smooth' });
    });
  }
}
