import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router); //^ we use inject because we are in a fn not a class constructor
  const isUserLoggedIn = localStorage.getItem('user') ? true : false;

  if (isUserLoggedIn) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
