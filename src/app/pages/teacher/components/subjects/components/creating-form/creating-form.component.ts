import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {GroupData} from "../../../../models/group-data.model";
import {GroupService} from "../../../../services/group.service";

@Component({
  selector: 'subject-creating-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './creating-form.component.html',
  styleUrls: ['./creating-form.component.css', '../../../../../../styles/buttons.css']
})
export class CreatingFormComponent implements OnInit{
  @Input() teacherId!: number; // Передається id викладача
  @Output() subjectCreated = new EventEmitter<{ name: string, groupIds: number[] }>();
  @Output() formClosed = new EventEmitter<void>();

  subjectName: string = '';
  groups: GroupData[] = []; // Динамічно завантажені групи
  selectedGroups: number[] = [];
  step: 'input' | 'confirmation' | 'addGroups' = 'input';

  constructor(private groupService: GroupService) {}

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    if (this.teacherId) {
      this.groupService.getGroupsByTeacherId(this.teacherId).subscribe({
        next: (data) => {
          this.groups = data;
        },
        error: (err) => console.error('Помилка завантаження груп:', err)
      });
    }
  }

  confirm() {
    if (this.subjectName) {
      this.step = 'confirmation';
    }
  }

  getGroupName(groupId: number): string | undefined {
    return this.groups.find(group => group.id === groupId)?.group_name;
  }


  selectYes() {
    this.step = 'addGroups';
  }

  selectNo() {
    this.saveSubject([]);
  }

  addGroup(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = +target.value;
    if (selectedValue && !this.selectedGroups.includes(selectedValue)) {
      this.selectedGroups.push(selectedValue);
    }
  }

  removeGroup(groupId: number) {
    this.selectedGroups = this.selectedGroups.filter(id => id !== groupId);
  }

  saveSubject(groupIds: number[]) {
    this.subjectCreated.emit({ name: this.subjectName, groupIds });
    this.closeForm();
  }

  saveWithSelectedGroups() {
    this.saveSubject(this.selectedGroups);
  }

  cancel() {
    this.closeForm();
  }

  private closeForm() {
    this.formClosed.emit();
  }
}
