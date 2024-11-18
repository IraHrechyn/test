import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TestService} from "../../../../../services/test.service";
import {Question, TestData} from "../../../../../models/test-data.model";

@Component({
  selector: 'app-second-step',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './second-step.component.html',
  styleUrls: ['./second-step.component.css', '../../../../../../../styles/buttons.css']
})
export class SecondStepComponent  implements OnInit{
  questionType: string = 'single';
  newTestName: string = '';
  showAddTest: boolean = false;

  @Output() backToFirstStep: EventEmitter<void> = new EventEmitter<void>();
  @Output() secondStepComplete: EventEmitter<void> = new EventEmitter<void>();
  @Input() isEditing: boolean = false;
  @Input() selectedTest: TestData | null = null;

  tests: any[] = [{ name: '', type: 'single', answers: ['', ''], correctAnswers: [] }];

  questions!: Question[];

  testFormData: TestData = {
    id: 0,
    subject_id: 0,
    test_name: '',
    open_date: '',
    close_date: '',
    open_time: { hours: 0, minutes: 0 },
    close_time: { hours: 0, minutes: 0 },
    questions: this.questions,
    duration: { hours: 0, minutes: 0 },
    max_attempts: 1
  };

  constructor(private testService: TestService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log(this.isEditing);
    if (this.isEditing && this.selectedTest) {
      this.populateTestData();
      console.log("this.tests", this.tests);
    } else {
      const savedData = this.testService.getFormStepData();
      if (savedData) {
        this.testFormData = {
          id: savedData.id || 0, // Значення за замовчуванням для id
          subject_id: savedData.subject_id || 0, // Значення за замовчуванням для subject_id
          test_name: savedData.test_name || '',
          open_date: savedData.open_date || '',
          close_date: savedData.close_date || '',
          open_time: savedData.open_time || { hours: 0, minutes: 0 },
          close_time: savedData.close_time || { hours: 0, minutes: 0 },
          questions: savedData.questions || [], // Порожній масив для запитань за замовчуванням
          duration: savedData.duration || { hours: 0, minutes: 0 },
          max_attempts: savedData.max_attempts || 1 // Default value for duration

        };
        this.questions = this.testFormData.questions;
      } else {
        this.questions = []; // Початковий порожній масив для запитань
      }
    }
  }



  populateTestData(): void {
    if (this.selectedTest && this.selectedTest.questions) {
      console.log("this.selectedTest", this.selectedTest);
      this.questions = this.selectedTest.questions;
      console.log("questions", this.questions, this.questions[0].correct_answer);
      this.tests = this.selectedTest.questions.map(question => ({
        name: question.question_text || 'Нове питання',
        type: question.type || 'single', // Use the type from the question
        answers: Array.isArray(question.options) && question.options.length > 0 ? question.options : [''],
        correctAnswers: Array.isArray(question.correct_answer) && question.correct_answer.length > 1
          ? question.correct_answer.map((index: number) => true)
          : [question.correct_answer ? question.correct_answer[0] : null],
      }));
      console.log(this.tests)
      this.isEditing = false
    }
  }


  trackByIndex(index: number, obj: any): any {
    return index;
  }


  addMoreAnswers(index: number) {
    const test = this.tests[index];
    if (!test.answers) {
      test.answers = [];  // Initialize answers if not already done
    }
    test.answers.push('');  // Add an empty answer field
    if (!test.correctAnswers) {
      test.correctAnswers = [];  // Initialize correct answers if not already done
    }
    test.correctAnswers.push(false);  // Add a corresponding correct answer checkbox (default to false)
  }

  cloneObject<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }


  addQuestion() {
    const newTest = {
      name: '',
      type: 'single',
      answers: ['', ''], // або ініціалізуйте необхідними варіантами
      correctAnswer: null // Значення, яке буде зберігати правильну відповідь
    };
    this.tests.push(newTest);
    console.log(this.tests);
  }



  onTestTypeChange(event: Event, index: number) {
    const selectedType = (event.target as HTMLSelectElement).value;
    this.tests[index].type = selectedType;
    if (selectedType === 'open') {
      this.tests[index].answers = [''];
      this.tests[index].correctAnswers = [];
    }
  }

  goBack() {
    this.backToFirstStep.emit();
  }

  goNext() {
    this.testService.saveCurrentTestData(this.tests);
    this.secondStepComplete.emit();
    this.testService.visibleTestForm = false;
    this.testService.clearFormData();
  }

  saveEditedTest() {
    console.log("this.testFormData", this.testFormData);
    if (this.isEditing && this.selectedTest) {
      // Оновлюємо основні деталі тесту з даних форми
      this.selectedTest.test_name = this.testFormData.test_name;
      this.selectedTest.open_date = this.testFormData.open_date;
      this.selectedTest.close_date = this.testFormData.close_date;
      this.selectedTest.open_time = this.testFormData.open_time;
      this.selectedTest.close_time = this.testFormData.close_time;
      this.selectedTest.duration = this.testFormData.duration;
      this.selectedTest.max_attempts = this.testFormData.max_attempts;

      // Оновлюємо питання
      this.selectedTest.questions = this.tests.map((test, index) => {
        if (test.type === 'open') {
          return {
            id: this.selectedTest!.questions[index]?.id,
            question_text: test.name,
            options: null,  // додаємо null для open питання
            correct_answer: null,  // додаємо null для open питання
            type: test.type // додаємо тип питання
          };
        } else {
          return {
            id: this.selectedTest!.questions[index]?.id,
            question_text: test.name,
            options: test.answers,  // додаємо варіанти відповідей
            correct_answer: test.type === 'single'
              ? [test.correctAnswer]  // для одного правильного варіанту
              : test.correctAnswers
                .map((isCorrect: boolean, i: number) => isCorrect ? i : null)
                .filter((i: number | null) => i !== null),
            type: test.type // додаємо тип питання
          };
        }
      });

      console.log('this.selectedTest', this.selectedTest);

      // Надсилаємо оновлений тест
      this.testService.updateTest(this.selectedTest).subscribe(
        (updatedTest: TestData) => {
          console.log('Тест успішно оновлено', updatedTest);
          this.secondStepComplete.emit();
        },
        error => {
          console.error('Помилка при оновленні тесту:', error);
        }
      );
    }
    this.testService.visibleTestForm = false;
    this.testService.clearFormData();
  }





  saveTest() {
    this.secondStepComplete.emit();
    this.testService.visibleTestForm = false;
    this.testService.clearFormData();

    // Генеруємо унікальні ID для кожного питання
    const questionsToSave = this.tests.map((test, index) => {
      const uniqueID = Math.floor(Math.random() * 21454474) + 1; // Генерація унікального ID для кожного питання
      if (test.type === 'open') {
        return {
          id: uniqueID,
          question_text: test.name,
          options: null,  // додаємо null для open питання
          correct_answer: null,  // додаємо null для open питання
          type: 'open'  // додаємо type
        };
      } else {
        return {
          id: uniqueID,
          question_text: test.name,
          options: test.answers,  // додаємо варіанти відповідей
          correct_answer: test.type === 'single'
            ? [test.correctAnswer]  // для одного правильного варіанту
            : test.correctAnswers
              .map((isCorrect: boolean, i: number) => isCorrect ? i : null)  // фільтруємо лише правильні варіанти
              .filter((i: number | null) => i !== null),  // видаляємо null значення
          type: test.type  // додаємо type
        };
      }
    });

    // Надсилаємо збережений тест до сервісу
    this.testService.addTest(
      this.testFormData.test_name,
      questionsToSave,
      this.testFormData.open_date,
      this.testFormData.close_date,
      this.testFormData.open_time,
      this.testFormData.close_time,
      this.testFormData.duration,
      this.testFormData.max_attempts
    ).subscribe(savedTest => {
      if (savedTest) {
        console.log('Тест успішно збережено', savedTest);
        this.secondStepComplete.emit();
      } else {
        console.error('Не вдалося зберегти тест');
      }
    });
  }






  cancel() {
    this.testService.visibleTestForm = false;
    this.testService.clearFormData();
  }
}
