import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumb: string[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Only continue with events where the navigation has successfully ended.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildBreadcrumb();
        // Force change detection to update the view
        this.cdr.detectChanges();
      });
  }

  buildBreadcrumb() {
    const path = this.router.url;
    const segments = path.split('/').filter((segment) => segment);

    if (segments.length === 0) {
      this.breadcrumb = ['Home']; // If no segments, default to 'Home'
    } else {
      this.breadcrumb = ['Home', ...segments.map(this.formatSegments)];
    }

    console.log('Breadcrumb:', this.breadcrumb); // Debugging breadcrumb
  }

  formatSegments(segment: string): string {
    const decoded = decodeURIComponent(segment);
    return decoded.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
