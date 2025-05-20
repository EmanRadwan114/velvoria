import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DealofDayService {
  localStorageKeyDOD = 'DealOfTheDayProduct';
  private URL = environment.backUrl;
  private selectedProductSubject = new BehaviorSubject<any>(
    this.getDealOfDayFromLocalStorage()
  );
  selectedproduct$ = this.selectedProductSubject.asObservable();

  constructor(private _httpClient: HttpClient) {
    this.checkAndUpdateDeal();
  }

  private setDealOfTheDay(dealOfTheDay: any) {
    const dataWithEndDate = {
      ...dealOfTheDay,
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiration
    };

    localStorage.setItem(
      this.localStorageKeyDOD,
      JSON.stringify(dataWithEndDate)
    );
    this.selectedProductSubject.next(dataWithEndDate);
  }

  private getDealOfDayFromLocalStorage() {
    const product = localStorage.getItem(this.localStorageKeyDOD);
    return product ? JSON.parse(product) : null;
  }

  private getDealOfTheDay() {
    return this._httpClient.get<any[]>(
      `${this.URL}/products/least-ordered-products`,
      {
        withCredentials: true,
      }
    );
  }

  checkAndUpdateDeal() {
    this.getDealOfTheDay().subscribe((res) => {});
    const deal = this.getDealOfDayFromLocalStorage();
    const now = new Date();

    if (!deal || new Date(deal.endDate) <= now) {
      // No deal or deal expired
      this.getDealOfTheDay().subscribe((res: any[]) => {
        if (res && res.length > 0) {
          // Ensure that we have a valid product in the response
          this.setDealOfTheDay(res[0]);
        } else {
          console.log('⚠️ No products available for deal');
        }
      });
    } else {
      // Deal not expired
      this.selectedProductSubject.next(deal);
      console.log(
        `✅ Deal not expired ---> 🎇 ${deal?.title || 'No title available'}`
      );
    }
  }
}
