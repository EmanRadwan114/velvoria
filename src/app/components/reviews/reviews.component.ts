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
import { ToastService } from '../../../services/toast.service';
import { LoadingButtonComponent } from '../sharedComponents/loading-button/loading-button.component';

@Component({
  selector: 'app-reviews',
  imports: [
    CommonModule,
    PaginationComponent,
    ReactiveFormsModule,
    LoadingButtonComponent,
  ],
  templateUrl: './reviews.component.html',
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  productID = '';
  reviewData!: FormGroup;
  newReview!: {};
  responseMsg!: string;
  isLoading = false;
  totalPages: number = 1;
  currentPage: number = 1;
  rate: number = 0;

  constructor(
    private reviewService: ReviewsService,
    private route: ActivatedRoute,
    private toastService: ToastService
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
    this.getAllReviews(this.currentPage);
  }
  getAllReviews(page: number) {
    this.reviewService.getAllReviews(this.productID, page).subscribe({
      next: (res: any) => {
        this.reviews = [...res.data];
        this.responseMsg = res.message;
        this.totalPages = res.totalPages;
      },
      error: (err) => {
        this.responseMsg = err.error.message;
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
  changePage(page: number) {
    this.currentPage = page;
    this.getAllReviews(this.currentPage);
  }

  // *get review data and add a new review
  addNewReview(event: any) {
    event.preventDefault();
    if (this.isFormValid()) {
      this.isLoading = true;
      this.reviewService
        .addNewReview(this.productID, this.reviewData.value)
        .subscribe({
          next: (res: any) => {
            this.newReview = res.data;
            this.responseMsg = res.message;
            this.rate = 0;
            this.reviewData.reset();
            this.toastService.show(
              'success',
              'Your Review is Submitted Successfully'
            );
            this.isLoading = false;
            // *get all product reviews
            this.reviewService.getAllReviews(this.productID).subscribe({
              next: (res: any) => {
                this.reviews = [...res.data];
              },
              error: (err) => {
                this.toastService.show('error', err.message);
              },
            });
          },
          error: (err) => {
            this.isLoading = true;
            const myErr = err.error.errors;
            if (myErr) {
              this.toastService.show('error', myErr[0].message);
            } else if (err.status === 401) {
              this.toastService.show(
                'error',
                'Login First to Review a Product'
              );
            } else if (err.status === 400) {
              this.toastService.show(
                'error',
                'You Can not Review a Product Before Ordering It or Being Shipped To You'
              );
            } else if (err.status === 409) {
              this.toastService.show(
                'error',
                'You Have Already Reviewed This Product Before'
              );
            } else {
              console.log(err);

              this.toastService.show(
                'error',
                'You Can not Review a Product Before Ordering It'
              );
            }
            this.isLoading = false;
          },
        });
    } else {
      this.toastService.show('error', 'form is not valid');
    }
  }
}
