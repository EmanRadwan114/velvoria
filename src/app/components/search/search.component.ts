import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styles: ``,
})
export class SearchComponent implements OnInit {
  products = [CommonModule];
  query = '';
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'];
      console.log(this.query);
      // this.http.get('http://127.0.0.1:7500/products/search?q=${this.query}').subscribe({
      //   next: (res) => {
      //     if (res) {
      //       this.products = res.data;
      //     }
      //   },
      //   error: (err) => {
      //     console.log(err.error.message);
      //   },
      // });
    });
  }
}
