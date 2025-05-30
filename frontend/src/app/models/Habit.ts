export interface Habit {
  id?: string;
  userId: string;
  name: string;
  frequency: string;
  completedDates: string[];
}
