import { Component } from '@angular/core';
import {HeaderComponent} from "../entrance/header/header.component";
import {SubjectsComponent} from "./components/subjects/subjects.component";
import {GroupsComponent} from "./components/groups/groups.component";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SettingsComponent} from "./components/settings/settings.component";

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [
    HeaderComponent,
    SubjectsComponent,
    GroupsComponent,
    CommonModule,
    RouterLink,
    SettingsComponent
  ],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css', '../../styles/buttons.css', "../../styles/pages-title.css"]
})
export class TeacherComponent {
  teacherName: string = "Гречин Ірина"
  subjectCount: number = 0;
  selectedTab: string = 'subjects';
  showSettings = false;

  toggleSettings() {
    this.showSettings = !this.showSettings;

  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
