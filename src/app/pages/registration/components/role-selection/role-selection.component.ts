import { Component } from '@angular/core';
import {HeaderComponent} from "../../../entrance/header/header.component";
import {Role} from "../../model/role.model";
import {RouterLink} from "@angular/router";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'role-selection',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink
  ],
  templateUrl: './role-selection.component.html',
  styleUrls: ['../../../../styles/buttons.css', '../../../../styles/container-border.css', '../../../../styles/pages-title.css', './role-selection.component.css']
})
export class RoleSelectionComponent {
  roles: Role[] = [
    { id: 'teacher', name: 'Викладач' },
    { id: 'student', name: 'Студент' }
  ];

  constructor(public data: DataService) {
  }

  getRoleById(roleId: string): Role | undefined {
    return this.roles.find(role => role.id === roleId);
  }

  selectRole(roleId: string) {
    const role = this.getRoleById(roleId);
    if (role) {
      this.data.role.selectedRole = role;
      console.log( this.data.role.selectedRole);
    }
  }
}
