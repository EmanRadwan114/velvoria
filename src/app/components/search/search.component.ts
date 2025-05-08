import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
@Component({
  selector: 'app-search',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './search.component.html',
  styles: ``,
})
export class SearchComponent implements OnInit {
  products = [CommonModule];
  query = '';
  message = 'loading';
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'];
      console.log(this.query);
      this.http
        .get(`http://127.0.0.1:7500/products/search?q=${this.query}`)
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
            this.message = 'No products were found matching your selection.';
          },
        });
    });
  }
}
