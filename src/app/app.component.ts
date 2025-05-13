import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import { NavbarComponent } from './components/sharedComponents/navbar/navbar.component';
import { FooterComponent } from './components/sharedComponents/footer/footer.component';
import { ToastComponent } from './components/sharedComponents/toast/toast.component';
import { CartService } from '../services/cart.service';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'velvoria';
  showNavAndFoot = true;
  showSideBar = false;
  mobileSidebarOpen: boolean = false;

  constructor(private router: Router, private cartService: CartService) {}
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        this.showSideBar = url.includes('/dashboard');
        this.showNavAndFoot =
          !url.includes('/login') && !url.includes('/register');
        if (this.showNavAndFoot) {
          this.cartService.loadCartFromBackend();
        }
      }
      // if (event instanceof NavigationEnd) {
      //   if (event.url.includes('/dashboard')) {
      //     this.showSideBar = true;
      //     this.showNavAndFoot=false
      //   } else if (
      //     event.url.includes('/register') ||
      //     event.url.includes('/login') ||
      //     event.url.includes('/dashboard')
      //   ) {
      //     this.showNavAndFoot = false;
      //   }
      // } else {
      //   this.showNavAndFoot = true;
      // }
    });
  }
}
