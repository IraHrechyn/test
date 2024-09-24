import { Routes } from '@angular/router';
import {MainPageComponent} from "./pages/main-page/main-page.component";
import {RegistrationComponent} from "./pages/registration/registration.component";
import {EntranceComponent} from "./pages/entrance/entrance.component";
import {DataFillingComponent} from "./pages/registration/components/data-filling/data-filling.component";
import {StudentComponent} from "./pages/student/student.component";
import {TeacherComponent} from "./pages/teacher/teacher.component";

export const routes: Routes = [
  { path: '', component: MainPageComponent},
  { path: 'entrance', component: EntranceComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'main-page', component: MainPageComponent },
  { path: 'data-filling', component: DataFillingComponent },
  { path: 'app-teacher', component: TeacherComponent },
  { path: 'app-student', component: StudentComponent },
  { path: '**', redirectTo: '' }
];

