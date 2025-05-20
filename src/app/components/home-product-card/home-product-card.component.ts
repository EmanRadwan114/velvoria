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
  private readonly cartService = inject(CartService);
  private readonly _ToastService = inject(ToastService);

  ngOnInit(): void {
    this.isInWishlist = this.product?.isInWishlist || false;
  }

  addToWishList(productId: string): void {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: () => {
        this.isInWishlist = true;
        this._ToastService.show('success', 'Product added to wishlist!');
      },
      error: (err) => {
        if (err.error.message === 'Product already in wishlist') {
          this.wishlistService.deleteFromWishlist(productId).subscribe({
            next: () => {
              this._ToastService.show(
                'success',
                'Product removed from wishlist!'
              );
              this.isInWishlist = false;
            },
          });
        } else {
          this._ToastService.show(
            'error',
            'Login To Add Product to Your Wishlist!'
          );
        }
      },
    });
  }

  addToCart(id: string) {
    if (this.product.stock > 0) {
      if (localStorage.getItem('user')) {
        this.cartService.addToCart({ productId: id }).subscribe({
          next: (res: any) => {
            this.cartService.setTotal(res.totalItems);
            this.cartService.setSubtotal(res.subtotal);
            this._ToastService.show('success', 'Product added to cart!');
            this.wishlistService.deleteFromWishlist(id).subscribe({
              next: () => {
                this.isInWishlist = false;
              },
            });
          },
          error: (err) => {
            console.log(err.error.message);
          },
        });
      } else {
        this._ToastService.show('error', 'Login to add items to cart!');
      }
    } else {
      this._ToastService.show('error', 'Product is out of stock!');
    }
  }
}
