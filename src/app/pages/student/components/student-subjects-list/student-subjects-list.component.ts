import {Component, OnInit} from '@angular/core';
import {GroupService} from "../../../teacher/services/group.service";
import {GroupData} from "../../../teacher/models/group-data.model";
import {StudentService} from "../../../teacher/services/student.service";
import {SubjectService} from "../../../teacher/services/subject.service";
import {forkJoin} from "rxjs";
import {CommonModule} from "@angular/common";
import {SubjectData} from "../../../teacher/models/subject-data.model";
import {Router} from "@angular/router";

@Component({
  selector: 'student-subjects-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './student-subjects-list.component.html',
  styleUrl: './student-subjects-list.component.css'
})
export class StudentSubjectsListComponent implements OnInit {
  groupStudentData: { groupId: number; studentIds: number[] }[] = [];
  studentGroupIds: number[] = []; // Зберігатиме ID груп, де є поточний студент
  subjectIds: number[] = [];
  subjects: SubjectData[] = [];

  constructor(
    private groupService: GroupService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchGroups();
  }

  fetchGroups(): void {
    this.groupService.getAllGroups().subscribe((groups: GroupData[]) => {
      this.groupStudentData = groups.map(group => ({
        groupId: group.id,
        studentIds: group.students_id || []
      }));

      this.findStudentGroups();
    });
  }

  findStudentGroups(): void {
    const currentStudentId = this.studentService.currentStudentId;

    this.studentGroupIds = this.groupStudentData
      .filter(group => group.studentIds.includes(currentStudentId))
      .map(group => group.groupId);

    console.log("this.studentGroupIds", this.studentGroupIds);
    this.fetchSubjectsForStudentGroups();
  }

  fetchSubjectsForStudentGroups(): void {
    const subjectRequests = this.studentGroupIds.map(groupId =>
      this.subjectService.getSubjectsByGroupId(groupId)
    );

    // Отримуємо всі ID предметів, пов'язані з групами студента
    forkJoin(subjectRequests).subscribe((results: number[][]) => {
      this.subjectIds = results.flat();
      console.log("this.subjectIds", this.subjectIds);
      this.fetchSubjectDetails();
    });
  }

  fetchSubjectDetails(): void {
    const subjectDetailRequests = this.subjectIds.map(subjectId =>
      this.subjectService.getSubjectById(subjectId)
    );

    console.log(subjectDetailRequests);

    forkJoin(subjectDetailRequests).subscribe((subjectDetails: SubjectData[]) => {
      // Оновлюємо список предметів, додаючи тільки унікальні
      subjectDetails.forEach(subject => {
        if (!this.subjects.some(existingSubject => existingSubject.id === subject.id)) {
          this.subjects.push(subject);
        }
      });
      console.log("this.subjects", this.subjects);
    });
  }

  // В компоненті StudentSubjectsListComponent
  onSubjectClick(subject: SubjectData): void {
    this.router.navigate(['/app-test-page', subject.id, subject.subject_name]);  // Передаємо ID і назву
  }

}
