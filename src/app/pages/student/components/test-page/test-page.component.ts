import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TestData} from "../../../teacher/models/test-data.model";
import {TestService} from "../../../teacher/services/test.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})
export class TestPageComponent implements OnInit {
  subjectId: number = 0;
  subjectName: string = '';
  tests: TestData[] = [];  // Array to hold the tests

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private router: Router// Inject the TestService
  ) {}

  ngOnInit(): void {
    // Subscribe to the route params to get subjectId and subjectName
    this.route.params.subscribe(params => {
      this.subjectId = +params['subjectId'];
      this.subjectName = params['subjectName'];

      // Now that we have the subjectId, load the tests for this subject
      this.loadTestsForSubject(this.subjectId);
    });
  }

  // Method to load tests for the given subjectId
  loadTestsForSubject(subjectId: number): void {
    this.testService.getTestsBySubjectId(subjectId).subscribe(
      (tests: TestData[]) => {
        this.tests = tests;  // Assign the fetched tests to the component's tests array
      },
      (error) => {
        console.error('Error loading tests:', error);
      }
    );
  }
  onTestClick(test: TestData): void {
    // Store the selected test
    this.testService.setSelectedTest(test);
    // Navigate to the test-taking page
    this.router.navigate(['/test-taking', test.id]);
  }

}
