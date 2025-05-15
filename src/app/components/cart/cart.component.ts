import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../sharedComponents/pagination/pagination.component';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    FormsModule,
    LoadingSPinnerComponent,
    PaginationComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  message = 'loading';
  cartItems: any[] = [];
  currentPage: any;
  totalPages: any;
  subtotal: any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    protected cartService: CartService,
    protected router: Router
  ) {}
  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      if (items) {
        this.cartItems = items;
        this.message = 'success';
      }
    });
    this.cartService.cartMetaSubject.subscribe((meta) => {
      this.currentPage = meta.currentPage;
      this.totalPages = meta.totalPages;
    });
    this.cartService.subtotal.subscribe((subtotal) => {
      this.subtotal = subtotal;
    });
  }
  updateQuantity(item: any, quantity: number) {
    if (quantity <= 0) {
      this.removeProductFromCart(item);
    } else {
      this.cartService
        .updateCartItemQuantity(item.productId._id, quantity)
        .subscribe((res: any) => {
          this.cartService.setTotal(res.totalItems);
          this.cartService.setSubtotal(res.subtotal);
          this.loadCartFromBack(this.currentPage);
        });
    }
  }
  removeProductFromCart(item: any) {
    this.cartService
      .removeFromCart(item.productId._id)
      .subscribe((res: any) => {
        this.cartService.setTotal(res.totalItems);
        this.cartService.setSubtotal(res.subtotal);
        this.loadCartFromBack(this.currentPage);
      });
  }
  removeCart() {
    this.cartService.removeCart().subscribe(() => {
      this.cartService.setTotal(0);
      this.cartService.setSubtotal(0);
      this.loadCartFromBack();
    });
  }
  loadCartFromBack(page: number = 1) {
    this.cartService.loadCartFromBackend(page).subscribe((cart) => {
      this.cartService.setCartItems(cart.data);
      this.cartService.setTotal(cart.totalItems);
      this.cartService.cartMetaSubject.next({
        currentPage: cart.currentPage,
        totalPages: cart.totalPages,
      });
      this.cartService.setSubtotal(cart.subtotal);
    });
  }
  changePage(page: number) {
    this.currentPage = page;
    this.loadCartFromBack(this.currentPage);
  }
  trackById(index: number, item: any) {
    return item.productId._id;
  }
}
