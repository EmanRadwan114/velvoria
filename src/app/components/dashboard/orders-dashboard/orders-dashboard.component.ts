import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../../../services/orders.service';
import { OrdersModalComponent } from '../../modals/orders-modal/orders-modal.component';
import { ToastService } from '../../../../services/toast.service';
import { DashboardPaginationComponent } from '../dashboard-pagination/dashboard-pagination.component';

@Component({
  selector: 'app-orders-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OrdersModalComponent,
    DashboardPaginationComponent,
  ],
  templateUrl: './orders-dashboard.component.html',
  styleUrl: './orders-dashboard.component.css',
})
export class OrdersDashboardComponent implements OnInit {
  orders: any[] = [];
  activeModal: 'getById' | 'update' | null = null;
  selectedId: string | null = null;

  currentPage = 1;
  totalPages = 1;
  limit = 8;

  private readonly _ToastService = inject(ToastService);

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(page: number = 1) {
    this.ordersService.getAllOrders(page, this.limit).subscribe({
      next: (res: any) => {
        this.orders = res.data || res;
        this.totalPages = res.totalPages;
        this.currentPage = res.currentPage;
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
        this.orders = [];
        this.totalPages = 1;
      },
    });
  }

  onPageChange(newPage: number) {
    this.fetchOrders(newPage);
  }

  openModal(type: 'getById' | 'update', id: string | null = null) {
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
      this.ordersService.deleteOrder(this.deleteId).subscribe({
        next: () => {
          this._ToastService.show('success', 'order deleted successfully');
          this.fetchOrders();
          this.cancelDelete();
        },
        error: (err) => {
          this._ToastService.show('error', 'Failed to delete order');
          console.error('Failed to delete order', err);
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
