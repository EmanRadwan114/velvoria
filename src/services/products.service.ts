import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private URL = environment.backUrl;

  constructor(private _HttpClient: HttpClient) {}

  //^ Get All Products without pagination
  getProducts() {
    return this._HttpClient.get(`${this.URL}/products?all=true`, {
      withCredentials: true,
    });
  }
  //^ Get All Products
  getAllProducts(page: number = 1, limit: number = 6) {
    return this._HttpClient.get(
      `${this.URL}/products?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
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
  getProductByCategory(category: string | null, page: any = 1) {
    return this._HttpClient.get(
      `${this.URL}/products/category/${category}?page=${page}`
    );
  }

  //^ Get Best Selling Product
  getBestSelling() {
    return this._HttpClient.get(`${this.URL}/products/best-selling-products`, {
      withCredentials: true,
    });
  }

  //^ Get least ordered Product
  getLeastOrderedProducts() {
    return this._HttpClient.get(`${this.URL}/products/least-ordered-products`, {
      withCredentials: true,
    });
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

  filterProducts(filters: Record<string, any>, page: number = 1) {
    // build up HttpParams
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value);
      }
    });

    return this._HttpClient.get<{ data: any[] }>(
      `${this.URL}/products/filter?page=${page}`,
      {
        params,
      }
    );
  }
  discountProducts() {
    return this._HttpClient.get(`${this.URL}/products/least-ordered-products`, {
      withCredentials: true,
    });
  }
}
