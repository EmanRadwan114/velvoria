import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductsService } from '../../../../services/products.service';
import { CategoriesService } from '../../../../services/categories.service';
import { ProductsModalComponent } from '../../modals/products-modal/products-modal.component';
import { LoadingButtonComponent } from '../../sharedComponents/loading-button/loading-button.component';
@Component({
  selector: 'app-products-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductsModalComponent,
    LoadingButtonComponent,
  ],
  templateUrl: './products-dashboard.component.html',
})
export class ProductsDashboardComponent implements OnInit {
  private productsSvc = inject(ProductsService);
  private catsSvc = inject(CategoriesService);

  productsList: any[] = [];
  categories: any[] = [];

  activeModal: 'getById' | 'update' | 'add' | null = null;
  selectedId: string | null = null;
  loading = false;

  // for delete confirmation
  showDeleteConfirm = false;
  deleteId: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.catsSvc.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
        this.loadProducts();
      },
      error: (err) => console.error(err),
    });
  }

  loadProducts() {
    this.productsSvc.getAllProducts().subscribe({
      next: (res: any) => {
        this.productsList = res.data.map((p: any) => ({
          ...p,
          categoryName:
            this.categories.find((c) => c._id === p.categoryID)?.name ||
            'Unknown',
        }));
      },
      error: (err) => console.error(err),
    });
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
    this.productsSvc.deleteProduct(this.deleteId).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.deleteId = null;
        this.loadProducts();
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.showDeleteConfirm = false;
        this.deleteId = null;
      },
    });
  }

  // cancel delete
  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteId = null;
  }
}
