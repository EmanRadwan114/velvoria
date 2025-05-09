import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private URL = environment.backUrl;

  constructor(private _HttpClient: HttpClient) {
    console.log(_HttpClient);
  }

  //^ Get All Products
  getAllProducts() {
    return this._HttpClient.get(`${this.URL}/products`);
  }

  //^ Get Product By ID
  getSpecificProduct(id: string | null) {
    return this._HttpClient.get(`${this.URL}/products/${id}`);
  }

  //^ Get Product By Label
  getProductByLabel(label: string | null) {
    return this._HttpClient.get(`${this.URL}/products/label/${label}`);
  }

  //^ Get Product By Category
  getProductByCategory(category: string | null) {
    return this._HttpClient.get(`${this.URL}/products/category/${category}`);
  }

  // ^ Add New Product
  addProduct(newPrd: {}) {
    return this._HttpClient.post(`${this.URL}/products`, newPrd, {
      withCredentials: true,
    });
  }

  //^ Update Product By ID
  updateProduct(id: string, updatedPrd: {}) {
    return this._HttpClient.put(`${this.URL}/products/${id}`, updatedPrd, {
      withCredentials: true,
    });
  }

  //^ Delete Product By ID
  deleteProduct(id: string) {
    return this._HttpClient.delete(`${this.URL}/products/${id}`, {
      withCredentials: true,
    });
  }
}
