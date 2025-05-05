import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TogglePasswordDirective } from '../../../directives/toggle-password.directive';
import { HttpClient } from '@angular/common/http';
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
  constructor(public router: Router, private http: HttpClient) {}
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
      this.message = 'you must fill registration form';
      this.clickA();
    } else {
      const fullUrl = this.router.url;
      console.log(fullUrl); //user or admin
      let user = {
        name: this.userData.controls.name.value,
        email: this.userData.controls.email.value,
        password: this.userData.controls.password.value,
        role: fullUrl.includes('user') ? 'user' : 'admin',
      };
      this.http.post('http://127.0.0.1:7500/auth/register', user).subscribe({
        next: (res) => {
          if (res) {
            this.signUp = true;
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
