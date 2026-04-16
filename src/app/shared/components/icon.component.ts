import { Component, input } from '@angular/core';
import type { IconKey } from '../utils/svg-icons';

@Component({
  selector: 'app-icon',
  standalone: true,
  styleUrl: './icon.component.css',
  host: {
    'role': 'img',
    '[attr.aria-label]': 'ariaLabel()',
    'style': 'display:inline-flex;align-items:center;justify-content:center;line-height:1',
  },
  templateUrl: './icon.component.html',
})
export class IconComponent {
  readonly name = input.required<IconKey>();
  readonly ariaLabel = input<string>('');
}
