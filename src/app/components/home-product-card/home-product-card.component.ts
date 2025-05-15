import { Component, Input, OnInit, inject } from '@angular/core';
import { WishlistService } from '../../../services/wishlist.service';
import { ToastService } from '../../../services/toast.service';
import { CartService } from '../../../services/cart.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-product-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './home-product-card.component.html',
})
export class HomeProductCardComponent implements OnInit {
  @Input() product: any;
  @Input() isLargeCard: boolean = false;
  @Input() isInWishlist: boolean = false;

  showToast: any;
  showToastCart: any;
  hovered = 0;

  private readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly cartService = inject(CartService);

  ngOnInit(): void {
    this.isInWishlist = this.product?.isInWishlist || false;
  }

  addToWishList(productId: string): void {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: () => {
        this.isInWishlist = true;
        this.toastService.show('success', 'Product added to wishlist!');
      },
      error: (err) => {
        if (err.error.message === 'Product already in wishlist') {
          this.wishlistService.deleteFromWishlist(productId).subscribe({
            next: () => {
              this.isInWishlist = false;
              this.toastService.show('error', 'Product removed from wishlist!');
            },
          });
        } else {
          this.toastService.show('error', err.error.message);
        }
      },
    });
  }

  addToCart(productId: string): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.cartService.addToCart({ productId }).subscribe({
        next: (res: any) => {
          this.cartService.setCartItems(res.data);
          this.toastService.show('success', 'Product added to cart!');
        },
        error: (err) => {
          this.toastService.show('error', err.error.message);
        },
      });
    } else {
      this.toastService.show('error', 'Login to add items to cart!');
    }
  }
}
