import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  sidenav: boolean = true;
  isLoggedIn: boolean = false;
  user: any;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }
  closeSidenav() {
    this.sidenav = false;
  }

  logout() {
    localStorage.removeItem('user');
  }
}
