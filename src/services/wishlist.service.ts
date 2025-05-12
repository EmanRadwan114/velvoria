import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
 private URL = environment.backUrl;

  constructor(private _HttpClient: HttpClient) {
    console.log(_HttpClient);
  }
   getWishList()
   {
    return this._HttpClient.get(`${this.URL}/wishlist`,{ withCredentials: true,});
   }
   deleteFromWishlist(id: string) {
    return this._HttpClient.delete(`${this.URL}/wishlist/delete/${id}`, {
       withCredentials: true,
    });
  }

   addToWishlist(id: string) {
    return this._HttpClient.put(`${this.URL}/wishlist/add/${id}`,null, {
        withCredentials: true,
    });
  }
 
}
