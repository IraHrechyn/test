import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {SubjectData} from "../../../../models/subject-data.model";
import {GroupData} from "../../../../models/group-data.model";
import {GroupService} from "../../../../services/group.service";


interface Group {
  id: number;
  name: string;
}

@Component({
  selector: 'app-edit-subject-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './edit-subject-form.component.html',
  styleUrls: ['./edit-subject-form.component.css', '../../../../../../styles/buttons.css']
})

export class EditSubjectFormComponent {
  @Input() teacherId!: number;
  @Input() subjectId!: number;
  @Input() subjectName!: string;
  @Input() groupIds: number[] = [];
  @Output() formClosed = new EventEmitter<void>();
  @Output() subjectUpdated = new EventEmitter<{ subjectName: string, group_Ids: number[] }>();

  availableGroups: GroupData[] = [];

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadAvailableGroups();
  }

  loadAvailableGroups(): void {
    this.groupService.getGroupsByTeacherId(this.teacherId).subscribe(groups => {
      this.availableGroups = groups;
    });
  }

  addGroup(groupId: number): void {
    if (!this.groupIds.includes(groupId)) {
      this.groupIds.push(groupId);
    }
  }

  removeGroup(groupId: number): void {
    this.groupIds = this.groupIds.filter(id => id !== groupId);
  }

  saveChanges(): void {
    this.subjectUpdated.emit({ subjectName: this.subjectName, group_Ids: this.groupIds });
    this.formClosed.emit();
  }

  cancelEdit(): void {
    this.formClosed.emit();
  }
  toggleGroup(groupId: number, isCheck: boolean): void {
    if (isCheck) {
      if (this.groupIds.includes(groupId)) {
        this.groupIds = this.groupIds.filter(id => id !== groupId);
      } else {
        this.groupIds.push(groupId);
      }
    } else {
      if (this.groupIds.includes(groupId)) {
        this.groupIds = this.groupIds.filter(id => id !== groupId);
      }
    }
  }
}
