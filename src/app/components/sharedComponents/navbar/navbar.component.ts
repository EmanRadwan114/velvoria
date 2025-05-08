import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  menuOpen = false;
  searchQuery = '';
  constructor(private router: Router) {}
  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery },
      });
    }
  }
}
