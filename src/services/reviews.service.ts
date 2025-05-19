import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  constructor(private http: HttpClient) {}

  getAllReviews = (id: string, page: number = 1) => {
    const url = `${environment.backUrl}/products/${id}/reviews?page=${page}`;
    return this.http.get(url, { withCredentials: true });
  };

  addNewReview = (id: string, data: any) => {
    const url = `${environment.backUrl}/products/${id}/reviews`;
    return this.http.post(url, data, { withCredentials: true });
  };
}
