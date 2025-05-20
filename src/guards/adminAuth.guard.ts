import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const adminAuthGuards: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router); //^ we use inject because we are in a fn not a class constructor
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isUserLoggedIn = user && user.role === 'admin' ? true : false;

  if (isUserLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
