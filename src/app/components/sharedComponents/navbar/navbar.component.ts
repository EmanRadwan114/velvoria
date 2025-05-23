import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../../services/auth.service';
import { CartService } from '../../../../services/cart.service';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, FormsModule, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  menuOpen: boolean = false;
  isLoggedIn: boolean = false;
  furnitureMenuOpen: boolean = false;

  user: any;
  searchQuery = '';
  totalItems = 0;

  isProfileMenuShown = false;

  constructor(
    protected router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService
  ) {}
  ngOnInit() {
    this.authService.isLoggedIn.subscribe((status) => {
      this.isLoggedIn = status;
      this.user = status
        ? JSON.parse(localStorage.getItem('user') || 'null')
        : 'null';
    });

    if (this.isLoggedIn) {
      this.cartService.totalItems.subscribe((total: any) => {
        this.totalItems = total;
      });
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuShown = !this.isProfileMenuShown;
  }

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery },
      });
    }
  }

  signOut() {
    this.http
      .post(`${environment.backUrl}/auth/logout`, null, {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          localStorage.removeItem('user');
          this.authService.notifyLogout();
          this.router.navigate(['/home']);
        },
      });
  }
}
