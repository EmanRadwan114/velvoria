import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule,LoadingSPinnerComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  message = 'loading';
  cartItems: any[] = [];
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
    this.cartService.loadCartFromBackend();
  }
  updateQuantity(item: any, quantity: number) {
    this.cartService.updateCartItemQuantity(item.productId._id, quantity);
  }
  removeProductFromCart(item: any) {
    this.cartService.removeFromCart(item.productId._id);
  }
  removeCart() {
    this.cartService.removeCart();
  }
  get subtotal() {
    return this.cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  }
  trackById(index: number, item: any) {
    return item.productId._id;
  }
}
