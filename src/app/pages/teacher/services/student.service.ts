import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of, tap, throwError} from 'rxjs';
import { StudentData } from "../models/student-data.model";
import {TeacherData} from "../models/teacher-data.model";

@Injectable({ providedIn: 'root' })
export class StudentService {
  private baseUrl = 'http://localhost:3000/student';
  private _currentStudentId!: number; // Зберігаємо ID поточного студента
  studentNamesCache: { [key: number]: string } = {};

  constructor(private http: HttpClient) {}


  authenticate(full_name: string, password: string): Observable<StudentData | null> {
    console.log(full_name, password)
    return this.getAllStudents().pipe(
      map(rawTeachers => {
        // Map the raw data to TeacherData type objects
        const students: StudentData[] = rawTeachers.map(student => ({
          id: student.id,
          full_name: student.full_name,
          email: student.email,
          subjects_id: student.subjects_id,
          password: student.password
        }));
        console.log("students", students);

        // Find the teacher with matching name and password
        const student = students.find(
          student => student.full_name === full_name && student.password === password
        );
        console.log(student);
        return student || null; // Return the teacher object or null if not found
      }),
      catchError(error => {
        console.error('Authentication error:', error);
        return of(null); // Return null in case of an error
      })
    );
  }

  // Метод для отримання всіх студентів
  getAllStudents(): Observable<StudentData[]> {
    return this.http.get<StudentData[]>(this.baseUrl);
  }

  // Метод для отримання студента за його ID
  getStudentById(studentId: number): Observable<StudentData> {
    return this.http.get<StudentData>(`http://localhost:3000/student/${studentId}`);
  }

  studentNames(studentId: number): string {
    if (this.studentNamesCache[studentId]) {
      return this.studentNamesCache[studentId];
    } else {
     this.getStudentById(studentId).subscribe(student => {
        this.studentNamesCache[studentId] = student.full_name;
      });
      return '';
    }
  }

  // Метод для додавання нового студента з необов'язковим полем subjectsId
  addStudent(id: number, fullName: string, email: string, password: string, subjectsId?: number[]): Observable<StudentData> {
    const newStudent: StudentData = {
      id: id,
      full_name: fullName,
      email: email,
      subjects_id: subjectsId,
      password: password
    };
    console.log("ja tut");
    console.log(newStudent);
    return this.http.post<StudentData>('http://localhost:3000/student', newStudent).pipe(
      tap(response => {
        console.log('Дані успішно збережені:', response);
      }),
      catchError(error => {
        console.error('Помилка збереження даних:', error);
        return throwError(error); // re-throw the error
      })
    );
  }



  // Метод для редагування інформації про студента з можливістю редагувати subjectsId
  editStudent(studentId: number, fullName: string, email: string, subjectsId?: number[]): Observable<StudentData> {
    const updatedStudent: Partial<StudentData> = {
      id: studentId,
      full_name: fullName,
      email: email,
      subjects_id: subjectsId
    };
    return this.http.put<StudentData>(`${this.baseUrl}/${studentId}`, updatedStudent);
  }

  // Метод для видалення студента
  deleteStudent(studentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${studentId}`);
  }

  // Метод для встановлення поточного студента
  set currentStudentId(studentId: number) {
    this._currentStudentId = studentId;
  }

  // Метод для отримання ID поточного студента
  get currentStudentId(): number {
    return this._currentStudentId;
  }

  _student: number  = 0;

  set studentId(id: number) {
    this._student = id;
  }

  get studentId(): number {
    return this._student;
  }
}
