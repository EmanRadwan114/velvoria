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
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  isLoggedIn: boolean = false;
  user: any;
  searchQuery = '';
  totalItems = 0;
  constructor(
    protected router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService
  ) {}
  ngOnInit() {
    this.authService.isLoggedIn.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    if (this.user) {
      this.cartService.totalItems.subscribe((total: any) => {
        this.totalItems = total;
      });
    }
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
          this.router.navigate(['/login/user']);
        },
      });
  }
}
