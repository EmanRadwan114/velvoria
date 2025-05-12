import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../services/categories.service';

@Component({
  selector: 'app-categories-dashboard',
  imports: [],
  templateUrl: './categories-dashboard.component.html',
  styleUrl: './categories-dashboard.component.css',
})
export class CategoriesDashboardComponent implements OnInit {
  private readonly _CategoryServices = inject(CategoriesService);
  categoriesList: string[] = [];
  ngOnInit(): void {
    this._CategoryServices.getAllCategories().subscribe({
      next: (res:any) => {
        console.log(res.data);
        this.categoriesList=res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
