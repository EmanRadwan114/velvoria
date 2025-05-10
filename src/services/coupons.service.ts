import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CouponsService {
  private URL = environment.backUrl;

  constructor(private _HttpClient: HttpClient) {
    console.log(_HttpClient);
  }

  //^ Get All Coupons
  getAllCoupons() {
    return this._HttpClient.get(`${this.URL}/coupons`);
  }

  //^ Get Coupon By ID
  getCouponByID(id: string | null) {
    return this._HttpClient.get(`${this.URL}/coupons/${id}`);
  }

  //^ Add New Coupon
  addCoupon(newCoup: {}) {
    return this._HttpClient.post(`${this.URL}/coupons`, newCoup, {
      withCredentials: true,
    });
  }

  //^ Update Coupon By ID
  updateCoupon(id: string, updatedCoup: {}) {
    return this._HttpClient.put(`${this.URL}/coupons/${id}`, updatedCoup, {
      withCredentials: true,
    });
  }

  //^ Apply Coupon
  applyCoupon(coupCode: string) {
    return this._HttpClient.post(
      `${this.URL}/coupons/apply-coupon`,
      { couponCode: coupCode },
      {
        withCredentials: true,
      }
    );
  }

  //^ Delete Coupon By ID
  deleteCoupon(id: string) {
    return this._HttpClient.delete(`${this.URL}/coupons/${id}`, {
      withCredentials: true,
    });
  }
}
