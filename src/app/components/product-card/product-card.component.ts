import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WishlistService } from '../../../services/wishlist.service';
import { ToastComponent } from '../sharedComponents/toast/toast.component';
import { ToastService } from '../../../services/toast.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule, ToastComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnInit {
  hovered = 0;
  showToast: any;
  showToastCart: any;
  toastarray: boolean[] = [];
  @Input() product: any;
  @Input() description: any;
  @Input() thumbnail: any;
  @Input() price: any;
  private readonly _activRoutes = inject(ActivatedRoute);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _ToastService = inject(ToastService);
  isInWishlist = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.isInWishlist = this.product?.isInWishlist || false;
  }

  addToWishList(productId: string): void {
    if (localStorage.getItem('user')) {
      this._WishlistService.addToWishlist(productId).subscribe({
        next: () => {
          this.isInWishlist = true;
          this._ToastService.show('success', 'Product added to wishlist!');
        },
        error: (err) => {
          if (err.error.message === 'Product already in wishlist') {
            this._WishlistService.deleteFromWishlist(productId).subscribe({
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
  }

  addToCart(id: string) {
    if (this.product.stock > 0) {
      if (localStorage.getItem('user')) {
        this.cartService.addToCart({ productId: id }).subscribe({
          next: (res: any) => {
            this.cartService.setTotal(res.totalItems);
            this.cartService.setSubtotal(res.subtotal);
            this._ToastService.show('success', 'Product added to cart!');
            this._WishlistService.deleteFromWishlist(id).subscribe({
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
