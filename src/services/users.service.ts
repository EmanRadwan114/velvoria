import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.backUrl}/users`;

  constructor(private httpClient: HttpClient) {}
  getUserProfile(): Observable<any> {
    return this.httpClient
      .get<{ message: string; data: any }>(`${this.apiUrl}/me`, {
        withCredentials: true,
      })
      .pipe(map((res) => res.data));
  }

  updateUserProfile(data: any): Observable<any> {
    return this.httpClient
      .put<{ message: string; data: any }>(`${this.apiUrl}/me`, data, {
        withCredentials: true,
      })
      .pipe(map((res) => res.data));
  }
}
