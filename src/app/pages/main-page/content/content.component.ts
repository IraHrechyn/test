import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

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

}
