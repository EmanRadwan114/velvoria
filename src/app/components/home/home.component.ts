import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { DOTDComponent } from '../dotd/dotd.component';
import { ShopByCategoriesComponent } from "../shop-by-categories/shop-by-categories.component";
import { GoodVibesComponent } from "../good-vibes/good-vibes.component";

@Component({
  selector: 'app-home',
  imports: [HeroComponent, DOTDComponent, GoodVibesComponent,ShopByCategoriesComponent],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {}
