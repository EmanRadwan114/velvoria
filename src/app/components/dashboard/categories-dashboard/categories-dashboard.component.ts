import { filter } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../services/categories.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesModalComponent } from '../../modals/categories-modal/categories-modal.component';
import { LoadingButtonComponent } from '../../sharedComponents/loading-button/loading-button.component';
import { ToastService } from '../../../../services/toast.service';
import { LoadingSPinnerComponent } from '../../sharedComponents/loading-spinner/loading-spinner.component';
@Component({
  selector: 'app-categories-dashboard',
  imports: [
    FormsModule,
    CommonModule,
    CategoriesModalComponent,
    LoadingButtonComponent,
    LoadingSPinnerComponent,
  ],
  templateUrl: './categories-dashboard.component.html',
})
export class CategoriesDashboardComponent implements OnInit {
  private readonly _CategoryServices = inject(CategoriesService);
  categoriesList: any[] = [];

  activeModal: 'getById' | 'update' | 'add' | null = null;
  selectedId: string | null = null;
  selectedCategory: any = null;
  categoryForm: FormGroup;
  loading = false;

  private readonly _ToastService = inject(ToastService);

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      thumbnail: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
  }
  fetchCategories() {
    this.loading = true;
    this._CategoryServices.getAllCategories().subscribe({
      next: (res: any) => {
        this.categoriesList = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  openModal(type: 'add' | 'update' | 'getById', id: string | null = null) {
    this.activeModal = type;
    this.selectedId = id;

    if (type === 'add') {
      this.selectedCategory = null;
      this.categoryForm.reset();
    } else if (type === 'update' && id) {
      this.loading = true;
      this.categoriesService.getSpecificCategry(id).subscribe({
        next: (res: any) => {
          this.selectedCategory = res.data;
          this.categoryForm.patchValue({
            name: res.data.name,
            thumbnail: res.data.thumbnail,
          });
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    }
  }

  closeModal() {
    this.activeModal = null;
    this.selectedId = null;
    this.selectedCategory = null;
  }

  deleteId: string | null = null;
  showDeleteConfirm = false;

  triggerDelete(id: string) {
    this.deleteId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.deleteId) {
      this.categoriesService.deleteCategory(this.deleteId).subscribe({
        next: () => {
          this._ToastService.show('success', 'category deleted successfully');
          this.fetchCategories();
          this.cancelDelete();
        },
        error: (err: any) => {
          this._ToastService.show('error', 'Failed to delete category');
          console.error('Failed to delete category', err);
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
