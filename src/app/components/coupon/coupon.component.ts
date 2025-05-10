import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coupon',
  imports: [CommonModule, FormsModule],
  templateUrl: './coupon.component.html',
})
export class CouponComponent {
  couponCode = '';
  orderAmount = 0;
  finalAmount: number | null = null;
  discount: number | null = null;
  message = '';
  isLoading = false;

  constructor(private http: HttpClient) {}

  applyCoupon() {
    this.isLoading = true;
    this.finalAmount = null;
    this.discount = null;
    this.message = '';

    const token = localStorage.getItem('token'); // Assumes token is stored here
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .post<any>(
        'http://localhost:5000/api/coupons/apply-coupon',
        {
          couponCode: this.couponCode,
          orderAmount: this.orderAmount,
          userId: 'replace_with_logged_in_user_id', // Or fetch it dynamically
        },
        { headers }
      )
      .subscribe({
        next: (res) => {
          this.discount = res.discount;
          this.finalAmount = res.finalAmount;
          this.message = res.message;
          this.isLoading = false;
        },
        error: (err) => {
          this.message = err.error?.message || 'Error applying coupon';
          this.isLoading = false;
        },
      });
  }
}
