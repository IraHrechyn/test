import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {StudentData} from "../../../../models/student-data.model";
import {CommonModule} from "@angular/common";
import {StudentService} from "../../../../services/student.service";

@Component({
  selector: 'group-creating-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './creating-form.component.html',
  styleUrls: ['./creating-form.component.css', '../../../../../../styles/buttons.css']
})
export class CreatingFormComponent implements OnInit{
  @Output() groupCreated = new EventEmitter<{ groupName: string, selectedStudents: StudentData[] }>();
  @Output() formClosed = new EventEmitter<void>();

  groupName: string = '';
  studentSearchQuery: string = ''; // For searching students
  selectedStudents: StudentData[] = []; // Store selected students

  students: StudentData[] = []; // Store fetched students

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    // Fetch all students on component initialization
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => {
        console.error('Error fetching students:', error);
      }
    });
  }

  // Filter students based on search query
  get filteredStudents(): StudentData[] {
    return this.students.filter(student =>
      student.full_name.toLowerCase().includes(this.studentSearchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(this.studentSearchQuery.toLowerCase())
    );
  }

  confirm() {
    if (this.groupName) {
      this.groupCreated.emit({ groupName: this.groupName, selectedStudents: this.selectedStudents });
      this.closeForm();
    }
  }

  cancel() {
    this.closeForm();
  }

  private closeForm() {
    this.formClosed.emit();
  }

  // Add a student to selected list
  addStudent(student: StudentData) {
    if (!this.selectedStudents.some(s => s.id === student.id)) {
      this.selectedStudents.push(student);
    }
    this.studentSearchQuery = ''; // Reset query after selection
  }

  // Remove a student from selected list
  removeStudent(student: StudentData) {
    this.selectedStudents = this.selectedStudents.filter(s => s.id !== student.id);
  }
}
