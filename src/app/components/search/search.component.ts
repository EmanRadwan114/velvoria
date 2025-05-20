import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { environment } from '../../../environments/environment';
import { PaginationComponent } from '../sharedComponents/pagination/pagination.component';
import { ProductsService } from '../../../services/products.service';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';
@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    ProductsComponent,
    PaginationComponent,
    LoadingSPinnerComponent,
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
    private prdServices: ProductsService
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
        this.products = res.data;
        this.totalPages = res.totalPages;
      },
      error: (err) => {
        console.error('Filter Error status =', err.status);
        console.error('Filter Error body =', err.error);
        this.message = 'No products were found matching your selection';
      },
    });
  }
}
