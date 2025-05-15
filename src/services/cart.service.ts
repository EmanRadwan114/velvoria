import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
interface CartItem {
  quantity: number;
  productId: {
    _id: string;
    title: string;
    price: number;
    thumbnail: string;
    material: string;
    color: string;
  };
}
@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private itemsTotalSubject = new BehaviorSubject<number>(0);
  private subtotalSubject = new BehaviorSubject<number>(0);
  cartMetaSubject = new BehaviorSubject<any>({ currentPage: 1, totalPages: 1 });

  cartItems$ = this.cartItemsSubject.asObservable();
  totalItems = this.itemsTotalSubject.asObservable();
  subtotal = this.subtotalSubject.asObservable();

  loadCartFromBackend(page: number = 1, limit: number = 3) {
    return this.http.get<any>(
      `${environment.backUrl}/cart?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );
  }
  setTotal(value: number) {
    this.itemsTotalSubject.next(value);
  }
  setSubtotal(value: number) {
    this.subtotalSubject.next(value);
  }
  setCartItems(items: any) {
    this.cartItemsSubject.next(items);
  }
  addToCart(item: any) {
    return this.http.post<any[]>(`${environment.backUrl}/cart`, item, {
      withCredentials: true,
    });
  }
  updateCartItemQuantity(productId: string, quantity: number) {
    return this.http.put<any>(
      `${environment.backUrl}/cart/${productId}`,
      { quantity },
      { withCredentials: true }
    );
  }
  removeFromCart(productId: string) {
    return this.http.delete<any>(`${environment.backUrl}/cart/${productId}`, {
      withCredentials: true,
    });
  }
  removeCart() {
    return this.http.delete<any>(`${environment.backUrl}/cart`, {
      withCredentials: true,
    });
  }
}
