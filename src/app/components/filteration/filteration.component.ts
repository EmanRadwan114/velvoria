import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filteration',
  imports: [FormsModule],
  templateUrl: './filteration.component.html',
  styleUrl: './filteration.component.css',
})
export class FilterationComponent {

  price = 2500;
  minPrice = 200;
  maxPrice = 30000;
}
