import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { WishlistService } from '../../../services/wishlist.service';
import { ToastComponent } from '../sharedComponents/toast/toast.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule,ToastComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  hovered = 0;
  showToast:any;
  toastarray :boolean[]=[];
  @Input() product: any;
  @Input() description: any;
  @Input() thumbnail: any;
  @Input() price: any;
  private readonly _activRoutes=inject(ActivatedRoute)
  private readonly  _WishlistService=inject(WishlistService)
  private readonly  _ToastService=inject(ToastService)
  isInWishlist=false;

    
  addToWishList(id:string): void {
    this._WishlistService.addToWishlist(id).subscribe({
      next: (res: any) => {
        console.log('Product added to wishlist!', res);
        this.isInWishlist=true;
        this._ToastService.show('success', 'Product added to wishlist!');
      },
      error: (err) => {
        console.error('Failed to add product to wishlist', err);
        if (err.error.message == 'Product already in wishlist') {
          this._WishlistService.deleteFromWishlist(id).subscribe({
            next: (res: any) => {
              this._ToastService.show(
                'error',
                'Product removed from wishlist!'
              );
               this.isInWishlist=false;
            },
          });
        }
         else this._ToastService.show('success', err.error.message);
      },
    });
  }
  

}
