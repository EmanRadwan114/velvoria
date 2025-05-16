import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../services/wishlist.service';
import { ToastService } from '../../../services/toast.service';

import { PaginationComponent } from '../sharedComponents/pagination/pagination.component';
import { BreadcrumbComponent } from '../sharedComponents/breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, BreadcrumbComponent],


@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, PaginationComponent,BreadcrumbComponent],
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
    private router: Router,
    private cartService: CartService
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
        console.error('Failed to del from wishlist', e);
      },
    });
  }

  addToCart(id: string) {
    if (localStorage.getItem('user')) {
      // const fullUrl = this.router.url;
      // let id = fullUrl.split('/')[2];
      this.cartService.addToCart({ productId: id }).subscribe({
        next: (res: any) => {
          this.cartService.setCartItems(res.data);
          this._ToastService.show('success', 'Product added to cart!');
        },
        error: (err) => {
          console.log(err.error.message);
        },
      });
    } else {
      this._ToastService.show('error', 'Login to add items to cart!');
    }
  }
}
