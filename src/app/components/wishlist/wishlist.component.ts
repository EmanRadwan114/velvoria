import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../services/wishlist.service';
import { ToastService } from '../../../services/toast.service';
import { BreadcrumbComponent } from '../sharedComponents/breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, BreadcrumbComponent, LoadingSPinnerComponent],
  templateUrl: './wishlist.component.html',
  styles: ``,
})
export class WishlistComponent implements OnInit {
  WishList: any[] = [];
  totalPages: number = 1;
  currentPage: number = 1;

  isLoggedIn: boolean = false;
  user: any;

  isLoading: boolean = false;

  products!: {}[];

  constructor(
    private _WishlistService: WishlistService,
    private productsService: ProductsService,
    private _ToastService: ToastService,
    public router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((status) => {
      this.isLoggedIn = status;
      this.user = status
        ? JSON.parse(localStorage.getItem('user') || 'null')
        : 'null';
    });

    this.getWishlist(this.currentPage);
  }

  getWishlist(page = 1) {
    this.isLoading = true;
    this._WishlistService.getWishList(page).subscribe({
      next: (res: any) => {
        this.WishList = res.wishlist;
        this.totalPages = res.totalPages;
        this.isLoading = false;
      },
      error: (e) => {
        console.error('Failed to get wishlist', e);
        this.isLoading = false;
      },
    });
  }
  changePage(page: number) {
    this.currentPage = page;
    this.getWishlist(this.currentPage);
  }

  deleteFromWishlist(id: string) {
    this.isLoading = true;
    this._WishlistService.deleteFromWishlist(id).subscribe({
      next: (res) => {
        this.getWishlist(this.currentPage);
        this.isLoading = false;
        this._ToastService.show('success', 'Product removed from wishlist!');
      },
      error: (e) => {
        this.isLoading = false;
        console.error('Failed to del from wishlist', e);
      },
    });
  }

  addToCart(id: string) {
    this.isLoading = true;
    this.cartService.addToCart({ productId: id }).subscribe({
      next: (res: any) => {
        this.cartService.setTotal(res.totalItems);
        this.cartService.setSubtotal(res.subtotal);
        this._ToastService.show('success', 'Product added to cart!');
        this.deleteFromWishlist(id);
        this.isLoading = false;
      },
      error: (err) => {
        this._ToastService.show('error', err.error.message);
        this.isLoading = false;
      },
    });
  }
  clearWishlist() {
    this.isLoading = true;
    this._WishlistService.clearWishlist().subscribe({
      next: (res) => {
        this.isLoading = false;
        this._ToastService.show('success', 'Wishlist Cleared Successfully!');

        this._WishlistService.getWishList(1).subscribe({
          next: (res: any) => {
            this.isLoading = true;
            this.WishList = res.wishlist;
            this.totalPages = res.totalPages;
            this.isLoading = false;
          },
          error: (e) => {
            console.error('Failed to get wishlist', e);
          },
        });
      },
      error: (e) => {
        this.isLoading = false;
        console.error('Failed to del from wishlist', e);
      },
    });
  }
}
