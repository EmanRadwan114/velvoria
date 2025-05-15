import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponsService } from '../../../../services/coupons.service';
import { CouponsModalComponent } from '../../modals/coupons-modal/coupons-modal.component';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-coupons-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CouponsModalComponent],
  templateUrl: './coupons-dashboard.component.html',
  styleUrl: './coupons-dashboard.component.css',
})
export class CouponsDashboardComponent implements OnInit {
  coupons: any[] = [];
  activeModal: 'getById' | 'update' | 'add' | null = null;
  selectedId: string | null = null;
  private readonly _ToastService = inject(ToastService);

  constructor(private couponsService: CouponsService) {}

  ngOnInit(): void {
    this.fetchCoupons();
    console.log('Coupons Dashboard Initialized');
  }

  fetchCoupons() {
    this.couponsService.getAllCoupons().subscribe({
      next: (res: any) => {
        this.coupons = res.data || res;
      },
      error: (err) => {
        console.error('Failed to fetch coupons', err);
      },
    });
  }

  openModal(type: 'getById' | 'update' | 'add', id: string | null = null) {
    this.activeModal = type;
    this.selectedId = id;
  }

  closeModal() {
    this.activeModal = null;
    this.selectedId = null;
  }

  deleteId: string | null = null;
  showDeleteConfirm = false;

  triggerDelete(id: string) {
    this.deleteId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.deleteId) {
      this.couponsService.deleteCoupon(this.deleteId).subscribe({
        next: () => {
          this._ToastService.show('success', 'coupon deleted successfully');
          this.fetchCoupons();
          this.cancelDelete();
        },
        error: (err) => {
          this._ToastService.show('error', 'Failed to delete coupon');

          console.error('Failed to delete coupon', err);
          this.cancelDelete();
        },
      });
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteId = null;
  }
}
