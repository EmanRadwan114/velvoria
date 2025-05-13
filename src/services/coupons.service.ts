import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CouponsService {
  private URL = environment.backUrl;
  couponApplied = new EventEmitter<{ couponCode: string; discount: number }>();

  private defaultShippingPrice = 50;

  getShippingPrice(): number {
    return this.defaultShippingPrice;
  }

  constructor(private _HttpClient: HttpClient) {
    console.log(_HttpClient);
  }

  setCouponCode(couponCode: string, discount: number) {
    this.couponApplied.emit({ couponCode, discount });
  }

  //^ Get All Coupons
  getAllCoupons() {
    return this._HttpClient.get(`${this.URL}/coupons`, {
      withCredentials: true,
    });
  }

  //^ Get Coupon By ID
  getCouponById(id: string | null) {
    return this._HttpClient.get(`${this.URL}/coupons/${id}`, {
      withCredentials: true,
    });
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
