import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coupon-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './coupon-admin.component.html',
  styleUrl: './coupon-admin.component.css',
})
export class CouponAdminComponent {
  tabs = ['Get All', 'Get By ID', 'Delete', 'Update', 'Add New'];
  activeTab = 'Get All';

  couponId = '';
  coupons: any[] = [];
  couponData: any = null;

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

  // Implement the corresponding service methods for:

  // Functions like:
  addNewCoupon() {
    /* service call */
  }
  updateCoupon() {
    /* needs couponData.id */
  }
  getAllCoupons() {
    /* sets list */
  }
  getCouponById() {
    /* uses targetCouponId */
  }
  deleteCoupon() {
    /* uses targetCouponId */
  }
}
