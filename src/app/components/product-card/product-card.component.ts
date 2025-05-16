import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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
export class ProductCardComponent {
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

   isInWishlistFunc(id: string) {
    this._WishlistService.getWishList().subscribe({
      next:(res:any)=>{
        this.isInWishlist = res.wishlist.some(
          (item: { productId: string }) => item.productId === id
        );
        console.log('isInWishlist', this.isInWishlist);

      }
      ,
      error: (err) => {
        console.error('Failed to get wishlist', err);
      },
    })
   }

  addToWishList(id: string): void {
    this._WishlistService.addToWishlist(id).subscribe({
      next: (res: any) => {
        this.isInWishlist = true;
        this._ToastService.show('success', 'Product added to wishlist!');
      },
      error: (err) => {
        if (err.error.message == 'Product already in wishlist') {
          this._WishlistService.deleteFromWishlist(id).subscribe({
            next: (res: any) => {
              this._ToastService.show(
                'error',
                'Product removed from wishlist!'
              );
              this.isInWishlist = false;
            },
          });
        } else
          this._ToastService.show(
            'error',
            'Login To Add Product to Your Wishlist!'
          );
      },
    });
  }
  addToCart(id: string) {
    if (this.product.stock > 0) {
      if (localStorage.getItem('user')) {
        this.cartService.addToCart({ productId: id }).subscribe({
          next: (res: any) => {
            // this.cartService.setCartItems(res.data);
            this.cartService.setTotal(res.totalItems);
            this.cartService.setSubtotal(res.subtotal);
            this._ToastService.show('success', 'Product added to cart!');
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
