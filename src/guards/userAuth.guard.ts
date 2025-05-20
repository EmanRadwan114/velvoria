import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const userAuthGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router); //^ we use inject because we are in a fn not a class constructor
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isUserLoggedIn = user && user.role === 'user' ? true : false;

  if (isUserLoggedIn) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
