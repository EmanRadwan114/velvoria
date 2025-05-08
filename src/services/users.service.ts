import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

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
    return this.httpClient.get(`${this.apiUrl}/me`, { withCredentials: true });
  }

  updateUserProfile(data: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/me`, data, {
      withCredentials: true,
    });
  }
}
