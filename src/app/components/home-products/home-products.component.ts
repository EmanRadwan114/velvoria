import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { HomeProductCardComponent } from '../home-product-card/home-product-card.component';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-home-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HomeProductCardComponent,
    LoadingSPinnerComponent,
  ],
  templateUrl: './home-products.component.html',
  styleUrls: ['./home-products.component.css'],
})
export class HomeProductsComponent implements OnInit {
  isLoading = false;
  isInWishlistArr: string[] = [];
  products: any[] = [];

  tabs = [
    { key: 'hot', label: 'HOT' },
    { key: 'new arrival', label: 'ARRIVALS' },
    { key: 'trendy', label: 'TRENDING' },
  ];

  activeTab: string = 'hot';

  constructor(
    private router: Router,
    private prdServices: ProductsService,
    private _WishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.loadProductsByTab(this.activeTab);

    // First load wishlist, then fetch products
    if (localStorage.getItem('user')) {
      this._WishlistService.getAllWishList().subscribe({
        next: (res: any) => {
          this.isInWishlistArr = res.wishlist.map((item: any) => item._id);

          this.loadProductsByTab(this.activeTab);

          this.isLoading = false;
          console.log(this.isInWishlistArr);
        },
        error: (err) => {
          console.error('Error loading wishlist:', err);
          this.isLoading = false;
        },
      });
    }
  }

  loadProductsByTab(tabKey: string): void {
    this.prdServices.getProductByLabel(tabKey).subscribe({
      next: (res: any) => {
        this.products = res.data.map((item: any) => ({
          ...item,
          isInWishlist: this.isInWishlistArr.includes(item._id),
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      },
    });
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;

    this.loadProductsByTab(tab);
  }

  viewAllBtn(): void {
    this.router.navigate(['/furniture']);
  }
}
