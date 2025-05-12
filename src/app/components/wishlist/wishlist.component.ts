import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../services/wishlist.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styles: ``,
})
export class WishlistComponent implements OnInit {
  WishList: any[] = [];

  constructor(
    private _WishlistService: WishlistService,
    private _ToastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getWishlist();
  }
  getWishlist() {
    this._WishlistService.getWishList().subscribe({
      next: (res: any) => {
        this.WishList = res.wishlist;

        console.log(' 🎇 wishlist!', res);
      },
      error: (e) => {
        console.error('Failed to get wishlist', e);
      },
    });
  }

  deleteFromWishlist(id: string) {
    this._WishlistService.deleteFromWishlist(id).subscribe({
      next: (res) => {
        this.getWishlist();
        this._ToastService.show('error', 'Product removed from wishlist!');
        console.log('deleted from wishlist!', res);
      },
      error: (e) => {
        console.error('Failed to add to wishlist', e);
      },
    });
  }
}
