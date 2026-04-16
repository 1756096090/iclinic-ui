/**
 * Componente de estado vacío
 */

import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
})

export class EmptyStateComponent {
  readonly icon = input('📦');
  readonly title = input('Sin datos');
  readonly message = input('No hay información para mostrar');
  readonly actionLabel = input<string | null>(null);
  readonly action = output<void>();

  onAction(): void {
    this.action.emit();
  }
}
