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
import { UsersService } from '../../../services/users.service';
@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    TogglePasswordDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  signUp = false;
  showAlert = false;
  message = '';
  constructor(public router: Router) {}
  userData = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
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
    confirmPassword: new FormControl('', [Validators.required]),
  });

  get validName() {
    return this.userData.controls.name;
  }
  get validEmail() {
    return this.userData.controls.email;
  }
  get validPassword() {
    return this.userData.controls.password;
  }
  get validConfirmPassword() {
    return this.userData.controls.confirmPassword;
  }
  get passwordsMatch() {
    const pwd = this.userData.controls.password.value;
    const confirm = this.userData.controls.confirmPassword.value;
    return pwd === confirm;
  }
  addUser() {
    if (!this.userData.valid || !this.passwordsMatch) {
      alert('You must fill registration form');
    } else {
      const fullUrl = this.router.url;
      console.log(fullUrl); //user or admin
      let user = {
        name: this.userData.controls.name.value,
        email: this.userData.controls.email.value,
        password: this.userData.controls.password.value,
        role: fullUrl.includes('user') ? 'user' : 'admin',
      };
      axios
        .post('http://127.0.0.1:7500/auth/register', user)
        .then((res) => {
          if (res.data) {
            this.signUp = true;
          }
        })
        .catch((err) => {
          this.message = err.response.data.message;
          this.clickA();
          // console.log();
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
