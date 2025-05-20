import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { FilterationComponent } from '../filteration/filteration.component';
import { BreadcrumbComponent } from '../sharedComponents/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-products',
  imports: [
    ProductCardComponent,
    CommonModule,
    FilterationComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.css',
})
export class ProductsComponent {
  @Input() productsList: object[] = [];
  @Output() filterChanged = new EventEmitter<any>();

  onFilterChange(filterQuery: any): void {
    this.filterChanged.emit(filterQuery);
  }
}
