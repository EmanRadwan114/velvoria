import { Component, OnDestroy, OnInit } from '@angular/core';
import { DealofDayService } from '../../../services/dealof-day.service';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dotd',
  imports:[CommonModule],
  templateUrl: './dotd.component.html',
  styles: ``,
})
export class DOTDComponent implements OnInit, OnDestroy {
  DealOfTheDayProduct: any = {};
  timeLeft: any;
  IntervalForupdateCountdown: Subscription = Subscription.EMPTY;

  private productSubscription: Subscription = Subscription.EMPTY;

  constructor(private _DealofDayService: DealofDayService) {}

  ngOnInit(): void {
    this.getProduct(); 
    this.updateCountdown(); 

   
    this.IntervalForupdateCountdown = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  private getProduct(): void {
    this.productSubscription = this._DealofDayService.selectedproduct$.subscribe(
      (res) => {
        this.DealOfTheDayProduct = res;
        this.updateCountdown(); 
      }
    );
  }

  private updateCountdown(): void {
    const now = new Date();
    const endDate = new Date(this.DealOfTheDayProduct?.endDate);
    const diffMs = Math.max(0, endDate.getTime() - now.getTime());

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    this.timeLeft = {
      days: this.formatTime(days),
      hours: this.formatTime(hours),
      minutes: this.formatTime(minutes),
      seconds: this.formatTime(seconds),
    };
  }

  private formatTime(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  ngOnDestroy() {
  
    if (this.IntervalForupdateCountdown) {
      this.IntervalForupdateCountdown.unsubscribe();
    }
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
