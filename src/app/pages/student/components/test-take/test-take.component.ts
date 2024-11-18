import {Component, OnDestroy, OnInit} from '@angular/core';
import {Question, TestData} from "../../../teacher/models/test-data.model";
import {ActivatedRoute} from "@angular/router";
import {TestService} from "../../../teacher/services/test.service";
import {CommonModule} from "@angular/common";
import {ResultsModalComponent} from "../results-modal/results-modal.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-test-take',
  standalone: true,
  imports: [
    CommonModule,
    ResultsModalComponent,
    FormsModule
  ],
  templateUrl: './test-take.component.html',
  styleUrl: './test-take.component.css'
})
export class TestTakeComponent  implements OnInit, OnDestroy {
  selectedTest: TestData | null = null;
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  timeLeft: number = 0;
  formattedTime: string = '';
  private timerInterval: any;
  selectedAnswers: { [key: number]: string[] } = {}; // Define selected answers as an object with arrays of strings
  // Тут коректно оголошено тип
  score: number = 0;
  totalQuestions: number = 0;
  hasOpenAnswers: boolean = false;
  openAnswers: { question: string; answer: string }[] = [];
  isModalVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const testId = +params['testId'];
      this.loadTest(testId);
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  loadTest(testId: number): void {
    this.testService.getTestById(testId).subscribe(test => {
      this.selectedTest = test;
      this.loadQuestions(test.id);
      this.totalQuestions = test.questions.length;
      const durationInSeconds = this.convertDurationToSeconds(test.duration);
      this.startTimer(durationInSeconds);
    });
  }

  loadQuestions(testId: number): void {
    this.questions = this.selectedTest?.questions || [];
  }

  convertDurationToSeconds(duration: { hours: number; minutes: number }): number {
    return duration.hours * 3600 + duration.minutes * 60;
  }




  outside(answer: string | boolean[]): void {
    console.log(answer);
  }

  startTimer(durationInSeconds: number): void {
    this.timeLeft = durationInSeconds;
    this.updateFormattedTime();

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateFormattedTime();
      } else {
        this.clearTimer();
        this.onTimeUp();
      }
    }, 1000);
  }

  updateFormattedTime(): void {
    const hours = Math.floor(this.timeLeft / 3600);
    const minutes = Math.floor((this.timeLeft % 3600) / 60);
    const seconds = this.timeLeft % 60;
    this.formattedTime = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  onTimeUp(): void {
    alert("Час вийшов! Ваш тест буде автоматично надісланий.");
    this.calculateScore();
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  calculateScore(): void {
    let score = 0;
    const openAnswers: { question: string; answer: string }[] = [];
    this.hasOpenAnswers = false;

    this.questions.forEach((question, index) => {
      if (question.type === 'open') {
        this.hasOpenAnswers = true;
        const answer = this.selectedAnswers[index].toString(); // Assume open answers are strings
        openAnswers.push({ question: question.question_text, answer });
      } else if (question.type === 'single') {
        // Ensure selectedAnswers[index] is treated as a single string
        const selectedAnswer = this.selectedAnswers[index].toString();
        const isCorrect = this.checkAnswer(question, selectedAnswer);
        if (isCorrect) score++;
      } else if (question.type === 'multiple') {
        // Ensure selectedAnswers[index] is treated as an array of strings for multiple-choice
        const selectedAnswers = this.selectedAnswers[index] as string[];
        const isCorrect = this.checkAnswer(question, selectedAnswers);
        if (isCorrect) score++;
      }
    });

    this.score = score;
    this.openAnswers = openAnswers;
    this.isModalVisible = true; // Show the modal
  }


  onMultipleAnswerChange(questionIndex: number, option: string): void {
    // Ensure selectedAnswers for this question is an array
    if (!Array.isArray(this.selectedAnswers[questionIndex])) {
      this.selectedAnswers[questionIndex] = [];
    }

    const selectedAnswersForQuestion = this.selectedAnswers[questionIndex] as string[];

    // Add or remove the option
    if (selectedAnswersForQuestion.includes(option)) {
      this.selectedAnswers[questionIndex] = selectedAnswersForQuestion.filter(answer => answer !== option);
    } else {
      selectedAnswersForQuestion.push(option);
    }
    console.log(`Selected answers for question ${questionIndex}:`, this.selectedAnswers[questionIndex], selectedAnswersForQuestion);
  }

  checkAnswer(question: Question, selectedAnswer: string | string[]): boolean {
    if (question.type === 'single' && typeof selectedAnswer === 'string') {
      const correctAnswer = question.correct_answer![0];
      return correctAnswer.toString() === selectedAnswer;
    } else if (question.type === 'multiple' && Array.isArray(selectedAnswer)) {
      if (Array.isArray(question.correct_answer)) {
        // Sort both arrays and compare for equality
        console.log(question.correct_answer, selectedAnswer, question.correct_answer === selectedAnswer, 'fvasefsef');
        return question.correct_answer === selectedAnswer;
      }
    }
    return false;
  }



  closeResultModal(): void {
    this.isModalVisible = false;
  }




}
