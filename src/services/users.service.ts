import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private httpClient: HttpClient) {}
  addUser(user: any) {
    console.log(user);
    return { message: 'Hi' };
  }
}
