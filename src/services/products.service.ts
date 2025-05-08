import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private URL = 'http://127.0.0.1:7500';

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
  getProducdByLabel(label: string | null) {
    return this._HttpClient.get(`${this.URL}/products/label/${label}`);
  }

  //^ Get Product By Category
  getProducdByCategory(category: string | null) {
    return this._HttpClient.get(`${this.URL}/products/category/${category}`);
  }
  addProduct(newPrd: {}) {
    return this._HttpClient.post(`${this.URL}/products`, newPrd);
  }

  //^ Update Product By ID
  updateProduct(id: string, updatedPrd: {}) {
    return this._HttpClient.put(`${this.URL}/products/${id}`, updatedPrd);
  }

  //^ Delete Product By ID
  deleteProduct(id: string) {
    return this._HttpClient.delete(`${this.URL}/products/${id}`);
  }
}
