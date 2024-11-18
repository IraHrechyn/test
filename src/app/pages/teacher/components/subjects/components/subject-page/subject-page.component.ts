import {Component, OnInit} from '@angular/core';
import {SubjectData} from "../../../../models/subject-data.model";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {SubjectService} from "../../../../services/subject.service";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "../../../../../entrance/header/header.component";
import {TestCreatingComponent} from "../test-creating/test-creating.component";
import {TestService} from "../../../../services/test.service";
import {TestData} from "../../../../models/test-data.model";
import {forkJoin, map, Observable} from "rxjs";
import {GroupService} from "../../../../services/group.service";
import {GroupData} from "../../../../models/group-data.model";


@Component({
  selector: 'subject',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterLink,
    TestCreatingComponent
  ],
  templateUrl: './subject-page.component.html',
  styleUrls: ['./subject-page.component.css', '../../../../../../styles/buttons.css']
})
export class SubjectPageComponent implements OnInit{
  subject?: SubjectData;
  tests: TestData[] = [];
  activeMenuIndex: number | null = null;
  subjectColor: string = '';

  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectService,
    public testService: TestService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const subjectId = +params.get('id')!;  // Перетворюємо на число
      this.subjectService.currentSubjectId = subjectId;
      console.log(this.subjectService.currentSubjectId);
      if (subjectId) {
        this.subjectService.getSubjectById(subjectId).subscribe(
          (subjectData: SubjectData) => {
            this.subject = subjectData;
            this.loadTestsForSubject(subjectId);
          },
          error => {
            console.error('Error loading subject:', error);
          }
        );
      }
    });

    // Load tests for the current subject
    this.testService.getTestsBySubjectId(this.subjectService.currentSubjectId).subscribe(
      (tests: TestData[]) => {
        this.tests = tests;
      },
      error => {
        console.error('Error loading tests:', error);
      }
    );

    // Retrieve the 'color' parameter from route query parameters
    this.route.queryParams.subscribe(params => {
      this.subjectColor = params['color'] || '#ffffff';
    });
  }

  loadTestsForSubject(subjectId: number): void {
    // Subscribe to the observable and assign the result to this.tests
    this.testService.getTestsBySubjectId(subjectId).subscribe(
      (tests: TestData[]) => {
        this.tests = tests; // Assign the received array to the tests variable
      },
      error => {
        console.error('Error loading tests:', error);
      }
    );
  }

  // Метод для перевірки активності тесту
  getTestStatus(test: TestData): string[] {
    const currentDate = new Date();
    const openDate = new Date(test.open_date);
    const closeDate = new Date(test.close_date);

    const openTimeString = `${test.open_time.hours}:${test.open_time.minutes < 10 ? '0' + test.open_time.minutes : test.open_time.minutes}`;

    if (currentDate < openDate) {
      return [`Запланований на`, `${test.open_date} о ${openTimeString}`];
    } else if (currentDate >= openDate && currentDate <= closeDate) {
      return ['Тест активний', ''];
    } else {
      return ['Тест неактивний', ''];
    }
  }

  toggleMenu(index: number): void {
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }

  editTest(test: TestData): void {
    this.testService.visibleTestForm = true;
    this.testService.setSelectedTest(test);
  }

  deleteTest(index: number): void {
    const testToDelete = this.tests[index];
    console.log(`Видалити тест ${testToDelete.test_name}`);

    // Виклик методу видалення з TestService
    this.testService.deleteTest(testToDelete.id).subscribe(() => {
      // Поновлення списку тестів після видалення
      this.testService.getTestsBySubjectId(this.subjectService.currentSubjectId).subscribe(
        (tests: TestData[]) => {
          this.tests = tests;  // Оновлюємо список тестів
        },
        error => {
          console.error('Error updating tests:', error);
        }
      );
    });
  }


  toggleTestCreatingForm() {
    this.testService.visibleTestForm = !this.testService.visibleTestForm;
  }
}
