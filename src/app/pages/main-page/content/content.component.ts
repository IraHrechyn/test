import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {DataService} from "../../registration/services/data.service";

@Component({
  selector: 'main-content',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css', '../../../styles/buttons.css']
})
export class ContentComponent {
  constructor(public data: DataService) {}

  setVisible(){
    this.data.entrance.visibleEntrance = true;
  }
}
