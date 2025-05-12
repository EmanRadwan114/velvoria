import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-search',
  imports: [CommonModule, ProductsComponent],
  templateUrl: './search.component.html',
  styles: ``,
})
export class SearchComponent implements OnInit {
  products = [];
  query = '';
  message = 'loading';
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'];
      console.log(this.query);
      this.http
        .get(`${environment.backUrl}/products/search?q=${this.query}`)
        .subscribe({
          next: (res: any) => {
            if (res) {
              this.message = 'success';
              this.products = res['data'];
              console.log(this.products);
              console.log(res);
            }
          },
          error: (err) => {
            console.log(err.error.message);
            this.message = 'No products were found matching your selection';
          },
        });
    });
  }
}
