import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../services/wishlist.service';
import { ToastService } from '../../../services/toast.service';

import { PaginationComponent } from '../sharedComponents/pagination/pagination.component';
import { BreadcrumbComponent } from '../sharedComponents/breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
<<<<<<< HEAD
  imports: [CommonModule, BreadcrumbComponent],
=======
  imports: [CommonModule, PaginationComponent,BreadcrumbComponent],
>>>>>>> d6f11d1ed70f3233afb96fadf5f3417e65be58fc
  templateUrl: './wishlist.component.html',
  styles: ``,
})
export class WishlistComponent implements OnInit {
  WishList: any[] = [];
  totalPages: number = 1;
  currentPage: number = 1;

  constructor(
    private _WishlistService: WishlistService,
    private _ToastService: ToastService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getWishlist(this.currentPage);
  }
  getWishlist(page = 1) {
    this._WishlistService.getWishList(page).subscribe({
      next: (res: any) => {
        this.WishList = res.wishlist;
        this.totalPages = res.totalPages;
        console.log(' 🎇 wishlist!', res);
      },
      error: (e) => {
        console.error('Failed to get wishlist', e);
      },
    });
  }
  changePage(page: number) {
    this.currentPage = page;
    this.getWishlist(this.currentPage);
  }

  deleteFromWishlist(id: string) {
    this._WishlistService.deleteFromWishlist(id).subscribe({
      next: (res) => {
        this.getWishlist(this.currentPage);
        this._ToastService.show('error', 'Product removed from wishlist!');
        console.log('deleted from wishlist!', res);
      },
      error: (e) => {
        console.error('Failed to add to wishlist', e);
      },
    });
  }
}
