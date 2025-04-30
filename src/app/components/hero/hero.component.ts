import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styles: ``,
})
export class HeroComponent implements OnInit {
  currentIndex = 0;

  slides = [
    {
      image: 'assets/hero1.png',
      header: 'Welcome to Velvoria',
      text: 'Discover modern furniture that brings comfort and style to your home.',
      buttonText: 'Shop Now',
    },
    {
      image: 'assets/hero2.png',
      header: 'Make Your Space Yours',
      text: 'Find unique pieces that match your style and elevate daily living.',
      buttonText: 'Explore Collection',
    },
    {
      image: 'assets/hero3.png',
      header: 'Limited Time Offer!',
      text: 'Get 25% off our best-selling Nordic armchair. Style meets comfort — don’t miss out!',
      buttonText: 'Grab the Deal',
    },
  ];

  ngOnInit(): void {
    setInterval(() => this.nextSlide(), 5000);
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
