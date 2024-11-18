import { Injectable } from "@angular/core";
import { TeacherData } from "../models/teacher-data.model";
import {map, Subject, catchError, throwError, Observable, of} from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private dataUpdated = new Subject<TeacherData[]>();

  constructor(private http: HttpClient) {}

 _teacherId: number  = 0;

  set teacherId(id: number) {
    this._teacherId = id;
  }

  get teacherId(): number {
    return this._teacherId;
  }

  getTeacherData(): Observable<any[]> {
    return this.http.get<any>('http://localhost:3000/teacher')
      .pipe(
        map(response => {
          console.log('API Response:', response); // Log full response
          if (response) {
            return response; // Access `data` directly
          } else {
            console.error('Unexpected data format:', response);
            return []; // Return an empty array if format is unexpected
          }
        }),
        catchError(error => {
          console.error('Error fetching teacher data:', error);
          return of([]); // Return empty array if there is an error
        })
      );
  }




  // Map the raw data to TeacherData objects and authenticate
  authenticate(name: string, password: string): Observable<TeacherData | null> {
    console.log(name, password);
    return this.getTeacherData().pipe(
      map(rawTeachers => {
        // Map the raw data to TeacherData type objects
        const teachers: TeacherData[] = rawTeachers.map(teacher => ({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          password: teacher.password
        }));

        // Find the teacher with matching name and password
        const teacher = teachers.find(
          teacher => teacher.name === name && teacher.password === password
        );

        return teacher || null; // Return the teacher object or null if not found
      }),
      catchError(error => {
        console.error('Authentication error:', error);
        return of(null); // Return null in case of an error
      })
    );
  }


  addTeacherData(id: number, name: string, email: string, password: string) {
    const data: TeacherData = {id: id, name: name, email: email, password: password};
    const dataJson = JSON.stringify(data); // Це не потрібно, якщо використовуєте HttpClient
    this.http.post<{ message: string }>('http://localhost:3000/teacher', data, {
      headers: {'Content-Type': 'application/json'}
    })
      .pipe(
        catchError(error => {
          console.error('Error adding teacher data:', error.message || error);
          return throwError(error);
        })
      )
      .subscribe(response => {
        console.log('Response from server:', response);
      });
  }

  getTeacherById(id: number) {
    return this.http.get<{ message: string, data: TeacherData }>(`http://localhost:3000/teacher/${id}`)
      .pipe(
        map(response => {
          return {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            password: response.data.password
          };
        }),
        catchError(error => {
          console.error('Error fetching teacher data by ID:', error);
          return throwError(error);
        })
      );
  }

}
