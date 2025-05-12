import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-related-prod',
  templateUrl: './related-prod.component.html',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
})
export class RelatedProdComponent implements OnInit, OnDestroy {
  @Input() categoryName: any;
  @Input() productID: any;
  products: any[] = [];

  currentIndex = 0;
  cardsPerView = 4;

  constructor(private prdServices: ProductsService) {}

  ngOnInit(): void {
    this.setCardsPerView();

    this.prdServices.getProductByCategory(this.categoryName).subscribe({
      next: (res: any) => {
        this.products = res.data.filter((p: any) => p._id !== this.productID);
        this.currentIndex = 0;
      },
      error: (err) => console.log(err),
    });

    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setCardsPerView();
  };

  setCardsPerView() {
    const width = window.innerWidth;
    if (width >= 1200) {
      this.cardsPerView = 4;
    } else if (width >= 822) {
      this.cardsPerView = 3;
    } else if (width >= 548) {
      this.cardsPerView = 2;
    } else {
      this.cardsPerView = 1;
    }
  }

  getTransform(): string {
    const offset = this.currentIndex * 274; // 250px card + 2*12px margin
    return `translateX(-${offset}px)`;
  }

  scrollRight() {
    if (this.products.length <= this.cardsPerView) return;
    const maxIndex = this.products.length - this.cardsPerView;
    this.currentIndex =
      this.currentIndex >= maxIndex ? 0 : this.currentIndex + this.cardsPerView;
  }

  scrollLeft() {
    if (this.products.length <= this.cardsPerView) return;
    const maxIndex = this.products.length - this.cardsPerView;
    this.currentIndex =
      this.currentIndex <= 0 ? maxIndex : this.currentIndex - this.cardsPerView;
  }

  get disableArrows(): boolean {
    return this.products.length <= this.cardsPerView;
  }
}
