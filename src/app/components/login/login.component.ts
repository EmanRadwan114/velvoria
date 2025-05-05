import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TogglePasswordDirective } from '../../../directives/toggle-password.directive';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    TogglePasswordDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showAlert = false;
  message = '';
  constructor(public router: Router, private http: HttpClient) {}
  userData = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_$-])[A-Za-z\d@_$-]{8,}$/g
      ),
    ]),
  });
  get validEmail() {
    return this.userData.controls.email;
  }
  get validPassword() {
    return this.userData.controls.password;
  }
  addUser() {
    if (!this.userData.valid) {
      this.message = 'you must fill login form';
      this.clickA();
    } else {
      const fullUrl = this.router.url;
      console.log(fullUrl); //user or admin
      let user = {
        email: this.userData.controls.email.value,
        password: this.userData.controls.password.value,
      };
      this.http.post('http://127.0.0.1:7500/auth/login', user).subscribe({
        next: (res) => {
          if (res) {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.message = err.error.message;
          this.clickA();
        },
      });
    }
  }
  clickA() {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 1000);
  }
}
