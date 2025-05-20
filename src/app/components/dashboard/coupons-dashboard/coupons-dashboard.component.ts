import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponsService } from '../../../../services/coupons.service';
import { CouponsModalComponent } from '../../modals/coupons-modal/coupons-modal.component';
import { ToastService } from '../../../../services/toast.service';
import { DashboardPaginationComponent } from '../dashboard-pagination/dashboard-pagination.component';
import { LoadingSPinnerComponent } from '../../sharedComponents/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-coupons-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CouponsModalComponent,
    DashboardPaginationComponent,
    LoadingSPinnerComponent,
  ],
  templateUrl: './coupons-dashboard.component.html',
  styleUrl: './coupons-dashboard.component.css',
})
export class CouponsDashboardComponent implements OnInit {
  coupons: any[] = [];
  activeModal: 'getById' | 'update' | 'add' | null = null;
  selectedId: string | null = null;

  currentPage = 1;
  totalPages = 1;
  limit = 8;

  isLoading = false;

  private readonly _ToastService = inject(ToastService);

  constructor(private couponsService: CouponsService) {}

  ngOnInit(): void {
    this.fetchCoupons();
    console.log('Coupons Dashboard Initialized');
  }

  fetchCoupons(page: number = 1): void {
    this.isLoading = true;
    this.couponsService.getAllCoupons(page, this.limit).subscribe({
      next: (res: any) => {
        this.coupons = res.data || res;
        this.totalPages = res.totalPages;
        this.currentPage = res.currentPage;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch coupons', err);
        this.coupons = [];
        this.totalPages = 1;
        this.isLoading = false;
      },
    });
  }

  onPageChange(newPage: number) {
    this.fetchCoupons(newPage);
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
      this.isLoading = true;
      this.couponsService.deleteCoupon(this.deleteId).subscribe({
        next: () => {
          this._ToastService.show('success', 'coupon deleted successfully');
          this.fetchCoupons();
          this.cancelDelete();
          this.isLoading = false;
        },
        error: (err) => {
          this._ToastService.show('error', 'Failed to delete coupon');

          console.error('Failed to delete coupon', err);
          this.cancelDelete();
          this.isLoading = false;
        },
      });
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteId = null;
  }
}
