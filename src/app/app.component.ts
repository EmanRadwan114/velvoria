import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "./components/sharedComponents/navbar/navbar.component";
import { FooterComponent } from "./components/sharedComponents/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'velvoria';
}
