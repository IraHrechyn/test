import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupData} from "../../../../models/group-data.model";
import {CommonModule} from "@angular/common";
import {GroupService} from "../../../../services/group.service";
import {ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {Observable} from "rxjs";
import {StudentService} from "../../../../services/student.service";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {StudentData} from "../../../../models/student-data.model";

@Component({
  selector: 'group-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmDialogComponent
  ],
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css', '../../../../../../styles/buttons.css']
})
export class GroupDetailsComponent implements OnInit {
  @Input() groupId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() groupDeleted = new EventEmitter<number>();

  group: GroupData = {
    id: 0,
    group_name: '',
    teacher_id: 0,
    students_id: []
  };

  isAddingStudent = false;
  studentSearchQuery = '';
  isEditing = false;
  showConfirmDialog = false;
  students: StudentData[] = [];

  constructor(private groupService: GroupService, public studentService: StudentService) {}

  ngOnInit() {
    if (this.groupId) {
      this.groupService.getGroupById(this.groupId).subscribe(
        (groupData: GroupData) => {
          this.group = groupData;
        },
        (error) => {
          console.error(`Error fetching group with ID ${this.groupId}:`, error);
        }
      );
    }

    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => {
        console.error('Error fetching students:', error);
      }
    });
  }

  get filteredStudents() {
    if(this.studentSearchQuery!==''){
      return this.students.filter(student =>
        student.full_name.toLowerCase().includes(this.studentSearchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(this.studentSearchQuery.toLowerCase())
      );
    } else{
      return [];
    }
  }

  closeDetails() {
    this.close.emit();
  }

  editGroup() {
    this.isEditing = !this.isEditing;
    this.isAddingStudent = true;
    this.studentSearchQuery = '';
  }


  confirmDeleteGroup() {
    this.showConfirmDialog = true;
  }

  deleteGroup() {
    if (this.groupId) {
      this.groupService.deleteGroupById(this.groupId).subscribe(
        () => {
          this.groupDeleted.emit(this.groupId);
          this.closeDetails();
        },
        (error) => {
          console.error(`Error deleting group with ID ${this.groupId}:`, error);
        }
      );
    }
    this.showConfirmDialog = false;
  }

  cancelDelete() {
    this.showConfirmDialog = false;
  }

  removeStudent(studentId: number) {
    this.group.students_id = this.group.students_id.filter(id => id !== studentId);

    this.groupService.editGroup(this.group.id, this.group).subscribe(
      (response) => {
        console.log('Group updated successfully:', response);
      },
      (error) => {
        console.error('Error updating group:', error);
      }
    );
  }



  selectStudent(student: any) {
    if (!this.group.students_id.includes(student.id)) {
      this.group.students_id.push(student.id);
      this.groupService.editGroup(this.group.id, this.group).subscribe(
        (response) => {
          console.log('Student added to group successfully:', response);
          this.studentSearchQuery = '';
        },
        (error) => {
          console.error('Error updating group:', error);
        }
      );
    }
  }

  saveGroup() {
    this.groupService.editGroup(this.group.id, this.group).subscribe(
      (response) => {
        console.log('Group saved successfully:', response);
        this.isEditing = false; // Завершення режиму редагування
      },
      (error) => {
        console.error('Error saving group:', error);
      }
    );
  }
}
