/**
 * Pipes personalizados compartidos
 */

import { Pipe, PipeTransform } from '@angular/core';
import {
  formatPhoneNumber,
  formatDate,
  formatDateTime,
  truncateText,
} from '../utils';

@Pipe({
  name: 'phoneFormat',
  standalone: true,
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    return formatPhoneNumber(value);
  }
}

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date, locale?: string): string {
    return formatDate(value, locale);
  }
}

@Pipe({
  name: 'dateTimeFormat',
  standalone: true,
})
export class DateTimeFormatPipe implements PipeTransform {
  transform(value: string | Date, locale?: string): string {
    return formatDateTime(value, locale);
  }
}

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 50): string {
    return truncateText(value, maxLength);
  }
}

/**
 * Barrel export para pipes
 */
export const SHARED_PIPES = [
  PhoneFormatPipe,
  DateFormatPipe,
  DateTimeFormatPipe,
  TruncatePipe,
];
