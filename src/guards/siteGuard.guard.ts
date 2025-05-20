import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const siteGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router); //^ we use inject because we are in a fn not a class constructor
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return true;
  } else {
    if (user && user.role === 'admin') {
      router.navigate(['/dashboard']);
    } else {
      router.navigate(['/home']);
    }
    return false;
  }
};
