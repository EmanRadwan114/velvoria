import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../../services/orders.service';

@Component({
  selector: 'app-orders-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './orders-modal.component.html',
  styleUrl: './orders-modal.component.css',
})
export class OrdersModalComponent implements OnChanges {
  @Input() activeModal: 'getById' | 'update' | null = null;
  @Input() orderId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  orderForm!: FormGroup;
  orderData: any;
  loading = false;

  constructor(private fb: FormBuilder, private service: OrdersService) {}

  ngOnChanges(): void {
    if (!this.orderId) return;

    if (this.activeModal === 'update') {
      this.initForm();
    }

    if (this.activeModal === 'update' || this.activeModal === 'getById') {
      this.fetchOrderData(this.orderId);
    }
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      shippingStatus: ['', Validators.required],
    });
  }

  private fetchOrderData(id: string): void {
    this.loading = true;

    this.service.getOrderById(id).subscribe({
      next: (res: any) => {
        this.orderData = res.data || res;

        if (this.activeModal === 'update') {
          this.orderForm.patchValue({
            shippingStatus: this.orderData.shippingStatus,
          });
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load order', err);
        this.loading = false;
      },
    });
  }

  submitForm(): void {
    if (this.orderForm.invalid || !this.orderId) return;

    const newStatus = this.orderForm.value.shippingStatus;
    const currentStatus = this.orderData?.shippingStatus;

    if (newStatus === currentStatus) return;

    this.service
      .updateOrderShippingStatus(this.orderId, { shippingStatus: newStatus })
      .subscribe({
        next: () => {
          this.refresh.emit();
          this.closeModal();
        },
        error: (err) => console.error('Update failed', err),
      });
  }

  closeModal(): void {
    this.close.emit();
    this.orderForm?.reset();
    this.orderData = null;
    this.loading = false;
  }
}
