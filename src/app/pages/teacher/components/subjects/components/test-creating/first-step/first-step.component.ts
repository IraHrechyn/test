import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TestService} from "../../../../../services/test.service";
import {TestData} from "../../../../../models/test-data.model";

@Component({
  selector: 'app-first-step',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.css', '../../../../../../../styles/buttons.css']
})
export class FirstStepComponent implements OnInit{
  @Output() firstStepComplete = new EventEmitter<void>();
  @Input() isEditing: boolean = false;
  @Input() selectedTest: TestData | null = null;

  testName: string = '';
  selectedGroup: string = '';
  openDate: string = '';
  closeDate: string = '';
  openTime = { hours: 0, minutes: 0 };
  closeTime = { hours: 0, minutes: 0 };
  duration = { hours: 0, minutes: 0 };
  max_attempts: number = 1;

  today: string = '';

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.initializeToday();
    this.loadSavedData();

    // Якщо ми редагуємо, заповнюємо поля даними тесту
    if (this.isEditing && this.selectedTest) {
      this.populateTestData();
    }
  }

  initializeToday(): void {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    this.today = `${yyyy}-${mm}-${dd}`;
  }

  loadSavedData(): void {
    const savedData: Partial<TestData> = this.testService.getFormStepData();

    this.testName = savedData.test_name || '';
    // this.selectedGroup = savedData.selectedGroup || '';
    this.openDate = savedData.open_date || '';
    this.closeDate = savedData.close_date || '';
    this.openTime = savedData.open_time || { hours: 0, minutes: 0 };
    this.closeTime = savedData.close_time || { hours: 0, minutes: 0 };
    this.duration = savedData.duration || { hours: 0, minutes: 0 };
    this.max_attempts = savedData.max_attempts || 1;
  }

  populateTestData(): void {
    if (this.selectedTest) {
      this.testName = this.selectedTest.test_name;
      this.openDate = this.selectedTest.open_date;
      this.closeDate = this.selectedTest.close_date;
      this.openTime = this.selectedTest.open_time;
      this.closeTime = this.selectedTest.close_time;
      this.duration = this.selectedTest.duration
      this.max_attempts = this.selectedTest.max_attempts
    }
  }

  onDateChange() {
    const openDateTime = new Date(this.openDate);
    openDateTime.setHours(this.openTime.hours, this.openTime.minutes);

    const closeDateTime = new Date(this.closeDate);
    closeDateTime.setHours(this.closeTime.hours, this.closeTime.minutes);

    // Обчислення тривалості у хвилинах
    const durationMinutes = this.duration.hours * 60 + this.duration.minutes;

    if (closeDateTime <= openDateTime) {
      console.error("Дата і час закриття мають бути пізніше дати і часу відкриття");
    } else {
      console.log("Дати і час введені коректно");
    }

    // Обчислення різниці у хвилинах між датами відкриття та закриття
    const totalMinutes = (closeDateTime.getTime() - openDateTime.getTime()) / (1000 * 60);

    if (durationMinutes > totalMinutes) {
      console.error("Тривалість не може бути більшою за час від відкриття до закриття");
    }
  }


  goBack() {
    this.testService.visibleTestForm = !this.testService.visibleTestForm;
    this.testService.clearFormData();
  }

  goNext() {
    console.log("Form values:", {
      test_name: this.testName,
      openDate: this.openDate,
      closeDate: this.closeDate,
      openTime: this.openTime,
      closeTime: this.closeTime,
      duration: this.duration,
      max_attempts: this.max_attempts
    });

    console.log("Is form valid:", this.isFormValid());

    if (this.isFormValid()) {
      console.log("Proceeding to next step...");
      this.testService.saveFormStepData({
        test_name: this.testName,
        open_date: this.openDate,
        close_date: this.closeDate,
        open_time: this.openTime,
        close_time: this.closeTime,
        duration: this.duration,
        max_attempts: this.max_attempts
      });
      this.firstStepComplete.emit();
    } else {
      console.error("Form is invalid, cannot proceed to next step.");
    }
  }


  isFormValid(): boolean {
    const openDateTime = new Date(this.openDate);
    openDateTime.setHours(this.openTime.hours, this.openTime.minutes);

    const closeDateTime = new Date(this.closeDate);
    closeDateTime.setHours(this.closeTime.hours, this.closeTime.minutes);

    return (
      !!this.testName &&
      !!this.openDate &&
      !!this.closeDate &&
      openDateTime < closeDateTime &&
      this.openTime.hours >= 0 &&
      this.openTime.hours <= 23 &&
      this.openTime.minutes >= 0 &&
      this.openTime.minutes <= 59 &&
      this.closeTime.hours >= 0 &&
      this.closeTime.hours <= 23 &&
      this.closeTime.minutes >= 0 &&
      this.closeTime.minutes <= 59
    );
  }
}

