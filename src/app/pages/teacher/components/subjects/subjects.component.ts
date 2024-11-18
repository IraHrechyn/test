import {Component, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {CreatingFormComponent} from "./components/creating-form/creating-form.component";
import {CommonModule} from "@angular/common";
import {SubjectData} from "../../models/subject-data.model";
import {SubjectService} from "../../services/subject.service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {forkJoin, map, Observable, Subject} from "rxjs";
import {GroupData} from "../../models/group-data.model";
import {GroupService} from "../../services/group.service";
import {EditSubjectFormComponent} from "./components/edit-subject-form/edit-subject-form.component";

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    CreatingFormComponent,
    CommonModule,
    FormsModule,
    EditSubjectFormComponent

  ],
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css', '../../../../styles/buttons.css']
})
export class SubjectsComponent implements OnChanges, OnDestroy {
  @Input() searchQuery: string = '';
  @Input() teacherId!: number;

  showForm = false;
  subjects: SubjectData[] = [];
  pastelColors: string[] = [
    '#bcb0b7', '#ead0c6', '#849E8A', '#89A8AE', '#DBD3D1', '#A56266', '#bcb0b7', '#d9e3cb', '#cac7d8'
  ];

  private unsubscribe$ = new Subject<void>();

  activeMenuIndex: number | null = null;
  editModeIndex: number | null = null;
  newSubjectName: string = '';
  newGroupIds: number[] = [];
  groupNamesBySubjectId: { [subjectId: number]: string[] } = {};
  showEditForm: boolean = false;



  constructor(private subjectService: SubjectService, private router: Router, private groupService: GroupService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teacherId']) {
      this.loadSubjects();

    }
    if (changes['searchQuery']) {
      this.filterSubjects();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadSubjects(): void {
    this.subjects = [];
    console.log(this.teacherId);
    this.subjectService.getSubjectsByTeacherId(this.teacherId).subscribe(
      subjects => {
        this.subjects = subjects;
        console.log(this.subjects);
        this.filterSubjects(); // Відразу фільтруємо після завантаження
        this.loadGroupNames(subjects);
      },
      error => console.error('Помилка при завантаженні предметів:', error)
    );
  }

  // Фільтрування предметів
  filterSubjects(): void {
    const searchQueryLower = this.searchQuery.toLowerCase();
    this.subjectService.getSubjectsByTeacherId(this.teacherId).subscribe(subjects => {
      this.subjects = subjects.filter(subject => subject.subject_name.toLowerCase().includes(searchQueryLower));
    });
  }

  // Відкриття форми для створення нового предмета
  addSubject(): void {
    this.showForm = true;
  }

  // Додавання нового предмета

  onCreated(subjectData: { name: string, groupIds: number[] }): void {
    this.subjectService.addSubject(subjectData.name, this.teacherId, subjectData.groupIds).subscribe(() => {
      this.loadSubjects();
      this.showForm = false;
    });
  }


  closeForm(): void {
    this.showForm = false;
  }

  getBackgroundColor(index: number): string {
    return this.pastelColors[index % this.pastelColors.length];
  }

  toggleMenu(index: number): void {
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }

  editSubject(index: number): void {
    this.editModeIndex = index;
    this.showEditForm = true;
    this.newSubjectName = this.subjects[index].subject_name;
    this.newGroupIds = this.subjects[index].group_ids || [];
    this.activeMenuIndex = null;
  }

  updateSubject(index: number, updatedData: { subjectName: string, group_Ids: number[] }): void {
    const subject = this.subjects[index];
    this.subjectService.editSubject(subject.id, updatedData.subjectName, this.teacherId, updatedData.group_Ids).subscribe(() => {
      this.loadSubjects();
      this.cancelEdit();
    });
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editModeIndex = null;
    this.newSubjectName = '';
    this.newGroupIds = [];
  }


  saveSubject(): void {
    if (this.editModeIndex !== null) {
      const subject = this.subjects[this.editModeIndex];
      this.subjectService.editSubject(subject.id, this.newSubjectName, this.teacherId, this.newGroupIds).subscribe(() => {
        this.loadSubjects();
        this.editModeIndex = null;
        this.newSubjectName = '';
        this.newGroupIds = [];
      });
    }
  }

  // Видалення предмета
  deleteSubject(index: number): void {
    const subjectId = this.subjects[index].id;
    this.subjectService.deleteSubject(subjectId).subscribe(() => {
      this.loadSubjects();
      this.activeMenuIndex = null;
    });
  }

  // Перехід на сторінку предмета
  openSubjectPage(subject: SubjectData, color: string): void {
    this.subjectService.currentSubjectId = subject.id;
    this.router.navigate(['/subject', subject.id], { queryParams: { color: color } });
  }

  loadGroupNames(subjects: SubjectData[]): void {
    subjects.forEach(subject => {
      const groupIds = subject.group_ids || [];

      this.groupNamesBySubjectId[subject.id] = [];

      groupIds.forEach(groupId => {
        this.groupService.getGroupById(groupId).subscribe(
          group => {
            this.groupNamesBySubjectId[subject.id].push(group.group_name);
          },
          error => console.error(`Помилка при завантаженні групи з ID ${groupId}:`, error)
        );
      });
    });
  }
}
