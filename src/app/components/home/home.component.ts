import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { DOTDComponent } from '../dotd/dotd.component';
import { GoodVibesComponent } from "../good-vibes/good-vibes.component";

@Component({
  selector: 'app-home',
  imports: [HeroComponent, DOTDComponent, GoodVibesComponent],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {}
