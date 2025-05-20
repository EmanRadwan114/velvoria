import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.logout();
        }
        return throwError(() => error);
      })
    );
  }

  logout() {
    // Call backend to clear cookie
    this.http
      .post(`${environment.backUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.removeItem('user');
          this.authService.notifyLogout();
          this.router.navigate(['/login']);
        },
        error: () => {
          localStorage.removeItem('user');
          this.authService.notifyLogout();
          this.router.navigate(['/login']);
        },
      });
  }
}
