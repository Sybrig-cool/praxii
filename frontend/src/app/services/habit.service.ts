import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habit } from '../models/Habit';

@Injectable({ providedIn: 'root' })
export class HabitService {
  private apiUrl = 'http://localhost:8080/api/habit';

  constructor(private http: HttpClient) {}

  addHabit(habit: Habit): Observable<Habit> {
    return this.http.post<Habit>(this.apiUrl, habit);
  }

  getHabits(userId: string): Observable<Habit[]> {
    return this.http.get<Habit[]>(`${this.apiUrl}/user/${userId}`);
  }
}
