import { Component } from '@angular/core';
import {MainPageComponent} from "./main-page/main-page.component";

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    MainPageComponent
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent {

}
