import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../../../services/orders.service';
import { OrdersModalComponent } from '../../modals/orders-modal/orders-modal.component';

@Component({
  selector: 'app-orders-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, OrdersModalComponent],
  templateUrl: './orders-dashboard.component.html',
  styleUrl: './orders-dashboard.component.css',
})
export class OrdersDashboardComponent implements OnInit {
  orders: any[] = [];
  activeModal: 'getById' | 'update' | null = null;
  selectedId: string | null = null;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.ordersService.getAllOrders().subscribe({
      next: (res: any) => {
        this.orders = res.data || res;
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
      },
    });
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
          this.fetchOrders();
          this.cancelDelete();
        },
        error: (err) => {
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
