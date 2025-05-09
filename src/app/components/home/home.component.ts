import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { DOTDComponent } from '../dotd/dotd.component';
import { ShopByCategoriesComponent } from '../shop-by-categories/shop-by-categories.component';
import { GoodVibesComponent } from '../good-vibes/good-vibes.component';
import { HomeProductsComponent } from '../home-products/home-products.component';
import { CouponComponent } from '../coupon/coupon.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    DOTDComponent,
    GoodVibesComponent,
    ShopByCategoriesComponent,
    HomeProductsComponent,
    CouponComponent,
  ],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {}
