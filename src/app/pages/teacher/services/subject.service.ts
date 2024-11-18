import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of, switchMap} from 'rxjs';
import { SubjectData } from "../models/subject-data.model";

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private baseUrl = 'http://localhost:3000/subject'; // URL до вашого API
  private _currentSubjectId!: number;  // Зберігаємо ID поточного предмету
  group_ids!: number[];

  constructor(private http: HttpClient) {}

  // Геттер для отримання предметів за ID викладача
  getSubjectsByTeacherId(teacherId: number): Observable<SubjectData[]> {
    if (!teacherId) {
      console.error('teacherId is null or undefined');
      return new Observable<SubjectData[]>(observer => observer.complete());
    }

    // Load all subjects and filter by teacherId
    return this.http.get<SubjectData[]>(this.baseUrl).pipe(
      switchMap((subjects: SubjectData[]) => {
        // Filter subjects by teacherId
        const filteredSubjects = subjects.filter(subject => subject.id_teacher === teacherId);
        console.log(`Завантажені предмети для викладача ${teacherId}:`, filteredSubjects);
        return of(filteredSubjects);  // Return the filtered subjects
      }),
      catchError(error => {
        console.error('Помилка при завантаженні предметів:', error);
        return of([]);  // Return an empty array if there was an error
      })
    );
  }


  getAllSubjects(): Observable<SubjectData[]> {
    return this.http.get<SubjectData[]>(this.baseUrl);
  }

  getSubjectsByGroupId(groupId: number): Observable<number[]> {
    return this.getAllSubjects().pipe(
      map(subjects => {
        // Знаходимо предмети, де є шуканий groupId в group_ids
        return subjects
          .filter(subject => subject.group_ids?.includes(groupId))
          .map(subject => subject.id); // Повертаємо лише id предметів
      })
    );
  }

  // Метод для отримання предмету за його ID
  getSubjectById(subjectId: number): Observable<SubjectData> {
    return this.http.get<SubjectData>(`${this.baseUrl}/${subjectId}`);
  }

  // Метод для додавання нового предмету з необов'язковим полем group_ids
  addSubject(newSubjectName: string, teacherId: number, groupIds?: number[]): Observable<SubjectData> {
    const uniqueId = Math.floor(Math.random() * 21614774) + 1;
    const newSubject: SubjectData = {
      id: uniqueId,
      subject_name: newSubjectName,
      id_teacher: teacherId,
      group_ids: groupIds || [] // встановлюємо порожній масив, якщо поле не передане
    };
    return this.http.post<SubjectData>(this.baseUrl, newSubject);
  }

  // Метод для редагування предмету з можливістю редагувати group_ids
  editSubject(subjectId: number, newSubjectName: string, teacherId: number, groupIds?: number[]): Observable<SubjectData> {
    const updatedSubject: Partial<SubjectData> = {
      subject_name: newSubjectName,
      id_teacher: teacherId,
      group_ids: groupIds // залишаємо необов'язковим
    };
    return this.http.put<SubjectData>(`${this.baseUrl}/${subjectId}`, updatedSubject);
  }

  // Метод для видалення предмету
  deleteSubject(subjectId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${subjectId}`);
  }

  // Метод для встановлення поточного предмету
  set currentSubjectId(subjectId: number) {
    this._currentSubjectId = subjectId;
  }

  // Метод для отримання ID поточного предмету
  get currentSubjectId(): number {
    return this._currentSubjectId;
  }
}
