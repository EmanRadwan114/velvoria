import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../services/wishlist.service';
import { ToastService } from '../../../services/toast.service';
import { BreadcrumbComponent } from '../sharedComponents/breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './wishlist.component.html',
  styles: ``,
})
export class WishlistComponent implements OnInit {
  WishList: any[] = [];

  constructor(
    private _WishlistService: WishlistService,
    private _ToastService: ToastService,
    private router: Router,
    private cartService: CartService
  ) {}


  ngOnInit(): void {
    this.getWishlist();
  }
  getWishlist() {
    this._WishlistService.getWishList().subscribe({
      next: (res: any) => {
        this.WishList = res.wishlist;

        console.log(' 🎇 wishlist!', res);
      },
      error: (e) => {
        console.error('Failed to get wishlist', e);
      },
    });
  }

  deleteFromWishlist(id: string) {
    this._WishlistService.deleteFromWishlist(id).subscribe({
      next: (res) => {
        this.getWishlist();
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
