/**
 * Componente Bottom Navigation - Para móvil (Tailwind Responsive)
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-bottom-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  styleUrl: './bottom-nav.component.css',
  templateUrl: './bottom-nav.component.html',
})
export class BottomNavComponent {}
