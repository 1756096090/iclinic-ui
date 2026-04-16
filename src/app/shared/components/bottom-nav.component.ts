/**
 * Componente Bottom Navigation - Para móvil (Tailwind Responsive)
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  styleUrl: './bottom-nav.component.css',
  templateUrl: './bottom-nav.component.html',
})
export class BottomNavComponent {
  readonly navItems: BottomNavItem[] = [
    { route: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { route: '/users', icon: 'users', label: 'Usuarios' },
    { route: '/companies', icon: 'building', label: 'Empresas' },
    { route: '/branches', icon: 'store', label: 'Sucursales' },
    { route: '/conversations', icon: 'messageSquare', label: 'Chat' },
    { route: '/messages', icon: 'send', label: 'Mensajes' },
    { route: '/channels', icon: 'connectivity', label: 'Canales' },
  ];
}
