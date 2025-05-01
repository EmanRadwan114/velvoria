import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'furnitures', component: ProductsComponent, title: 'Products' },
  { path: 'cart', component: CartComponent, title: 'Cart' },
  { path: 'search', component: SearchComponent, title: 'Search Results' },
  {
    path: 'wishlist',
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
    title: 'Wishlist',
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
