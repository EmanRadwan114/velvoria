import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TogglePasswordDirective } from '../../../directives/toggle-password.directive';
import axios from 'axios';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

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
  constructor(public router: Router) {}
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
      alert('You must fill login form');
    } else {
      const fullUrl = this.router.url;
      console.log(fullUrl); //user or admin
      let user = {
        email: this.userData.controls.email.value,
        password: this.userData.controls.password.value,
      };
      axios
        .post('http://127.0.0.1:7500/auth/login', user)
        .then((res) => {
          if (res.data) {
            this.router.navigate(['/home']);
          }
        })
        .catch((err) => {
          this.message = err.response.data.message;
          this.clickA();
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
