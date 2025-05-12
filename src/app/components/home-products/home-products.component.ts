import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-home-products',
  imports: [CommonModule, ProductCardComponent, FormsModule],
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.css',
})
export class HomeProductsComponent implements OnInit {
  constructor(private router: Router, private prdServices: ProductsService) {}

  ////! there is no 'SALE' label so i removed it temp

  tabs = [
    { key: 'hot', label: 'HOT' },
    { key: 'new arrival', label: 'ARRIVALS' },
    { key: 'trendy', label: 'TRENDING' },
    // { key: 'hot', label: 'SALE OFF' },
  ];

  activeTab: string = 'hot';

  // products: object[] = [];
  filteredList: object[] = [];

  ngOnInit(): void {
    this.prdServices.getProductByLabel(this.activeTab).subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.filteredList = [...this.products];
      },
      error: (err: any) => console.log(err),
    });
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;

    this.prdServices.getProductByLabel(this.activeTab).subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.filteredList = [...this.products];
      },
      error: (err) => console.log(err),
    });
  }

  viewAllBtn(): void {
    this.router.navigate(['/furnitures']);
  }

  products = [
    {
      _id: '1',
      title: 'Diamond Halo Stud Massa',
      price: 450,
      rating: 0,
      avgRating: 0,
      numberOfReviews: 0,
      thumbnail:
        'https://media.istockphoto.com/id/505973586/photo/grey-armchair-isolated.jpg?s=612x612&w=0&k=20&c=8WHCjWGHpqEvY5O53drcHcclWRF3ZgvLfRIGx_iv0As=',
      label: ['trendy'],
    },
    {
      _id: '2',
      title: 'Diamond Halo Stud Monte',
      price: 236,
      rating: 0,
      avgRating: 0,
      numberOfReviews: 0,
      thumbnail:
        'https://media.istockphoto.com/id/133884817/photo/antique-chair.jpg?s=612x612&w=0&k=20&c=MzlVfjgBG9T6bMkKfTswJYyN0rSmq1nORd49W516WCo=',
      label: ['hot'],
    },
    {
      _id: '3',
      title: 'Acamond Halo Stud Conse',
      price: 198,
      rating: 5,
      avgRating: 5,
      numberOfReviews: 12,
      thumbnail:
        'https://media.istockphoto.com/id/154926620/photo/armchair.jpg?s=612x612&w=0&k=20&c=lLR_lNVKwo2eiEl-i5QZlCuPWbu8JD06ZdBEmbGeYNI=',
      label: ['new'],
    },
    {
      _id: '4',
      title: 'Viamond Halo Stud Donec',
      price: 409,
      rating: 4,
      avgRating: 4,
      numberOfReviews: 8,
      thumbnail:
        'https://media.istockphoto.com/id/176959132/photo/classical-interior-with-an-armchair.jpg?s=612x612&w=0&k=20&c=kOGIdnVTHkavahAVP0a10p57RH3DOWF4UxesGO7M2io=',
      label: [],
    },
    {
      _id: '1',
      title: 'Diamond Halo Stud Massa',
      price: 450,
      rating: 0,
      avgRating: 0,
      numberOfReviews: 0,
      thumbnail:
        'https://media.istockphoto.com/id/505973586/photo/grey-armchair-isolated.jpg?s=612x612&w=0&k=20&c=8WHCjWGHpqEvY5O53drcHcclWRF3ZgvLfRIGx_iv0As=',
      label: ['trendy'],
    },
    {
      _id: '2',
      title: 'Diamond Halo Stud Monte',
      price: 236,
      rating: 0,
      avgRating: 0,
      numberOfReviews: 0,
      thumbnail:
        'https://media.istockphoto.com/id/133884817/photo/antique-chair.jpg?s=612x612&w=0&k=20&c=MzlVfjgBG9T6bMkKfTswJYyN0rSmq1nORd49W516WCo=',
      label: ['hot'],
    },
    {
      _id: '3',
      title: 'Acamond Halo Stud Conse',
      price: 198,
      rating: 5,
      avgRating: 5,
      numberOfReviews: 12,
      thumbnail:
        'https://media.istockphoto.com/id/154926620/photo/armchair.jpg?s=612x612&w=0&k=20&c=lLR_lNVKwo2eiEl-i5QZlCuPWbu8JD06ZdBEmbGeYNI=',
      label: ['new', 'trendy'],
    },
    {
      _id: '4',
      title: 'Viamond Halo Stud Donec',
      price: 409,
      rating: 4,
      avgRating: 4,
      numberOfReviews: 8,
      thumbnail:
        'https://media.istockphoto.com/id/176959132/photo/classical-interior-with-an-armchair.jpg?s=612x612&w=0&k=20&c=kOGIdnVTHkavahAVP0a10p57RH3DOWF4UxesGO7M2io=',
      label: [],
    },
  ];
}
