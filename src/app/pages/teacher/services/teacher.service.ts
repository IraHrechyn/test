import { Injectable } from "@angular/core";
import { TeacherData } from "../models/teacher-data.model";
import { map, Subject, catchError, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private teacherData: TeacherData[] = [];
  private dataUpdated = new Subject<TeacherData[]>();

  constructor(private http: HttpClient) {}

  getTeacherData() {
    this.http.get<{ message: string, data: TeacherData[] }>('http://localhost:3000/api/teacher')
      .pipe(
        map(teachers => {
          return teachers.data.map(teacher => {
            return {
              id: teacher.id,
              name: teacher.name,
              email: teacher.email,
              password: teacher.password
            };
          });
        }),
        catchError(error => {
          console.error('Error fetching teacher data:', error);
          return throwError(error);
        })
      )
      .subscribe(transformedData => {
        this.teacherData = transformedData;
        this.dataUpdated.next([...this.teacherData]);
      });
  }

  getTeacherDataUpdateListener() {
    return this.dataUpdated.asObservable();
  }

  addTeacherData(name: string, email: string, password: string) {
    const data: TeacherData = { id: '', name: name, email: email, password: password };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/teacher', data)
      .pipe(
        catchError(error => {
          console.error('Error adding teacher data:', error);
          return throwError(error);
        })
      )
      .subscribe((responseData) => {
        console.log(responseData.message);
        data.id = responseData.postId;
        this.teacherData.push(data);
        this.dataUpdated.next([...this.teacherData]);
      });
  }
}
