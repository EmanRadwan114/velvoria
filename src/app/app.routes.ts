import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
// import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { SearchComponent } from './components/search/search.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductsCategoryComponent } from './components/products-category/products-category.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  {
    path: 'furnitures',
    component: ProductsCategoryComponent,
    title: 'Products',
  },
  {
    path: 'furnitures/category/:category',
    component: ProductsCategoryComponent,
  },
  {
    path: 'furnitures/:id',
    component: ProductDetailsComponent,
    title: 'Product Details',
  },
  { path: 'cart', component: CartComponent, title: 'Cart' },
  { path: 'search', component: SearchComponent, title: 'Search Results' },
  {
    path: 'register/user',
    component: RegisterComponent,
    title: 'Registration',
  },
  {
    path: 'register/admin',
    component: RegisterComponent,
    title: 'Registration',
  },
  {
    path: 'login/user',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'login/admin',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./components/wishlist/wishlist.component').then(
        (c) => c.WishlistComponent
      ),
    title: 'Wishlist',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/profile/profile.component').then(
        (c) => c.ProfileComponent
      ),
    title: 'Profile',
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
