import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-products',
  imports: [CommonModule, ProductCardComponent, FormsModule],
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.css',
})
export class HomeProductsComponent {
  constructor(private router: Router) {}

  tabs = [
    { key: 'hot', label: 'HOT' },
    { key: 'arrivals', label: 'ARRIVALS' },
    { key: 'trending', label: 'TRENDING' },
    { key: 'sale', label: 'SALE OFF' },
  ];

  activeTab: string = 'hot';

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  products = [
    {
      title: 'Luxury Leather Sofa',
      description:
        'A comfortable and stylish leather sofa that enhances any living room  sofa that enhances any living room  ',
      thumbnail:
        'https://i.pinimg.com/736x/6a/bc/5e/6abc5ee32be8dd302c4bfdca33373c4b.jpg',
      price: '15000',
    },
    {
      title: 'Cozy Fabric Sofa',
      description:
        'A soft and cozy fabric sofa perfect for small spaces. It provides a co…',
      thumbnail:
        'https://i.pinimg.com/736x/8b/a7/f1/8ba7f1b9a4f3bc481bb55128d78cb13c.jpg',
      price: '12300',
    },
    {
      title: 'Classic Wooden Storage Unit',
      description:
        'A classic wooden storage unit that offers ample space to store your  sofa that enhances any living room  sofa that enhances any living room ',
      thumbnail:
        'https://i.pinimg.com/736x/a2/f6/e6/a2f6e6046ab723e7061dc0d3fdd9f059.jpg',
      price: '10300',
    },
    {
      title: 'Modern Storage Shelf',
      description:
        'A sleek, modern storage shelf that combines style with functionality.',
      thumbnail:
        'https://i.pinimg.com/736x/c7/bd/05/c7bd055105d2eba84e81b90038f5f8b9.jpg',
      price: '2300',
    },
    {
      title: 'Classic Wooden Storage Unit',
      description:
        'A classic wooden storage unit that offers ample space to store your  sofa that enhances any living room  sofa that enhances any living room ',
      thumbnail:
        'https://i.pinimg.com/736x/a2/f6/e6/a2f6e6046ab723e7061dc0d3fdd9f059.jpg',
      price: '10300',
    },
    {
      title: 'Cozy Fabric Sofa',
      description:
        'A soft and cozy fabric sofa perfect for small spaces. It provides a co…',
      thumbnail:
        'https://i.pinimg.com/736x/8b/a7/f1/8ba7f1b9a4f3bc481bb55128d78cb13c.jpg',
      price: '12300',
    },
    {
      title: 'Classic Wooden Storage Unit',
      description:
        'A classic wooden storage unit that offers ample space to store your  sofa that enhances any living room  sofa that enhances any living room ',
      thumbnail:
        'https://i.pinimg.com/736x/a2/f6/e6/a2f6e6046ab723e7061dc0d3fdd9f059.jpg',
      price: '10300',
    },
    {
      title: 'Modern Storage Shelf',
      description:
        'A sleek, modern storage shelf that combines style with functionality.',
      thumbnail:
        'https://i.pinimg.com/736x/c7/bd/05/c7bd055105d2eba84e81b90038f5f8b9.jpg',
      price: '2300',
    },
    {
      title: 'Cozy Fabric Sofa',
      description:
        'A soft and cozy fabric sofa perfect for small spaces. It provides a co…',
      thumbnail:
        'https://i.pinimg.com/736x/8b/a7/f1/8ba7f1b9a4f3bc481bb55128d78cb13c.jpg',
      price: '12300',
    },
  ];

  viewAllBtn(): void {
    this.router.navigate(['/products']);
  }
}
