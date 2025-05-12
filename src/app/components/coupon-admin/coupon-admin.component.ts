import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponsService } from '../../../services/coupons.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-coupon-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './coupon-admin.component.html',
  styleUrl: './coupon-admin.component.css',
})
export class CouponAdminComponent implements OnInit {
  coupons: any[] = [];
  activeModal: 'getById' | 'update' | 'add' | null = null;
  selectedId: string | null = null;

  constructor(private couponsService: CouponsService) {}

  ngOnInit(): void {
    this.fetchCoupons();
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
          this.fetchCoupons();
          this.cancelDelete();
        },
        error: (err) => {
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
