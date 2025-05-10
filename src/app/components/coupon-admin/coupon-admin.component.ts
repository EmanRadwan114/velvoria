import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponsService } from '../../../services/coupons.service';

@Component({
  selector: 'app-coupon-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coupon-admin.component.html',
  styleUrl: './coupon-admin.component.css',
})
export class CouponAdminComponent {
  constructor(private coupServices: CouponsService) {}

  tabs = ['Get All', 'Get By ID', 'Delete', 'Update', 'Add New'];
  activeTab = 'Get All';

  couponId = '';
  coupons: any[] = [];
  couponData: any = null;
  message = '';
  error = '';

  updateData = {
    CouponCode: '',
    CouponPercentage: null,
    expirationDate: '',
    maxUsageLimit: null,
    isActive: true,
  };

  newCoupon = {
    CouponCode: '',
    CouponPercentage: null,
    expirationDate: '',
    maxUsageLimit: null,
    isActive: true,
  };

  addNewCoup() {
    this.resetMessages();
    this.coupServices.addCoupon(this.newCoupon).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Coupon added successfully';
        this.newCoupon = {
          CouponCode: '',
          CouponPercentage: null,
          expirationDate: '',
          maxUsageLimit: null,
          isActive: true,
        };
        this.getCoupons();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to add coupon';
      },
    });
  }

  updateCoup() {
    this.resetMessages();
    this.coupServices.updateCoupon(this.couponId, this.updateData).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Coupon updated successfully';
        this.getCoupons();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update coupon';
      },
    });
  }

  getCoupons() {
    this.resetMessages();
    this.coupServices.getAllCoupons().subscribe({
      next: (res: any) => {
        this.coupons = res.data || res; // depending on your API structure
        this.message = 'Coupons fetched successfully';
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to fetch coupons';
      },
    });
  }

  getCoupById() {
    this.resetMessages();
    this.coupServices.getCouponByID(this.couponId).subscribe({
      next: (res: any) => {
        this.couponData = res.data || res;
        this.message = 'Coupon fetched successfully';
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to fetch coupon by ID';
        this.couponData = null;
      },
    });
  }

  deleteCoup() {
    this.resetMessages();
    this.coupServices.deleteCoupon(this.couponId).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Coupon deleted successfully';
        this.getCoupons();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete coupon';
      },
    });
  }

  resetMessages() {
    this.message = '';
    this.error = '';
  }
}
