import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../services/categories.service';
import { ReviewsComponent } from '../reviews/reviews.component';
import { WishlistService } from '../../../services/wishlist.service';
import { ToastService } from '../../../services/toast.service';
import { CartService } from '../../../services/cart.service';
import { RelatedProdComponent } from '../related-prod/related-prod.component';
import { ReviewsService } from '../../../services/reviews.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, ReviewsComponent, RelatedProdComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  // ActivatedRoute service return info of routing
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _reviewService = inject(ReviewsService);
  private _ToastService = inject(ToastService);

  constructor(private cartService: CartService, private router: Router) {}
  isInWishlist = false;
  mainImage: string = '';
  stock: number = 0;
  detailsProduct: any = {};
  categoryID: string = '';
  categoryName: string = '';
  category: any = {};
  productID: any = '';
  reviews: any = '';

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((p) => {
      this.productID = p.get('id')!;
      // 1) fetch product
      this._ProductsService.getSpecificProduct(this.productID).subscribe({
        next: (res: any) => {
          this.detailsProduct = res.data[0];
          this.categoryID = this.detailsProduct.categoryID;
          this.mainImage = this.detailsProduct.thumbnail;
          this.stock = this.detailsProduct.stock;
          // 2) fetch category
          this._CategoriesService
            .getSpecificCategry(this.categoryID)
            .subscribe({
              next: (catRes: any) => {
                this.categoryName = catRes.data.name;
                console.log('Category Name:', this.categoryName);
              },
              error: (err) => console.error('Category API Error:', err),
            });
        },
        error: (err) => console.error('Product API Error:', err),
      });
    });
  }

  //add to wishlist
  addToWishList(): void {
    this._WishlistService.addToWishlist(this.productID).subscribe({
      next: (res: any) => {
        this.isInWishlist = true;
        this._ToastService.show('success', 'Product added to wishlist!');
      },
      error: (err) => {
        if (err.error.message == 'Product already in wishlist') {
          this._WishlistService.deleteFromWishlist(this.productID).subscribe({
            next: (res: any) => {
              this.isInWishlist = false;
              this._ToastService.show(
                'error',
                'Product removed from wishlist!'
              );
            },
          });
        } else
          this._ToastService.show(
            'error',
            'Login To add Product To Your Wishlist'
          );
      },
    });
  }
  // add to cart
  addToCart() {
    if (localStorage.getItem('user')) {
      const fullUrl = this.router.url;
      let id = fullUrl.split('/')[2];
      if (this.stock > 0) {
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
        this._ToastService.show('error', 'Product is out of stock!');
      }
    } else {
      this._ToastService.show('error', 'Login to add items to cart!');
    }
  }
}
