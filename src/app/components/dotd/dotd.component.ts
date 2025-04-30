import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-dotd',
  imports: [],
  templateUrl: './dotd.component.html',
  styles: ``,
})
export class DOTDComponent implements OnInit {
  DealOfTheDayProduct: {
    img: string;
    title: string;
    des: string;
    afterDiscount: number;
    beforeDiscount: number;
    endDate: Date;
  } = {
    img: 'ddd',
    title: 'Chairs For Room',
    des: 'orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillu',
    afterDiscount: 1222.74,
    beforeDiscount: 2000.99,
    endDate: new Date('2025-05-29T14:30:45'),
  };
  timeLeft: any;
  IntervalForupdateCountdown: any;

  ngOnInit(): void {
    this.updateCountdown()
    this.IntervalForupdateCountdown = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    const now = new Date();
    const endDate = this.DealOfTheDayProduct.endDate;
    const diffMs = endDate.getTime() - now.getTime();

    this.timeLeft = {
      days: Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24))),
      hours: Math.max(
        0,
        Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      ),
      minutes: Math.max(
        0,
        Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      ),
      seconds: Math.max(0, Math.floor((diffMs % (1000 * 60)) / 1000)),
    };
  }
}
