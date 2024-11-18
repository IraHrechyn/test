import {Component, OnInit} from '@angular/core';
import {FirstStepComponent} from "./first-step/first-step.component";
import {SecondStepComponent} from "./second-step/second-step.component";
import {CommonModule} from "@angular/common";
import {TestService} from "../../../../services/test.service";
import {TestData} from "../../../../models/test-data.model";

@Component({
  selector: 'app-test-creating',
  standalone: true,
  imports: [
    FirstStepComponent,
    SecondStepComponent,
    CommonModule
  ],
  templateUrl: './test-creating.component.html',
  styleUrl: './test-creating.component.css'
})
export class TestCreatingComponent implements OnInit{
  isFirstStepCompleted: boolean = false;
  isSecondStepCompleted: boolean = false;
  isCompleted: boolean = false;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.selectedTest = this.testService.getSelectedTest();
    this.isEditing = this.selectedTest !== null;
  }
  onFirstStepComplete() {
    this.isFirstStepCompleted = true;
    this.isCompleted = true;
  }

  onSecondStepComplete() {
    this.isSecondStepCompleted = true;
  }
  onBackToFirstStep() {
    this.isFirstStepCompleted = false;
    this.isCompleted = false;
  }
  isEditing: boolean = false; // Додайте цю змінну
  selectedTest:  TestData | null = null;

}
