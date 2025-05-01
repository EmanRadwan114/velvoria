import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { DOTDComponent } from '../dotd/dotd.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, DOTDComponent],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {}
