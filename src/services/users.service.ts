import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // private apiUrl = 'https://your-api.com/api/users/me'; // Replace with your actual API

  constructor(private httpClient: HttpClient) {}
  addUser(user: any) {
    console.log(user);
    return { message: 'Hi' };
  }
  // getUser(): Observable<any> {
  //   return this.httpClient.get(`${this.apiUrl}`, { withCredentials: true });
  // }

  // updateUser(data: any): Observable<any> {
  //   return this.httpClient.put(`${this.apiUrl}`, data, {
  //     withCredentials: true,
  //   });
  // }
}
