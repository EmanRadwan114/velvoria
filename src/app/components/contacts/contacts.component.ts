import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { BreadcrumbComponent } from '../sharedComponents/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './contacts.component.html',
  styles: ``,
})
export class ContactsComponent {
  contactInfo = [
    {
      icon: 'fa-location-dot',
      color: '#cca724',
      title: 'Our Address',
      label: `No: 58 A, East Madison Street,\n
    Baltimore, MD, USA 4508`,
    },
    {
      icon: 'fa-at',
      color: '#cca724',
      title: 'Email',
      label: 'contact@velvoria.com',
    },
    {
      icon: 'fa-phone-volume',
      color: '#cca724',
      title: 'Phone',
      label: '+1 234 567 890',
    },
    {
      icon: 'fa-clock',
      color: '#cca724',
      title: 'Working Hours',
      label: 'Mon - Fri: 9am - 6pm',
    },
  ];
}
