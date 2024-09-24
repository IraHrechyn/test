import { Component } from '@angular/core';
import {HeaderComponent} from "./header/header.component";
import {ContentComponent} from "./content/content.component";

@Component({
  selector: 'main-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ContentComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
