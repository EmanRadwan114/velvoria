import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styles: ``,
})
export class HeroComponent implements OnInit {
  currentIndex = 0;

  slides = [
    {
      image: 'images/hero5.jpg',
      header: 'Welcome To VELVORIA',
      text: 'Discover modern furniture that brings comfort and style to your home.',
      buttonText: 'Shop Now',
      link: '/furnitures',
    },
    {
      image: 'images/hero4.jpg',
      header: 'Make Your Space Yours',
      text: 'Find unique pieces that match your style and elevate daily living.',
      buttonText: 'Explore Collection',
      link: '/furnitures',
    },
    {
      image: 'images/hero3.png',
      header: 'Limited Time Offer!',
      text: 'Get 25% off our best-selling Nordic armchair. Style meets comfort — don’t miss out!',
      buttonText: 'Grab the Deal',
      link: '/about',
    },
  ];

  ngOnInit(): void {
    setInterval(() => this.nextSlide(), 6000);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  getSlideTransform() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }
}
