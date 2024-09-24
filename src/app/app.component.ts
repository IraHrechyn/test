import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PagesComponent} from "./pages/pages.component";
import {MainPageComponent} from "./pages/main-page/main-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, PagesComponent, MainPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'edutest';
}
