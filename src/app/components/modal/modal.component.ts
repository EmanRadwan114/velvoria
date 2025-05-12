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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CouponsService } from '../../../services/coupons.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnChanges {
  @Input() activeModal: 'getById' | 'update' | 'add' | null = null;
  @Input() couponId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  couponForm!: FormGroup;
  couponData: any;
  loading = false;

  constructor(private fb: FormBuilder, private service: CouponsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.activeModal === 'update' && this.couponId) {
      this.fetchCouponData(this.couponId, true);
    }

    if (this.activeModal === 'getById' && this.couponId) {
      this.fetchCouponData(this.couponId, false);
    }

    if (this.activeModal === 'add') {
      this.initForm();
    }
  }

  initForm(forUpdate = false) {
    this.couponForm = this.fb.group({
      CouponCode: [
        '',
        forUpdate
          ? [Validators.pattern(/^(?!\d+$)[a-zA-Z0-9_]+$/)]
          : [
              Validators.required,
              Validators.pattern(/^(?!\d+$)[a-zA-Z0-9_]+$/),
            ],
      ],
      CouponPercentage: [
        '',
        forUpdate
          ? [Validators.min(1), Validators.max(100)]
          : [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      expirationDate: ['', forUpdate ? [] : [Validators.required]],
      maxUsageLimit: ['', forUpdate ? [] : [Validators.required]],
      isActive: [false],
    });
  }

  fetchCouponData(id: string, forEdit: boolean) {
    this.loading = true;
    this.service.getCouponById(id).subscribe({
      next: (res: any) => {
        this.couponData = res.data || res;
        if (forEdit) {
          this.initForm(true); // mark as update
          this.couponForm.patchValue(this.couponData);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load coupon', err);
        this.loading = false;
      },
    });
  }

  submitForm() {
    const formValues = this.couponForm.value;

    if (this.activeModal === 'add') {
      this.service.addCoupon(formValues).subscribe({
        next: () => {
          this.refresh.emit();
          this.closeModal();
        },
        error: (err) => console.error('Add failed', err),
      });
    }

    if (this.activeModal === 'update' && this.couponId) {
      const updatedFields: any = {};
      for (const key in formValues) {
        if (
          formValues[key] !== '' &&
          formValues[key] !== null &&
          formValues[key] !== this.couponData[key]
        ) {
          updatedFields[key] = formValues[key];
        }
      }

      if (Object.keys(updatedFields).length === 0) return; // nothing to update

      this.service.updateCoupon(this.couponId, updatedFields).subscribe({
        next: () => {
          this.refresh.emit();
          this.closeModal();
        },
        error: (err) => console.error('Update failed', err),
      });
    }
  }

  closeModal() {
    this.close.emit();
    this.couponForm?.reset();
    this.couponData = null;
    this.loading = false;
  }
}
