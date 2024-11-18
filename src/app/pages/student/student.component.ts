import {Component, OnInit} from '@angular/core';
import {TeacherData} from "../teacher/models/teacher-data.model";
import {SubjectService} from "../teacher/services/subject.service";
import {TeacherService} from "../teacher/services/teacher.service";
import {Router} from "@angular/router";
import {StudentData} from "../teacher/models/student-data.model";
import {StudentService} from "../teacher/services/student.service";
import {StudentSubjectsListComponent} from "./components/student-subjects-list/student-subjects-list.component";

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    StudentSubjectsListComponent
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent  implements OnInit{
  studentName: string | undefined = "";
  student!: StudentData;



  subjectCount: number = 0;
  selectedTab: string = 'subjects';
  showSettings = false;

  searchQuery: string = '';
  filteredSubjects = [];

  constructor(
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    public studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.student = history.state.student;
    this.studentName = this.student.full_name;
    this.studentService.currentStudentId = this.student!.id;
    console.log(this.studentService.currentStudentId);
  }
}
