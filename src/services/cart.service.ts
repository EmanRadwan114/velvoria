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
  cartItems$ = this.cartItemsSubject.asObservable();

  loadCartFromBackend() {
    this.http
      .get<any[]>(`${environment.backUrl}/cart`, { withCredentials: true })
      .subscribe((cart: any) => {
        this.cartItemsSubject.next(cart.data);
      });
  }
  setCartItems(items: CartItem[]) {
    const clonedItems = items.map((i) => ({
      ...i,
      product: { ...i.productId },
    }));
    this.cartItemsSubject.next(clonedItems);
  }
  // getTotalItems(): number {
  //   return this.cartItems$.reduce((sum, item) => sum + item.quantity, 0);
  // }

  // getSubtotal(): number {
  //   return this.cartItems.reduce((sum, item) => {
  //     const price = item.productId?.price;
  //     const quantity = item.quantity;
  //     return sum + (price && quantity ? price * quantity : 0);
  //   }, 0);
  // }

  addToCart(item: any) {
    return this.http.post<any[]>(`${environment.backUrl}/cart`, item, {
      withCredentials: true,
    });
  }
  updateCartItemQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
    }
    this.http
      .put<any>(
        `${environment.backUrl}/cart/${productId}`,
        { quantity },
        { withCredentials: true }
      )
      .subscribe((res: any) => {
        this.cartItemsSubject.next([...res.data]);
      });
  }
  removeFromCart(productId: string) {
    this.http
      .delete<any>(`${environment.backUrl}/cart/${productId}`, {
        withCredentials: true,
      })
      .subscribe((res: any) => {
        this.cartItemsSubject.next([...res.data]);
      });
  }
  removeCart() {
    this.http
      .delete<any>(`${environment.backUrl}/cart`, {
        withCredentials: true,
      })
      .subscribe((res: any) => {
        this.cartItemsSubject.next([]);
      });
  }
}
