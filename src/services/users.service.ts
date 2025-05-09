import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://127.0.0.1:7500/users';

  constructor(private httpClient: HttpClient) {}
  addUser(user: any) {
    console.log(user);
    return { message: 'Hi' };
  }

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
