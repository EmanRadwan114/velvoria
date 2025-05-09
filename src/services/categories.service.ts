import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private URL = 'http://127.0.0.1:7500';

  constructor(private _HttpClient: HttpClient) {
    console.log(_HttpClient);
  }

  //^ Add Category
  addCategory(newCategory: {}) {
    return this._HttpClient.post(`${this.URL}/categories/add`, newCategory, {
      withCredentials: true,
    });
  }

  //^ Get All Categories
  getAllCategories() {
    return this._HttpClient.get(`${this.URL}/categories`);
  }

  //^ Get Category By ID
  getSpecificCategry(id: string) {
    return this._HttpClient.get(`${this.URL}/categories/${id}`);
  }

  //^ Update Category By ID
  updateCategory(id: string, updatedCat: {}) {
    return this._HttpClient.put(`${this.URL}/categories/${id}`, updatedCat, {
      withCredentials: true,
    });
  }

  //^ Delete Category By ID
  deleteCategory(id: string) {
    // return this._HttpClient.delete(`${this.URL}/categories/${id}`);
    return this._HttpClient.delete(`${this.URL}/categories/${id}`, {
      withCredentials: true,
    });
  }
}
