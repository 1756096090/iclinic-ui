/**
 * Componente de cargador genérico
 * Muestra un spinner mientras isLoading es true
 */

import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
})
export class LoaderComponent {
  readonly isLoading = input(false);
  readonly diameter = input(40);
  readonly message = input<string | null>(null);
}
