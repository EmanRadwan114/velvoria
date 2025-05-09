import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { DOTDComponent } from '../dotd/dotd.component';
import { ShopByCategoriesComponent } from '../shop-by-categories/shop-by-categories.component';
import { GoodVibesComponent } from '../good-vibes/good-vibes.component';
import { CategoriesService } from '../../../services/categories.service';
import { HomeProductsComponent } from '../home-products/home-products.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    DOTDComponent,
    GoodVibesComponent,
    ShopByCategoriesComponent,
    HomeProductsComponent,
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
      console.log(res.data)
      this.categoriesList = res.data;
      console.log(this.categoriesList)
        },
    error: (err) => {
      console.log(err);
    },
  });
}
  
}
