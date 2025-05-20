import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TogglePasswordDirective } from '../../../directives/toggle-password.directive';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { environment } from '../../../environments/environment';
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
  isLoading = false;

  private readonly _ToastService = inject(ToastService);
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
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_$-])[A-Za-z\d@_$-]{8,}$/
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
      this._ToastService.show('error', 'you must fill registration form');
    } else {
      this.isLoading = true;
      let user = {
        name: this.userData.controls.name.value,
        email: this.userData.controls.email.value,
        password: this.userData.controls.password.value,
      };
      this.http
        .post(`${environment.backUrl}/auth/register`, user, {
          withCredentials: true,
        })
        .subscribe({
          next: (res) => {
            if (res) {
              this.signUp = true;
              this.isLoading = false;
            }
          },
          error: (err) => {
            this._ToastService.show('error', err.error.message);
            this.isLoading = false;
          },
        });
    }
  }
}
