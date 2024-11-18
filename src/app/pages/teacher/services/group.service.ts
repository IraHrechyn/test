import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, forkJoin, Observable, of, switchMap} from 'rxjs';
import { GroupData } from "../models/group-data.model";
import { StudentData } from "../models/student-data.model";
import {SubjectService} from "./subject.service";
import {SubjectData} from "../models/subject-data.model";

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:3000/group'; // URL вашого API для груп

  constructor(private http: HttpClient, private subjectService: SubjectService) {}

  getGroupsByTeacherId(teacherId: number): Observable<GroupData[]> {
    if (!teacherId) {
      console.error('teacherId is null or undefined');
      return new Observable<GroupData[]>(observer => observer.complete());
    }

    // Load all groups and filter them by teacherId
    return this.http.get<GroupData[]>(this.apiUrl).pipe(
      switchMap((groups: GroupData[]) => {
        // Filter groups by teacherId
        const filteredGroups = groups.filter(group => group.teacher_id === teacherId);
        console.log(`Завантажені групи для викладача ${teacherId}:`, filteredGroups);
        return of(filteredGroups);  // Return the filtered groups
      }),
      catchError(error => {
        console.error('Помилка при завантаженні груп:', error);
        return of([]);  // Return an empty array if there was an error
      })
    );
  }


  addGroup(groupName: string, teacherId: number): Observable<GroupData> {
    const newGroup: Partial<GroupData> = {
      group_name: groupName,
      teacher_id: teacherId,
      students_id: []
    };
    return this.http.post<GroupData>(this.apiUrl, newGroup);
  }

  // Додати нову групу з певним списком студентів
  addGroupWithStudents(groupName: string, teacherId: number, students: StudentData[]): Observable<GroupData> {
    console.log("groupName", groupName);
    console.log("teacherId", teacherId);
    console.log("students IDs", students.map(student => student.id)); // Перевірте формат IDs студентів

    const newGroup: Partial<GroupData> = {
      id: Math.floor(Math.random() * 21474534) + 1,
      group_name: groupName,
      teacher_id: teacherId,
      students_id: students.map(student => student.id)
    };
    return this.http.post<GroupData>(this.apiUrl, newGroup);
  }

  getAllGroups(): Observable<GroupData[]> {
    return this.http.get<GroupData[]>(this.apiUrl);
  }

  getGroupById(id: number): Observable<GroupData> {
    return this.http.get<GroupData>(`${this.apiUrl}/${id}`);
  }


  // Оновити ім'я групи за індексом та ID вчителя
  editGroup(groupId: number, updatedGroupData: GroupData): Observable<GroupData> {
    return this.http.put<GroupData>(`${this.apiUrl}/${groupId}`, updatedGroupData);
  }


  // Видалити групу за її ID
  deleteGroupById(groupId: number): Observable<void> {
    return this.subjectService.getSubjectsByGroupId(groupId).pipe(
      switchMap((subjectIds: number[]) => {  // Тепер subjectIds це масив чисел (ID предметів)
        // Отримуємо повну інформацію про предмети, використовуючи їх ID
        const subjectRequests = subjectIds.map(id => this.subjectService.getSubjectById(id));

        return forkJoin(subjectRequests).pipe(  // Виконуємо всі запити для отримання предметів
          switchMap((subjects: SubjectData[]) => {  // Тепер subjects - це масив об'єктів SubjectData
            const updateRequests = subjects
              .map(subject => {
                if (subject.group_ids) {  // Перевірка наявності group_ids в кожному предметі
                  const updatedGroupIds = subject.group_ids.filter(id => id !== groupId);
                  return this.subjectService.editSubject(subject.id, subject.subject_name, subject.id_teacher, updatedGroupIds);
                }
                return of(null);  // Якщо немає group_ids, повертаємо порожній Observable
              })
              .filter(request => request !== null);  // Фільтруємо тільки дійсні запити

            return forkJoin(updateRequests).pipe(
              switchMap(() => this.http.delete<void>(`${this.apiUrl}/${groupId}`))  // Видаляємо групу
            );
          })
        );
      })
    );
  }


}
