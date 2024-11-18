import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css', '../../../../../../styles/buttons.css']
})
export class ConfirmDialogComponent {
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
  }

  cancel() {
    this.cancelled.emit();
  }
}
