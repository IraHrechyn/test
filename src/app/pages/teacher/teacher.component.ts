import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HeaderComponent} from "../entrance/header/header.component";
import {SubjectsComponent} from "./components/subjects/subjects.component";
import {GroupsComponent} from "./components/groups/groups.component";
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {SettingsComponent} from "./components/settings/settings.component";
import {FormsModule} from "@angular/forms";
import {SubjectData} from "./models/subject-data.model";
import {SubjectService} from "./services/subject.service";
import {TeacherService} from "./services/teacher.service";
import {TeacherData} from "./models/teacher-data.model";
import {map} from "rxjs";

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [
    HeaderComponent,
    SubjectsComponent,
    GroupsComponent,
    CommonModule,
    RouterLink,
    SettingsComponent,
    FormsModule
  ],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css', '../../styles/buttons.css', "../../styles/pages-title.css"]
})
export class TeacherComponent  implements OnInit, OnChanges{
  teacherName: string | undefined = "";
  teacherId!: number;
  subjectCount: number = 0;
  selectedTab: string = 'subjects';
  showSettings = false;
  teacher!: TeacherData;
  searchQuery: string = '';
  filteredSubjects: SubjectData[] = [];

  constructor(
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.teacher = history.state.teacher;
    this.teacherName = this.teacher?.name;
    this.teacherId = this.teacher!.id
    console.log(this.teacherService.teacherId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery'] || changes['filteredSubjects']) {
      this.onSearchChange();
    }
  }


  onSearchChange(): void {
    const searchTextLower = this.searchQuery.toLowerCase();
    console.log('Search Query:', searchTextLower); // Додайте цю строку для перевірки

    if (this.selectedTab === 'subjects') {
      this.subjectService.getSubjectsByTeacherId(this.teacherId).pipe(
        map(subjects => {
          return subjects.filter(subject =>
            subject.subject_name.toLowerCase().includes(searchTextLower)
          );
        })
      ).subscribe(filteredSubjects => {
        this.filteredSubjects = filteredSubjects;

        this.subjectCount = filteredSubjects.length; // Оновлення кількості предметів
        console.log('Updated Filtered Subjects:', this.filteredSubjects); // Додайте цю строку для перевірки
      });
    } else if (this.selectedTab === 'groups') {
      // this.filteredGroups = this.subjectService.getGroups().filter(group =>
      //   group.group_name.toLowerCase().includes(searchTextLower)
      // );
    }
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;

  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.searchQuery = '';
  }
}
