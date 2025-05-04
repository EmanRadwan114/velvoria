import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  image = 'https://picsum.photos/350';

  fullName = localStorage.getItem('fullName') || '';
  email = localStorage.getItem('email') || '';
  password = localStorage.getItem('password') || '';
  newPassword = localStorage.getItem('newPassword') || '';
  bio = localStorage.getItem('bio') || '';
  country = localStorage.getItem('country') || '';
  city = localStorage.getItem('city') || '';
  postalCode = localStorage.getItem('postalCode') || '';

  isEditingPersonalInfo = false;
  isEditingAddress = false;
  isPersonalInfo = true;
  isOrder = false;

  constructor() {}

  ngOnInit(): void {}

  savePersonalInfo() {
    localStorage.setItem('fullName', this.fullName);
    localStorage.setItem('email', this.email);
    localStorage.setItem('password', this.password);
    localStorage.setItem('newPassword', this.newPassword);
    localStorage.setItem('bio', this.bio);
    this.isEditingPersonalInfo = false;
  }

  saveAddress() {
    localStorage.setItem('country', this.country);
    localStorage.setItem('city', this.city);
    localStorage.setItem('postalCode', this.postalCode);
    this.isEditingAddress = false;
  }
}
