import { filter } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../services/categories.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './categories-dashboard.component.html',
  styleUrl: './categories-dashboard.component.css',
})
export class CategoriesDashboardComponent implements OnInit {
  private readonly _CategoryServices = inject(CategoriesService);
  categoriesList: any[] = [];
  editingCategory: any = null;
  activeModal: 'getById' | 'update' | 'add' | null = null;
  selectedId: string | null = null;

  constructor(private _CategoryService: CategoriesService) {}
  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this._CategoryServices.getAllCategories().subscribe({
      next: (res: any) => {
        console.log(res.data);
        this.categoriesList = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  deleteCategory(categoryID: string): void {
    const confirmed = confirm('Are you sure you want to delete this category?');
    if (confirmed) {
      this._CategoryServices.deleteCategory(categoryID).subscribe({
        next: () => {
          this.categoriesList = this.categoriesList.filter(
            (category: any) => category._id !== categoryID
          );
        },
        error: (err) => {
          console.log('delete failed', err);
        },
      });
    }
  }

  // Open the modal for adding a new category
  openModal(type: 'add' | 'update' | 'getById', id: string | null = null) {
    this.activeModal = type;
    this.selectedId = id;

    // If we are opening the modal for editing or viewing, we fetch the category data
    if (type === 'update' || type === 'getById') {
      this.fetchCategoryById(id);
    }
  }

  // Fetch category by ID (for update or view)
  fetchCategoryById(id: string | null) {
    if (id) {
      this._CategoryServices.getSpecificCategry(id).subscribe({
        next: (res: any) => {
          console.log(res.data);
        },
        error: (err: any) => {
          console.log('Failed to fetch category data:', err);
        },
      });
    }
  }
  // Close the modal
  closeModal() {
    this.activeModal = null;
    this.selectedId = null;
  }
}
