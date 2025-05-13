import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductsService } from '../../../../services/products.service';

@Component({
  selector: 'app-products-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-modal.component.html',
  styleUrls: ['./products-modal.component.css'],
})
export class ProductsModalComponent implements OnChanges {
  @Input() activeModal: 'getById' | 'update' | 'add' | null = null;
  @Input() productId: string | null = null;
  @Input() categories: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  productForm!: FormGroup;
  productData: any = null;
  loading = false;

  constructor(private fb: FormBuilder, private service: ProductsService) {}

  ngOnChanges(ch: SimpleChanges) {
    if (this.activeModal === 'add') {
      this.initForm();
    }

    if (
      (this.activeModal === 'update' || this.activeModal === 'getById') &&
      this.productId
    ) {
      this.fetchProduct(this.productId, this.activeModal === 'update');
    }
  }

  // private initForm() {
  //   this.productForm = this.fb.group({
  //     title: ['', [Validators.required, Validators.minLength(3)]],
  //     description: ['', [Validators.required, Validators.minLength(10)]],
  //     price: [null, [Validators.required, Validators.min(0.01)]],
  //     stock: [null, [Validators.required, Validators.min(0)]],
  //     categoryID: ['', Validators.required],
  //     thumbnail: [
  //       '',
  //       [Validators.required, Validators.pattern(/^https?:\/\//)],
  //     ],
  //     material: ['', Validators.required],
  //     color: ['', Validators.required],
  //     label: [[], Validators.required],
  //     images: [[], Validators.required],
  //   });
  // }

  private initForm() {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      categoryID: ['', Validators.required],
      thumbnail: [
        '',
        [Validators.required, Validators.pattern(/^https?:\/\//)],
      ],
      material: ['', Validators.required],
      color: ['', Validators.required],
      images: [[], Validators.required], // Keep images field for file handling
    });
  }

  private fetchProduct(id: string, forEdit: boolean) {
    this.loading = true;
    this.service.getSpecificProduct(id).subscribe({
      next: (res: any) => {
        
        this.productData = res.data;
        const cat = this.categories.find(
          (c) => c._id === this.productData.categoryID
        );
        this.productData.categoryName = cat?.name ?? '—';

        if (forEdit) {
          this.initForm();
          this.productForm.patchValue(this.productData);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed loading product', err);
        this.loading = false;
      },
    });
  }

  submitForm() {
    const payload = this.productForm.value;
    if (this.activeModal == 'add') {
      this.service.addProduct(payload).subscribe({
        next: () => {
          console.log('Product Added Successfully');

          this.refresh.emit();
          this.closeModal;
        },
        error: (err) => {
          console.log('Add Failed', err);
          alert(err.error?.message || 'Something went wrong');
        },
      });
      console.log('Submitting payload:', payload);
    }

    if (this.activeModal === 'update' && this.productId) {
      this.service.updateProduct(this.productId, payload).subscribe({
        next: () => {
          console.log('Product updated Successfully');

          this.refresh.emit;
          this.closeModal();
        },
        error: (err) => console.error('Update failed', err),
      });
    }
    console.log(this.productForm);

    // if (this.productForm.invalid) {
    //   this.productForm.markAllAsTouched(); // show all errors
    //   return;
    // }

    // const payload = this.productForm.value;

    // const action$ =
    //   this.activeModal === 'add'
    //     ? this.service.addProduct(payload)
    //     : this.service.updateProduct(this.productId!, payload);

    // action$.subscribe({
    //   next: () => {
    //     this.refresh.emit();
    //     this.closeModal();
    //   },
    //   error: (err) => alert(err.error?.message || `${this.activeModal} failed`),
    // });
  }

  closeModal() {
    this.close.emit();
    this.productForm?.reset();
    this.productData = null;
    this.loading = false;
  }

 
}
