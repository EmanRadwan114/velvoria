import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  // private loggedIn = new BehaviorSubject<boolean>(this.hasUser());

  // private hasUser(): boolean {
  //   return !!localStorage.getItem('user');
  // }
  private loggedIn = new BehaviorSubject<boolean>(false);
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  notifyLogin() {
    this.loggedIn.next(true);
  }

  notifyLogout() {
    this.loggedIn.next(false);
  }
}
