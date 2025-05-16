import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrdersService } from './../../../services/orders.service';
import { CouponComponent } from '../coupon/coupon.component';
import { CouponsService } from './../../../services/coupons.service';
import { Subscription } from 'rxjs';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';
import { LoadingButtonComponent } from '../sharedComponents/loading-button/loading-button.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CouponComponent,
    LoadingSPinnerComponent,
    LoadingButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  cartLoading: boolean = true;

  shippingPrice: number = 0;
  couponCode: string = '';
  discount: number = 0;
  couponSubscription!: Subscription;
  checkoutForm!: FormGroup;

  orderData!: {
    shippingAddress: string;
    couponCode?: string;
    paymentMethod: string;
    totalPrice: number;
  };

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private couponsService: CouponsService,
    private toastService: ToastService
  ) {}

  // checkout.component.ts

  get subtotal() {
    return this.cartItems.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );
  }

  // Calculate the discount amount (just the discount value)
  get discountAmount() {
    return (this.subtotal + this.shippingPrice) * (this.discount / 100);
  }

  // Calculate the final total price
  get total() {
    return this.subtotal + this.shippingPrice - this.discountAmount;
  }

  isFormValid(): boolean {
    return this.checkoutForm.valid;
  }
  isAddressValid(): boolean {
    return this.checkoutForm.controls['shippingAddress'].valid;
  }

  ngOnInit(): void {
    // *validation
    this.checkoutForm = new FormGroup({
      shippingAddress: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      paymentMethod: new FormControl('cash', [Validators.required]),
    });

    this.loadCartItems();

    this.shippingPrice = this.ordersService.getShippingPrice();

    // Subscribe to the couponApplied EventEmitter
    this.couponSubscription = this.couponsService.couponApplied.subscribe(
      (data) => {
        this.couponCode = data.couponCode;
        this.discount = data.discount;
      }
    );
  }

  ngOnDestroy() {
    if (this.couponSubscription) {
      this.couponSubscription.unsubscribe();
    }
  }

  loadCartItems() {
    this.cartLoading = true;
    this.ordersService.getCartItems().subscribe({
      next: (response: any) => {
        this.cartItems = response.data;
        this.cartLoading = false;
        console.log(response);
      },
      error: (err) => {
        this.error = 'Failed to load cart items';
        this.cartLoading = false;
      },
    });
  }

  validateForm(): boolean {
    if (this.cartItems.length === 0) {
      this.error = 'Your cart is empty';
      return false;
    }
    this.error = null;
    return true;
  }

  submitOrder() {
    if (!this.validateForm() || !this.isFormValid()) return;
    this.isLoading = true;

    // Initialize orderData with required fields
    this.orderData = {
      shippingAddress: this.checkoutForm.value.shippingAddress,
      paymentMethod: this.checkoutForm.value.paymentMethod,
      totalPrice: this.total,
    };

    // Only add couponCode if it exists
    if (this.couponCode) {
      this.orderData.couponCode = this.couponCode;
    }

    this.ordersService.createOrder(this.orderData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.sessionId) {
          this.ordersService.checkout(response.sessionId);
        } else {
          this.router.navigate([`/orders/${response.data._id}`]);
          this.toastService.show(
            'success',
            'Your Order is Placed Successfully'
          );
        }
      },
      error: (err) => {
        console.log(err);

        this.isLoading = false;
        this.toastService.show('error', err.error?.message);
      },
    });
  }
}
