import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-results-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './results-modal.component.html',
  styleUrl: './results-modal.component.css'
})
export class ResultsModalComponent {
  @Input() isVisible: boolean = false;
  @Input() score: number = 0;
  @Input() totalQuestions: number = 0;
  @Input() hasOpenAnswers: boolean = false;
  @Input() openAnswers: { question: string; answer: string }[] = [];

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
