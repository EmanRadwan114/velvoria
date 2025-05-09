import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../sharedComponents/pagination/pagination.component';
import { ReviewsService } from '../../../services/reviews.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, PaginationComponent, ReactiveFormsModule],
  templateUrl: './reviews.component.html',
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  productID = '';
  reviewData!: FormGroup;
  newReview!: {};
  responseMsg!: string;

  rate: number = 0;

  constructor(
    private reviewService: ReviewsService,
    private route: ActivatedRoute
  ) {
    // *get productID
    this.productID = route.snapshot.params['id'];
  }

  ngOnInit(): void {
    // *validation
    this.reviewData = new FormGroup({
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      rating: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(5),
      ]),
    });

    // *get all product reviews
    this.reviewService.getAllReviews(this.productID).subscribe({
      next: (res: any) => {
        this.reviews = [...res.data];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isFormValid(): boolean {
    return this.reviewData.valid;
  }
  isDescValid(): boolean {
    return this.reviewData.controls['description'].valid;
  }
  isRateValid(): boolean {
    return this.reviewData.controls['rating'].valid;
  }

  // *get rate
  handleRate(value: number) {
    this.rate = value;
    this.reviewData.get('rating')?.setValue(value);
  }

  // *get review data and add a new review
  addNewReview(event: any) {
    event.preventDefault();
    if (this.isFormValid()) {
      this.reviewService
        .addNewReview(this.productID, this.reviewData.value)
        .subscribe({
          next: (res: any) => {
            this.newReview = res.data;
            this.responseMsg = res.message;
            this.rate = 0;
            this.reviewData.reset();
            // *get all product reviews
            this.reviewService.getAllReviews(this.productID).subscribe({
              next: (res: any) => {
                this.reviews = [...res.data];
              },
              error: (err) => {
                console.log(err);
              },
            });
          },
          error: (err) => {
            console.log(err);
            const myErr = err.error.errors;
            if (myErr) {
              this.responseMsg = myErr[0].message;
            } else {
              this.responseMsg = err.error.message;
            }
            this.reviewData.reset();
            this.rate = 0;
          },
        });
    }
  }
}
