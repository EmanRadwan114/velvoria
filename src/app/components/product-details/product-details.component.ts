import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../services/categories.service';
import { ReviewsComponent } from '../reviews/reviews.component';
import { WishlistService } from '../../../services/wishlist.service';
import { ToastComponent } from '../sharedComponents/toast/toast.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, ReviewsComponent, ToastComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  // ActivatedRoute service return info of routing
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _WishlistService = inject(WishlistService);
  private _ToastService = inject(ToastService);

  mainImage: string = '';
  detailsProduct: any = {};
  categoryID: string = '';
  categoryName: string = '';
  category: any = {};
  productID: any;

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        this.productID = p.get('id');

        // Call API For Specific Product
        this._ProductsService.getSpecificProduct(this.productID).subscribe({
          next: (res: any) => {
            console.log(res.data);
            this.detailsProduct = res.data[0];
            this.mainImage = this.detailsProduct.thumbnail;
            this.categoryID = this.detailsProduct.categoryID;
          },
          error: (err) => {
            console.log(err);
          },
        });
        // get category name
        this._CategoriesService.getSpecificCategry(this.categoryID).subscribe({
          next: (res: any) => {
            this.category = res.data[0];
            this.categoryName = this.category.name;
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
    });
  }

  //add to wishlist
  isInWishlist=false;
  addToWishList(): void {
    this._WishlistService.addToWishlist(this.productID).subscribe({
      next: (res: any) => {
        console.log('Product added to wishlist!', res);
         this.isInWishlist=true;
        this._ToastService.show('success', 'Product added to wishlist!');
      },
      error: (err) => {
        console.error('Failed to add product to wishlist', err);
        if (err.error.message == 'Product already in wishlist') {
          this._WishlistService.deleteFromWishlist(this.productID).subscribe({
            next: (res: any) => {
               this.isInWishlist=false;
              this._ToastService.show(
                'error',
                'Product removed from wishlist!'
              );
            },
          });
        }
         else this._ToastService.show('success', err.error.message);
      },
    });
  }
}
