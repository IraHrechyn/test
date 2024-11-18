import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {SubjectData} from "../../models/subject-data.model";
import {SubjectService} from "../../services/subject.service";
import {Router} from "@angular/router";
import {CreatingFormComponent} from "./components/creating-form/creating-form.component";
import {GroupData} from "../../models/group-data.model";
import {GroupService} from "../../services/group.service";
import {StudentData} from "../../models/student-data.model";
import {GroupDetailsComponent} from "./components/group-details/group-details.component";
import {TeacherService} from "../../services/teacher.service";
import {StudentService} from "../../services/student.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CreatingFormComponent,
    FormsModule,
    CommonModule,
    CreatingFormComponent,
    GroupDetailsComponent
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent  implements OnInit, OnChanges {
  @Input() searchQuery: string = '';
  @Input() teacherId!: number ;

  showForm: boolean = false;
  students: StudentData[] = [];
  groups: GroupData[] = [];
  pastelColors: string[] = [
    '#bcb0b7', '#ead0c6', '#849E8A', '#89A8AE', '#DBD3D1', '#A56266', '#bcb0b7', '#d9e3cb', '#cac7d8'
  ];

  showDetails: boolean = false;
  selectedGroupId: number | null = null;
  activeMenuIndex: number | null = null;
  editModeIndex: number | null = null;
  newGroupName: string = '';

  studentName: string = "";

  constructor(
    private groupService: GroupService,
    private router: Router,
    private teacherService: TeacherService,
    public studentService: StudentService
  ) {}

  ngOnInit() {
    this.loadGroups();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['teacherId'] || changes['searchQuery']) {
      this.filterGroups();
    }
  }


  loadGroups() {
    this.groupService.getGroupsByTeacherId(this.teacherId).subscribe(groups => {
      this.groups = groups;
      this.filterGroups();
    });
  }

  onGroupDeleted(deletedGroupId: number) {
    this.groups = this.groups.filter(group => group.id !== deletedGroupId);
  }

  filterGroups(): void {
    const searchQueryLower = this.searchQuery.toLowerCase();
    this.groups = this.groups.filter(group =>
      group.group_name.toLowerCase().includes(searchQueryLower)
    );
  }

  addGroup() {
    this.showForm = true;
  }

  onCreated(data: { groupName: string, selectedStudents: StudentData[] }) {
    this.groupService.addGroupWithStudents(data.groupName, this.teacherId, data.selectedStudents).subscribe(() => {
      this.loadGroups(); // Оновлення списку груп
      this.showForm = false;
    });
  }

  closeForm() {
    this.showForm = false;
  }

  getBackgroundColor(index: number): string {
    return this.pastelColors[index % this.pastelColors.length];
  }

  toggleMenu(index: number) {
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }

  editGroup(index: number) {
    this.editModeIndex = index;
    this.newGroupName = this.groups[index].group_name;
    this.activeMenuIndex = null;
  }

  // loadStudents(groupId: number) {
  //   // Метод для завантаження студентів по ID групи
  //   this.groupService.getStudentsByGroupId(groupId).subscribe(students => {
  //     this.students = students;
  //     console.log(this.students);
  //   });
  // }

  saveGroup() {
    if (this.editModeIndex !== null) {
      const groupToUpdate = { ...this.groups[this.editModeIndex], group_name: this.newGroupName };
      this.groupService.editGroup(groupToUpdate.id, groupToUpdate).subscribe(() => {
        this.loadGroups(); // Оновлюємо список груп
        this.cancelEdit();
      });
    }
  }

  cancelEdit() {
    this.editModeIndex = null;
    this.newGroupName = '';
  }

  // deleteGroup(index: number) {
  //   const groupId = this.groups[index].id;
  //   this.groupService.deleteGroup(groupId, this.teacherId).subscribe(() => {
  //     this.loadGroups();  // Reload groups after deletion
  //     this.activeMenuIndex = null;
  //   });
  // }

  openGroupPage(group: GroupData) {
    this.selectedGroupId = group.id;
    this.showDetails = true;
  }
  closeGroupDetails() {
    this.showDetails = false;
    this.selectedGroupId = null;
    this.loadGroups();
  }
}


