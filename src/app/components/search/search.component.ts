import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { environment } from '../../../environments/environment';
import { PaginationComponent } from '../sharedComponents/pagination/pagination.component';
@Component({
  selector: 'app-search',
  imports: [CommonModule, ProductsComponent, PaginationComponent],
  templateUrl: './search.component.html',
  styles: ``,
})
export class SearchComponent implements OnInit {
  products = [];
  query = '';
  currentPage: number = 1;
  totalPages: number = 1;
  message = 'loading';
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  fetchProducts(): void {
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
    this.fetchProducts();
  }
  // ngOnInit(): void {
  //   this.route.queryParams.subscribe((params) => {
  //     this.query = params['q'];
  //     console.log(this.query);
  //     this.http
  //       .get(`${environment.backUrl}/products/search?q=${this.query}`)
  //       .subscribe({
  //         next: (res: any) => {
  //           if (res) {
  //             this.message = 'success';
  //             this.products = res['data'];
  //             console.log(this.products);
  //             console.log(res);
  //           }
  //         },
  //         error: (err) => {
  //           console.log(err.error.message);
  //           this.message = 'No products were found matching your selection';
  //         },
  //       });
  //   });
  //}
}
