import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { environment } from '../../../environments/environment';
import { PaginationComponent } from '../sharedComponents/pagination/pagination.component';
import { ProductsService } from '../../../services/products.service';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';
import { FilterationComponent } from '../filteration/filteration.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    ProductsComponent,
    PaginationComponent,
    LoadingSPinnerComponent,
    FilterationComponent,
  ],
  templateUrl: './search.component.html',
  styles: ``,
})
export class SearchComponent implements OnInit {
  products = [];
  query = '';
  currentPage: number = 1;
  totalPages: number = 1;
  message = 'loading';
  isFiltered = false;
  lastFilterQuery: any = {};
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private prdServices: ProductsService,
    private _ToastService: ToastService
  ) {}
  fetchProducts(): void {
    this.isFiltered = false;
    this.http
      .get(
        `${environment.backUrl}/products/search?q=${this.query}&page=${this.currentPage}`
      )
      .subscribe({
        next: (res: any) => {
          this.message = 'success';
          this.products = res['data'];
          this.totalPages = res.totalPages;
          this.currentPage = res.currentPage;
        },
        error: (err) => {
          console.log(err.error.message);
          this.message = 'No products were found matching your selection';
        },
      });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'];
      this.currentPage = 1;
      this.fetchProducts();
    });
  }
  changePage(page: number): void {
    this.currentPage = page;
    if (this.isFiltered) {
      this.handleFilterChange(this.lastFilterQuery, false);
    } else {
      this.fetchProducts();
    }
  }
  handleFilterChange(filterQuery: any, resetPage = true): void {
    const fullQuery: any = { ...filterQuery };
    this.isFiltered = true;

    if (this.query) {
      fullQuery.search = this.query;
    }

    if (resetPage) this.currentPage = 1;

    Object.keys(fullQuery).forEach((key) => {
      if (
        fullQuery[key] === null ||
        fullQuery[key] === undefined ||
        fullQuery[key] === 'all'
      ) {
        delete fullQuery[key];
      }
    });

    this.lastFilterQuery = fullQuery;

    this.prdServices.filterProducts(fullQuery, this.currentPage).subscribe({
      next: (res: any) => {
        if (!res.data || res.data.length === 0) {
          this.products = [];
          this.message = 'No products were found matching your selection';
          this.totalPages = 1;
          this.currentPage = 1;
        } else {
          this.products = res.data;
          this.totalPages = res.totalPages || 1;
          this.currentPage = res.currentPage || 1;
          this.message = 'success';
          console.log(res);
        }
      },
      error: (err) => {
        this.products = [];
        this._ToastService.show('error', err.error.message || 'Server error');
        this.message = 'No products were found matching your selection';
      },
    });
  }
}
