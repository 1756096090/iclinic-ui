import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentResponse } from '../models';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: AppointmentResponse[];
}

@Component({
  selector: 'app-calendar-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  styleUrl: './calendar-grid.component.css',
  templateUrl: './calendar-grid.component.html',
})
export class CalendarGridComponent {
  readonly appointments = input<AppointmentResponse[]>([]);
  readonly year = input.required<number>();
  readonly month = input.required<number>(); // 0-based
  readonly selectedDate = input<Date | null>(null);

  readonly daySelected = output<Date>();
  readonly dayCreateRequested = output<Date>();

  readonly WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  readonly weeks = computed<CalendarDay[][]>(() => {
    const y = this.year();
    const m = this.month();
    const appts = this.appointments();

    const firstDay = new Date(y, m, 1);
    // Monday-based: getDay() returns 0=Sun,1=Mon,...,6=Sat → adjust
    const startDow = (firstDay.getDay() + 6) % 7; // 0=Mon
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today = new Date();

    const days: CalendarDay[] = [];

    // Pad from previous month
    for (let i = startDow - 1; i >= 0; i--) {
      const date = new Date(y, m, -i);
      days.push({ date, isCurrentMonth: false, isToday: false, appointments: [] });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();

      const dayAppts = appts.filter(a => {
        const ad = new Date(a.scheduledStart);
        return ad.getFullYear() === y && ad.getMonth() === m && ad.getDate() === d;
      });

      days.push({ date, isCurrentMonth: true, isToday, appointments: dayAppts });
    }

    // Fill remaining to complete last week
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(y, m + 1, i);
      days.push({ date, isCurrentMonth: false, isToday: false, appointments: [] });
    }

    // Group into weeks
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  });

  selectDay(day: CalendarDay): void {
    if (!day.isCurrentMonth) return;
    this.daySelected.emit(day.date);
  }

  requestCreate(day: CalendarDay): void {
    if (!day.isCurrentMonth) return;
    this.dayCreateRequested.emit(day.date);
  }

  isSelected(day: CalendarDay): boolean {
    const sel = this.selectedDate();
    if (!sel) return false;
    return sel.toDateString() === day.date.toDateString();
  }
}
