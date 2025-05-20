import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  // styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent {
  breadcrumb: string[] = [];

  constructor(private router: Router) {
    // Only continue with events where the navigation has successfully ended.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const path = this.router.url;
        const segments = path.split('/').filter((segment) => segment);

        if (segments.length === 0) {
          this.breadcrumb = ['Home']; // If no segments, default to 'Home'
        } else {
          this.breadcrumb = ['Home', ...segments.map(this.formatSegments)];
        }
      });
  }

  formatSegments(segment: string): string {
    let decoded = decodeURIComponent(segment);
    decoded = decoded.replace('?q=', ' for ');
    return decoded.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
