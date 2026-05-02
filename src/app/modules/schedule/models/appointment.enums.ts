export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export const APPOINTMENT_STATUS_DISPLAY_NAMES: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: 'Pendiente',
  [AppointmentStatus.CONFIRMED]: 'Confirmada',
  [AppointmentStatus.COMPLETED]: 'Completada',
  [AppointmentStatus.CANCELLED]: 'Cancelada',
  [AppointmentStatus.NO_SHOW]: 'No se presentó',
};
