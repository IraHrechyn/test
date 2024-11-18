import { Routes } from '@angular/router';
import {MainPageComponent} from "./pages/main-page/main-page.component";
import {RegistrationComponent} from "./pages/registration/registration.component";
import {EntranceComponent} from "./pages/entrance/entrance.component";
import {DataFillingComponent} from "./pages/registration/components/data-filling/data-filling.component";
import {StudentComponent} from "./pages/student/student.component";
import {TeacherComponent} from "./pages/teacher/teacher.component";
import {SubjectPageComponent} from "./pages/teacher/components/subjects/components/subject-page/subject-page.component";
import {RoleSelectionComponent} from "./pages/registration/components/role-selection/role-selection.component";
import {TestPageComponent} from "./pages/student/components/test-page/test-page.component";
import {TestTakeComponent} from "./pages/student/components/test-take/test-take.component";

export const routes: Routes = [
  { path: '', component: MainPageComponent},
  { path: 'entrance', component: EntranceComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'role-selection', component: RoleSelectionComponent},
  { path: 'main-page', component: MainPageComponent },
  { path: 'data-filling', component: DataFillingComponent },
  { path: 'app-teacher', component: TeacherComponent },
  { path: 'app-student', component: StudentComponent },
  { path: 'test-taking/:testId', component: TestTakeComponent },
  { path: 'app-test-page/:subjectId/:subjectName', component: TestPageComponent },
  { path: 'subject/:id', component: SubjectPageComponent },
  { path: '', redirectTo: '/subjects', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

