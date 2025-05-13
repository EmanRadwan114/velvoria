// import { Component, inject, OnInit } from '@angular/core';
// import { ProductsService } from '../../../../services/products.service';
// import { CommonModule } from '@angular/common';
// import { CategoriesService } from '../../../../services/categories.service';
// import { ProductsModalComponent } from '../../modals/products-modal/products-modal.component';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-products-dashboard',
//   imports: [CommonModule, ProductsModalComponent],
//   templateUrl: './products-dashboard.component.html',
//   styleUrl: './products-dashboard.component.css',
// })
// export class ProductsDashboardComponent implements OnInit {
//   private readonly _ProductsServices = inject(ProductsService);
//   private readonly _CategoriesService = inject(CategoriesService);
//   productsList: any[] = [];
//   categories: any[] = [];

//   activeModal: 'getById' | 'update' | 'add' | null = null;
//   selectedId: string | null = null;
//   selectedProduct: any = null;
//   productForm: FormGroup;
//   loading = false;

//   constructor(private fb: FormBuilder) {
//     this.productForm = this.fb.group({
//       categoryID: ['', Validators.required],
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       thumbnail: ['', Validators.required],
//       images: [[], Validators.required],
//       stock: [0, Validators.required],
//       price: [0, Validators.required],
//       material: ['', Validators.required],
//       color: ['', Validators.required],
//       label: [[], Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     this._CategoriesService.getAllCategories().subscribe({
//       next: (categoryRes: any) => {
//         this.categories = categoryRes.data;
//         this.fetchAllProducts();
//       },
//       error: (err) => console.log('Failed to load categories', err),
//     });
//     this.fetchAllProducts();
//   }

//   fetchAllProducts() {
//     this._ProductsServices.getAllProducts().subscribe({
//       next: (res: any) => {
//         this.productsList = res.data.map((product: any) => {
//           const category = this.categories.find(
//             (cat) => cat._id === product.categoryID
//           );
//           return {
//             ...product,
//             categoryName: category?.name || 'Unknown',
//           };
//         });
//         console.log(this.productsList);
//       },
//       error: (err) => console.log(err),
//     });
//   }

//   openModal(type: 'add' | 'update' | 'getById', id: string | null = null) {
//     this.activeModal = type;
//     this.selectedId = id;
//     if (type === 'add') {
//       this.selectedProduct = null;
//       this.productForm.reset();
//     } else if (type === 'update' && id) {
//       this.loading = true;
//       this._ProductsServices.getSpecificProduct(id).subscribe({
//         next: (res: any) => {
//           this.selectedProduct = res.data;
//           this.productForm.patchValue({
//             categoryID: res.data.categoryID,
//             title: res.data.title,
//             thumbnail: res.data.thumbnail,
//             description: res.data.description,
//           });
//           this.loading = false;
//         },
//         error: () => (this.loading = false),
//       });
//     }
//   }

//   closeModal() {
//     this.activeModal = null;
//     this.selectedId = null;
//     this.selectedProduct = null;
//   }
// }
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductsService } from '../../../../services/products.service';
import { CategoriesService } from '../../../../services/categories.service';
import { ProductsModalComponent } from '../../modals/products-modal/products-modal.component';

@Component({
  selector: 'app-products-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductsModalComponent],
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css'],
})
export class ProductsDashboardComponent implements OnInit {
  private productsSvc = inject(ProductsService);
  private catsSvc = inject(CategoriesService);

  productsList: any[] = [];
  categories: any[] = [];

  activeModal: 'getById' | 'update' | 'add' | null = null;
  selectedId: string | null = null;
  loading = false;

  // for delete confirmation
  showDeleteConfirm = false;
  deleteId: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.catsSvc.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
        this.loadProducts();
      },
      error: (err) => console.error(err),
    });
  }

  loadProducts() {
    this.productsSvc.getAllProducts().subscribe({
      next: (res: any) => {
        this.productsList = res.data.map((p: any) => ({
          ...p,
          categoryName:
            this.categories.find((c) => c._id === p.categoryID)?.name ||
            'Unknown',
        }));
      },
      error: (err) => console.error(err),
    });
  }

  openModal(type: 'add' | 'update' | 'getById', id: string | null = null) {
    this.activeModal = type;
    this.selectedId = id;
  }

  closeModal() {
    this.activeModal = null;
    this.selectedId = null;
  }

  onRefresh() {
    this.closeModal();
    this.loadProducts();
  }

  // 1) user clicks trash icon
  triggerDelete(id: string) {
    this.deleteId = id;
    this.showDeleteConfirm = true;
  }

  // 2) user confirms
  confirmDelete() {
    if (!this.deleteId) return;
    this.productsSvc.deleteProduct(this.deleteId).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.deleteId = null;
        this.loadProducts();
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.showDeleteConfirm = false;
        this.deleteId = null;
      },
    });
  }

  // 3) user cancels
  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteId = null;
  }
}
