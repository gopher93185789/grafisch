export type UserRole = 'student' | 'teacher';

export interface User {
  role: UserRole;
  name: string;
}

export interface ClassSchedule {
  id: string;
  subject: string;
  teacher: string;
  student: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  startTime: string;
  endTime: string;
  room?: string;
  notes?: string;
  color: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
}

export interface ScheduleData {
  classes: ClassSchedule[];
  settings: AppSettings;
  user: User | null;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export const DAYS_OF_WEEK: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00'
];

export const SUBJECT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
]; 