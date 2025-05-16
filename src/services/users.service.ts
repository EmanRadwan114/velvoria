import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.backUrl}/users`;
  private URL = environment.backUrl;

  constructor(private httpClient: HttpClient) {}
  getUserProfile(): Observable<any> {
    return this.httpClient.get<{ message: string; data: any }>(
      `${this.apiUrl}/me`,
      {
        withCredentials: true,
      }
    );
  }

  updateUserProfile(data: any): Observable<any> {
    return this.httpClient.put<{ message: string; data: any }>(
      `${this.apiUrl}/me`,
      data,
      {
        withCredentials: true,
      }
    );
  }


  getUserOrders(page: number = 1): Observable<any> {
    return this.httpClient.get<{ message: string; data: any }>(
      `${this.URL}/orders/me?page=${page}`,
      {
        withCredentials: true,
      })
      .pipe(map((res:any) => res.data));
  }
}
