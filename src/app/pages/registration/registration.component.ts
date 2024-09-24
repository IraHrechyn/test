import { Component } from '@angular/core';
import {HeaderComponent} from "../entrance/header/header.component";
import {RoleSelectionComponent} from "./components/role-selection/role-selection.component";

@Component({
  selector: 'registration',
  standalone: true,
  imports: [
    HeaderComponent,
    RoleSelectionComponent
  ],
  templateUrl: './registration.component.html',
  styleUrl:  './registration.component.css'
})
export class RegistrationComponent {
}
