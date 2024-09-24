import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../../../entrance/header/header.component";
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../services/data.service";
import {CommonModule} from "@angular/common";
import {FormsModule, NgForm} from "@angular/forms";
import {TeacherService} from "../../../teacher/services/teacher.service";
import {TeacherData} from "../../../teacher/models/teacher-data.model";

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
    private  teacherService: TeacherService
  ) {}

  ngOnInit() {
    // Отримуємо роль з DataService
    this.role = this.data.role.selectedRole as string;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if( this.role === 'teacher') {
      const teacherData: TeacherData = {
        id: '',
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
      };

      this.teacherService.addTeacherData(teacherData.name, teacherData.email, teacherData.password);
      form.reset(); // Скидаємо форму після відправки, якщо потрібно
    }

    const redirectUrl = this.role === 'teacher' ? '/app-teacher' : '/app-student';
    this.router.navigate([redirectUrl]);
  }
}
