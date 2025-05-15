import { CommonModule, ViewportScroller } from '@angular/common';
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
import { ScrollTopComponent } from './components/sharedComponents/scroll-top/scroll-top.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    SidebarComponent,
    CommonModule,
    ScrollTopComponent,
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
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      if (event instanceof NavigationEnd) {
        const url = event.url;
        this.showSideBar = url.includes('/dashboard');
        this.showNavAndFoot =
          !url.includes('/login') && !url.includes('/register');
        if (
          this.showNavAndFoot &&
          JSON.parse(localStorage.getItem('user') || '').role === 'user'
        ) {
          this.cartService.loadCartFromBackend().subscribe((cart) => {
            this.cartService.setCartItems(cart.data);
            this.cartService.setTotal(cart.totalItems);
            this.cartService.cartMetaSubject.next({
              currentPage: cart.currentPage,
              totalPages: cart.totalPages,
            });
            this.cartService.setSubtotal(cart.subtotal);
          });
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
