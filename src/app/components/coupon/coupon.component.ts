import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponsService } from '../../../services/coupons.service';

@Component({
  selector: 'app-coupon',
  imports: [CommonModule, FormsModule],
  templateUrl: './coupon.component.html',
})
export class CouponComponent {
  couponCode: string = '';
  discount: number | null = null;
  message: string = '';
  isLoading = false;

  constructor(private coupServices: CouponsService) {}

  applyCoupon() {
    this.isLoading = true;
    this.discount = 0;
    this.message = '';

    this.coupServices.applyCoupon(this.couponCode).subscribe({
      next: (res: any) => {
        this.discount = +res.discount;
        this.message = res.message;
        this.isLoading = false;
        this.coupServices.setCouponCode(this.couponCode, this.discount);
      },
      error: (err) => {
        this.message = err.error?.message || 'Error applying coupon';
        this.isLoading = false;
      },
    });
  }
}
