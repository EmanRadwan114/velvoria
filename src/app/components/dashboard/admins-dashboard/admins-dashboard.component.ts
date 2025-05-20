import { Component, inject, OnInit } from '@angular/core';
import { AdminsService } from '../../../../services/admins.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminsModalComponent } from '../../modals/admins-modal/admins-modal.component';
import { ToastService } from '../../../../services/toast.service';
import { DashboardPaginationComponent } from '../dashboard-pagination/dashboard-pagination.component';
import { LoadingSPinnerComponent } from '../../sharedComponents/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admins-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminsModalComponent,
    DashboardPaginationComponent,
    LoadingSPinnerComponent,
  ],
  templateUrl: './admins-dashboard.component.html',
})
export class AdminsDashboardComponent implements OnInit {
  admins: any[] = [];
  isLoading = false;

  currentPage = 1;
  totalPages = 1;
  limit = 8;

  // Modal state control
  showModal = false;
  modalType: 'add' | 'edit' | 'view' | null = null;
  selectedAdmin: any = null;

  // Delete confirmation
  showDeleteConfirm = false;
  adminToDelete: any = null;

  private readonly _ToastService = inject(ToastService);

  constructor(private adminsService: AdminsService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  // Load admin list
  loadAdmins(page: number = 1) {
    this.isLoading = true;
    this.adminsService.getAdmins(page, this.limit).subscribe({
      next: (res: any) => {
        this.admins = (res.data || res).filter(
          (user: any) => user.role === 'admin'
        );
        this.isLoading = false;
        this.totalPages = res.totalPages;
        this.currentPage = res.currentPage;
      },
      error: (err) => {
        console.error('Error loading admins', err);
        this.isLoading = false;
      },
    });
  }

  onPageChange(newPage: number) {
    this.loadAdmins(newPage);
  }

  // Open modal with type (add, edit, view)
  openModal(type: 'add' | 'edit' | 'view', admin?: any) {
    this.modalType = type;
    this.selectedAdmin = admin || null;
    this.showModal = true;
  }

  // Close modal
  closeModal() {
    this.showModal = false;
    this.modalType = null;
    this.selectedAdmin = null;
  }

  // Refresh admins list after save
  onAdminUpdated() {
    this.loadAdmins();
    this.closeModal();
  }

  // Show delete confirmation modal
  confirmDelete(admin: any) {
    this.adminToDelete = admin;
    this.showDeleteConfirm = true;
  }

  // Cancel delete action
  cancelDelete() {
    this.adminToDelete = null;
    this.showDeleteConfirm = false;
  }

  // Perform delete
  deleteAdmin() {
    if (!this.adminToDelete?._id) return;

    this.isLoading = true;
    this.adminsService.deleteAdmin(this.adminToDelete._id).subscribe({
      next: () => {
        this._ToastService.show('success', 'admin deleted successfully');
        this.loadAdmins();
        this.showDeleteConfirm = false;
        this.adminToDelete = null;
        this.isLoading = false;
      },
      error: (err) => {
        this._ToastService.show('error', 'Failed to delete admin');
        console.error('Failed to delete admin', err);
        this.isLoading = false;
      },
    });
  }
}
