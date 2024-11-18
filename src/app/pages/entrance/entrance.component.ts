import { Component } from '@angular/core';
import {HeaderComponent} from "./header/header.component";
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TeacherService} from "../teacher/services/teacher.service";
import {TeacherData} from "../teacher/models/teacher-data.model";
import {RoleSelectionComponent} from "../registration/components/role-selection/role-selection.component";
import {DataService} from "../registration/services/data.service";
import {StudentService} from "../teacher/services/student.service";
import {StudentData} from "../teacher/models/student-data.model";
import {Role} from "../registration/model/role.model";

@Component({
  selector: 'entrance',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    RoleSelectionComponent
  ],
  templateUrl: './entrance.component.html',
  styleUrls: ['../../styles/pages-title.css', '../../styles/container-border.css', './entrance.component.css', '../../styles/buttons.css']
})
export class EntranceComponent {
  entranceForm: FormGroup;
  constructor(private router: Router,
              private fb: FormBuilder,
              private teacherService: TeacherService,
              private studentService: StudentService,
              public data: DataService) {

    // Ініціалізація форми з полями `name` і `password`
    this.entranceForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Метод для обробки входу
  onSubmit() {
    this.data.entrance.visibleEntrance = false;

    if (this.entranceForm.valid) {
      const { name, password } = this.entranceForm.value;
      console.log(this.data.role.selectedRole);

      // Check if selectedRole is an instance of Role
      if (this.isRole(this.data.role.selectedRole) && this.data.role.selectedRole.id === 'teacher') {
        this.teacherService.authenticate(name, password).subscribe(
          (teacher: TeacherData | null) => {
            if (teacher) {
              console.log('Authenticated teacher:', teacher);
              this.router.navigate(['/app-teacher'], { state: { teacher } });
            } else {
              console.error('Невірне ім’я або пароль');
            }
          },
          error => {
            console.error('Помилка авторизації для викладача:', error);
          }
        );
      } else if (this.isRole(this.data.role.selectedRole) && this.data.role.selectedRole.id === 'student') {
        this.studentService.authenticate(name, password).subscribe(
          (student: StudentData | null) => {
            if (student) {
              console.log('Authenticated student:', student);
              this.router.navigate(['/app-student'], { state: { student } });
            } else {
              console.error('Невірне ім’я або пароль');
            }
          },
          error => {
            console.error('Помилка авторизації для студента:', error);
          }
        );
      } else {
        console.error('Role not selected properly');
      }
    }
  }

// Type guard to check if selectedRole is of type Role
  isRole(role: string | Role): role is Role {
    return (role as Role).id !== undefined;
  }


}
