import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
<<<<<<< HEAD
  imports: [RouterLink, CommonModule, FormsModule],
=======
  imports: [RouterLink, RouterLinkActive, CommonModule],
>>>>>>> 04067ed5976dcbdcf26fb8d35ab972a415dc3852
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  menuOpen = false;
<<<<<<< HEAD
  searchQuery = '';
  constructor(private router: Router) {}
  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery },
      });
    }
=======

  signOut() {
    localStorage.removeItem('user');
>>>>>>> 04067ed5976dcbdcf26fb8d35ab972a415dc3852
  }
}
