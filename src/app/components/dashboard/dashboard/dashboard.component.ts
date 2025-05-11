import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ProductsDashboardComponent } from "../products-dashboard/products-dashboard.component";

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, ProductsDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
