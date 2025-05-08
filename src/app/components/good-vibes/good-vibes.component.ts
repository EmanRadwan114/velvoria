import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-good-vibes',
  imports: [CommonModule],
  templateUrl: './good-vibes.component.html',
  styleUrl: './good-vibes.component.css'
})
export class GoodVibesComponent {
  showCard1 = false;
  showCard2 = false;
  showCard3 = false;
}
