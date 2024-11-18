import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../../../entrance/header/header.component";
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../services/data.service";
import {CommonModule} from "@angular/common";
import {FormsModule, NgForm} from "@angular/forms";
import {TeacherService} from "../../../teacher/services/teacher.service";
import {TeacherData} from "../../../teacher/models/teacher-data.model";
import {Role} from "../../model/role.model";
import {StudentData} from "../../../teacher/models/student-data.model";
import {StudentService} from "../../../teacher/services/student.service";

@Component({
  selector: 'data-filling',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './data-filling.component.html',
  styleUrls: ['./data-filling.component.css','../../../../styles/pages-title.css', '../../../../styles/container-border.css', '../../../../styles/buttons.css']
})
export class DataFillingComponent implements OnInit {
  role: string | null = null;

  constructor(
    private router: Router,
    public data: DataService,
    private  teacherService: TeacherService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    // Перевіряємо, чи selectedRole є об'єктом Role
    if (typeof this.data.role.selectedRole === 'object' && 'id' in this.data.role.selectedRole) {
      this.role = (this.data.role.selectedRole as Role).id; // Присвоюємо тільки id
    } else {
      this.role = this.data.role.selectedRole as string; // Якщо це просто рядок, присвоюємо як є
    }
    console.log("роль ", this.role);
  }

  onSubmit(form: NgForm) {
    console.log("Form Submitted:", form.value);

    if (form.invalid) {
      console.log("Form is invalid");
      return;
    }
    const uniqueId = Math.floor(Math.random() * 21474) + 1;
    if (this.role === 'teacher') {
      const teacherData: TeacherData = {
        id: uniqueId,
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
      };
      console.log("Teacher Data:", teacherData);

      this.teacherService.addTeacherData(teacherData.id, teacherData.name, teacherData.email, teacherData.password);
      this.teacherService.teacherId = uniqueId;

      this.router.navigate(['/app-teacher'], { state: { teacher: teacherData } });
      form.reset();
    } else {
      const studentData: StudentData = {
        id: uniqueId,
        full_name: form.value.name,
        email: form.value.email,
        subjects_id: [],
        password: form.value.password,
      };
      console.log("Student Data:", studentData);

      this.studentService.addStudent(studentData.id, studentData.full_name, studentData.email, studentData.password, studentData.subjects_id).subscribe(
        (data) => {
          console.log("Студент успішно доданий:", data);
        },
        (error) => {
          console.error("Помилка додавання студента:", error);
        }
      );
      this.studentService.studentId = uniqueId;
      console.log(this.studentService.studentId);

      this.router.navigate(['/app-student'], { state: { student: studentData } });
    }
  }

}
