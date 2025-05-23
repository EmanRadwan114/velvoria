import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TogglePasswordDirective } from '../../../directives/toggle-password.directive';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
  isLoading = false;

  constructor(
    public router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}
  private readonly _ToastService = inject(ToastService);
  userData = new FormGroup({
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
  });
  get validEmail() {
    return this.userData.controls.email;
  }
  get validPassword() {
    return this.userData.controls.password;
  }
  addUser() {
    if (!this.userData.valid) {
      this._ToastService.show('error', 'you must fill login form');
    } else {
      this.isLoading = true;

      const fullUrl = this.router.url;
      let user = {
        email: this.userData.controls.email.value,
        password: this.userData.controls.password.value,
      };
      this.http
        .post(`${environment.backUrl}/auth/login`, user, {
          withCredentials: true,
        })
        .subscribe({
          next: (res: any) => {
            if (res) {
              let { email, name, image, role, address } = res.user;
              localStorage.setItem(
                'user',
                JSON.stringify({ email, name, image, role, address })
              );
              this.authService.notifyLogin();
              this.isLoading = false;
              this.router.navigate([
                `${role === 'user' ? '/home' : '/dashboard'}`,
              ]);
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
