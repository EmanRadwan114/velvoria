import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  image: string = 'https://picsum.photos/350';

  fullName: string = localStorage.getItem('fullName') || '';
  email: string = localStorage.getItem('email') || '';
  address: string = localStorage.getItem('address') || '';
  password: string = localStorage.getItem('password') || '';
  newPassword: string = localStorage.getItem('newPassword') || '';
  confirmPassword: string = localStorage.getItem('confirmPassword') || '';
  // bio: string = localStorage.getItem('bio') || '';
  // country: string = localStorage.getItem('country') || '';
  // city: string = localStorage.getItem('city') || '';
  // postalCode: string = localStorage.getItem('postalCode') || '';

  isEditingPersonalInfo: boolean = false;
  isEditingPassword: boolean = false;

  isPersonalInfo: boolean = true;
  isOrder: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      const tab: string = params['tab'];
      if (tab === 'orders') {
        this.isOrder = true;
        this.isPersonalInfo = false;
      } else {
        this.isPersonalInfo = true;
        this.isOrder = false;
      }
    });
  }

  showPersonalInfo(): void {
    this.isPersonalInfo = true;
    this.isOrder = false;
    this.router.navigate([], { queryParams: { tab: 'info' } });
  }

  showOrders(): void {
    this.isOrder = true;
    this.isPersonalInfo = false;
    this.router.navigate([], { queryParams: { tab: 'orders' } });
  }

  editCancelPersonalInfo(): void {
    this.isEditingPersonalInfo = !this.isEditingPersonalInfo;
    if (!this.isEditingPersonalInfo) {
      this.fullName = localStorage.getItem('fullName') || '';
      this.email = localStorage.getItem('email') || '';
      this.address = localStorage.getItem('address') || '';
    }
  }

  editCancelPassword(): void {
    this.isEditingPassword = !this.isEditingPassword;
    if (!this.isEditingPassword) {
      this.password = localStorage.getItem('password') || '';
      this.newPassword = localStorage.getItem('newPassword') || '';
      this.confirmPassword = localStorage.getItem('confirmPassword') || '';
    }
  }

  savePersonalInfo(): void {
    localStorage.setItem('fullName', this.fullName);
    localStorage.setItem('email', this.email);
    localStorage.setItem('address', this.address);
    this.isEditingPersonalInfo = false;
  }

  savePassword(): void {
    localStorage.setItem('password', this.password);
    localStorage.setItem('newPassword', this.newPassword);
    localStorage.setItem('confirmPassword', this.confirmPassword);
    this.isEditingPassword = false;
  }
}
