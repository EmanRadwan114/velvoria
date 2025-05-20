import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../../../../services/products.service';
import { CategoriesService } from '../../../../services/categories.service';
import { ProductsModalComponent } from '../../modals/products-modal/products-modal.component';
import { LoadingButtonComponent } from '../../sharedComponents/loading-button/loading-button.component';
import { ToastService } from '../../../../services/toast.service';
import { DashboardPaginationComponent } from '../dashboard-pagination/dashboard-pagination.component';
import { LoadingSPinnerComponent } from '../../sharedComponents/loading-spinner/loading-spinner.component';
@Component({
  selector: 'app-products-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductsModalComponent,
    LoadingButtonComponent,
    DashboardPaginationComponent,
    LoadingSPinnerComponent,
  ],
  templateUrl: './products-dashboard.component.html',
})
export class ProductsDashboardComponent implements OnInit {
  private productsSvc = inject(ProductsService);
  private catsSvc = inject(CategoriesService);
  private readonly _ToastService = inject(ToastService);

  productsList: any[] = [];
  categories: any[] = [];

  currentPage = 1;
  totalPages = 1;
  limit = 8;

  activeModal: 'getById' | 'update' | 'add' | null = null;
  selectedId: string | null = null;
  loading = false;

  // for delete confirmation
  showDeleteConfirm = false;
  deleteId: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.loading = true;
    this.catsSvc.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
        this.loadProducts();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  loadProducts(page: number = 1) {
    this.loading = true;
    this.productsSvc.getAllProducts(page, this.limit).subscribe({
      next: (res: any) => {
        this.productsList = res.data.map((p: any) => ({
          ...p,
          categoryName:
            this.categories.find((c) => c._id === p.categoryID)?.name ||
            'Unknown',
        }));
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  onPageChange(newPage: number) {
    this.loadProducts(newPage);
  }

  openModal(type: 'add' | 'update' | 'getById', id: string | null = null) {
    this.activeModal = type;
    this.selectedId = id;
  }

  closeModal() {
    this.activeModal = null;
    this.selectedId = null;
  }

  onRefresh() {
    this.closeModal();
    this.loadProducts();
  }

  // delete
  triggerDelete(id: string) {
    this.deleteId = id;
    this.showDeleteConfirm = true;
  }

  // confirm delete
  confirmDelete() {
    if (!this.deleteId) return;
    this.loading = true;
    this.productsSvc.deleteProduct(this.deleteId).subscribe({
      next: () => {
        this._ToastService.show('success', 'product deleted successfully');

        this.showDeleteConfirm = false;
        this.deleteId = null;
        this.loadProducts();
        this.loading = false;
      },
      error: (err) => {
        this._ToastService.show('error', 'Failed to delete product');
        console.error('Delete failed', err);
        this.showDeleteConfirm = false;
        this.deleteId = null;
        this.loading = false;
      },
    });
  }

  // cancel delete
  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteId = null;
  }
}
