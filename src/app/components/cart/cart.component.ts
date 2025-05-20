import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../sharedComponents/pagination/pagination.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    FormsModule,
    LoadingSPinnerComponent,
    PaginationComponent,
    RouterLink,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  loading: boolean = false;
  cartItems: any[] = [];
  currentPage: any;
  totalPages: any;
  subtotal: any;

  isLoggedIn: boolean = false;
  user: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    protected cartService: CartService,
    protected router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authService.isLoggedIn.subscribe((status) => {
      this.isLoggedIn = status;
      this.user = status
        ? JSON.parse(localStorage.getItem('user') || 'null')
        : 'null';
    });

    this.loadCartFromBack();
    this.cartService.cartItems$.subscribe((items) => {
      if (items) {
        this.cartItems = items;
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
    this.loading = true;
    this.cartService
      .removeFromCart(item.productId._id)
      .subscribe((res: any) => {
        this.cartService.setTotal(res.totalItems);
        this.cartService.setSubtotal(res.subtotal);
        this.loadCartFromBack(this.currentPage);
        this.loading = false;
      });
  }
  removeCart() {
    this.loading = true;
    this.cartService.removeCart().subscribe(() => {
      this.cartService.setTotal(0);
      this.cartService.setSubtotal(0);
      this.loadCartFromBack();
      this.loading = false;
    });
  }
  loadCartFromBack(page: number = 1) {
    if (localStorage.getItem('user')) {
      this.loading = true;
      this.cartService.loadCartFromBackend(page).subscribe((cart) => {
        if (cart.data.length == 0 && page > 1) {
          this.changePage(page - 1);
        } else {
          this.cartService.setCartItems(cart.data);
          this.cartService.setTotal(cart.totalItems);
          this.cartService.cartMetaSubject.next({
            currentPage: cart.currentPage,
            totalPages: cart.totalPages,
          });
          this.cartService.setSubtotal(cart.subtotal);
        }
        this.loading = false;
      });
    }
  }
  changePage(page: number) {
    this.currentPage = page;
    this.loadCartFromBack(this.currentPage);
  }
  trackById(index: number, item: any) {
    return item.productId._id;
  }
}
