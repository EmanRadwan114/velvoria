import { Component } from '@angular/core';
import { AppFeaturesComponent } from '../app-features/app-features.component';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../sharedComponents/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-about',
  imports: [AppFeaturesComponent, CommonModule, BreadcrumbComponent],
  templateUrl: './about.component.html',
  styles: ``,
})
export class AboutComponent {
  whyChooseUs = [
    {
      title: 'Quality Craftsmanship',
      description:
        'Built with care using premium materials and detailed finishes.',
      icon: 'fa-cogs', // Icon for quality craftsmanship
    },
    {
      title: 'Customize Options',
      description: 'Design pieces your way with custom finishes and fabrics.',
      icon: 'fa-paint-brush', // Icon for customization
    },
    {
      title: 'Exceptional Service',
      description: 'Enjoy smooth service from purchase to delivery and beyond.',
      icon: 'fa-headset', // Icon for customer service
    },
    {
      title: 'Sustainable Practices',
      description:
        'Committed to eco-friendly materials and responsible sourcing.',
      icon: 'fa-leaf', // Icon for sustainability
    },
  ];

  FAQ = [
    {
      question: 'How long does delivery take?',
      answer:
        'Standard delivery takes 5-7 business days. Custom furniture requires 2-3 weeks for production plus delivery time.',
    },
    {
      question: 'Do you offer in-store pickup?',
      answer:
        '--Yes, you can select free in-store pickup during checkout at our flagship locations in [City1] and [City2]--',
    },
    {
      question: 'What if my furniture arrives damaged?',
      answer:
        "--Contact us within 48 hours with photos. We'll arrange replacement parts or a full replacement at no cost--",
    },
    {
      question: 'Can I see fabric samples before ordering?',
      answer:
        '--Yes! Request free swatches through our website or visit any showroom to feel materials in person--',
    },
    {
      question: "What's your price match policy?",
      answer:
        "--We match competitors' prices on identical in-stock items within 14 days of purchase. Submit proof to our customer service--",
    },
  ];
}
