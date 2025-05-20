import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { SearchComponent } from './components/search/search.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductsCategoryComponent } from './components/products-category/products-category.component';
import { ProductsDashboardComponent } from './components/dashboard/products-dashboard/products-dashboard.component';
import { CategoriesDashboardComponent } from './components/dashboard/categories-dashboard/categories-dashboard.component';
import { OrdersDashboardComponent } from './components/dashboard/orders-dashboard/orders-dashboard.component';
import { CouponsDashboardComponent } from './components/dashboard/coupons-dashboard/coupons-dashboard.component';
import { AdminsDashboardComponent } from './components/dashboard/admins-dashboard/admins-dashboard.component';

import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { DashboardHomeComponent } from './components/dashboard/dashboard-home/dashboard-home.component';
import { userAuthGuard } from '../guards/userAuth.guard';
import { adminAuthGuards } from '../guards/adminAuth.guard';
import { siteGuard } from '../guards/siteGuard.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  {
    path: 'furniture',
    component: ProductsCategoryComponent,
    title: 'Products',
  },
  {
    path: 'furniture/category/:category',
    component: ProductsCategoryComponent,
  },
  {
    path: 'furniture/:id',
    component: ProductDetailsComponent,
    title: 'Product Details',
  },
  { path: 'search', component: SearchComponent, title: 'Search Results' },

  // DASHBOARD
  {
    path: 'dashboard',
    canActivateChild: [adminAuthGuards],
    children: [
      {
        path: '',
        component: DashboardHomeComponent,
        title: 'Dashboard Home',
      },
      {
        path: 'categories',
        component: CategoriesDashboardComponent,
        title: 'Categories Dashboard',
      },
      {
        path: 'products',
        component: ProductsDashboardComponent,
        title: 'Products Dashboard',
      },
      {
        path: 'admins',
        component: AdminsDashboardComponent,
        title: 'Admins Dashboard',
      },
      {
        path: 'coupons',
        component: CouponsDashboardComponent,
        title: 'Coupons Dashboard',
      },
      {
        path: 'orders',
        component: OrdersDashboardComponent,
        title: 'Orders Dashboard',
      },
    ],
  },
  {
    path: '',
    canActivateChild: [userAuthGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
        title: 'Profile',
      },
      { path: 'checkout', component: CheckoutComponent, title: 'Checkout' },
      {
        path: 'orders/:orderId',
        component: OrderConfirmationComponent,
        title: 'Order Confirmation',
      },
    ],
  },
  { path: 'cart', component: CartComponent, title: 'Cart' },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./components/wishlist/wishlist.component').then(
        (c) => c.WishlistComponent
      ),
    title: 'Wishlist',
  },
  /////
  {
    path: '',
    canActivateChild: [siteGuard],
    children: [
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Registration',
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
      },
    ],
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/about/about.component').then(
        (c) => c.AboutComponent
      ),
    title: 'About',
  },
  {
    path: 'contact-us',
    loadComponent: () =>
      import('./components/contacts/contacts.component').then(
        (c) => c.ContactsComponent
      ),
    title: 'Contact Us',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
    title: 'Not Found 404',
  },
];
