import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { NavbarComponent } from './components/sharedComponents/navbar/navbar.component';
import { FooterComponent } from './components/sharedComponents/footer/footer.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'velvoria';
  showNavAndFoot = true;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/register') || event.url.includes('/login') || event.url.includes('/dashboard') )   {
          this.showNavAndFoot = false;
        }
      } else {
        this.showNavAndFoot = true;
      }
    });
  }
}
