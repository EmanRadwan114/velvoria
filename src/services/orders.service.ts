import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { loadStripe } from '@stripe/stripe-js';

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
}
