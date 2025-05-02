import { Component } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './products.component.html',
  styles: ``,
})
export class ProductsComponent {
  products = [
    {
      title: 'Luxury Leather Sofa',
      description:
        'A comfortable and stylish leather sofa that enhances any living room  sofa that enhances any living room  ',
      thumbnail:
        'https://img.freepik.com/free-psd/sofa-isolated-transparent-background_191095-10348.jpg?uid=R194767243&ga=GA1.1.1957810835.1742649565&semt=ais_hybrid&w=740',
      price: '15000',
    },
    {
      title: 'Cozy Fabric Sofa',
      description:
        'A soft and cozy fabric sofa perfect for small spaces. It provides a co…',
      thumbnail:
        'https://img.freepik.com/free-psd/midcentury-modern-grey-sofa-with-wooden-frame_632498-25556.jpg?ga=GA1.1.1738893645.1745595705&semt=ais_hybrid&w=740',
      price: '12300',
    },
    {
      title: 'Classic Wooden Storage Unit',
      description:
        'A classic wooden storage unit that offers ample space to store your  sofa that enhances any living room  sofa that enhances any living room ',
      thumbnail:
        'https://img.freepik.com/free-psd/rustic-wooden-chest-drawers-threedrawer-wooden-storage-unit_191095-86149.jpg?uid=R194767243&ga=GA1.1.1957810835.1742649565&semt=ais_hybrid&w=740',
      price: '10300',
    },
    {
      title: 'Modern Storage Shelf',
      description:
        'A sleek, modern storage shelf that combines style with functionality.',
      thumbnail:
        'https://img.freepik.com/free-vector/white-supermarket-shelves_134830-694.jpg?ga=GA1.1.1738893645.1745595705&semt=ais_hybrid&w=740',
      price: '2300',
    },
  ];
}
