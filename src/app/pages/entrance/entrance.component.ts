import { Component } from '@angular/core';
import {HeaderComponent} from "./header/header.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'entrance',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink
  ],
  templateUrl: './entrance.component.html',
  styleUrls: ['../../styles/pages-title.css', '../../styles/container-border.css', './entrance.component.css', '../../styles/buttons.css']
})
export class EntranceComponent {

}
