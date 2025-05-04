import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { DOTDComponent } from '../dotd/dotd.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, DOTDComponent, ProfileComponent],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {}
