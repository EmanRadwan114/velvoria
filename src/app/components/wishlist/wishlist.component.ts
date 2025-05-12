import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styles: ``
})
export class WishlistComponent {
   wishList=[
    {
      url:"https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg",
      title:"Earthen Bottle",
      price:230,
    },
    {
      url:"https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg",
      title:"Earthen Bottle",
      price:430,
    },
    {
      url:"https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg",
      title:"Earthen Bottle",
      price:430,
    },
   ]
}
