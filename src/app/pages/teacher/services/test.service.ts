import { Injectable } from '@angular/core';
import {Question, TestData} from "../models/test-data.model";
import { SubjectService } from "./subject.service";
import {catchError, Observable, of, switchMap, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class TestService {
  private apiUrl = 'http://localhost:3000/test'; // URL до сервера API
  private _visibleTestForm: boolean = false;
  private formStepData: Partial<TestData> = {};
  private currentTest: TestData | null = null;

  constructor(private http: HttpClient, private subjectService: SubjectService) {}
  get visibleTestForm() {
    return this._visibleTestForm;
  }

  set visibleTestForm(visibleTestForm: boolean) {
    this._visibleTestForm = visibleTestForm;
  }

  // Завантаження тестів з сервера за subjectId
  loadTestsFromServer(subjectId: number | null): Observable<TestData[]> {
    if (!subjectId) {
      console.error('subjectId is null or undefined');
      return new Observable<TestData[]>(observer => observer.complete());
    }

    // Load all tests and filter by subjectId
    return this.http.get<TestData[]>(`${this.apiUrl}`).pipe(
      switchMap((tests: TestData[]) => {
        // Filter tests by subjectId
        const filteredTests = tests.filter(test => test.subject_id === subjectId);
        console.log(`Завантажені тести для предмету ${subjectId}:`, filteredTests);
        return of(filteredTests);  // Return the filtered tests
      }),
      catchError(error => {
        console.error('Помилка при завантаженні тестів:', error);
        return of([]);  // Return an empty array if there was an error
      })
    );
  }


  addTest(
    test_name: string,
    questions: Question[],
    openDate: string,
    closeDate: string,
    openTime: { hours: number, minutes: number },
    closeTime: { hours: number, minutes: number },
    duration: { hours: number, minutes: number },
    max_attempts: number
  ): Observable<TestData[] | null> {
    const currentSubjectId = this.subjectService.currentSubjectId;
    if (!currentSubjectId) {
      console.error('Cannot add test: currentSubjectId is null');
      return of(null);
    }

    const newTest: TestData = {
      id: Math.floor(Math.random() * 21454474) + 1,
      test_name: test_name,
      subject_id: currentSubjectId,
      questions: questions,
      open_date: openDate,
      close_date: closeDate,
      open_time: openTime,
      close_time: closeTime,
      duration: duration,
      max_attempts: max_attempts
    };

    console.log("Test Data", newTest);
    return this.http.post<TestData>(this.apiUrl, newTest).pipe(
      tap(savedTest => {
        console.log('Тест збережено на сервері:', savedTest);
      }),
      switchMap(() => this.getTestsBySubjectId(currentSubjectId)),  // Fetch the updated list of tests
      catchError(error => {
        console.error('Помилка при збереженні тесту:', error);
        return of([]);  // Return empty array if error occurs
      })
    );
  }


  // Збереження тесту
  saveCurrentTestData(tests: any[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, tests).pipe(
      tap(response => console.log('Дані тесту збережено на сервері:', response)),
      catchError(error => {
        console.error('Помилка при збереженні даних тесту:', error);
        return of(null);
      })
    );
  }

  // Видалення тесту
  deleteTest(testId: number): Observable<void> {
    console.log(`Deleting test with id: ${testId}`);  // Додайте цей лог
    return this.http.delete<void>(`${this.apiUrl}/${testId}`).pipe(
      tap(() => console.log('Тест видалено:', testId)),
      catchError(error => {
        console.error('Помилка при видаленні тесту:', error);
        return of(undefined);
      })
    );
  }





  // Отримання тестів для конкретного предмету
  getTestsBySubjectId(subjectId: number | null): Observable<TestData[]> {
    return this.loadTestsFromServer(subjectId);
  }



  getTestById(testId: number): Observable<TestData> {
    return this.http.get<TestData>(`${this.apiUrl}/${testId}`).pipe(
      tap(test => console.log('Test loaded:', test))
    );
  }

  // Оновлення тесту
  updateTest(test: TestData): Observable<TestData> {
    return this.http.put<TestData>(`${this.apiUrl}/${test.id}`, test).pipe(
      tap(updatedTest => console.log('Оновлено тест:', updatedTest))
    );
  }

  // Збереження тесту

  saveFormStepData(data: Partial<TestData>): void {
    this.formStepData = { ...this.formStepData, ...data };
  }

  getFormStepData(): Partial<TestData> {
    return this.formStepData;
  }

  clearFormData(): void {
    this.formStepData = {};
    this.currentTest = null;
  }

  // Збереження даних тесту на другому кроці


  selectedTest: TestData | null = null;

  setSelectedTest(test: TestData | null) {
    this.selectedTest = test;
  }

  getSelectedTest(): TestData | null {
    return this.selectedTest;
  }

  clearSelectedTest() {
    this.selectedTest = null;
  }
}
