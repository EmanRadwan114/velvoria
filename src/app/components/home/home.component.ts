import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { DOTDComponent } from '../dotd/dotd.component';
import { ShopByCategoriesComponent } from '../shop-by-categories/shop-by-categories.component';
import { GoodVibesComponent } from '../good-vibes/good-vibes.component';
import { CategoriesService } from '../../../services/categories.service';
import { HomeProductsComponent } from '../home-products/home-products.component';
import { AppFeaturesComponent } from '../app-features/app-features.component';
import { DiscountSectionHomeComponent } from '../discount-section-home/discount-section-home.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    GoodVibesComponent,
    ShopByCategoriesComponent,
    HomeProductsComponent,
    AppFeaturesComponent,
    DiscountSectionHomeComponent,
  ],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent implements OnInit {
  categoriesList: object[] = [];
  constructor(private categoryServices: CategoriesService) {}
  ngOnInit(): void {
    this.categoryServices.getAllCategories().subscribe({
      next: (res: any) => {
        this.categoriesList = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
