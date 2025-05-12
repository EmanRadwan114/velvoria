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
  categoriesList: any;
  ngOnInit(): void {
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
