import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSPinnerComponent],
  templateUrl: './order-confirmation.component.html',
})
export class OrderConfirmationComponent implements OnInit {
  order: any;
  loading = true;
  error: string | null = null;
  shippingPrice = 0;
  subtotal = 0;
  discountAmount = 0;
  discountPercentage = 0;
  totalAfterDiscount = 0;

  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (!orderId) {
      this.error = 'No order ID provided';
      this.loading = false;
      return;
    }

    this.orderService.getOrderDetails(orderId).subscribe({
      next: (data) => {
        this.order = data.data;
        this.calculateSubtotal();
        this.totalAfterDiscount = data.data.totalPrice;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order details';
        this.loading = false;
        console.error(err);
      },
    });
  }

  // order-confirmation.component.ts

  calculateSubtotal(): void {
    this.subtotal = this.order?.orderItems.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );

    this.shippingPrice = this.orderService.getShippingPrice();

    // Calculate total before discount
    const totalBeforeDiscount = this.subtotal + this.shippingPrice;

    // Calculate discount amount
    this.discountAmount = totalBeforeDiscount - this.order.totalPrice;

    // Calculate discount percentage
    this.discountPercentage =
      totalBeforeDiscount > 0
        ? Math.round((this.discountAmount / totalBeforeDiscount) * 100 * 100) /
          100
        : 0;

    this.totalAfterDiscount = this.order.totalPrice;
  }
}
