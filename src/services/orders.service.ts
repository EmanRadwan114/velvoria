import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { loadStripe } from '@stripe/stripe-js';

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  _id?: string;
  user?: any;
  userID?: string;
  totalPrice: number;
  orderItems: OrderItem[];
  shippingAddress: string;
  paymentMethod: 'cash' | 'online';
  orderStatus?: 'paid' | 'waiting';
  shippingStatus?: 'pending' | 'prepared' | 'shipped';
  createdAt?: string;
}

export interface OrdersByMonth {
  totalOrders: number;
  totalRevenue: number;
  month: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private stripePromise = loadStripe(environment.stripe_public_key);

  private defaultShippingPrice = 50;

  constructor(private http: HttpClient) {}

  getShippingPrice(): number {
    return this.defaultShippingPrice;
  }

  createOrder(orderData: {
    shippingAddress: string;
    paymentMethod: string;
    couponCode?: string;
    totalPrice: number;
  }) {
    return this.http.post(`${environment.backUrl}/orders`, orderData, {
      withCredentials: true,
    });
  }

  async checkout(sessionId: string): Promise<void> {
    const stripe = await this.stripePromise;
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Stripe Checkout error:', error.message);
      }
    }
  }

  getOrderDetails(orderId: string): Observable<any> {
    return this.http.get(`${environment.backUrl}/orders/${orderId}`, {
      withCredentials: true,
    });
  }

  getCartItems() {
    return this.http.get<any[]>(`${environment.backUrl}/cart`, {
      withCredentials: true,
    });
  }

  ////////& orders dashboard //////

  //^ GET all orders (Admin only)
  getAllOrders(): Observable<any> {
    return this.http.get(`${environment.backUrl}/orders`, {
      withCredentials: true,
    });
  }

  //^ GET current user's orders
  getMyOrders(): Observable<any> {
    return this.http.get(`${environment.backUrl}/orders/me`, {
      withCredentials: true,
    });
  }

  //^ GET order by ID
  getOrderById(orderId: string | null): Observable<any> {
    return this.http.get(`${environment.backUrl}/orders/${orderId}`, {
      withCredentials: true,
    });
  }

  //^ POST a new order
  addOrder(orderData: {}): Observable<any> {
    return this.http.post(`${environment.backUrl}/orders`, orderData, {
      withCredentials: true,
    });
  }

  //^ PUT - Update order shipping status (Admin only)
  updateOrderShippingStatus(
    orderId: string,
    data: { shippingStatus: string }
  ): Observable<any> {
    return this.http.put(`${environment.backUrl}/orders/${orderId}`, data, {
      withCredentials: true,
    });
  }

  //^ DELETE - Delete order by ID (Admin only)
  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(`${environment.backUrl}/orders/${orderId}`, {
      withCredentials: true,
    });
  }

  //^ GET - Orders data by month (Admin only)
  getOrdersByMonth(year: number): Observable<any> {
    return this.http.get(
      `${environment.backUrl}/orders/orders-by-month?year=${year}`,
      {
        withCredentials: true,
      }
    );
  }
}
