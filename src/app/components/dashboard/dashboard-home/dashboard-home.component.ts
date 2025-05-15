import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { environment } from '../../../../environments/environment';
import { ProductsService } from '../../../../services/products.service';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgApexchartsModule],
  templateUrl: './dashboard-home.component.html',
  styles: [],
})
export class DashboardHomeComponent implements OnInit {
  public ordersChartOptions: Partial<ChartOptions> | any;
  public revenueChartOptions: Partial<ChartOptions> | any;
  private apiUrl = `${environment.backUrl}/orders/orders-by-month?year=2025`;

  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  totalOrdersData = Array(12).fill(0);
  totalRevenueData = Array(12).fill(0);

  bestSellingProducts!: {
    thumbnail: string;
    title: string;
    price: number;
    category: string;
    stock: number;
    avgRating: number;
    orderCount: number;
  }[];

  leastOrderedProducts!: {
    thumbnail: string;
    title: string;
    price: number;
    category: string;
    stock: number;
    avgRating: number;
    orderCount: number;
  }[];

  constructor(
    private http: HttpClient,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.fetchData();

    this.productsService.getBestSelling().subscribe({
      next: (data: any) => {
        this.bestSellingProducts = data.data;
      },
    });
    this.productsService.getLeastOrderedProducts().subscribe({
      next: (data: any) => {
        this.leastOrderedProducts = data.data;
      },
    });
  }

  //^ fetch stats
  fetchData(): void {
    this.http
      .get<{
        data: { month: number; totalRevenue: number; totalOrders: number }[];
      }>(this.apiUrl, {
        withCredentials: true,
      })
      .subscribe(
        (res) => {
          res.data.forEach((item) => {
            const monthIndex = item.month - 1;
            this.totalOrdersData[monthIndex] = item.totalOrders;
            this.totalRevenueData[monthIndex] = item.totalRevenue;
          });

          this.updateCharts();
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  updateCharts(): void {
    // Orders Chart - Bar Chart with Custom Colors
    this.ordersChartOptions = {
      series: [
        {
          name: 'Total Orders',
          data: this.totalOrdersData,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#333', // Text color
      },
      colors: ['#00BFA5'], // Main bar color
      plotOptions: {
        bar: {
          borderRadius: 6,
          distributed: false,
          dataLabels: {
            position: 'top', // Position data labels above bars
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toLocaleString(); // Format numbers with commas
        },
      },
      xaxis: {
        categories: this.months,
        labels: {
          style: {
            colors: '#666', // X-axis label color
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return val.toLocaleString(); // Format Y-axis numbers
          },
        },
      },
      title: {
        text: `Orders Per Month - ${new Date().getFullYear()}`,
        align: 'center',
        style: {
          color: '#00BFA5',
          fontSize: '16px',
          fontWeight: '600',
        },
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: number) {
            return val.toLocaleString() + ' orders';
          },
        },
      },
    };

    // Revenue Chart - Line Chart with Area Fill
    this.revenueChartOptions = {
      series: [
        {
          name: 'Total Revenue',
          data: this.totalRevenueData,
        },
      ],
      chart: {
        type: 'line',
        height: 350,
        foreColor: '#333',
        stacked: false, // Required for area fill
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      colors: ['#00BFA5'], // Line color
      stroke: {
        width: 3,
        curve: 'smooth',
      },

      markers: {
        size: 6,
        colors: ['#00BFA5'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 8,
        },
      },
      xaxis: {
        categories: this.months,
        labels: {
          style: {
            colors: '#666',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return 'EGP ' + val.toLocaleString(); // Add currency
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return 'EGP ' + val.toLocaleString();
        },
        style: {
          colors: ['#00BFA5'],
        },
      },
      title: {
        text: `Revenue Per Month - ${new Date().getFullYear()}`,
        align: 'center',
        style: {
          color: '#00BFA5',
          fontSize: '16px',
          fontWeight: '600',
        },
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: number) {
            return 'EGP ' + val.toLocaleString();
          },
        },
      },
    };
  }
}
